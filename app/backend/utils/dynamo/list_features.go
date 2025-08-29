package dynamo

import (
	"backend/api"
	"context"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type ListFeaturesInput struct {
	LastEvaluatedSK      *string
	ProjectionExpression *string
}

type FeatureLister interface {
	ListFeatures(c context.Context, input *ListFeaturesInput) (*api.ListFeaturesResponse, error)
}

func (dc *DynamoConfig) ListFeatures(ctx context.Context, input *ListFeaturesInput) (*api.ListFeaturesResponse, error) {
	proj, exprAttrNames := sanitizeProjectionExpression(input.ProjectionExpression)
	exclusiveStartKey := makeExclusiveStartKey(input.LastEvaluatedSK)

	queryIn := &dynamodb.QueryInput{
		TableName:                 dc.TableName,
		KeyConditionExpression:    aws.String("PK = :pk"),
		ExpressionAttributeValues: map[string]types.AttributeValue{":pk": &types.AttributeValueMemberS{Value: "FEATURE"}},
		ProjectionExpression:      proj,
		ExpressionAttributeNames:  exprAttrNames,
		ExclusiveStartKey:         exclusiveStartKey,
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

	lastEvaluatedSK := extractLastEvaluatedSK(result.LastEvaluatedKey)
	return &api.ListFeaturesResponse{
		Features:        &features,
		LastEvaluatedSK: lastEvaluatedSK,
	}, nil
}

func makeExclusiveStartKey(lastEvaluatedSK *string) map[string]types.AttributeValue {
	if lastEvaluatedSK == nil {
		return nil
	}
	return map[string]types.AttributeValue{
		"PK": &types.AttributeValueMemberS{Value: "FEATURE"},
		"SK": &types.AttributeValueMemberS{Value: *lastEvaluatedSK},
	}
}

func extractLastEvaluatedSK(lastEvaluatedKey map[string]types.AttributeValue) *string {
	if lastEvaluatedKey == nil {
		return nil
	}
	if skAttr, ok := lastEvaluatedKey["SK"]; ok {
		if sk, ok := skAttr.(*types.AttributeValueMemberS); ok {
			return &sk.Value
		}
	}
	return nil
}
