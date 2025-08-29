package listfeatures

import (
	"backend/api"
	"backend/utils/dynamo"
	"log"

	"github.com/gin-gonic/gin"
)

func BuildListFeatures(c *gin.Context, fl dynamo.FeatureLister, params *api.ListFeaturesParams) {
	lfo, err := fl.ListFeatures(c, &dynamo.ListFeaturesInput{LastEvaluatedSK: params.LastFeatureId, ProjectionExpression: params.ProjectionExpression})
	if err != nil {
		log.Printf("Error listing features: %v", err)
		c.JSON(500, gin.H{"message": "internal server error"})
		return
	}
	c.JSON(200, lfo)
}
