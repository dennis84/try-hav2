extern crate api;
extern crate futures;
extern crate tokio_core;
extern crate hyper;
#[macro_use] extern crate serde_json;

use std::{thread};

use futures::{Future, Stream};
use tokio_core::reactor::Core;
use hyper::{Client, Request, Method};
use serde_json::{Value};

use api::repo::Repo;

#[test]
fn read_and_write() {
    let addr = "0.0.0.0:8080".parse().unwrap();
    let repo = Repo::new();
    thread::spawn(move || api::serve(addr, &repo));

    let client = Client::new();
    let mut core = Core::new().unwrap();
    let sample_workshop = json!({
        "name": "Foo",
        "description": "...",
        "instructor": "Dennis",
        "price": 0,
    });

    let fut = client
        .get("http://localhost:8080/workshops".parse().unwrap())
        .and_then(|res| res.into_body().concat2())
        .and_then(|body| {
            Ok(serde_json::from_slice::<Value>(&body).unwrap())
        })
        .map(|json| {
            assert_eq!(json, json!([]));
        })
        .map_err(|_| ());

    core.run(fut).unwrap();

    let request = Request::builder()
        .method(Method::POST)
        .uri("http://localhost:8080/workshops")
        .header("Content-Type", "application/json")
        .body(serde_json::to_string(&sample_workshop).unwrap().into())
        .unwrap();

    let fut = client
        .request(request)
        .and_then(|res| res.into_body().concat2())
        .and_then(|body| {
            Ok(serde_json::from_slice::<Value>(&body).unwrap())
        })
        .map(|json| {
            assert_eq!(json, sample_workshop);
        })
        .map_err(|_| ());

    core.run(fut).unwrap();

    let fut = client
        .get("http://localhost:8080/workshops".parse().unwrap())
        .and_then(|res| res.into_body().concat2())
        .and_then(|body| {
            Ok(serde_json::from_slice::<Value>(&body).unwrap())
        })
        .map(|json| {
            assert_eq!(json, json!([sample_workshop]));
        })
        .map_err(|_| ());

    core.run(fut).unwrap();
}
