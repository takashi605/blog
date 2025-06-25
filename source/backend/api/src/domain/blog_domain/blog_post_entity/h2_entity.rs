use uuid::Uuid;

#[derive(Debug)]
pub struct H2Entity {
    id: Uuid,
    text: String,
}

impl H2Entity {
    pub fn new(id: Uuid, text: String) -> Self {
        Self { id, text }
    }

    pub fn get_id(&self) -> Uuid {
        self.id
    }

    pub fn get_value(&self) -> &str {
        &self.text
    }
}