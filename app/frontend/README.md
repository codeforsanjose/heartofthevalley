# Frontend

This directory contains the frontend code for the application. It is built using [vike](https://vike.dev/) and [React](https://react.dev/).

## Development

To run the frontend locally, follow the instructions in the main [README.md](../../README.md) file.

Language servers will report that your code doesn't compile. This is because the generated code from the OpenAPI spec is not checked into version control.
To generate the code, run:

```bash
API_SPEC=../../openapi.yaml bun i
```

This will install dependencies and generate the API client code.
