use aws_sdk_s3::presigning::PresigningConfig;

use anyhow::Result;
use uuid::Uuid;

pub async fn presigned_url(
    s3_client: &aws_sdk_s3::Client,
    bucket_name: &str,
    image_key: &Uuid,
) -> Result<String> {
    let presigning_config = PresigningConfig::builder()
        .expires_in(std::time::Duration::from_secs(900))
        .build()?;
    let presigned = s3_client
        .put_object()
        .bucket(bucket_name)
        .key(*image_key)
        .presigned(presigning_config)
        .await?;
    Ok(presigned.uri().to_string())
}
