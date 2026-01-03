use crate::api_impl::{ApiImpl, error::ApiError};
use async_trait::async_trait;
use axum_extra::extract::{CookieJar, Host};
use http::Method;
use openapi::apis::ErrorHandler;

#[async_trait]
impl ErrorHandler<ApiError> for ApiImpl {
    async fn handle_error(
        &self,
        _method: &Method,
        _host: &Host,
        _cookies: &CookieJar,
        error: ApiError,
    ) -> Result<axum::response::Response, http::StatusCode> {
        match &error {
            ApiError::IncorrectMethodError => {
                tracing::error!("Incorrect Method Error: {:?}", error);
                axum::response::Response::builder()
                    .status(http::StatusCode::METHOD_NOT_ALLOWED)
                    .body(axum::body::Body::empty())
                    .map_err(|_| http::StatusCode::INTERNAL_SERVER_ERROR)
            }

            ApiError::DynamoError(inner_error) => {
                tracing::error!(
                    "\nDynamoDB Error:\n-------\n{}\n-------\n{:?}\n-------\n",
                    error,
                    inner_error
                );
                axum::response::Response::builder()
                    .status(http::StatusCode::INTERNAL_SERVER_ERROR)
                    .body(axum::body::Body::empty())
                    .map_err(|_| http::StatusCode::INTERNAL_SERVER_ERROR)
            }

            ApiError::DataIntegrityError => {
                tracing::error!("Data Integrity Error: {:?}", error);
                axum::response::Response::builder()
                    .status(http::StatusCode::INTERNAL_SERVER_ERROR)
                    .body(axum::body::Body::empty())
                    .map_err(|_| http::StatusCode::INTERNAL_SERVER_ERROR)
            }
        }
    }
}
