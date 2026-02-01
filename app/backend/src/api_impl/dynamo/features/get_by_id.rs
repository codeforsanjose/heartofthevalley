//! Single feature retrieval functionality for DynamoDB operations

use aws_sdk_dynamodb::{
    config::http::HttpResponse, error::SdkError, operation::get_item::GetItemError,
    types::AttributeValue,
};
use openapi::models::Feature;

use crate::api_impl::{
    dynamo::features::sanitize_projection_expression, mapping::try_map_item_to_feature,
};

/// Error types that can occur during single feature retrieval operations
#[derive(Debug)]
pub enum GetFeatureByIdError {
    /// Error occurred during DynamoDB get_item operation
    RequestError(SdkError<GetItemError, HttpResponse>),
    /// Error occurred when mapping DynamoDB item to Feature model
    DataIntegrityError,
}

/// Retrieves a feature by ID with optional field projection
///
/// Returns Some(Feature) if found, None if not found, or error on failure.
pub async fn get_feature_by_id(
    client: &aws_sdk_dynamodb::Client,
    feature_id: &str,
    initial_projection_expression: &Option<String>,
    table_name: impl Into<String>,
) -> Result<Option<Feature>, GetFeatureByIdError> {
    // Prevent injection attacks and ensure valid attribute names
    let (projection_expression, expression_attribute_names) =
        sanitize_projection_expression(initial_projection_expression);

    let get_output = client
        .get_item()
        .table_name(table_name)
        .key("PK", AttributeValue::S("FEATURE".to_string()))
        .key("SK", AttributeValue::S("FEATURE#".to_string() + feature_id))
        .set_projection_expression(projection_expression)
        .set_expression_attribute_names(expression_attribute_names)
        .send()
        .await
        .map_err(GetFeatureByIdError::RequestError)?;

    if let Some(item) = get_output.item {
        // Mapping can fail if DynamoDB data doesn't match expected schema
        let feature =
            try_map_item_to_feature(&item).map_err(|_| GetFeatureByIdError::DataIntegrityError)?;
        Ok(Some(feature))
    } else {
        Ok(None)
    }
}
