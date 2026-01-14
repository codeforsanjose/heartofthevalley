//! Error handling for the Heart of the Valley API
//!
//! Provides hierarchical error types for API operations with appropriate
//! abstraction levels for different failure modes.

use std::fmt::{Debug, Display};

use async_trait::async_trait;
use aws_sdk_dynamodb::{
    error::SdkError,
    operation::{get_item::GetItemError, query::QueryError},
};
use axum_extra::extract::{CookieJar, Host};
use http::Method;
use openapi::apis::ErrorHandler;

use crate::api_impl::api::ApiImpl;

/// Main error type for API operations
#[derive(Debug)]
pub enum ApiError {
    /// HTTP method not supported for the endpoint (HTTP 405)
    IncorrectMethodError,

    /// Data validation or consistency failure (HTTP 500)
    DataIntegrityError,

    /// AWS DynamoDB or external service error (HTTP 500/503)
    DynamoError(DynamoServiceError),
}

impl std::error::Error for ApiError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            ApiError::DynamoError(dynamo_error) => Some(dynamo_error),
            _ => None,
        }
    }
}

impl std::fmt::Display for ApiError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ApiError::IncorrectMethodError => {
                write!(f, "HTTP method not supported for this endpoint")
            }
            ApiError::DataIntegrityError => {
                write!(f, "Data validation or consistency check failed")
            }
            ApiError::DynamoError(error) => {
                write!(f, "Database service error: {}", error)
            }
        }
    }
}

/// AWS DynamoDB-specific error types
#[derive(Debug)]
pub enum DynamoServiceError {
    /// DynamoDB Query operation error
    QueryError(SdkError<QueryError>),
    /// DynamoDB GetItem operation error
    GetItemError(SdkError<GetItemError>),
}

impl Display for DynamoServiceError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            DynamoServiceError::QueryError(sdk_error) => {
                write!(f, "DynamoDB Query operation failed: {}", sdk_error)
            }
            DynamoServiceError::GetItemError(sdk_error) => {
                write!(f, "DynamoDB GetItem operation failed: {}", sdk_error)
            }
        }
    }
}

impl std::error::Error for DynamoServiceError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            DynamoServiceError::QueryError(sdk_error) => Some(sdk_error),
            DynamoServiceError::GetItemError(sdk_error) => Some(sdk_error),
        }
    }
}

// Conversion implementations
impl From<DynamoServiceError> for ApiError {
    fn from(dynamo_error: DynamoServiceError) -> Self {
        ApiError::DynamoError(dynamo_error)
    }
}

impl From<SdkError<QueryError>> for DynamoServiceError {
    fn from(error: SdkError<QueryError>) -> Self {
        DynamoServiceError::QueryError(error)
    }
}

impl From<SdkError<GetItemError>> for DynamoServiceError {
    fn from(error: SdkError<GetItemError>) -> Self {
        DynamoServiceError::GetItemError(error)
    }
}

/// Global error handling implementation
///
/// Converts internal API errors into appropriate HTTP responses while ensuring
/// sensitive error details are logged but not exposed to clients. This prevents
/// information leakage while maintaining debuggability.
#[async_trait]
impl ErrorHandler<ApiError> for ApiImpl {
    /// Converts ApiError instances into HTTP responses
    ///
    /// This method serves as the central error handling point, ensuring consistent
    /// error responses across all endpoints and proper logging for debugging.
    ///
    /// # Security Considerations
    ///
    /// - Detailed error information is logged server-side for debugging
    /// - Client responses contain minimal information to prevent data leakage
    /// - All errors result in empty response bodies to avoid accidental exposure
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
                // Return 405 Method Not Allowed per HTTP standards
                axum::response::Response::builder()
                    .status(http::StatusCode::METHOD_NOT_ALLOWED)
                    .body(axum::body::Body::empty())
                    .map_err(|_| http::StatusCode::INTERNAL_SERVER_ERROR)
            }

            ApiError::DynamoError(inner_error) => {
                // Log detailed error information for debugging
                tracing::error!(
                    "\nDynamoDB Error:\n-------\n{}\n-------\n{:?}\n-------\n",
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
