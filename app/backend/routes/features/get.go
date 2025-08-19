package features

import (
	"backend/utils/dynamo"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	dynamoTypes "github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/gin-gonic/gin"
)

type Feature struct {
	PK            string    `json:"pk"`
	SK            string    `json:"sk"`
	Address       string    `json:"address"`
	Artist        string    `json:"artist"`
	ArtistUrl     *string   `json:"artistUrl,omitempty"`
	ArtType       string    `json:"artType"`
	City          string    `json:"city"`
	Description   string    `json:"description"`
	Enabled       bool      `json:"enabled"`
	Facility      string    `json:"facility"`
	ImagePath     *string   `json:"imagePath,omitempty"`
	IsActive      string    `json:"isActive"`
	LatLong       [2]string `json:"latLong"`
	Partnership   string    `json:"partnership"`
	PostalCode    string    `json:"postalCode"`
	SourceUrl     *string   `json:"sourceUrl,omitempty"`
	SourceUrlText *string   `json:"sourceUrlText,omitempty"`
	State         string    `json:"state"`
	Title         string    `json:"title"`
}

type Key struct {
	PK string `json:"PK"`
	SK string `json:"SK"`
}

type GetFeaturesResponse struct {
	Features         []Feature `json:"features"`
	LastEvaluatedKey *Key      `json:"lastEvaluatedKey,omitempty"`
}

func BuildGetFeatures(dynamo *dynamo.DynamoConfig) func(c *gin.Context) {
	return func(c *gin.Context) {
		// Make request
		queryIn := &dynamodb.QueryInput{
			TableName:              &dynamo.TableName,
			KeyConditionExpression: aws.String("PK = :pk"),
			ExpressionAttributeValues: map[string]dynamoTypes.AttributeValue{
				":pk": &dynamoTypes.AttributeValueMemberS{Value: "FEATURE"},
			},
		}
		queryOut, err := dynamo.Client.Query(c, queryIn)
		if err != nil {
			panic(err)
		}

		// Unmarshal items
		var features []Feature
		err = attributevalue.UnmarshalListOfMaps(queryOut.Items, &features)
		if err != nil {
			panic(err)
		}

		// Prepare last evaluated key
		var lastEvaluatedKey *Key
		if len(queryOut.LastEvaluatedKey) != 0 {
			var key Key
			err = attributevalue.UnmarshalMap(queryOut.LastEvaluatedKey, &key)
			if err != nil {
				panic(err)
			}
			lastEvaluatedKey = &key
		}

		c.Header("Access-Control-Allow-Origin", "*")
		c.JSON(200, GetFeaturesResponse{
			Features:         features,
			LastEvaluatedKey: lastEvaluatedKey,
		})
	}
}
