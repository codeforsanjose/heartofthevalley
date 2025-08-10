package main

import "net/http"

func createServer(routes *[]Route) *http.ServeMux {
	mux := http.NewServeMux()
	for _, route := range *routes {
		mux.HandleFunc(route.Pattern, route.Handler)
	}
	return mux
}
