package listfeatures

import (
	"backend/api"
	"backend/utils/dynamo"
	"context"
	"log"

	"github.com/gin-gonic/gin"
)

type FeatureLister interface {
	ListFeatures(c context.Context, input *dynamo.ListFeaturesInput) (*api.ListFeaturesResponse, error)
}

func BuildListFeatures(c *gin.Context, fl FeatureLister, params *api.ListFeaturesParams) {
	lfo, err := fl.ListFeatures(c, &dynamo.ListFeaturesInput{LastFeatureId: params.LastFeatureId, ProjectionExpression: params.ProjectionExpression})
	if err != nil {
		log.Printf("Error listing features: %v", err)
		c.JSON(500, gin.H{"message": "internal server error"})
		return
	}
	c.JSON(200, lfo)
}
