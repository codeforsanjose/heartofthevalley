//! Features listing functionality for DynamoDB operations
//!
//! This module provides functionality to list features from DynamoDB with support for
//! pagination, projection expressions, and error handling.

use aws_sdk_dynamodb::{
    config::http::HttpResponse,
    error::SdkError,
    operation::query::QueryError,
    types::AttributeValue::{self, S},
};
use openapi::models::{Feature, ListFeaturesResponse};

use crate::api_impl::{
    dynamo::features::sanitize_projection_expression, mapping::try_map_item_to_feature,
};

/// Error types that can occur during feature listing operations
#[derive(Debug)]
pub enum ListFeaturesError {
    /// Error occurred during DynamoDB query operation
    RequestError(SdkError<QueryError, HttpResponse>),
    /// Error occurred when mapping DynamoDB items to Feature models
    DataIntegrityError,
}

impl From<SdkError<QueryError, HttpResponse>> for ListFeaturesError {
    fn from(err: SdkError<QueryError, HttpResponse>) -> Self {
        ListFeaturesError::RequestError(err)
    }
}

impl From<&AttributeValue> for ListFeaturesError {
    fn from(_av: &AttributeValue) -> Self {
        ListFeaturesError::DataIntegrityError
    }
}

/// Lists features from DynamoDB with support for pagination and field projection
///
/// This function queries the DynamoDB table for feature items and returns them as a paginated list.
/// It uses the DynamoDB GSI (Global Secondary Index) pattern with PK="FEATURE" and SK="FEATURE#{id}".
///
/// # Arguments
///
/// * `client` - The DynamoDB client instance to use for the query
/// * `initial_projection_expression` - Optional string specifying which attributes to retrieve from DynamoDB.
///   If provided, only the specified fields will be returned to optimize performance and reduce costs.
/// * `last_feature_id` - Optional feature ID to use as the starting point for pagination.
///   Used to implement cursor-based pagination for efficient browsing of large datasets.
/// * `table_name` - The name of the DynamoDB table to query
///
/// # Returns
///
/// Returns a `Result` containing either:
/// - `ListFeaturesResponse` with the list of features and optional pagination token
/// - `ListFeaturesError` if the query fails or data mapping encounters issues
///
/// # Pagination
///
/// The function implements cursor-based pagination:
/// - Results are limited to 25 items per page for optimal performance
/// - Returns a `last_feature_id` token that can be used in subsequent requests
/// - If `last_feature_id` is None in the response, there are no more pages
///
/// # Performance Optimization
///
/// - Uses projection expressions to only fetch required attributes
/// - Implements a reasonable page size (25 items) to balance latency and throughput
/// - Leverages DynamoDB's native pagination with `exclusive_start_key`
///
/// # Example
///
/// ```rust,no_run
/// # use aws_sdk_dynamodb::Client;
/// # async fn example(client: &Client) -> Result<(), Box<dyn std::error::Error>> {
/// let response = list_features(
///     client,
///     &Some("feature_id,name,description".to_string()),
///     &None, // Start from the beginning
///     "features-table"
/// ).await?;
///
/// println!("Found {} features", response.features.len());
/// if let Some(pagination_token) = response.last_feature_id {
///     println!("Use token '{}' for next page", pagination_token);
/// }
/// # Ok(())
/// # }
/// ```
pub async fn list_features(
    client: &aws_sdk_dynamodb::Client,
    initial_projection_expression: &Option<String>,
    last_feature_id: &Option<String>,
    table_name: impl Into<String>,
) -> Result<ListFeaturesResponse, ListFeaturesError> {
    // Prevent injection attacks and ensure valid attribute names
    let (projection_expression, expression_attribute_names) =
        sanitize_projection_expression(initial_projection_expression);

    let mut query_builder = client
        .query()
        .table_name(table_name)
        .key_condition_expression("PK = :pk")
        .expression_attribute_values(":pk", S("FEATURE".to_string()))
        .set_projection_expression(projection_expression)
        .set_expression_attribute_names(expression_attribute_names)
        .limit(25); // Balance latency and throughput

    if let Some(last_id) = last_feature_id {
        query_builder = query_builder
            .exclusive_start_key("PK", S("FEATURE".to_string()))
            .exclusive_start_key("SK", S("FEATURE#".to_string() + last_id));
    }

    let query_output = query_builder.send().await?;

    let last_feature_id = query_output
        .last_evaluated_key()
        .and_then(|lek| {
            lek.get("SK")
                .and_then(|av| av.as_s().ok())
                .map(|s| s.to_string())
        })
        .map(|s| s.strip_prefix("FEATURE#").unwrap_or(&s).to_string());

    // Mapping can fail if DynamoDB data doesn't match expected schema
    let features = query_output
        .items()
        .iter()
        .map(|item| try_map_item_to_feature(item))
        .collect::<Result<Vec<Feature>, &AttributeValue>>()?;

    Ok(ListFeaturesResponse {
        features,
        last_feature_id,
    })
}
