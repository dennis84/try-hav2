use std::sync::{Arc, Mutex};

use validator::{Validate};

#[derive(Debug, Clone, Serialize, Deserialize, Validate)]
pub struct Workshop {
    #[validate(length(min = "3"))]
    pub name: String,
    pub description: String,
    #[validate(length(min = "1"))]
    pub instructor: String,
    pub price: i64,
}

#[derive(Clone)]
pub struct Repo {
    workshops: Arc<Mutex<Vec<Workshop>>>,
}

impl Repo {
    pub fn new() -> Repo {
        Repo {
            workshops: Arc::new(Mutex::new(Vec::new())),
        }
    }

    pub fn insert(&self, workshop: Workshop) {
        self.workshops.lock().unwrap().push(workshop);
    }

    pub fn list(&self) -> Vec<Workshop> {
        self.workshops.lock().unwrap().clone()
    }
}
