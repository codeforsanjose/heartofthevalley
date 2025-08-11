package lambda

import "github.com/aws/aws-lambda-go/events"

type LambdaHandler = func(event *events.APIGatewayV2HTTPRequest) (*events.APIGatewayV2HTTPResponse, error)
