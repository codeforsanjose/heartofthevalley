use std::fmt::Display;

use aws_sdk_dynamodb::operation::{get_item::GetItemError, query::QueryError};
use aws_sdk_s3::operation::put_object::PutObjectError;

#[derive(Debug)]
pub enum AWSSdkError {
    DynamoQueryError(aws_sdk_dynamodb::error::SdkError<QueryError>),
    DynamoGetItemError(aws_sdk_dynamodb::error::SdkError<GetItemError>),
    S3PresigningError(aws_sdk_s3::error::SdkError<PutObjectError>),
}

impl Display for AWSSdkError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl std::error::Error for AWSSdkError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            AWSSdkError::DynamoQueryError(sdk_error) => Some(sdk_error),
            AWSSdkError::DynamoGetItemError(sdk_error) => Some(sdk_error),
            AWSSdkError::S3PresigningError(sdk_error) => Some(sdk_error),
        }
    }
}
