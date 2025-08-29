package dynamo

import (
	"backend/api"
	"context"
	"errors"
	"strings"

	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type GetFeatureInput struct {
	FeatureId            string
	ProjectionExpression *string
}

type FeatureGetter interface {
	FeatureNotFoundError() error
	GetFeature(c context.Context, input *GetFeatureInput) (*api.Feature, error)
}

var errfeatureNotFound = errors.New("feature not found")

func (dc *DynamoConfig) GetFeature(ctx context.Context, getFeatureInput *GetFeatureInput) (*api.Feature, error) {
	proj, exprAttrNames := sanitizeProjectionExpression(getFeatureInput.ProjectionExpression)

	getIn := &dynamodb.GetItemInput{
		TableName: dc.TableName,
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{Value: "FEATURE"},
			"SK": &types.AttributeValueMemberS{Value: "FEATURE#" + getFeatureInput.FeatureId},
		},
		ProjectionExpression:     proj,
		ExpressionAttributeNames: exprAttrNames,
	}

	result, err := dc.Client.GetItem(ctx, getIn)
	if err != nil {
		return nil, err
	}
	if result.Item == nil {
		return nil, errfeatureNotFound
	}

	feature := &api.Feature{}
	err = attributevalue.UnmarshalMap(result.Item, feature)
	if err != nil {
		return nil, err
	}

	return feature, nil
}

func (dc *DynamoConfig) FeatureNotFoundError() error {
	return errfeatureNotFound
}

func sanitizeProjectionExpression(proj *string) (*string, map[string]string) {
	if proj == nil {
		return nil, nil
	}

	var projectionExpression *string
	var expressionAttributeNames map[string]string

	// Take care of state keyword
	replaced := strings.ReplaceAll(*proj, "state", "#S")
	projectionExpression = &replaced
	if strings.Contains(*proj, "state") {
		expressionAttributeNames = map[string]string{
			"#S": "state",
		}
	}
	return projectionExpression, expressionAttributeNames
}
