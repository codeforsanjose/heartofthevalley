//! API implementation for Heart of the Valley features service
//!
//! This module provides the concrete implementation of the OpenAPI-generated
//! traits, handling HTTP requests and delegating to appropriate data layer
//! operations. It serves as the bridge between HTTP transport and business logic.

use async_trait::async_trait;
use axum_extra::extract::{CookieJar, Host};
use http::Method;
use openapi::{
    apis::default::{Default, GetFeatureByIdResponse, ListFeaturesResponse},
    models,
};

use crate::api_impl::{
    dynamo::features::get_by_id::{GetFeatureByIdError, get_feature_by_id},
    error::ApiError,
};

use super::error::DynamoServiceError;

/// Main API implementation struct containing shared resources
///
/// This struct holds the dependencies needed across all API endpoints,
/// including the DynamoDB client and configuration. It implements the
/// OpenAPI-generated traits to provide actual business logic.
#[derive(Clone)]
pub struct ApiImpl {
    /// DynamoDB client for database operations
    pub client: aws_sdk_dynamodb::Client,
    /// Name of the DynamoDB table storing features data
    pub table_name: String,
}

/// Implementation of the Default trait providing the core API endpoints
#[async_trait]
impl Default<ApiError> for ApiImpl {
    /// Retrieves a single feature by its unique identifier
    ///
    /// This endpoint provides efficient single-item lookup using DynamoDB's
    /// primary key access pattern. It supports optional field projection
    /// to minimize data transfer and improve performance.
    ///
    /// # HTTP Method Validation
    ///
    /// Only GET requests are accepted. Other HTTP methods return 405 Method Not Allowed
    /// to comply with REST conventions and prevent unintended operations.
    ///
    /// # Error Handling
    ///
    /// - DynamoDB errors are wrapped and logged for debugging while returning generic 500 responses
    /// - Data integrity issues (malformed data) result in 500 Internal Server Error
    /// - Missing features return 404 Not Found as expected by REST conventions
    async fn get_feature_by_id(
        &self,

        method: &Method,
        _host: &Host,
        _cookies: &CookieJar,
        path_params: &models::GetFeatureByIdPathParams,
        query_params: &models::GetFeatureByIdQueryParams,
    ) -> Result<GetFeatureByIdResponse, ApiError> {
        if method != &Method::GET {
            return Err(ApiError::IncorrectMethodError);
        }

        let feature = get_feature_by_id(
            &self.client,
            &path_params.feature_id,
            &query_params.projection_expression,
            &self.table_name,
        )
        .await
        .map_err(|e| match e {
            GetFeatureByIdError::RequestError(sdk_err) => {
                ApiError::DynamoError(DynamoServiceError::GetItemError(sdk_err))
            }
            GetFeatureByIdError::DataIntegrityError => ApiError::DataIntegrityError,
        })?;

        match feature {
            None => Ok(GetFeatureByIdResponse::Status404_FeatureNotFound),
            Some(feature) => Ok(GetFeatureByIdResponse::Status200_ASingleFeature(feature)),
        }
    }

    /// Lists features with pagination and optional field projection
    ///
    /// This endpoint provides efficient paginated access to the features collection.
    /// It supports cursor-based pagination for consistent results even as the
    /// underlying data changes, and optional field projection for performance optimization.
    ///
    /// # Pagination Strategy
    ///
    /// Uses cursor-based pagination rather than offset-based to ensure:
    /// - Consistent results when data is modified during browsing
    /// - Better performance for large datasets
    /// - No missing or duplicate items across page boundaries
    async fn list_features(
        &self,

        method: &Method,
        _host: &Host,
        _cookies: &CookieJar,
        query_params: &models::ListFeaturesQueryParams,
    ) -> Result<ListFeaturesResponse, ApiError> {
        if method != &Method::GET {
            return Err(ApiError::IncorrectMethodError);
        }

        let list_response = crate::api_impl::dynamo::features::list_features::list_features(
            &self.client,
            &query_params.projection_expression,
            &query_params.last_feature_id,
            &self.table_name,
        )
        .await
        .map_err(|e| match e {
            crate::api_impl::dynamo::features::list_features::ListFeaturesError::RequestError(sdk_err) => {
                ApiError::DynamoError(DynamoServiceError::QueryError(sdk_err))
            }
            crate::api_impl::dynamo::features::list_features::ListFeaturesError::DataIntegrityError => ApiError::DataIntegrityError,
        })?;

        Ok(ListFeaturesResponse::Status200_AListOfFeatures(
            list_response,
        ))
    }
}

impl AsRef<ApiImpl> for ApiImpl {
    fn as_ref(&self) -> &ApiImpl {
        self
    }
}
