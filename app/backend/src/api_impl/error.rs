//! API error handling for the Heart of the Valley backend
//!
//! This module defines the main error types that can occur during API operations,
//! providing a unified error interface that abstracts away implementation details
//! while preserving essential error information for debugging and client responses.

use std::{error::Error, fmt::Debug};

use aws_sdk_dynamodb::{
    error::SdkError,
    operation::{get_item::GetItemError, query::QueryError},
};

/// Main error type for API operations
///
/// This enum consolidates different categories of errors that can occur during
/// API request processing, allowing for consistent error handling and client
/// response formatting across all endpoints.
#[derive(Debug)]
pub enum ApiError {
    /// HTTP method not supported for the requested endpoint
    ///
    /// Occurs when a client attempts to use an HTTP method (GET, POST, etc.)
    /// that is not implemented for a particular API endpoint.
    IncorrectMethodError,

    /// Data validation or consistency error
    ///
    /// Occurs when data retrieved from storage doesn't match expected schemas,
    /// or when data transformation/validation fails during request processing.
    DataIntegrityError,

    /// AWS DynamoDB or other external service error
    ///
    /// Wraps errors from external dependencies like DynamoDB, allowing
    /// the original error context to be preserved while providing a
    /// consistent interface for error handling.
    DynamoError(Box<dyn Error + Send + Sync>),
}

/// Standard Error trait implementation for ApiError
///
/// Enables ApiError to be used with Rust's standard error handling mechanisms
/// and error propagation patterns like the `?` operator.
impl std::error::Error for ApiError {}

/// Display formatting for ApiError
///
/// Provides human-readable error messages suitable for logging and debugging.
/// Note: These messages may contain technical details and should be sanitized
/// before being sent to client applications to avoid information leakage.
impl std::fmt::Display for ApiError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ApiError::IncorrectMethodError => write!(f, "Incorrect Method Error"),
            ApiError::DataIntegrityError => write!(f, "Data Integrity Error"),
            // Preserve underlying error context for debugging
            ApiError::DynamoError(error) => write!(f, "SDK Error {}", error),
        }
    }
}

pub enum DynamoServiceError {
    QueryError(SdkError<QueryError>),
    GetItemError(SdkError<GetItemError>),
}
