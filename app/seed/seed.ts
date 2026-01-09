import { CreateTableCommand, DynamoDB } from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

import data from "./heartofvalley-data-updated.json";

try {
  const dynamo = DynamoDBDocumentClient.from(
    new DynamoDB({
      endpoint: process.env.DYNAMODB_ENDPOINT,
    })
  );

  // Ensure the table exists before seeding
  await dynamo.send(
    new CreateTableCommand({
      TableName: "MyTable",
      KeySchema: [
        { AttributeName: "PK", KeyType: "HASH" },
        { AttributeName: "SK", KeyType: "RANGE" },
      ],
      AttributeDefinitions: [
        { AttributeName: "PK", AttributeType: "S" },
        { AttributeName: "SK", AttributeType: "S" },
      ],
      BillingMode: "PAY_PER_REQUEST",
    })
  );

  // Split data into chunks of 25 items each
  const chunkSize = 25;
  const chunks = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }

  // Process each chunk sequentially
  for (const chunk of chunks) {
    await dynamo.send(
      new BatchWriteCommand({
        RequestItems: {
          MyTable: chunk.map((Item) => ({ PutRequest: { Item } })),
        },
      })
    );
  }
} catch (error) {
  console.error("Error seeding data:", error);
}
