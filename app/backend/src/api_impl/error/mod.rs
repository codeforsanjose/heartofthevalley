//! Error handling for the Heart of the Valley API

use std::fmt::Debug;

use async_trait::async_trait;
use axum_extra::extract::{CookieJar, Host};
use http::Method;
use openapi::apis::ErrorHandler;

use crate::api_impl::api::ApiImpl;
pub mod aws_sdk_error;

/// Main error type for API operations
#[derive(Debug)]
pub enum ApiError {
    /// Data validation or consistency failure (HTTP 500)
    DataIntegrityError,

    AWSSdkError(aws_sdk_error::AWSSdkError),
}

impl std::error::Error for ApiError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            ApiError::AWSSdkError(inner_error) => Some(inner_error),
            ApiError::DataIntegrityError => None,
        }
    }
}

impl std::fmt::Display for ApiError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ApiError::DataIntegrityError => {
                write!(f, "Data validation or consistency check failed")
            }
            ApiError::AWSSdkError(error) => {
                write!(f, "Database service error: {}", error)
            }
        }
    }
}

/// Converts API errors into HTTP responses with proper logging
#[async_trait]
impl ErrorHandler<ApiError> for ApiImpl {
    /// Converts ApiError instances into HTTP responses with server-side logging
    async fn handle_error(
        &self,
        _method: &Method,
        _host: &Host,
        _cookies: &CookieJar,
        error: ApiError,
    ) -> Result<axum::response::Response, http::StatusCode> {
        match &error {
            ApiError::AWSSdkError(inner_error) => {
                // Log detailed error information for debugging
                tracing::error!(
                    "\nDynamoDB Error:\n-------\n{:?}\n-------\n{:?}\n-------\n",
                    error,
                    inner_error
                );
                // Return generic 500 to avoid exposing infrastructure details
                axum::response::Response::builder()
                    .status(http::StatusCode::INTERNAL_SERVER_ERROR)
                    .body(axum::body::Body::empty())
                    .map_err(|_| http::StatusCode::INTERNAL_SERVER_ERROR)
            }

            ApiError::DataIntegrityError => {
                tracing::error!("Data Integrity Error: {:?}", error);
                // Return 500 as this indicates a server-side data issue
                axum::response::Response::builder()
                    .status(http::StatusCode::INTERNAL_SERVER_ERROR)
                    .body(axum::body::Body::empty())
                    .map_err(|_| http::StatusCode::INTERNAL_SERVER_ERROR)
            }
        }
    }
}
