//! Features listing functionality for DynamoDB operations

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
    DataIntegrityError(AttributeValue),
}

impl From<SdkError<QueryError, HttpResponse>> for ListFeaturesError {
    fn from(err: SdkError<QueryError, HttpResponse>) -> Self {
        ListFeaturesError::RequestError(err)
    }
}

impl From<&AttributeValue> for ListFeaturesError {
    fn from(av: &AttributeValue) -> Self {
        ListFeaturesError::DataIntegrityError(av.clone())
    }
}

/// Lists features from DynamoDB with pagination and field projection
///
/// Uses cursor-based pagination (25 items per page) with optional projection expressions.
/// Returns features list and optional pagination token for next page.
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
