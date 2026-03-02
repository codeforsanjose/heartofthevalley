use anyhow::{Error, Result, anyhow};
use aws_sdk_cognitoidentityprovider::error::SdkError;
use aws_sdk_cognitoidentityprovider::operation::admin_initiate_auth::AdminInitiateAuthError;
use aws_sdk_cognitoidentityprovider::operation::admin_user_global_sign_out::AdminUserGlobalSignOutError;
use aws_sdk_cognitoidentityprovider::operation::get_tokens_from_refresh_token::GetTokensFromRefreshTokenError;
use aws_sdk_cognitoidentityprovider::types::AuthFlowType;
use axum_extra::extract::{CookieJar, Host};
use http::Method;
use openapi::apis::auth::{
    Auth, AuthLoginPostResponse, AuthRefreshPostResponse, AuthSignoutPostResponse,
};
use openapi::models::{
    AuthLoginPost200Response, AuthLoginPostRequest, AuthRefreshPost200Response,
    AuthRefreshPostRequest, AuthSignoutPostRequest,
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

        let access_token = auth_result
            .access_token()
            .map(|at| at.to_string())
            .ok_or(anyhow!("Access token missing from Cognito response"))?;

        let user_id = auth_result
            .id_token()
            .map(|id| id.to_string())
            .ok_or(anyhow!("ID token missing from Cognito response"))?;

        let refresh_token = auth_result
            .refresh_token()
            .map(|rt| rt.to_string())
            .ok_or(anyhow!("Refresh token missing from Cognito response"))?;

        Ok(AuthLoginPostResponse::Status200_LoginSuccessful(
            AuthLoginPost200Response {
                access_token,
                refresh_token,
                user_id,
            },
        ))
    }

    async fn auth_refresh_post(
        &self,
        _method: &Method,
        _host: &Host,
        _cookies: &CookieJar,
        body: &AuthRefreshPostRequest,
    ) -> Result<AuthRefreshPostResponse> {
        let tokens_refresh_result = self
            .cognito_client
            .get_tokens_from_refresh_token()
            .client_id(&self.cognito_client_id)
            .refresh_token(&body.refresh_token)
            .send()
            .await;

        let refreshed_tokens_output = match tokens_refresh_result {
            Ok(output) => output,
            Err(SdkError::ServiceError(err))
                if matches!(
                    err.err(),
                    GetTokensFromRefreshTokenError::NotAuthorizedException { .. }
                        | GetTokensFromRefreshTokenError::RefreshTokenReuseException { .. }
                        | GetTokensFromRefreshTokenError::UserNotFoundException { .. }
                ) =>
            {
                return Ok(
                    AuthRefreshPostResponse::Status401_InvalidOrExpiredRefreshToken(
                        "Invalid or expired refresh token".to_string(),
                    ),
                );
            }
            Err(err) => {
                return Err(anyhow!("Error during Cognito token refresh: {:?}", err));
            }
        };

        let auth_result = refreshed_tokens_output
            .authentication_result()
            .ok_or(anyhow!(
                "Authentication result missing from Cognito response during token refresh"
            ))?;

        let access_token = auth_result
            .access_token()
            .map(|at| at.to_string())
            .ok_or(anyhow!(
                "Access token missing from Cognito response during token refresh"
            ))?;

        let refresh_token = auth_result
            .refresh_token()
            .map(|rt| rt.to_string())
            .ok_or(anyhow!(
                "Refresh token missing from Cognito response during token refresh"
            ))?;

        Ok(AuthRefreshPostResponse::Status200_TokenRefreshSuccessful(
            AuthRefreshPost200Response {
                access_token,
                refresh_token,
            },
        ))
    }

    async fn auth_signout_post(
        &self,
        _method: &Method,
        _host: &Host,
        _cookies: &CookieJar,
        body: &AuthSignoutPostRequest,
    ) -> Result<AuthSignoutPostResponse> {
        let signout_result = self
            .cognito_client
            .admin_user_global_sign_out()
            .username(&body.email)
            .user_pool_id(&self.cognito_user_pool_id)
            .send()
            .await;

        match signout_result {
            Ok(_) => Ok(AuthSignoutPostResponse::Status200_SignOutSuccessful),
            Err(SdkError::ServiceError(err))
                if matches!(
                    err.err(),
                    AdminUserGlobalSignOutError::UserNotFoundException { .. }
                        | AdminUserGlobalSignOutError::NotAuthorizedException { .. }
                ) =>
            {
                Ok(AuthSignoutPostResponse::Status401_Unauthorized)
            }
            Err(err) => Err(anyhow!("Error during Cognito sign out: {:?}", err)),
        }
    }
}
