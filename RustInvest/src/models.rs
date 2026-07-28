use serde::Serialize;

#[derive(Serialize, Clone)]
pub struct Asset {
    pub id: i64,
    pub name: String,
    pub unit_value: f64,
    pub quantity: f64,
}

#[derive(Serialize, Clone)]
pub struct Purchase {
    pub id: i64,
    pub asset_id: i64,
    pub quantity: f64,
    pub buy_price: f64,
    pub bought_at: chrono::DateTime<chrono::Utc>,
}

pub struct UserRecord {
    pub id: i64,
    pub username: String,
    pub password_hash: String,
}
