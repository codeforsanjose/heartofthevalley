mod error;
mod error_handling;
mod mapping;

use async_trait::async_trait;
use aws_sdk_dynamodb::types::AttributeValue::S;
use axum_extra::extract::{CookieJar, Host};
use error::ApiError;
use http::Method;
use openapi::{
    apis::default::{Default, GetFeatureByIdResponse, ListFeaturesResponse},
    models::{self},
};

use crate::api_impl::mapping::try_map_item_to_feature;

#[derive(Clone)]
pub struct ApiImpl {
    pub client: aws_sdk_dynamodb::Client,
}

#[async_trait]
impl Default<ApiError> for ApiImpl {
    async fn get_feature_by_id(
        &self,

        method: &Method,
        _host: &Host,
        _cookies: &CookieJar,
        path_params: &models::GetFeatureByIdPathParams,
        query_params: &models::GetFeatureByIdQueryParams,
    ) -> Result<GetFeatureByIdResponse, ApiError> {
        // IncorrectMethodError if method is not GET
        if method != &Method::GET {
            return Err(ApiError::IncorrectMethodError);
        }

        // Process projectionExpression if provided
        // If the projectionExpression is provided, check if it includes "state"
        // If it does, we have to replace "state" with "#st" and add an expression attribute name mapping
        let mut projection_expression = None;
        let mut expression_attribute_names = None;
        if let Some(proj_expr) = &query_params.projection_expression {
            if proj_expr.contains("state") {
                let modified_expr = proj_expr.replace("state", "#st");
                projection_expression = Some(modified_expr);
                let mut expr_attr_names = std::collections::HashMap::new();
                expr_attr_names.insert("#st".to_string(), "state".to_string());
                expression_attribute_names = Some(expr_attr_names);
            } else {
                projection_expression = Some(proj_expr.clone());
            }
        }

        // Make a DynamoDB get
        let mut get_builder = self
            .client
            .get_item()
            .table_name("DeploymentStack-HeartOfValleyTable6CECEE9C-1CF2MXMG3R0L6")
            .key("PK", S("FEATURE".to_string()))
            .key("SK", S("FEATURE#".to_string() + &path_params.feature_id))
            .set_projection_expression(projection_expression)
            .set_expression_attribute_names(expression_attribute_names);

        // Handle TABLE_NAME environment variable for local testing
        if let Ok(table_name) = std::env::var("TABLE_NAME") {
            get_builder = get_builder.table_name(table_name);
        }

        // Send the get
        let get_item_output = get_builder
            .send()
            .await
            .map_err(|e| ApiError::DynamoError(Box::new(e)))?;

        // Process the get item output
        if let Some(item) = get_item_output.item() {
            let feature = try_map_item_to_feature(item)?;

            Ok(GetFeatureByIdResponse::Status200_ASingleFeature(feature))
        } else {
            Ok(GetFeatureByIdResponse::Status404_FeatureNotFound)
        }
    }

    async fn list_features(
        &self,

        method: &Method,
        _host: &Host,
        _cookies: &CookieJar,
        query_params: &models::ListFeaturesQueryParams,
    ) -> Result<ListFeaturesResponse, ApiError> {
        // IncorrectMethodError if method is not GET
        if method != &Method::GET {
            return Err(ApiError::IncorrectMethodError);
        }

        // Process projectionExpression if provided
        // If the projectionExpression is provided, check if it includes "state"
        // If it does, we have to replace "state" with "#st" and add an expression attribute name mapping
        let mut projection_expression = None;
        let mut expression_attribute_names = None;
        if let Some(proj_expr) = &query_params.projection_expression {
            if proj_expr.contains("state") {
                let modified_expr = proj_expr.replace("state", "#st");
                projection_expression = Some(modified_expr);
                let mut expr_attr_names = std::collections::HashMap::new();
                expr_attr_names.insert("#st".to_string(), "state".to_string());
                expression_attribute_names = Some(expr_attr_names);
            } else {
                projection_expression = Some(proj_expr.clone());
            }
        }

        // Make a DynamoDB query
        let mut query_builder = self
            .client
            .query()
            .table_name("DeploymentStack-HeartOfValleyTable6CECEE9C-1CF2MXMG3R0L6")
            .key_condition_expression("PK = :pk")
            .expression_attribute_values(":pk", S("FEATURE".to_string()))
            .set_projection_expression(projection_expression)
            .set_expression_attribute_names(expression_attribute_names)
            .limit(25);

        // Handle pagination with last_feature_id
        if let Some(last_id) = &query_params.last_feature_id {
            query_builder = query_builder
                .exclusive_start_key("PK", S("FEATURE".to_string()))
                .exclusive_start_key("SK", S("FEATURE#".to_string() + last_id));
        }

        // Handle TABLE_NAME environment variable for local testing
        if let Ok(table_name) = std::env::var("TABLE_NAME") {
            query_builder = query_builder.table_name(table_name);
        }

        // Send the query
        let query_output = query_builder
            .send()
            .await
            .map_err(|e| ApiError::DynamoError(Box::new(e)))?;

        // Process the query output
        // Extract last_feature_id for pagination
        let last_feature_id = query_output
            .last_evaluated_key()
            .and_then(|lek| {
                lek.get("SK")
                    .and_then(|av| av.as_s().ok())
                    .map(|s| s.to_string())
            })
            .map(|s| s.strip_prefix("FEATURE#").unwrap_or(&s).to_string());

        // Map DynamoDB items to Feature models
        let features = query_output
            .items()
            .iter()
            .map(|item| try_map_item_to_feature(item))
            .collect::<Result<Vec<models::Feature>, ApiError>>()?;

        // Return the response
        Ok(ListFeaturesResponse::Status200_AListOfFeatures(
            models::ListFeaturesResponse {
                features,
                last_feature_id,
            },
        ))
    }
}

impl AsRef<ApiImpl> for ApiImpl {
    fn as_ref(&self) -> &ApiImpl {
        self
    }
}
