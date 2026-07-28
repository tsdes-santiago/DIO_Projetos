use std::collections::HashMap;

use axum::{Json, Router, routing::get};
use serde::{Deserialize, Serialize};

use crate::{
    app::AppState, auth::admin::Admin, error::AppError, models::Asset,
    models::Purchase, repository::Repository,
};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/assets", get(list_assets).post(create_asset).patch(update_asset))
        .route("/assets/purchases", get(list_purchases).post(create_purchase))
}

#[tracing::instrument(skip_all)]
async fn list_assets(repository: Repository) -> Result<Json<Vec<Asset>>, AppError> {
    let assets = repository.list_assets().await?;
    Ok(Json(assets))
}

#[derive(Deserialize)]
struct CreateAssetRequest {
    name: String,
    unit_value: f64,
    #[serde(default)]
    quantity: f64,
}

#[tracing::instrument(skip_all)]
async fn create_asset(
    _: Admin,
    repository: Repository,
    Json(request): Json<CreateAssetRequest>,
) -> Result<Json<Asset>, AppError> {
    let new_asset = repository
        .create_asset(request.name, request.unit_value, request.quantity)
        .await?;

    Ok(Json(new_asset))
}

#[derive(Deserialize)]
struct UpdateAssetRequest {
    id: i64,
    name: Option<String>,
    unit_value: Option<f64>,
    #[serde(default)]
    quantity: Option<f64>,
}

#[tracing::instrument(skip_all)]
async fn update_asset(
    _: Admin,
    repository: Repository,
    Json(request): Json<UpdateAssetRequest>,
) -> Result<Json<Asset>, AppError> {
    match repository
        .update_asset(request.id, request.name, request.unit_value, request.quantity)
        .await?
    {
        Some(updated_asset) => Ok(Json(updated_asset)),
        None => Err(AppError::AssetDoesNotExist),
    }
}

#[derive(Deserialize)]
struct CreatePurchaseRequest {
    asset_id: i64,
    quantity: f64,
    buy_price: f64,
}

#[tracing::instrument(skip_all)]
async fn create_purchase(
    repository: Repository,
    Json(request): Json<CreatePurchaseRequest>,
) -> Result<Json<Purchase>, AppError> {
    let purchase = repository
        .create_purchase(request.asset_id, request.quantity, request.buy_price, chrono::Utc::now())
        .await?;

    Ok(Json(purchase))
}

#[derive(Serialize)]
struct PurchaseWithName {
    id: i64,
    asset_id: i64,
    asset_name: String,
    quantity: f64,
    buy_price: f64,
    bought_at: chrono::DateTime<chrono::Utc>,
}

async fn list_purchases(repository: Repository) -> Result<Json<Vec<PurchaseWithName>>, AppError> {
    let purchases = repository.list_purchases().await?;

    let assets = repository.list_assets().await?;
    let asset_map: HashMap<i64, String> = assets
        .into_iter()
        .map(|a| (a.id, a.name))
        .collect();

    let enriched = purchases
        .into_iter()
        .map(|p| PurchaseWithName {
            asset_name: asset_map.get(&p.asset_id).cloned().unwrap_or_default(),
            id: p.id,
            asset_id: p.asset_id,
            quantity: p.quantity,
            buy_price: p.buy_price,
            bought_at: p.bought_at,
        })
        .collect();

    Ok(Json(enriched))
}

#[cfg(test)]
mod tests {
    use sqlx::PgPool;

    use super::*;

    #[sqlx::test]
    async fn test_create_asset(db: PgPool) {
        let request = CreateAssetRequest {
            name: "Bitcoin".to_string(),
            unit_value: 10.0,
            quantity: 100.0,
        };
        let Json(new_asset) = create_asset(Admin, db.into(), Json(request))
            .await
            .expect("success");

        assert_eq!(new_asset.id, 1);
        assert_eq!(new_asset.name, "Bitcoin");
        assert_eq!(new_asset.unit_value, 10.0);
        assert_eq!(new_asset.quantity, 100.0);

        insta::assert_json_snapshot!(new_asset);
    }

    #[sqlx::test(fixtures("bitcoin_asset"))]
    async fn test_list_assets(db: PgPool) {
        let Json(assets) = list_assets(db.into()).await.expect("success");

        assert_eq!(assets.len(), 1);
        assert_eq!(assets[0].name, "Bitcoin");

        insta::assert_json_snapshot!(assets);
    }

    #[sqlx::test(fixtures("bitcoin_asset"))]
    async fn test_update_asset(db: PgPool) {
        let request = UpdateAssetRequest {
            id: 1,
            name: Some("Ethereum".to_string()),
            unit_value: Some(20.0),
            quantity: Some(50.0),
        };

        let Json(updated_asset) = update_asset(Admin, db.into(), Json(request))
            .await
            .expect("success");

        assert_eq!(updated_asset.id, 1);
        assert_eq!(updated_asset.name, "Ethereum");
        assert_eq!(updated_asset.unit_value, 20.0);
        assert_eq!(updated_asset.quantity, 50.0);

        insta::assert_json_snapshot!(updated_asset);
    }
}
