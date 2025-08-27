package dynamo

import (
	"context"
	"log"
	"os"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

type DynamoConfig struct {
	TableName *string
	Client    *dynamodb.Client
}

func NewDefault() *DynamoConfig {
	tableName, there := os.LookupEnv("TABLE_NAME")
	if !there {
		log.Fatal("TABLE_NAME environment variable is not set")
	}

	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Fatalf("failed to load AWS config: %v", err)
	}

	return &DynamoConfig{
		TableName: &tableName,
		Client: dynamodb.NewFromConfig(cfg, func(o *dynamodb.Options) {
			// Set the endpoint URL for local development
			if endpoint, ok := os.LookupEnv("DYNAMODB_ENDPOINT"); ok {
				o.BaseEndpoint = &endpoint
			}
		}),
	}
}
