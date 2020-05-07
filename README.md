# Reroll
A web application for playing tabletop RPGs with friends. It is currently in it's earliest stages and is not a functional product.

## Requirements
This project requires either Docker or a Node.js development enviornment with to get started.

### Environment
#### Node Environment
MONGO_CONNECTION_STRING - the fully qualified URI for connecting to a MongoDB database. The full format should appear something similar to `mongodb://[username]:[password]@[mongoURL]:27017/[dbname]?authSource=[auth_dbname]`.

#### MongoDB Environment
Within database.env, add the following:
 * MONGO_INITDB_ROOT_USERNAME - the username of the root user on database initialization 
 * MONGO_INITDB_ROOT_PASSWORD - the password of the root user on database initialization

## Getting Started
Clone it locally and open a terminal in the project root. Simply run `docker-compose up` and the project will start in development mode on a Node.js contaner. You can also run the project directly in a Node.js development enviornment by installing the dependancies with `yarn install` and running the project with `yarn dev`.

To start up the included mongo database, use `docker-compose -f docker-compose.mongo.yml up -d`. This can be started in tandem with the node container or seperately. 

### Common Issues
#### ENOSPC: System limit for number of file watchers reached
This error is caused by nodemon's reloading. A Linux system has a limited number of file watchers. By default, this number is 8192. With VSCode in play, this allotment can be reached very quickly, causing this error. To resolve, run 

`echo fs.inotify.max_user_watches=582222 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`

This permanently sets the maximum number of watchers per user to 582222, giving much needed breathing room for nodemon. 

## Building
The project can be built and run in production mode eitehr by building a docker container with `docker build .` and running it or with a local Node enviornment using `yarn build` and `yarn start`.

### Using with nginx-proxy image
By default, the .web.env file is empty. This works for local development through `localhost:3000`. For servers, the environment variables `VIRTUAL_HOST=[urls]` and  `VIRTUAL_PORT=3000` variables must be set within the .web.env file. 

There must also be a network shared between the nginx-proxy and the reroll-web containers. Since the reroll container networks must be specified in the docker-compose.yaml and external containers are not guaranteed to exist in other systems, the best option is to add the nginx-proxy container to the reroll network. **Note:** this will cause an error when tearing down with `docker-compose down`, where the reroll network will not be deleted. This will simply leave the network up. `docker-compose up` will utlize this existing network. 

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
