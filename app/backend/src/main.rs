use std::env::var;

use aws_sdk_dynamodb::Client as DynamoDbClient;
use aws_sdk_s3::Client as S3Client;
use axum::routing::get;

use crate::api_impl::api::ApiImpl;

mod api_impl;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::ERROR)
        .init();

    dotenvy::dotenv().ok();

    let mut config = aws_config::from_env();
    if let Ok(endpoint) = var("DYNAMODB_ENDPOINT") {
        println!("Using custom DynamoDB endpoint: {}", endpoint);
        config = config.endpoint_url(endpoint);
    }
    let built_config = config.load().await;
    let dynamo_client = DynamoDbClient::new(&built_config);
    let s3_client = S3Client::new(&built_config);

    let api_impl = ApiImpl {
        dynamo_db_client: dynamo_client,
        image_bucket_name: var("IMAGE_BUCKET_NAME").unwrap(),
        s3_client,
        table_name: var("TABLE_NAME").unwrap(),
    };
    let app = openapi::server::new(api_impl).route("/ping", get(|| async { "pong" }));
    let addr = std::net::SocketAddr::from(([0, 0, 0, 0], 8080));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    println!("Listening on http://{}", addr);
    axum::serve(listener, app).await.unwrap();
}
