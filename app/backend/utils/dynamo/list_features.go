package dynamo

import (
	"backend/api"
	"context"
	"log"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type ListFeaturesInput struct {
	LastFeatureId        *string
	ProjectionExpression *string
}

func (dc *DynamoConfig) ListFeatures(ctx context.Context, input *ListFeaturesInput) (*api.ListFeaturesResponse, error) {
	proj, exprAttrNames := sanitizeProjectionExpression(input.ProjectionExpression)
	exclusiveStartKey := makeExclusiveStartKey(input.LastFeatureId)

	queryIn := &dynamodb.QueryInput{
		TableName:                 dc.TableName,
		KeyConditionExpression:    aws.String("PK = :pk"),
		ExpressionAttributeValues: map[string]types.AttributeValue{":pk": &types.AttributeValueMemberS{Value: "FEATURE"}},
		ProjectionExpression:      proj,
		ExpressionAttributeNames:  exprAttrNames,
		ExclusiveStartKey:         exclusiveStartKey,
		ReturnConsumedCapacity:    types.ReturnConsumedCapacityTotal,
		Limit:                     aws.Int32(25),
	}
	result, err := dc.Client.Query(ctx, queryIn)
	if err != nil {
		return nil, err
	}
	features := []api.Feature{}
	err = attributevalue.UnmarshalListOfMaps(result.Items, &features)
	if err != nil {
		return nil, err
	}
	log.Printf("ConsumedCapacity: %f", *result.ConsumedCapacity.CapacityUnits)

	lastFeatureId := extractLastFeatureId(result.LastEvaluatedKey)
	return &api.ListFeaturesResponse{
		Features:      features,
		LastFeatureId: lastFeatureId,
	}, nil
}

func makeExclusiveStartKey(lastFeatureId *string) map[string]types.AttributeValue {
	if lastFeatureId == nil {
		return nil
	}
	return map[string]types.AttributeValue{
		"PK": &types.AttributeValueMemberS{Value: "FEATURE"},
		"SK": &types.AttributeValueMemberS{Value: "FEATURE#" + *lastFeatureId},
	}
}

func extractLastFeatureId(lastEvaluatedKey map[string]types.AttributeValue) *string {
	if lastEvaluatedKey == nil {
		return nil
	}
	if skAttr, ok := lastEvaluatedKey["SK"]; ok {
		if sk, ok := skAttr.(*types.AttributeValueMemberS); ok {
			parts := strings.SplitN(sk.Value, "#", 2)
			if len(parts) == 2 {
				return &parts[1]
			}
		}
	}
	return nil
}
