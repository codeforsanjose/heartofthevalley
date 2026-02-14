import { CreateTableCommand } from "@aws-sdk/client-dynamodb";
import type { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const createDynamoTable = async (dynamo: DynamoDBDocumentClient) => {
  try {
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
      }),
    );
  } catch (error) {
    throw new Error(
      `Failed to create DynamoDB table: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};
