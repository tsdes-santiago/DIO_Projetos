use std::collections::HashMap;

use askama::Template;
use axum::{
    Form, Router,
    response::{Html, IntoResponse, Redirect, Response},
    routing::get,
};
use axum_extra::extract::{CookieJar, cookie::Cookie};
use serde::Deserialize;

use crate::{
    app::AppState,
    auth::user::{UnauthenticatedUser, User},
    error::AppError,
    repository::Repository,
};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/", get(index))
        .route("/login", get(login_page).post(login))
        .route("/assets", get(list_assets_page))
        .route("/purchases", get(list_purchases_page))
        .route("/buy", get(buy_page).post(buy))
}

#[derive(Template)]
#[template(path = "login.html")]
struct LoginPage;

#[derive(Template)]
#[template(path = "assets.html")]
struct AssetsPage {
    username: String,
    assets: Vec<AssetView>,
}

struct AssetView {
    id: i64,
    name: String,
    unit_value: String,
    quantity: String,
}

#[derive(Template)]
#[template(path = "dashboard.html")]
struct DashboardPage {
    username: String,
    assets: Vec<DashboardAssetView>,
    total_invested: String,
    total_value: String,
    total_gain: String,
    total_gain_class: String,
}

struct DashboardAssetView {
    name: String,
    unit_value: String,
    quantity: String,
    invested: String,
    current_value: String,
    gain: String,
    gain_class: String,
}

#[derive(Template)]
#[template(path = "purchases.html")]
struct PurchasesPage {
    username: String,
    purchases: Vec<PurchaseView>,
}

struct PurchaseView {
    asset_name: String,
    quantity: String,
    buy_price: String,
    total_cost: String,
    bought_at: String,
}

#[derive(Template)]
#[template(path = "buy.html")]
struct BuyPage {
    username: String,
    assets: Vec<AssetView>,
}

async fn buy_page(
    user: User,
    repository: Repository,
) -> Result<Html<String>, AppError> {
    let assets = repository.list_assets().await?;
    let views = assets
        .into_iter()
        .map(|a| AssetView {
            id: a.id,
            name: a.name,
            unit_value: format!("{:.2}", a.unit_value),
            quantity: format_quantity(a.quantity),
        })
        .collect();
    let html = BuyPage {
        username: user.username().clone(),
        assets: views,
    }
    .render()?;

    Ok(Html(html))
}

#[derive(Deserialize)]
struct BuyForm {
    asset_id: i64,
    quantity: f64,
    buy_price: f64,
}

async fn buy(
    _user: User,
    repository: Repository,
    Form(form): Form<BuyForm>,
) -> Result<impl IntoResponse, AppError> {
    repository
        .create_purchase(form.asset_id, form.quantity, form.buy_price, chrono::Utc::now())
        .await?;

    Ok(Redirect::to("/"))
}

async fn login_page() -> Result<Html<String>, AppError> {
    let html = LoginPage.render()?;
    Ok(Html(html))
}

async fn list_assets_page(
    user: User,
    repository: Repository,
) -> Result<Html<String>, AppError> {
    let assets = repository.list_assets().await?;
    let views: Vec<AssetView> = assets
        .into_iter()
        .map(|a| AssetView {
            id: a.id,
            name: a.name,
            unit_value: format!("{:.2}", a.unit_value),
            quantity: format_quantity(a.quantity),
        })
        .collect();
    let html = AssetsPage {
        username: user.username().clone(),
        assets: views,
    }
    .render()?;

    Ok(Html(html))
}

async fn list_purchases_page(
    user: User,
    repository: Repository,
) -> Result<Html<String>, AppError> {
    let purchases = repository.list_purchases().await?;
    let assets = repository.list_assets().await?;
    let asset_map: HashMap<i64, String> = assets
        .into_iter()
        .map(|a| (a.id, a.name))
        .collect();

    let views: Vec<PurchaseView> = purchases
        .into_iter()
        .map(|p| PurchaseView {
            asset_name: asset_map.get(&p.asset_id).cloned().unwrap_or_default(),
            quantity: format_quantity(p.quantity),
            buy_price: format!("{:.2}", p.buy_price),
            total_cost: format!("{:.2}", p.quantity * p.buy_price),
            bought_at: p.bought_at.format("%d/%m/%Y %H:%M").to_string(),
        })
        .collect();

    let html = PurchasesPage {
        username: user.username().clone(),
        purchases: views,
    }
    .render()?;

    Ok(Html(html))
}

#[derive(Deserialize)]
struct LoginForm {
    username: String,
    password: String,
}

async fn login(
    repository: Repository,
    jar: CookieJar,
    Form(request): Form<LoginForm>,
) -> Result<impl IntoResponse, AppError> {
    let unauth_user = UnauthenticatedUser::new(request.username, request.password);
    let user = match unauth_user.authenticate(&repository).await {
        Ok(user) => user,
        Err(AppError::UserDoesNotExist) => unauth_user.register(&repository).await?,
        Err(other_err) => return Err(other_err),
    };

    let token = user.auth_token()?;
    let cookie = Cookie::build(("token", token)).http_only(true);

    Ok((jar.add(cookie), Redirect::to("/")))
}

async fn index(
    maybe_user: Option<User>,
    repository: Repository,
) -> Result<Response, AppError> {
    match maybe_user {
        Some(user) => {
            let assets = repository.list_assets().await?;
            let purchases = repository.list_purchases().await?;

            let total_invested: f64 = purchases.iter().map(|p| p.quantity * p.buy_price).sum();
            let total_value: f64 = assets.iter().map(|a| a.unit_value * a.quantity).sum();
            let total_gain = total_value - total_invested;

            let dashboard_assets: Vec<DashboardAssetView> = assets
                .into_iter()
                .map(|a| {
                    let invested: f64 = purchases
                        .iter()
                        .filter(|p| p.asset_id == a.id)
                        .map(|p| p.quantity * p.buy_price)
                        .sum();
                    let current_value = a.unit_value * a.quantity;
                    let gain = current_value - invested;
                    DashboardAssetView {
                        name: a.name,
                        unit_value: format!("{:.2}", a.unit_value),
                        quantity: format_quantity(a.quantity),
                        invested: format!("{:.2}", invested),
                        current_value: format!("{:.2}", current_value),
                        gain: format_gain(gain),
                        gain_class: gain_class(gain),
                    }
                })
                .collect();

            let html = DashboardPage {
                username: user.username().clone(),
                assets: dashboard_assets,
                total_invested: format!("{:.2}", total_invested),
                total_value: format!("{:.2}", total_value),
                total_gain: format_gain(total_gain),
                total_gain_class: gain_class(total_gain),
            }
            .render()?;

            Ok(Html(html).into_response())
        }
        None => Ok(Redirect::to("/login").into_response()),
    }
}

fn format_quantity(q: f64) -> String {
    if q.fract() == 0.0 {
        format!("{:.0}", q)
    } else {
        format!("{:.4}", q)
    }
}

fn format_gain(gain: f64) -> String {
    if gain >= 0.0 {
        format!("+{:.2}", gain)
    } else {
        format!("{:.2}", gain)
    }
}

fn gain_class(gain: f64) -> String {
    (if gain >= 0.0 { "gain" } else { "loss" }).to_string()
}
