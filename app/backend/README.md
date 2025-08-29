# Backend

This directory contains the backend code for the Heart of the Valley application. It is built using golang and is designed to run as a serverless application on AWS Lambda.

## Development

To run the backend locally, follow the instructions in the main [README.md](../../README.md) file.

Language servers will report that your code doesn't compile. This is because the generated code from the OpenAPI spec is not checked into version control.
To generate the code, run:

```bash
API_SPEC=../../openapi.yaml go generate ./...
```
