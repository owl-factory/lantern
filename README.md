# Lantern Tabletop
A web application for playing tabletop RPGs with friends. It is currently in an early development phase and is not a functional product.

## Requirements

This project requires a NodeJS environment with Yarn installed and a PostgreSQL database server.

## Environment Variables
Below are environment the required environment variables for the project. In development, they will likely be placed within a .env file at project root. Environment variables are set in various ways during production deployments.

* `AWS_S3_KEY` - One of three secrets used for access the AWS S3 storage bucket used for storing uploaded image and audio assets.
* `AWS_S3_SECRET` - See above.
* `AWS_S3_IMAGE_BUCKET` - See above.
* `DATABASE_URL` - PostgreSQL connection string. Consumed by Prisma.
* `SENDGRID_KEY` - Secret for connecting to SendGrid email API. Used for sending email confirmation emails, password reset emails, and more.
* `JWT_SECRET` - Secret used for signing and verifying JWTs. Can be any secret string, but this project generally uses a randomly generated base 16 number with a 64 digit length. In production, *extremely* dangerous to have exposed.
* SIGNUP_MODE development


## Getting Started
Clone the project down to a local repository. Then, add a .env file containing required environment variables to the project root. If using a local Postgres database, start it up. Next, from the root of the project, run `yarn` to install all dependencies. From there, running `yarn dev` will start the project in development mode.

## Building
The project can be built with `yarn build` (as long as all dependencies are installed). Run the build with `yarn start`.

## Testing
The project can be tested through Jest using `yarn test`.

## Built With
* TypeScript
* React
* NextJS
* ChakraUI
* SQL 
* Prisma
* GraphQL

## Authors
* **Lucy Awrey** - *Lead Developer* - [lucyawrey](https://github.com/lucyawrey)
* **Laura Wenning** - *Developer* - [hey-waffles](https://github.com/hey-waffles)
