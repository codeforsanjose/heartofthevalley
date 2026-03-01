use std::env::var;

use anyhow::Result;
use aws_sdk_dynamodb::Client as DynamoDbClient;
use axum::routing::get;

use crate::api_impl::api::ApiImpl;

mod api_impl;

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt()
        .with_ansi(false)
        .with_max_level(tracing::Level::ERROR)
        .init();

    dotenvy::dotenv().ok();
    let built_config = build_config().await;
    let dynamo_client = DynamoDbClient::new(&built_config);
    let cognito_client = aws_sdk_cognitoidentityprovider::Client::new(&built_config);

    let api_impl = ApiImpl {
        dynamodb_client: dynamo_client,
        cognito_client,
        cognito_user_pool_id: var("COGNITO_USER_POOL_ID")
            .map_err(|e| format!("Error getting COGNITO_USER_POOL_ID: {}", e))
            .unwrap(),
        cognito_client_id: var("COGNITO_CLIENT_ID")
            .map_err(|e| format!("Error getting COGNITO_CLIENT_ID: {}", e))
            .unwrap(),
        table_name: var("TABLE_NAME")
            .map_err(|e| format!("Error getting TABLE_NAME: {}", e))
            .unwrap(),
    };
    let app = openapi::server::new(api_impl).route("/ping", get(|| async { "pong" }));
    let addr = std::net::SocketAddr::from(([0, 0, 0, 0], 8080));
    let listener = tokio::net::TcpListener::bind(addr).await?;
    println!("Listening on http://{}", addr);
    axum::serve(listener, app).await?;
    Ok(())
}

async fn build_config() -> aws_config::SdkConfig {
    let mut config = aws_config::from_env();
    if let Ok(endpoint) = var("DYNAMODB_ENDPOINT") {
        println!("Using custom DynamoDB endpoint: {}", endpoint);
        config = config.endpoint_url(endpoint);
    }
    config.load().await
}
