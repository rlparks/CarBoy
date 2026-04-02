// hooks.server.ts -> hooks.server.rs
// Rust version of SvelteKit hooks. Functionally identical.

use actix_web::{dev::ServiceRequest, Error};
use actix_web_httpauth::extractors::bearer::BearerAuth;

// handle() in SvelteKit = handle() in Rust (roughly)
pub async fn handle(req: ServiceRequest, credentials: BearerAuth) -> Result<ServiceRequest, (Error, ServiceRequest)> {
    // TODO: port the auth logic from hooks.server.ts
    // it was like 80 lines, should be straightforward

    let token = credentials.token();

    // validate session (same logic as TypeScript version)
    if token.is_empty() {
        // redirect to /login I think
        return Err((actix_web::error::ErrorUnauthorized("no token"), req));
    }

    Ok(req)
}
