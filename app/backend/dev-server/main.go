package main

import (
	getFeatures "backend/lambdas/http/get-features"
	"log"
	"net/http"
)

func main() {
	mux := createServer(&[]Route{
		NewRouteFromLambda("GET /features", getFeatures.GetFeatures),
	})

	log.Println("Starting server on http://localhost:8080")
	err := http.ListenAndServe(":8080", mux)
	if err != nil {
		panic(err)
	}
}
