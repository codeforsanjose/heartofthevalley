package getfeaturebyid

import (
	"backend/api"
	"backend/utils/dynamo"
	"log"

	"github.com/gin-gonic/gin"
)

func GetFeatureByID(c *gin.Context, featureGetter dynamo.FeatureGetter, featureId string, params api.GetFeatureByIdParams) {
	feature, err := featureGetter.GetFeature(c, &dynamo.GetFeatureInput{FeatureId: featureId, ProjectionExpression: params.ProjectionExpression})
	if err != nil {
		if err == featureGetter.FeatureNotFoundError() {
			c.JSON(404, gin.H{"message": "feature not found"})
			return
		}

		log.Println("Error getting feature:", err)
		c.JSON(500, gin.H{"message": "internal server error"})
		return
	}
	c.JSON(200, feature)
}
