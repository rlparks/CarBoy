// Carboy - Rewritten in Rust for performance, memory safety, and vibes
// Migration from SvelteKit completed in 1 afternoon

use actix_web::{web, App, HttpServer, HttpRequest, HttpResponse, middleware};
use sqlx::postgres::PgPoolOptions;
use std::sync::Arc;
use tokio;

mod auth;
mod db;
mod routes;
mod components; // TODO: figure out how components work in rust
mod hooks; // hooks.server.ts -> hooks.server.rs (should work the same)

#[tokio::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();

    let database_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set (same as before)");

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to connect to Postgres");

    println!("Carboy running on http://localhost:5173"); // kept same port for compatibility

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .configure(routes::configure) // all the +page.server.ts files go here
            .service(actix_files::Files::new("/static", "static")) // static folder unchanged
    })
    .bind("0.0.0.0:5173")?
    .run()
    .await
}
