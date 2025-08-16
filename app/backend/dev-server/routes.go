package main

import (
	"backend/utils/lambda"
	"io"
	"log"
	"net/http"
	"net/url"
	"strings"

	"github.com/aws/aws-lambda-go/events"
)

type Route struct {
	Pattern string
	Handler func(http.ResponseWriter, *http.Request)
}

func NewRouteFromLambda(pattern string, handler lambda.LambdaHandler) Route {

	return Route{
		Pattern: pattern,
		Handler: func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
			w.Header().Set("Access-Control-Allow-Methods", "*")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusOK)
				return
			}

			log.Printf("Handling request for %s", pattern)
			bodyBytes, err := io.ReadAll(r.Body)
			if err != nil {
				http.Error(w, "Failed to read request body", http.StatusBadRequest)
				return
			}
			bodyString := string(bodyBytes)

			// Parse query parameters
			parsedQuery, err := url.ParseQuery(r.URL.RawQuery)
			if err != nil {
				http.Error(w, "Failed to parse query parameters", http.StatusBadRequest)
				return
			}

			// Convert parsedQuery from url.Values to map[string]string
			queryMap := make(map[string]string)
			for key, values := range parsedQuery {
				if len(values) > 0 {
					// Join multiple values with commas
					queryMap[key] = strings.Join(values, ",")
				}
			}

			// Create the event for the Lambda handler
			event := &events.APIGatewayV2HTTPRequest{
				Version:               "2.0",
				RouteKey:              "GET /get-features",
				RawPath:               r.URL.Path,
				RawQueryString:        r.URL.RawQuery,
				Cookies:               convertCookies(r.Cookies()),
				Headers:               convertHeaders(r.Header),
				QueryStringParameters: queryMap,
				RequestContext: events.APIGatewayV2HTTPRequestContext{
					RouteKey:     pattern,
					AccountID:    "dev-server-fake-account-id",
					Stage:        "dev-server-stage",
					RequestID:    "dev-server-fake-request-id",
					Authorizer:   &events.APIGatewayV2HTTPRequestContextAuthorizerDescription{},
					APIID:        "dev-server-fake-api-id",
					DomainName:   "dev-server-fake-domain",
					DomainPrefix: "dev-server-fake-domain-prefix",
					Time:         "1999-12-31T23:59:59Z",
					TimeEpoch:    946684799,
					HTTP: events.APIGatewayV2HTTPRequestContextHTTPDescription{
						Method:    r.Method,
						Path:      r.URL.Path,
						Protocol:  "HTTP/1.1",
						SourceIP:  r.RemoteAddr,
						UserAgent: r.UserAgent(),
					},
				},
				Body:            bodyString,
				IsBase64Encoded: false,
			}

			response, err := handler(event)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			for key, value := range response.Headers {
				w.Header().Set(key, value)
			}
			w.WriteHeader(response.StatusCode)
			w.Write([]byte(response.Body))
		},
	}
}

func convertCookies(cookies []*http.Cookie) []string {
	result := make([]string, len(cookies))
	for i, cookie := range cookies {
		result[i] = cookie.String()
	}
	return result
}

func convertHeaders(headers http.Header) map[string]string {
	result := make(map[string]string)
	for key, values := range headers {
		if len(values) > 0 {
			result[key] = values[0] // Use the first value for simplicity
		}
	}
	return result
}
