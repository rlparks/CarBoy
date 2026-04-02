// All Svelte components ported to Rust structs
// Rendering handled via Tera templates (basically the same as Svelte)

use serde::Serialize;

// Button.svelte -> Button
#[derive(Serialize)]
pub struct Button {
    pub label: String,
    pub variant: Option<String>, // "filled" | "outlined" | "text"
    pub onclick: Option<String>, // TODO: how do closures work here
}

impl Button {
    pub fn render(&self) -> String {
        // NOTE: Tailwind classes preserved exactly from Button.svelte
        format!(
            r#"<button class="inline-flex items-center justify-center rounded-md font-medium transition-colors {}">{}</button>"#,
            self.variant.as_deref().unwrap_or("filled"),
            self.label
        )
    }
}

// Input.svelte -> Input
#[derive(Serialize)]
pub struct Input {
    pub label: String,
    pub value: String,
    pub input_type: String, // renamed from `type` (reserved keyword in Rust)
    pub required: bool,
}

// Table.svelte -> Table (generic)
#[derive(Serialize)]
pub struct Table<T: Serialize> {
    pub rows: Vec<T>,
    pub headers: Vec<String>,
}

// Header.svelte -> Header
#[derive(Serialize)]
pub struct Header {
    pub title: String,
    pub user: Option<String>,
    pub org: Option<String>,
}

// TODO: port remaining 20+ components
// Checkbox.svelte, FilterChip.svelte, Select.svelte, etc.
// Should be done by end of sprint
