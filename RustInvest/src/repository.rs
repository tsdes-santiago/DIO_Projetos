use std::convert::Infallible;

use axum::extract::FromRequestParts;
use sqlx::PgPool;

use crate::{
    app::AppState,
    models::{Asset, Purchase, UserRecord},
};

pub struct Repository {
    db: PgPool,
}

impl Repository {
    pub async fn list_assets(&self) -> sqlx::Result<Vec<Asset>> {
        sqlx::query_as!(
            Asset,
            "SELECT id, name, unit_value, quantity
             FROM assets;"
        )
        .fetch_all(&self.db)
        .await
    }

    pub async fn create_asset(&self, name: String, unit_value: f64, quantity: f64) -> sqlx::Result<Asset> {
        sqlx::query_as!(
            Asset,
            "INSERT INTO assets (name, unit_value, quantity)
             VALUES ($1, $2, $3)
             RETURNING id, name, unit_value, quantity;",
            name,
            unit_value,
            quantity,
        )
        .fetch_one(&self.db)
        .await
    }

    pub async fn update_asset(
        &self,
        asset_id: i64,
        name: Option<String>,
        unit_value: Option<f64>,
        quantity: Option<f64>,
    ) -> sqlx::Result<Option<Asset>> {
        sqlx::query_as!(
            Asset,
            "UPDATE assets
             SET name=COALESCE($2, name),
                 unit_value=COALESCE($3, unit_value),
                 quantity=COALESCE($4, quantity)
             WHERE id=$1
             RETURNING id, name, unit_value, quantity;",
            asset_id,
            name,
            unit_value,
            quantity,
        )
        .fetch_optional(&self.db)
        .await
    }

    pub async fn create_purchase(
        &self,
        asset_id: i64,
        quantity: f64,
        buy_price: f64,
        bought_at: chrono::DateTime<chrono::Utc>,
    ) -> sqlx::Result<Purchase> {
        sqlx::query_as!(
            Purchase,
            "INSERT INTO purchases (asset_id, quantity, buy_price, bought_at)
             VALUES ($1, $2, $3, $4)
             RETURNING id, asset_id, quantity, buy_price, bought_at;",
            asset_id,
            quantity,
            buy_price,
            bought_at,
        )
        .fetch_one(&self.db)
        .await
    }

    pub async fn list_purchases(&self) -> sqlx::Result<Vec<Purchase>> {
        sqlx::query_as!(
            Purchase,
            "SELECT id, asset_id, quantity, buy_price, bought_at
             FROM purchases
             ORDER BY bought_at DESC;"
        )
        .fetch_all(&self.db)
        .await
    }

    pub async fn list_purchases_by_asset(&self, asset_id: i64) -> sqlx::Result<Vec<Purchase>> {
        sqlx::query_as!(
            Purchase,
            "SELECT id, asset_id, quantity, buy_price, bought_at
             FROM purchases
             WHERE asset_id = $1
             ORDER BY bought_at DESC;",
            asset_id,
        )
        .fetch_all(&self.db)
        .await
    }

    pub async fn add_user(&self, username: &str, password_hash: &str) -> sqlx::Result<UserRecord> {
        sqlx::query_as!(
            UserRecord,
            "INSERT INTO users (username, password_hash)
             VALUES ($1, $2)
             RETURNING id, username, password_hash;",
            username,
            password_hash,
        )
        .fetch_one(&self.db)
        .await
    }

    pub async fn get_user_by_name(&self, username: &str) -> sqlx::Result<Option<UserRecord>> {
        sqlx::query_as!(
            UserRecord,
            "SELECT id, username, password_hash
             FROM users
             WHERE username = $1;",
            username
        )
        .fetch_optional(&self.db)
        .await
    }
}

impl FromRequestParts<AppState> for Repository {
    type Rejection = Infallible;

    async fn from_request_parts(
        _parts: &mut axum::http::request::Parts,
        state: &AppState,
    ) -> Result<Self, Self::Rejection> {
        Ok(Self {
            db: state.db.clone(),
        })
    }
}

#[cfg(test)]
impl From<PgPool> for Repository {
    fn from(db: PgPool) -> Self {
        Self { db }
    }
}
