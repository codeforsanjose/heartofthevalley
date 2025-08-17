package main

import (
	"backend/routes/features"
	"backend/utils/dynamo"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.GET("/features", features.BuildGetFeatures(dynamo.NewDefault()))
	r.GET("/ping", func(c *gin.Context) {
		c.String(200, "pong")
	})
	r.OPTIONS("/*any", func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Status(204)
	})
	if err := r.Run(":8080"); err != nil {
		panic(err)
	}
}
