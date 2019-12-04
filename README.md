# Reroll
A web application for playing tabletop RPGs.

## Requirements
This project requires either Docker or a Node.js development enviornment with to get started.

## Getting Started
Clone it locally and open a terminal in the project root. Simply run `docker-compose up` and the project will start in development mode on a Node.js contaner. You can also run the project directly in a Node.js development enviornment by installing the dependancies with `yarn install` and running the project with 'yarn dev'.

## Building
The project can be built and run in production mode by running `docker-compose -f docker-compose.prod.yml up`.

### Using with nginx-proxy image
By default, the .web.env file is empty. This works for local development through `localhost:3000`. For servers, the environment variables `VIRTUAL_HOST=[urls]` and  `VIRTUAL_PORT=3000` variables must be set within the .web.env file. 

## Testing
The project can be tested through Jest using `yarn test`.

## Built With
* React
* NextJS
* TypeScript
* MaterialUI

## Authors
* **Lucy Awrey** - *Lead Developer* - [lucyawrey](https://github.com/lucyawrey)
* **Laura Wenning** - *Developer* - [hey-waffles](https://github.com/hey-waffles)
