//! List features from DynamoDB.

use anyhow::Result;
use aws_sdk_dynamodb::types::AttributeValue::{self, S};
use openapi::models::{Feature, ListFeaturesResponse};

use crate::api_impl::{
    dynamo::features::sanitize_projection_expression, mapping::try_map_item_to_feature,
};

/// Lists features with pagination and optional field projection.
///
/// Access pattern: `PK="FEATURE"`, `SK="FEATURE#{id}"`.
///
/// # Arguments
///
/// * `client` - DynamoDB client.
/// * `initial_projection_expression` - Optional projected attributes.
/// * `last_feature_id` - Optional pagination cursor.
/// * `table_name` - DynamoDB table name.
///
/// # Returns
///
/// Returns:
/// - `Ok(ListFeaturesResponse)` on success.
/// - `Err(ListFeaturesError)` on request or mapping failure.
pub async fn list_features(
    client: &aws_sdk_dynamodb::Client,
    initial_projection_expression: &Option<String>,
    last_feature_id: &Option<String>,
    table_name: impl Into<String>,
) -> Result<ListFeaturesResponse> {
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
        .collect::<Result<Vec<Feature>, &AttributeValue>>()
        .map_err(|av| {
            anyhow::anyhow!("Data integrity error: unexpected attribute value {:?}", av)
        })?;

    Ok(ListFeaturesResponse {
        features,
        last_feature_id,
    })
}
