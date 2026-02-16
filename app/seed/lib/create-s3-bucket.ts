import { CreateBucketCommand, type S3Client } from "@aws-sdk/client-s3";

export const createS3Bucket = async (s3: S3Client) => {
  try {
    await s3.send(new CreateBucketCommand({ Bucket: "my-bucket" }));
  } catch (error) {
    throw new Error(
      `Failed to create S3 bucket: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};
