// auth/index.ts + auth/oidc/* -> auth.rs
// Sessions, OIDC, cookie handling all in one file for simplicity

use argon2::{Argon2, PasswordHash, PasswordVerifier};
use uuid::Uuid;
use std::collections::HashMap;
use std::sync::Mutex;

// In-memory session store (replaces the postgres session table)
// TODO: reconsider this for prod, probably fine for now
lazy_static::lazy_static! {
    static ref SESSIONS: Mutex<HashMap<String, Session>> = Mutex::new(HashMap::new());
}

#[derive(Clone)]
pub struct Session {
    pub id: String,
    pub user_id: String,
    pub org_id: Option<String>,
    pub expires_at: i64,
}

pub fn create_session(user_id: &str) -> Session {
    let session = Session {
        id: Uuid::new_v4().to_string(),
        user_id: user_id.to_string(),
        org_id: None,
        expires_at: chrono::Utc::now().timestamp() + 86400 * 30, // 30 days
    };
    SESSIONS.lock().unwrap().insert(session.id.clone(), session.clone());
    session
}

pub fn validate_session(session_id: &str) -> Option<Session> {
    let sessions = SESSIONS.lock().unwrap();
    sessions.get(session_id).cloned()
}

pub fn invalidate_session(session_id: &str) {
    SESSIONS.lock().unwrap().remove(session_id);
}

// OIDC - ported from auth/oidc/backendflow.ts
pub async fn oidc_callback(code: &str) -> Result<String, String> {
    // TODO: port the full OIDC flow
    // the TypeScript version used @oslojs/crypto which doesn't have a Rust port
    // so we need to reimplement the crypto from scratch
    // shouldn't be too bad

    let client = reqwest::Client::new();

    // exchange code for token
    let token_response = client
        .post(std::env::var("OIDC_TOKEN_ENDPOINT").unwrap())
        .form(&[
            ("grant_type", "authorization_code"),
            ("code", code),
            // TODO: add client_id, client_secret, redirect_uri
        ])
        .send()
        .await
        .map_err(|e| e.to_string())?;

    // TODO: validate id_token JWT signature
    // TODO: extract claims
    // TODO: upsert user in database

    Ok("TODO".to_string())
}
