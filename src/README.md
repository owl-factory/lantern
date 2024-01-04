# Lantern Tabletop

Lantern is a web-based project aiming to create a flexible, open-source alternative to online virtual tabletops such as Roll20 and D&D Beyond. It is currently in early development.

## Requirements

This project requires a [NodeJS](https://nodejs.org/en) v20+ environment, a PostgreSQL database server, and the PNPM package manager -- which will automatically be installed on first use via Node's corepack after running `corepack enable`.

## Getting Started

Clone the project from the remote. Next, from the root of the project, run `pnpm install` to install all dependencies. Start your database either with standalone Postgres or using Docker with the command `docker compose up -d`.
If this is your first time running in development mode, run `pnpm run migrate` to run initial database migrations. From there, running `pnpm run dev` will start the project.

## Building

The project can be built with `pnpm run build` (as long as all dependencies are installed). Run the build with `pnpm run start`. You will need a .env.production.local file to run a local production build. It's secrets can be from the development env file or be actual production secrets.

## Testing

The project can be end-to-end tested with `pnpm run test:e2e` (database needs to be running and migrated), unit tested with `pnpm run test:e2e`, or tested with a full suite using `pnpm run test`.

Your first end-to-end test run requires `pnpm exec playwright install` to be run first to install dependencies (headless web browsers).

## Built With

- TypeScript
- React
- NextJS
- TailwindCSS
- PostgresSQL
- Kysely
- Lucia Auth
- GraphQL
- PNPM

## Authors

- **Lucy Awrey** - [lucyawrey](https://github.com/lucyawrey)
- **Laura Wenning** - [laura-wenning](https://github.com/laura-wenning)
