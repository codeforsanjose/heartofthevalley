use std::env::var;

use aws_sdk_dynamodb::Client;
use axum::routing::get;

use crate::api_impl::api::ApiImpl;

mod api_impl;

#[tokio::main]
async fn main() {
    // Logging
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::ERROR)
        .init();

    // DynamoDB client
    let mut config = aws_config::from_env();
    if let Ok(endpoint) = var("DYNAMODB_ENDPOINT") {
        println!("Using custom DynamoDB endpoint: {}", endpoint);
        config = config.endpoint_url(endpoint);
    }
    let built_config = config.load().await;
    let dynamo_client = Client::new(&built_config);

    // Server
    let api_impl = ApiImpl {
        client: dynamo_client,
        table_name: var("TABLE_NAME").unwrap_or_else(|_| {
            "DeploymentStack-HeartOfValleyTable6CECEE9C-1CF2MXMG3R0L6".to_string()
        }),
    };
    let app = openapi::server::new(api_impl).route("/ping", get(|| async { "pong" }));
    let addr = std::net::SocketAddr::from(([0, 0, 0, 0], 8080));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    println!("Listening on http://{}", addr);
    axum::serve(listener, app).await.unwrap();
}
