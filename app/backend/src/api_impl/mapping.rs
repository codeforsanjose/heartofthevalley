use std::collections::HashMap;

use aws_sdk_dynamodb::types::AttributeValue;
use openapi::models;

use crate::api_impl::error::ApiError;

pub fn try_map_item_to_feature(
    item: &HashMap<String, AttributeValue>,
) -> Result<models::Feature, ApiError> {
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
