import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import data from "./heartofvalley-data.json";
import { batchWriteData } from "./lib/batch-write-data";
import { createDynamoTable } from "./lib/create-dynamo-table";
import { createS3Bucket } from "./lib/create-s3-bucket";

const dynamo = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    endpoint: process.env.AWS_ENDPOINT,
  }),
);

const s3 = new S3Client({
  endpoint: process.env.AWS_ENDPOINT,
  forcePathStyle: true,
});

const seedDynamoDB = async () => {
  await createDynamoTable(dynamo);
  await batchWriteData(dynamo, data);
};

try {
  await Promise.all([seedDynamoDB(), createS3Bucket(s3)]);
} catch (error) {
  console.error("Error seeding data:\n", error);
}
