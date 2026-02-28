use anyhow::{Error, Result, anyhow};
use aws_sdk_cognitoidentityprovider::{
    error::SdkError, operation::admin_initiate_auth::AdminInitiateAuthError, types::AuthFlowType,
};
use axum_extra::extract::{CookieJar, Host};
use http::Method;
use openapi::{
    apis::auth::{Auth, AuthLoginPostResponse},
    models::{AuthLoginPost200Response, AuthLoginPostRequest},
};

use crate::api_impl::api::ApiImpl;

#[async_trait::async_trait]
impl Auth<Error> for ApiImpl {
    async fn auth_login_post(
        &self,

        _method: &Method,
        _host: &Host,
        _cookies: &CookieJar,
        body: &AuthLoginPostRequest,
    ) -> Result<AuthLoginPostResponse> {
        let admin_initiate_auth_result = self
            .cognito_client
            .admin_initiate_auth()
            .user_pool_id(&self.cognito_user_pool_id)
            .client_id(&self.cognito_client_id)
            .auth_flow(AuthFlowType::AdminUserPasswordAuth)
            .auth_parameters("USERNAME", &body.email)
            .auth_parameters("PASSWORD", &body.password)
            .send()
            .await;

        let admin_initiate_auth_output = match admin_initiate_auth_result {
            Ok(output) => output,
            Err(SdkError::ServiceError(err))
                if matches!(
                    err.err(),
                    AdminInitiateAuthError::UserNotFoundException { .. }
                        | AdminInitiateAuthError::NotAuthorizedException { .. }
                ) =>
            {
                return Ok(AuthLoginPostResponse::Status401_InvalidCredentials(
                    "Invalid email or password".to_string(),
                ));
            }
            Err(err) => {
                return Err(anyhow!(
                    "Error during Cognito authentication. for user {:?}: {:?}",
                    body.email,
                    err
                ));
            }
        };

        let auth_result = admin_initiate_auth_output
            .authentication_result()
            .ok_or(anyhow!(
                "Authentication result missing from Cognito response"
            ))?;

        let token = auth_result
            .access_token()
            .map(|at| at.to_string())
            .ok_or(anyhow!("Access token missing from Cognito response"))?;

        let user_id = auth_result
            .id_token()
            .map(|id| id.to_string())
            .ok_or(anyhow!("ID token missing from Cognito response"))?;

        Ok(AuthLoginPostResponse::Status200_LoginSuccessful(
            AuthLoginPost200Response { token, user_id },
        ))
    }
}
