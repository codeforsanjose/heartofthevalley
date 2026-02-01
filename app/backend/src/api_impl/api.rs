//! API implementation for Heart of the Valley features service
//!
//! Concrete implementation of OpenAPI-generated traits that handles HTTP requests
//! and delegates to data layer operations.

use async_trait::async_trait;
use axum_extra::extract::{CookieJar, Host};
use http::Method;
use openapi::{
    apis::default::{
        Default, GetFeatureByIdResponse, ListFeaturesResponse, RequestImageUploadUrlResponse,
    },
    models::{self, ImageUploadResponse},
};

use crate::api_impl::s3::PresignedUploadUrlError;

use super::dynamo::features::get_by_id::{GetFeatureByIdError, get_feature_by_id};
use super::dynamo::features::list_features::ListFeaturesError;
use super::error::ApiError;
use super::error::aws_sdk_error::AWSSdkError;
use super::s3::presigned_url;

/// API implementation with shared DynamoDB client and configuration
#[derive(Clone)]
pub struct ApiImpl {
    /// DynamoDB client for database operations
    pub dynamo_db_client: aws_sdk_dynamodb::Client,

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
    ///
    /// Returns 404 if not found, 405 for non-GET methods, 500 for DynamoDB/data errors
    async fn get_feature_by_id(
        &self,

        _method: &Method,
        _host: &Host,
        _cookies: &CookieJar,
        path_params: &models::GetFeatureByIdPathParams,
        query_params: &models::GetFeatureByIdQueryParams,
    ) -> Result<GetFeatureByIdResponse, ApiError> {
        let feature = get_feature_by_id(
            &self.dynamo_db_client,
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
            &self.dynamo_db_client,
            &query_params.projection_expression,
            &query_params.last_feature_id,
            &self.table_name,
        )
        .await
        .map_err(|e| match e {
            ListFeaturesError::RequestError(sdk_err) => {
                ApiError::AWSSdkError(AWSSdkError::DynamoQueryError(sdk_err))
            }
            ListFeaturesError::DataIntegrityError => ApiError::DataIntegrityError,
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
    ) -> Result<RequestImageUploadUrlResponse, ApiError> {
        let presigned_url = presigned_url(&self.s3_client, &self.image_bucket_name)
            .await
            .map_err(|e| match e {
                PresignedUploadUrlError::PresigningConfigError(presigning_config_err) => panic!(
                    "Presigning config error should not occur: {:?}",
                    presigning_config_err
                ),
                PresignedUploadUrlError::RequestError(sdk_err) => {
                    ApiError::AWSSdkError(AWSSdkError::S3PresigningError(sdk_err))
                }
            })?;

        Ok(
            RequestImageUploadUrlResponse::Status200_PresignedURLGeneratedSuccessfully(
                ImageUploadResponse { presigned_url },
            ),
        )
    }
}

impl AsRef<ApiImpl> for ApiImpl {
    fn as_ref(&self) -> &ApiImpl {
        self
    }
}
