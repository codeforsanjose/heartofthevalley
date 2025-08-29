package main

import (
	"backend/api"
	"backend/routes/features/getfeaturebyid"
	"backend/routes/features/listfeatures"
	"backend/utils/dynamo"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

//go:generate go run ./tools/gen.go

type Server struct {
	dynamoConfig *dynamo.DynamoConfig
}

// GetFeatureById implements api.ServerInterface.
func (s *Server) GetFeatureById(c *gin.Context, featureId string, params api.GetFeatureByIdParams) {
	getfeaturebyid.GetFeatureByID(c, s.dynamoConfig, featureId, params)
}

func (s *Server) ListFeatures(c *gin.Context, params api.ListFeaturesParams) {
	listfeatures.BuildListFeatures(c, s.dynamoConfig, &params)
}

func main() {
	r := gin.Default()
	r.Use(cors.Default())

	dynamoConfig := dynamo.NewDefault()
	server := &Server{dynamoConfig: dynamoConfig}
	api.RegisterHandlers(r, server)

	r.GET("/ping", func(c *gin.Context) {
		c.String(200, "pong")
	})
	if err := r.Run(":8080"); err != nil {
		panic(err)
	}
}
