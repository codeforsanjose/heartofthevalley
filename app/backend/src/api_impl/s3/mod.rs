use aws_sdk_s3::{
    error::SdkError,
    operation::put_object::PutObjectError,
    presigning::{PresigningConfig, PresigningConfigError},
};

pub enum PresignedUploadUrlError {
    RequestError(SdkError<PutObjectError>),
    PresigningConfigError(PresigningConfigError),
}

pub async fn presigned_url(
    s3_client: &aws_sdk_s3::Client,
    bucket_name: &str,
) -> Result<String, PresignedUploadUrlError> {
    let presigning_config = PresigningConfig::builder()
        .expires_in(std::time::Duration::from_secs(900))
        .build()
        .map_err(PresignedUploadUrlError::PresigningConfigError)?;
    let presigned = s3_client
        .put_object()
        .bucket(bucket_name)
        .key(uuid::Uuid::new_v4())
        .presigned(presigning_config)
        .await
        .map_err(PresignedUploadUrlError::RequestError)?;
    Ok(presigned.uri().to_string())
}
