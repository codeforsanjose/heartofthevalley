package getfeatures

import (
	_ "embed"

	"github.com/aws/aws-lambda-go/events"
)

//go:embed heartofvalley-data.json
var dataFile string

func GetFeatures(event *events.APIGatewayV2HTTPRequest) (*events.APIGatewayV2HTTPResponse, error) {
	// TODO: Get features from dynamodb
	// For now, return a static response

	return &events.APIGatewayV2HTTPResponse{
		StatusCode: 200,
		Body:       dataFile,
	}, nil
}
