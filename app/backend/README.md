# Backend

This directory contains the backend code for the Heart of the Valley application. It is built using golang and is designed to run as a serverless application on AWS Lambda.

## Running the Backend

To run the backend locally, there are two methods:

1. **Using Docker**: This is the recommended way to run the backend in a containerized environment.
2. **Using the Go development server**: This allows you to run the backend without Docker, which is useful if you're on a system where Docker is not available or if you prefer to run the code directly.

### Using Docker

1. Install [Docker](https://docs.docker.com/get-docker/) if you haven't already.
2. Run the following command in the root of the project directory:

```bash
docker compose up backend
```

### Using Go

1. Ensure you have [Go](https://golang.org/doc/install) installed on your machine.
2. Navigate to app/backend/dev-server directory:

```bash
cd app/backend/dev-server
```

3. Run the development server:

```bash
go run .
```

This will start the development server, which listens for incoming requests and routes them to the appropriate lambdas.

## Lambdas

Define your AWS Lambda functions in the `lambdas/{type}` directory. Define the route in dev-server/main.go and the handler in `lambdas/{type}/{handlerName}/handler.go`.
