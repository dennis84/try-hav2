use api::repo::Repo;

fn main() {
    let addr = "0.0.0.0:8080".parse().unwrap();
    let repo = Repo::new();
    api::serve(addr, repo)
}
