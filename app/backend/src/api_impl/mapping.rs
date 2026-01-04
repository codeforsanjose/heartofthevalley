//! DynamoDB to domain model mapping utilities
//!
//! This module contains functions for converting raw DynamoDB items into
//! strongly-typed domain models, handling type conversions and validation
//! in the process.

use std::collections::HashMap;

use aws_sdk_dynamodb::types::AttributeValue;
use openapi::models;

/// Converts a DynamoDB item to a Feature domain model
///
/// This function performs defensive mapping from DynamoDB's loosely-typed
/// AttributeValue format to the strongly-typed Feature model. It handles
/// type mismatches gracefully by returning errors rather than panicking.
///
/// # Arguments
///
/// * `item` - A DynamoDB item represented as a HashMap of attribute names to AttributeValues
///
/// # Returns
///
/// Returns a `Result` containing either:
/// - `Feature` - Successfully mapped feature with all available attributes
/// - `&AttributeValue` - Reference to the problematic AttributeValue that caused mapping failure
///
/// # Type Conversions
///
/// - String attributes: Converted from DynamoDB String (S) type
/// - Boolean attributes: Converted from DynamoDB Bool (BOOL) type  
/// - List attributes: Converted from DynamoDB List (L) type, with inner strings extracted
/// - Optional fields: Missing attributes result in None values rather than errors
///
/// # Error Handling
///
/// Mapping fails when DynamoDB attribute types don't match expected types
/// (e.g., expecting a String but finding a Number). This indicates either:
/// - Data corruption in DynamoDB
/// - Schema changes that weren't properly migrated
/// - Client code sending unexpected data types
///
/// # Example
///
/// ```rust,no_run
/// # use std::collections::HashMap;
/// # use aws_sdk_dynamodb::types::AttributeValue;
/// let mut item = HashMap::new();
/// item.insert("title".to_string(), AttributeValue::S("Art Piece".to_string()));
/// item.insert("enabled".to_string(), AttributeValue::Bool(true));
///
/// let feature = try_map_item_to_feature(&item)?;
/// # Ok::<(), Box<dyn std::error::Error>>(())
/// ```
pub fn try_map_item_to_feature(
    item: &HashMap<String, AttributeValue>,
) -> Result<models::Feature, &AttributeValue> {
    let feature = models::Feature {
        description: item
            .get("description")
            .map(|av| av.as_s())
            .transpose()?
            .map(|s| s.to_string()),
        pk: item
            .get("PK")
            .map(|av| av.as_s())
            .transpose()?
            .map(|s| s.to_string()),
        sk: item
            .get("SK")
            .map(|av| av.as_s())
            .transpose()?
            .map(|s| s.to_string()),
        address: item
            .get("address")
            .map(|av| av.as_s())
            .transpose()?
            .map(|s| s.to_string()),
        art_type: item
            .get("artType")
            .map(|av| av.as_s())
            .transpose()?
            .map(|s| s.to_string()),
        artist: item
            .get("artist")
            .map(|av| av.as_s())
            .transpose()?
            .map(|s| s.to_string()),
        artist_url: item
            .get("artistUrl")
            .map(|av| av.as_s())
            .transpose()?
            .map(|s| s.to_string()),
        city: item
            .get("city")
            .map(|av| av.as_s())
            .transpose()?
            .map(|s| s.to_string()),
        enabled: item
            .get("enabled")
            .map(|av| av.as_bool().copied())
            .transpose()?,
        facility: item
            .get("facility")
            .map(|av| av.as_s())
            .transpose()?
            .map(|s| s.to_string()),
        image_path: item
            .get("imagePath")
            .map(|av| av.as_s())
            .transpose()?
            .map(|s| s.to_string()),
        lat_long: item
            .get("latLong")
            .map(|av| av.as_l())
            .transpose()?
            .map(|l| {
                // Extract coordinate strings from DynamoDB List format
                l.iter()
                    .filter_map(|av| av.as_s().ok().map(|s| s.to_string()))
                    .collect()
            }),
        partnership: item
            .get("partnership")
            .map(|av| av.as_s())
            .transpose()?
            .map(|s| s.to_string()),
        state: item
            .get("state")
            .map(|av| av.as_s())
            .transpose()?
            .map(|s| s.to_string()),
        title: item
            .get("title")
            .map(|av| av.as_s())
            .transpose()?
            .map(|s| s.to_string()),
        postal_code: item
            .get("postalCode")
            .map(|av| av.as_s())
            .transpose()?
            .map(|s| s.to_string()),
        source_url: item
            .get("sourceUrl")
            .map(|av| av.as_s())
            .transpose()?
            .map(|s| s.to_string()),
        source_url_text: item
            .get("sourceUrlText")
            .map(|av| av.as_s())
            .transpose()?
            .map(|s| s.to_string()),
        is_active: item
            .get("isActive")
            .map(|av| av.as_s())
            .transpose()?
            .map(|s| s.to_string()),
    };

    Ok(feature)
}
