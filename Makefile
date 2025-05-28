.PHONY: install build start dev test test:watch test:e2e test:cov lint format docker:build docker:up docker:down clean

# Development
install:
	npm install

build:
	npm run build

start:
	npm run start

dev:
	npm run start:dev

# Testing
test:
	npm run test

test:watch:
	npm run test:watch

test:e2e:
	npm run test:e2e

test:cov:
	npm run test:cov

# Linting and Formatting
lint:
	npm run lint

format:
	npm run format

# Docker
docker:build:
	docker-compose build

docker:up:
	docker-compose up -d

docker:down:
	docker-compose down

# Database
db:migrate:
	npm run typeorm migration:run

db:revert:
	npm run typeorm migration:revert

# Cleanup
clean:
	rm -rf dist/
	rm -rf coverage/
	rm -rf node_modules/

# Help
help:
	@echo "Available commands:"
	@echo "  make install      - Install dependencies"
	@echo "  make build        - Build the application"
	@echo "  make start        - Start the application"
	@echo "  make dev          - Start the application in development mode"
	@echo "  make test         - Run unit tests"
	@echo "  make test:watch   - Run unit tests in watch mode"
	@echo "  make test:e2e     - Run e2e tests"
	@echo "  make test:cov     - Run tests with coverage"
	@echo "  make lint         - Run linter"
	@echo "  make format       - Format code"
	@echo "  make docker:build - Build Docker containers"
	@echo "  make docker:up    - Start Docker containers"
	@echo "  make docker:down  - Stop Docker containers"
	@echo "  make db:migrate   - Run database migrations"
	@echo "  make db:revert    - Revert last database migration"
	@echo "  make clean        - Clean build artifacts"
	@echo "  make help         - Show this help message" 