use std::env::var;

use axum::routing::get;

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
    let dynamo_client = aws_sdk_dynamodb::Client::new(&built_config);

    // Server
    let api_impl = crate::api_impl::ApiImpl {
        client: dynamo_client,
    };
    let app = openapi::server::new(api_impl).route("/ping", get(|| async { "pong" }));
    let addr = std::net::SocketAddr::from(([0, 0, 0, 0], 8080));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    println!("Listening on http://{}", addr);
    axum::serve(listener, app).await.unwrap();
}
