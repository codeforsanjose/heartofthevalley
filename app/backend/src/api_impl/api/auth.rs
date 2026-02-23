use axum_extra::extract::{CookieJar, Host};
use http::Method;
use openapi::{
    apis::auth::{Auth, AuthLoginPostResponse},
    models::AuthLoginPostRequest,
};

use crate::api_impl::{api::ApiImpl, error::ApiError};

#[async_trait::async_trait]
impl Auth<ApiError> for ApiImpl {
    async fn auth_login_post(
        &self,

        _method: &Method,
        _host: &Host,
        _cookies: &CookieJar,
        _body: &AuthLoginPostRequest,
    ) -> Result<AuthLoginPostResponse, ApiError> {
        todo!()
    }
}
