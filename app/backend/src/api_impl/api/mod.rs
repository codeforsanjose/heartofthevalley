//! API implementation for Heart of the Valley features service
//!
//! Concrete implementation of OpenAPI-generated traits that handles HTTP requests
//! and delegates to data layer operations.

use std::collections::HashMap;

use async_trait::async_trait;
use aws_sdk_dynamodb::types::AttributeValue;
use axum_extra::extract::{CookieJar, Host};
use http::Method;
use openapi::apis::default::{Default, GetFeatureByIdResponse, ListFeaturesResponse};
use openapi::models;

use crate::api_impl::s3::presigned_url;

use super::dynamo::features::get_by_id::{GetFeatureByIdError, get_feature_by_id};
use super::dynamo::features::list_features::ListFeaturesError;
use super::error::ApiError;
use super::error::aws_sdk_error::AWSSdkError;

/// API implementation with shared DynamoDB client and configuration
#[derive(Clone)]
pub struct ApiImpl {
    /// DynamoDB client for database operations
    pub dynamodb_client: aws_sdk_dynamodb::Client,

    /// Name of the S3 bucket for image uploads
    pub image_bucket_name: String,

    /// S3 client for image upload operations
    pub s3_client: aws_sdk_s3::Client,

    /// Name of the DynamoDB table storing features data
    pub table_name: String,
}

/// Implementation of the Default trait providing the core API endpoints
#[async_trait]
impl Default<ApiError> for ApiImpl {
    /// Retrieves a feature by ID with optional field projection
    async fn get_feature_by_id(
        &self,

        _method: &Method,
        _host: &Host,
        _cookies: &CookieJar,
        path_params: &models::GetFeatureByIdPathParams,
        query_params: &models::GetFeatureByIdQueryParams,
    ) -> Result<GetFeatureByIdResponse, ApiError> {
        let feature = get_feature_by_id(
            &self.dynamodb_client,
            &path_params.feature_id,
            &query_params.projection_expression,
            &self.table_name,
        )
        .await
        .map_err(|e| match e {
            GetFeatureByIdError::RequestError(sdk_err) => {
                ApiError::AWSSdkError(AWSSdkError::DynamoGetItemError(sdk_err))
            }
            GetFeatureByIdError::DataIntegrityError => ApiError::DataIntegrityError,
        })?;

        match feature {
            None => Ok(GetFeatureByIdResponse::Status404_FeatureNotFound),
            Some(feature) => Ok(GetFeatureByIdResponse::Status200_ASingleFeature(feature)),
        }
    }

    /// Lists features with cursor-based pagination and optional field projection
    async fn list_features(
        &self,

        _method: &Method,
        _host: &Host,
        _cookies: &CookieJar,
        query_params: &models::ListFeaturesQueryParams,
    ) -> Result<ListFeaturesResponse, ApiError> {
        let list_response = crate::api_impl::dynamo::features::list_features::list_features(
            &self.dynamodb_client,
            &query_params.projection_expression,
            &query_params.last_feature_id,
            &self.table_name,
        )
        .await
        .map_err(|e| match e {
            ListFeaturesError::RequestError(sdk_err) => {
                ApiError::AWSSdkError(AWSSdkError::DynamoQueryError(sdk_err))
            }
            ListFeaturesError::DataIntegrityError(av) => {
                tracing::error!(
                    "\nData integrity error while mapping DynamoDB item to Feature model:\n-------\n{:?}\n-------\n",
                    av
                );
                ApiError::DataIntegrityError},
        })?;

        Ok(ListFeaturesResponse::Status200_AListOfFeatures(
            list_response,
        ))
    }

    async fn request_image_upload_url(
        &self,

        _method: &Method,
        _host: &Host,
        _cookies: &CookieJar,
    ) -> Result<openapi::apis::default::RequestImageUploadUrlResponse, ApiError> {
        let image_key = uuid::Uuid::new_v4();

        let url = presigned_url(&self.s3_client, &self.image_bucket_name, &image_key)
            .await
            .map_err(|e| ApiError::AWSSdkError(AWSSdkError::S3PresigningError(e)))?;

        Ok(
            openapi::apis::default::RequestImageUploadUrlResponse::Status200_PresignedS(
                models::RequestImageUploadUrl200Response {
                    upload_url: url,
                    image_key: image_key.to_string(),
                },
            ),
        )
    }

    async fn submit_feature(
        &self,

        _method: &Method,
        _host: &Host,
        _cookies: &CookieJar,
        body: &models::SubmitFeatureRequestBody,
    ) -> Result<openapi::apis::default::SubmitFeatureResponse, ApiError> {
        // Use uuid crate to generate a unique feature ID
        let feature_id = uuid::Uuid::new_v4().to_string();

        let latlong = &body.latlong;
        let lat = &latlong[0];
        let long = &latlong[1];
        let lattribute_value = AttributeValue::S(lat.to_string());
        let longttribute_value = AttributeValue::S(long.to_string());

        // Define a feature
        let feature_submission = HashMap::<String, AttributeValue>::from([
            (
                "pk".to_string(),
                AttributeValue::S("FEATURE_SUBMISSION".to_string()),
            ),
            ("sk".to_string(), AttributeValue::S(feature_id)),
            (
                "latlong".to_string(),
                AttributeValue::L(vec![lattribute_value, longttribute_value]),
            ),
            (
                "imageKey".to_string(),
                AttributeValue::S(body.image_key.clone()),
            ),
        ]);

        self.dynamodb_client
            .put_item()
            .table_name(&self.table_name)
            .set_item(Some(feature_submission))
            .send()
            .await
            .unwrap(); // TODO: Handle errors properly instead of unwrapping

        Ok(openapi::apis::default::SubmitFeatureResponse::Status201_FeatureSubmittedSuccessfully)
    }
}

impl AsRef<ApiImpl> for ApiImpl {
    fn as_ref(&self) -> &ApiImpl {
        self
    }
}
