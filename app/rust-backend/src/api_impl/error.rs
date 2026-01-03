use std::error::Error;

use aws_sdk_dynamodb::types::AttributeValue;

#[derive(Debug)]
pub enum ApiError {
    IncorrectMethodError,
    DataIntegrityError,
    DynamoError(Box<dyn Error + Send + Sync>),
}

impl std::error::Error for ApiError {}

impl std::fmt::Display for ApiError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ApiError::IncorrectMethodError => write!(f, "Incorrect Method Error"),
            ApiError::DataIntegrityError => write!(f, "Data Integrity Error"),
            ApiError::DynamoError(error) => write!(f, "SDK Error {}", error),
        }
    }
}

impl From<&AttributeValue> for ApiError {
    fn from(_av: &AttributeValue) -> Self {
        ApiError::DataIntegrityError
    }
}
