//! Single feature retrieval functionality for DynamoDB operations
//!
//! This module provides functionality to retrieve a specific feature by its ID from DynamoDB
//! with support for projection expressions and error handling.

use aws_sdk_dynamodb::{
    config::http::HttpResponse,
    error::SdkError,
    operation::get_item::GetItemError,
    types::AttributeValue::{self, S},
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

impl From<SdkError<GetItemError, HttpResponse>> for GetFeatureByIdError {
    fn from(err: SdkError<GetItemError, HttpResponse>) -> Self {
        GetFeatureByIdError::RequestError(err)
    }
}

impl From<&AttributeValue> for GetFeatureByIdError {
    fn from(_av: &AttributeValue) -> Self {
        GetFeatureByIdError::DataIntegrityError
    }
}

/// Retrieves a specific feature by its ID from DynamoDB
///
/// This function performs a direct key-based lookup using DynamoDB's get_item operation,
/// which is the most efficient way to retrieve a single item when you know its primary key.
/// Uses the access pattern: PK="FEATURE", SK="FEATURE#{feature_id}".
///
/// # Arguments
///
/// * `client` - The DynamoDB client instance to use for the query
/// * `feature_id` - The unique identifier of the feature to retrieve
/// * `initial_projection_expression` - Optional string specifying which attributes to retrieve.
///   Used to optimize performance and reduce costs by fetching only required fields.
/// * `table_name` - The name of the DynamoDB table to query
///
/// # Returns
///
/// Returns a `Result` containing either:
/// - `Some(Feature)` if the feature exists and was successfully mapped
/// - `None` if no feature with the given ID exists
/// - `GetFeatureByIdError` if the query fails or data mapping encounters issues
///
/// # Performance
///
/// This operation has O(1) complexity as it uses DynamoDB's primary key for direct access.
/// Projection expressions further optimize by reducing data transfer and processing.
///
/// # Example
///
/// ```rust,no_run
/// # use aws_sdk_dynamodb::Client;
/// # async fn example(client: &Client) -> Result<(), Box<dyn std::error::Error>> {
/// let feature = get_feature_by_id(
///     client,
///     "feature-123",
///     &Some("name,description,coordinates".to_string()),
///     "features-table"
/// ).await?;
///
/// match feature {
///     Some(f) => println!("Found feature: {}", f.name.unwrap_or_default()),
///     None => println!("Feature not found"),
/// }
/// # Ok(())
/// # }
/// ```
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
        .key("PK", S("FEATURE".to_string()))
        .key("SK", S("FEATURE#".to_string() + feature_id))
        .set_projection_expression(projection_expression)
        .set_expression_attribute_names(expression_attribute_names)
        .send()
        .await?;

    if let Some(item) = get_output.item {
        // Mapping can fail if DynamoDB data doesn't match expected schema
        let feature = try_map_item_to_feature(&item)?;
        Ok(Some(feature))
    } else {
        Ok(None)
    }
}
