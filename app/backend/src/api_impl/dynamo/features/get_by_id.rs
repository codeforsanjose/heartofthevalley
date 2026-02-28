//! Retrieve a single feature from DynamoDB by ID.

use anyhow::Result;
use aws_sdk_dynamodb::types::AttributeValue::S;
use openapi::models::Feature;

use crate::api_impl::{
    dynamo::features::sanitize_projection_expression, mapping::try_map_item_to_feature,
};

/// Fetches one feature by ID using DynamoDB `get_item`.
///
/// Access pattern: `PK="FEATURE"`, `SK="FEATURE#{feature_id}"`.
///
/// # Arguments
///
/// * `client` - DynamoDB client.
/// * `feature_id` - Feature identifier.
/// * `initial_projection_expression` - Optional projected attributes.
/// * `table_name` - DynamoDB table name.
///
/// # Returns
///
/// Returns:
/// - `Ok(Some(Feature))` when found.
/// - `Ok(None)` when not found.
/// - `Err(_)` on request or mapping failure.
///
pub async fn get_feature_by_id(
    client: &aws_sdk_dynamodb::Client,
    feature_id: &str,
    initial_projection_expression: &Option<String>,
    table_name: impl Into<String>,
) -> Result<Option<Feature>> {
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
        let feature = try_map_item_to_feature(&item).map_err(|av| {
            anyhow::anyhow!("Data integrity error: unexpected attribute value {:?}", av)
        })?;
        Ok(Some(feature))
    } else {
        Ok(None)
    }
}
