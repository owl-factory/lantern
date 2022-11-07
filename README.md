# Lantern Tabletop
A web application for playing tabletop RPGs with friends. It is currently in it's earliest stages and is not a functional product.

## Requirements

This project requires a NodeJS environment with Yarn installed and a Mongo database server. 

## Environment Variables
Environment variables are variables placed within .env files within the root of their respective projects. 

[TODO]

## Getting Started
Clone the project down to a local repository. From the root of the project, run `yarn` to install all dependencies. From there, running `yarn dev` from root will spin up all the services. 

### Common Issues
#### ENOSPC: System limit for number of file watchers reached
This error is caused by nodemon's reloading. A Linux system has a limited number of file watchers. By default, this number is 8192. With VSCode in play, this allotment can be reached very quickly, causing this error. To resolve, run 

`echo fs.inotify.max_user_watches=582222 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`

This permanently sets the maximum number of watchers per user to 582222, giving much needed breathing room for nodemon. 

## Building
The project can be built and run in production mode eitehr by building a docker container with `docker build .` and running it or with a local Node enviornment using `yarn build` and `yarn start`.

## Testing
The project can be tested through Jest using `yarn test`.

## Built With
* React
* NextJS
* TypeScript

## Authors
* **Lucy Awrey** - *Lead Developer* - [lucyawrey](https://github.com/lucyawrey)
* **Laura Wenning** - *Developer* - [hey-waffles](https://github.com/hey-waffles)
