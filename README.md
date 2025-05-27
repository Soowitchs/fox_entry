<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Lišákův obchod

A REST API for product inventory management, built with NestJS, TypeORM, and PostgreSQL.

## Purpose
This project provides a backend for managing products, their prices, and stock, including price history. It is suitable for small shops or as a learning project for RESTful API design.

## Installation & Configuration
1. Clone the repository.
2. Copy `.env.example` to `.env` and adjust as needed.
3. Install dependencies:
   ```bash
   npm install
   ```
4. (Optional) Use Docker Compose for local development:
   ```bash
   docker-compose up --build
   ```

## Running
- Locally: `npm run start`
- In Docker: `docker-compose up --build`
- API docs: [http://localhost:3000/api](http://localhost:3000/api)

## Security
- No authentication or authorization is implemented by default. For production, add JWT or OAuth2.
- Input validation is recommended (see below).

## Input Validation
- Use `class-validator` and `class-transformer` in DTOs for validating incoming data. See NestJS docs for examples.

## Environment Variables
- See `.env.example` for all required variables.

## CI/CD
- Add a `.github/workflows/ci.yml` for GitHub Actions to automate tests and linting.

## Logging & Monitoring
- Integrate Winston or Sentry for advanced logging and error monitoring.

## License
MIT (see LICENSE file)

## Features
- Product CRUD (create, read, update, delete)
- Search products by name
- Filter products by stock
- Price change tracking and history
- OpenAPI (Swagger) documentation

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure PostgreSQL:**
   - Ensure PostgreSQL is running locally with a database named `lisakuv_obchod` and user/password `postgres`/`postgres` (or update `src/app.module.ts` for your setup).
3. **Run the server:**
   ```bash
   npm run start
   ```
4. **API documentation:**
   - Visit [http://localhost:3000/api](http://localhost:3000/api) for Swagger UI and OpenAPI docs.

## Docker

To run the app and PostgreSQL in Docker:
```bash
docker-compose up --build
```
The API will be available at [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Products
- `POST /products` — Create a new product
- `GET /products` — List all products
- `GET /products/search?name=...` — Search products by name
- `GET /products/filter?minStock=...` — Filter products by minimum stock
- `GET /products/:id` — Get a product by ID
- `PUT /products/:id` — Update a product (tracks price changes)
- `DELETE /products/:id` — Delete a product
- `GET /products/:id/price-history` — Get price change history for a product

## Development

### Linting
```bash
npm run lint
```

### Testing
```bash
npm run test
```

### Code Coverage
```bash
npm run test:cov
```

## Notes
- No authentication or UI is included (API only)
- All code is typed and organized for clarity

---

Happy coding!

## Project setup

```bash
$ npm install
```