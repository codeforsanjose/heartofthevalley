SHELL := /bin/bash -e -o pipefail

PWD := $(shell echo $$(pwd))
NODE_VERSION := $(shell echo $$( cat ${PWD}/.nvmrc))

build: ## Build all docker containers
build:
	NODE_VERSION=${NODE_VERSION} \
	docker compose build

npm-i: ## install npm packages
	docker run -v "${PWD}/app/client:/app" node:16-alpine npm install
	docker run -v "${PWD}/app/server:/app" node:16-alpine npm install

run: ## Start all containers.
	docker compose up

shell-web: ## Shell into the reactapp container
	docker compose run --rm hotv-client sh

shell-api: ## Shell into the express server container
	docker compose run --rm hotv-client sh

scorched-earth: ## down all containers, remove all docker data
	docker compose down
	docker system prune -f -a
