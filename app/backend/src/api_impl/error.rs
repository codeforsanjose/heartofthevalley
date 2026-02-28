use anyhow::Error;
use axum::response::Response;
use axum_extra::extract::{CookieJar, Host};
use http::{Method, StatusCode};
use openapi::apis::ErrorHandler;

use crate::api_impl::api::ApiImpl;

#[async_trait::async_trait]
impl ErrorHandler<Error> for ApiImpl {
    async fn handle_error(
        &self,
        _method: &Method,
        _host: &Host,
        _cookies: &CookieJar,
        error: Error,
    ) -> Result<Response, StatusCode> {
        tracing::error!("API error: {:?}", error);

        Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .body(axum::body::Body::empty())
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
    }
}
