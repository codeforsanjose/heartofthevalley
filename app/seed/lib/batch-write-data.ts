import {
  BatchWriteCommand,
  type DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

export const batchWriteData = async (
  dynamo: DynamoDBDocumentClient,
  data: Record<string, unknown>[],
) => {
  try {
    const chunkSize = 25;
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }

    await Promise.all(
      chunks.map((chunk) =>
        dynamo.send(
          new BatchWriteCommand({
            RequestItems: {
              LocalDevTable: chunk.map((Item) => ({ PutRequest: { Item } })),
            },
          }),
        ),
      ),
    );
  } catch (error) {
    throw new Error(
      `Failed to batch write data to DynamoDB: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};
