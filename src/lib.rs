#[macro_use] extern crate serde_derive;
#[macro_use] extern crate validator_derive;

pub mod repo;

use std::error::Error;
use std::net::SocketAddr;
use std::fmt::{self, Display, Formatter};

use futures::future::{self};
use futures::{Future, Stream};

use hyper::{Request, Response, Body, StatusCode, Server, Method};
use hyper::service::{service_fn};

use validator::{Validate};

use repo::{Repo, Workshop};

type ServiceResponse = Box<Future<Item=Response<Body>, Error=ServiceError> + Send>;

#[derive(Debug, Serialize)]
struct ErrorMessage {
    message: String,
}

#[derive(Debug)]
enum ServiceError {
    Hyper(ErrorMessage),
    Serde(ErrorMessage),
    Validator(ErrorMessage),
}

impl Display for ServiceError {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        write!(f, "{}", self)
    }
}

impl Error for ServiceError {
    fn description(&self) -> &str {
        "Whoops, something went wrong."
    }
}

impl From<hyper::Error> for ServiceError {
    fn from(_: hyper::Error) -> ServiceError {
        ServiceError::Hyper(ErrorMessage {
            message: "Whoops, something went wrong".to_string()
        })
    }
}

impl From<serde_json::Error> for ServiceError {
    fn from(err: serde_json::Error) -> ServiceError {
        ServiceError::Serde(ErrorMessage {
            message: err.description().to_string()
        })
    }
}

impl From<validator::ValidationErrors> for ServiceError {
    fn from(_: validator::ValidationErrors) -> ServiceError {
        ServiceError::Validator(ErrorMessage {
            message: "Validation failed".to_string(),
        })
    }
}

fn index(_: Request<Body>) -> ServiceResponse {
    let resp = Response::builder()
        .header("Content-Type", "text/html")
        .body(r#"<!doctype html>
                 <meta charset="UTF-8">
                 <div id="container"></div>
                 <script src="/js/index.js" defer></script>"#.into()).unwrap();
    Box::new(future::ok(resp))
}

fn workshops(_: Request<Body>, repo: Repo) -> ServiceResponse {
    let workshops = repo.list();
    let resp = new_response(workshops, StatusCode::OK);
    Box::new(future::ok(resp))
}

fn create_workshop(req: Request<Body>, repo: Repo) -> ServiceResponse {
    let repo = repo.clone();
    Box::new(req.into_body().concat2().map_err(|e| e.into()).and_then(|bytes| {
        future::result(serde_json::from_slice::<Workshop>(&bytes).map_err(|e| e.into()))
    }).and_then(|workshop| {
        future::result(workshop.validate().map(|_| workshop).map_err(|e| e.into()))
    }).map(move |workshop| {
        repo.insert(workshop.clone());
        new_response(workshop, StatusCode::CREATED)
    }))
}

fn new_response<T>(body: T, status: StatusCode) -> Response<Body>
        where T: serde::ser::Serialize {
    let body = serde_json::to_string(&body).unwrap();
    Response::builder()
        .header("Content-Type", "application/json")
        .status(status)
        .body(body.into())
        .unwrap()
}

fn handle_request(req: Request<Body>, repo: Repo) -> ServiceResponse {
    let resp = match (req.method(), req.uri().path()) {
        (&Method::GET, "/workshops") => workshops(req, repo),
        (&Method::POST, "/workshops") => create_workshop(req, repo),
        (&Method::GET, _) if req.uri().path().starts_with("/js/") => {
            Box::new(hyper_static::from_dir("dist", req).map_err(|e| e.into()))
        },
        _ => index(req),
    };

    Box::new(resp.or_else(|err| Ok(match err {
        ServiceError::Serde(m) | ServiceError::Validator(m) =>
            new_response(m, StatusCode::BAD_REQUEST),
        ServiceError::Hyper(m) =>
            new_response(m, StatusCode::INTERNAL_SERVER_ERROR),
    })))
}

pub fn serve(addr: SocketAddr, repo: Repo) {
    hyper::rt::run(future::lazy(move || {
        let new_service = move || {
            let repo_inner = repo.clone();
            service_fn(move |req| {
                handle_request(req, repo_inner.clone())
            })
        };

        let server = Server::bind(&addr)
            .serve(new_service)
            .map_err(|e| eprintln!("server error: {}", e));

        println!("Listening on http://{}", addr);

        server
    }))
}
