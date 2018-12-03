extern crate api;

use std::{thread};
use api::repo::Repo;

fn main() {
    let addr = "0.0.0.0:8080".parse().unwrap();
    let repo = Repo::new();

    // Spawn a thread for each available core, minus one, since we'll
    // reuse the main thread as a server thread as well.
    for _ in 1..num_cpus::get() {
        let repo_inner = repo.clone();
        thread::spawn(move || api::serve(addr, &repo_inner));
    }

    api::serve(addr, &repo)
}
