# F1 Data Platform

A Formula 1 data platform built with NestJS, TypeScript, Prisma, and PostgreSQL, designed to expose historical F1 data through a REST API and support motorsport analytics with Power BI.

## Project Overview

F1 Data Platform is a backend project focused on collecting, organizing, and exposing Formula 1 historical data.

The platform will provide a structured API for accessing information about drivers, constructors, circuits, seasons, races, and race results.

The long-term goal is to integrate historical F1 data with Power BI to build analytics dashboards covering championship performance, race statistics, and driver and constructor comparisons.

## Technology Stack

- **Backend:** NestJS 12
- **Language:** TypeScript
- **Database:** PostgreSQL 17
- **ORM:** Prisma 7
- **Infrastructure:** Docker
- **Testing:** Jest and Supertest
- **Analytics:** Power BI (planned)

## Architecture

The project follows a modular architecture:

- **REST API:** Exposes read endpoints for Formula 1 data.
- **Database:** PostgreSQL stores structured historical F1 information.
- **ORM:** Prisma manages database access, schema, and migrations.
- **Data ingestion (planned):** A separate service will retrieve and synchronize data from external Formula 1 APIs.
- **Analytics (planned):** Power BI will consume the platform's data for reporting and visualization.

### Data Sources

- [Jolpica-F1 API](https://github.com/jolpica/jolpica-f1): Primary source for historical Formula 1 data dating back to 1950.
- [OpenF1 API](https://openf1.org/): Complementary source for detailed telemetry and session data, primarily from 2023 onward.

## Prerequisites

- Node.js 22+
- npm
- Docker and Docker Compose
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone git@github.com:ferfff/f1-data-platform.git
cd f1-data-platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://webhook_user:webhook_password@localhost:5433/webhook_hub?schema=public"
```

Use your local PostgreSQL configuration if it differs from the example above.

### 4. Start PostgreSQL

```bash
docker compose up -d
```

### 5. Apply database migrations

```bash
npx prisma migrate dev
```

### 6. Generate Prisma Client

```bash
npx prisma generate
```

### 7. Start the development server

```bash
npm run start:dev
```

The API will be available at:

`http://localhost:3000`

## Available Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Checks API and database connectivity |

Additional Formula 1 endpoints will be documented as they are implemented.

## Testing

Run unit tests:

```bash
npm test -- --runInBand
```

Run end-to-end tests:

```bash
npm run test:e2e -- --runInBand
```

Build the application:

```bash
npm run build
```

## Database Management

Open Prisma Studio:

```bash
npx prisma studio
```

Create a migration after modifying the Prisma schema:

```bash
npx prisma migrate dev --name migration_name
```

## Roadmap

- [x] NestJS project initialization
- [x] PostgreSQL Docker configuration
- [x] Prisma integration
- [x] Initial database schema
- [x] Health check endpoint
- [x] Unit and end-to-end testing
- [ ] Drivers REST API
- [ ] Constructors REST API
- [ ] Circuits and seasons REST APIs
- [ ] Races and results REST APIs
- [ ] Historical data ingestion
- [ ] OpenF1 integration
- [ ] Power BI dashboards
- [ ] AWS deployment
- [ ] CI/CD pipeline

## License

This project is licensed under the MIT License.