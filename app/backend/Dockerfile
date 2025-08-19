FROM golang:1.24-alpine3.22

WORKDIR /app

RUN go install github.com/air-verse/air@latest

COPY . .

RUN apk add --no-cache curl