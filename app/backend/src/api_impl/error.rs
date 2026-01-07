//! Error handling for the Heart of the Valley API
//!
//! Provides hierarchical error types for API operations with appropriate
//! abstraction levels for different failure modes.

use std::fmt::{Debug, Display};

use aws_sdk_dynamodb::{
    error::SdkError,
    operation::{get_item::GetItemError, query::QueryError},
};

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
