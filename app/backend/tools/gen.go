// tools/gen.go
package main

import (
	"fmt"
	"log"
	"os"
	"os/exec"
)

func main() {
	spec := os.Getenv("API_SPEC")
	if spec == "" {
		log.Fatal("API_SPEC environment variable not set")
	}

	// Adjust the command line as needed
	cmd := exec.Command("go", "tool", "oapi-codegen", "--config", "codegen.yaml", spec)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	fmt.Printf("Running: %v\n", cmd.Args)

	if err := cmd.Run(); err != nil {
		log.Fatalf("oapi-codegen failed: %v", err)
	}
}
