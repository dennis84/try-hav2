#[macro_use]
extern crate serde_derive;
extern crate serde_json;
#[macro_use]
extern crate validator_derive;
extern crate validator;
extern crate serde;
extern crate tokio_core;
extern crate num_cpus;
extern crate net2;
extern crate hyper;
extern crate futures;
extern crate hyper_static;

pub mod repo;

use std::error::Error;
use std::net::SocketAddr;
use std::fmt::{self, Display, Formatter};

use futures::future::{self};
use futures::{Future, Stream};

use tokio_core::reactor::Core;
use tokio_core::net::TcpListener;

use hyper::{Request, Response, Body, StatusCode, Method};
use hyper::server::conn::Http;
use hyper::service::Service;

use net2::TcpBuilder;
use net2::unix::UnixTcpBuilderExt;

use validator::{Validate};

use repo::{Repo, Workshop};

type ServiceResponse = Box<Future<Item=Response<Body>, Error=ServiceError> + Send + 'static>;

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

struct Application {
    repo: Repo,
}

impl Application {
    fn index(&self, _: Request<Body>) -> ServiceResponse {
        let resp = Response::builder()
            .header("Content-Type", "text/html")
            .body(r#"<!doctype html>
                     <meta charset="UTF-8">
                     <div id="container"></div>
                     <script src="/js/index.js" defer></script>"#.into()).unwrap();
        Box::new(future::ok(resp))
    }

    fn workshops(&self, _: Request<Body>) -> ServiceResponse {
        let workshops = self.repo.list();
        let resp = Self::new_response(workshops, StatusCode::OK);
        Box::new(future::ok(resp))
    }

    fn create_workshop(&self, req: Request<Body>) -> ServiceResponse {
        let repo = self.repo.clone();
        Box::new(req.into_body().concat2().map_err(|e| e.into()).and_then(|bytes| {
            future::result(serde_json::from_slice::<Workshop>(&bytes).map_err(|e| e.into()))
        }).and_then(|workshop| {
            future::result(workshop.validate().map(|_| workshop).map_err(|e| e.into()))
        }).map(move |workshop| {
            repo.insert(workshop.clone());
            Self::new_response(workshop, StatusCode::CREATED)
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
}

impl Service for Application {
    type ReqBody = Body;
    type ResBody = Body;
    type Error = ServiceError;
    type Future = ServiceResponse;

    fn call(&mut self, req: Request<Self::ReqBody>) -> Self::Future {
        let resp = match (req.method(), req.uri().path()) {
            (&Method::GET, "/workshops") => self.workshops(req),
            (&Method::POST, "/workshops") => self.create_workshop(req),
            (&Method::GET, _) if req.uri().path().starts_with("/js/") => {
                Box::new(hyper_static::from_dir("dist", req).map_err(|e| e.into()))
            },
            _ => self.index(req),
        };

        Box::new(resp.or_else(|err| Ok(match err {
            ServiceError::Serde(m) | ServiceError::Validator(m) =>
                Self::new_response(m, StatusCode::BAD_REQUEST),
            ServiceError::Hyper(m) =>
                Self::new_response(m, StatusCode::INTERNAL_SERVER_ERROR),
        })))
    }
}

pub fn serve(addr: SocketAddr, repo: &Repo) {
    let mut core = Core::new().unwrap();
    let handle = core.handle();
    let http = Http::new();

    let tcp = TcpBuilder::new_v4()
        .unwrap()
        .reuse_port(true)
        .unwrap()
        .reuse_address(true)
        .unwrap()
        .bind(&addr)
        .unwrap()
        .listen(1024)
        .unwrap();

    let listener = TcpListener::from_listener(tcp, &addr, &handle).unwrap();
    let server = listener.incoming().for_each(move |(socket, _)| {
        let conn = http.serve_connection(socket, Application {
            repo: repo.clone(),
        }).map_err(|_| ());
        handle.spawn(conn);
        Ok(())
    });

    core.run(server).unwrap()
}
