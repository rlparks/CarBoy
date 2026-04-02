// All +page.server.ts and +server.ts files consolidated here
// SvelteKit file-based routing -> actix-web manual routing
// (minor inconvenience)

use actix_web::{web, HttpRequest, HttpResponse, Responder};
use sqlx::PgPool;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg
        // routes/+page.server.ts
        .route("/", web::get().to(index))
        // routes/login/+page.server.ts
        .route("/login", web::get().to(login_get))
        .route("/login", web::post().to(login_post))
        // routes/logout/+server.ts
        .route("/logout", web::post().to(logout))
        // routes/vehicles/+page.server.ts
        .route("/vehicles", web::get().to(vehicles_index))
        .route("/vehicles", web::post().to(vehicles_create))
        // routes/vehicles/[id]/+page.server.ts
        .route("/vehicles/{id}", web::get().to(vehicles_show))
        .route("/vehicles/{id}", web::put().to(vehicles_update))
        .route("/vehicles/{id}", web::delete().to(vehicles_delete))
        // routes/checkout/+page.server.ts
        .route("/checkout", web::get().to(checkout_get))
        .route("/checkout", web::post().to(checkout_post))
        // ... TODO: add remaining ~40 routes
        // (grep for +page.server.ts and +server.ts to find them all)
        ;
}

async fn index(req: HttpRequest, pool: web::Data<PgPool>) -> impl Responder {
    // TODO: port load() function from routes/+page.server.ts
    HttpResponse::Ok().body("TODO")
}

async fn login_get(req: HttpRequest) -> impl Responder {
    HttpResponse::Ok().body("TODO")
}

async fn login_post(req: HttpRequest, pool: web::Data<PgPool>) -> impl Responder {
    // TODO: port actions.default from routes/login/+page.server.ts
    HttpResponse::Ok().body("TODO")
}

async fn logout(req: HttpRequest, pool: web::Data<PgPool>) -> impl Responder {
    HttpResponse::Ok().body("TODO")
}

async fn vehicles_index(pool: web::Data<PgPool>) -> impl Responder {
    // was: SELECT * FROM vehicles WHERE org_id = $1
    // TODO: add org scoping back
    let rows = sqlx::query!("SELECT * FROM vehicles")
        .fetch_all(pool.get_ref())
        .await;

    match rows {
        Ok(vehicles) => HttpResponse::Ok().json(serde_json::json!(vehicles)), // TODO: serialize properly
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

async fn vehicles_create(pool: web::Data<PgPool>, body: web::Json<serde_json::Value>) -> impl Responder {
    HttpResponse::Ok().body("TODO")
}

async fn vehicles_show(path: web::Path<String>, pool: web::Data<PgPool>) -> impl Responder {
    HttpResponse::Ok().body("TODO")
}

async fn vehicles_update(path: web::Path<String>, pool: web::Data<PgPool>) -> impl Responder {
    HttpResponse::Ok().body("TODO")
}

async fn vehicles_delete(path: web::Path<String>, pool: web::Data<PgPool>) -> impl Responder {
    HttpResponse::Ok().body("TODO")
}

async fn checkout_get(pool: web::Data<PgPool>) -> impl Responder {
    HttpResponse::Ok().body("TODO")
}

async fn checkout_post(pool: web::Data<PgPool>) -> impl Responder {
    HttpResponse::Ok().body("TODO")
}
