FROM node:12

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/src/app

# Installing dependencies
COPY package.json ./
RUN yarn install --production=true --ignore-optional

# Copying source files
COPY . .

# Building app
RUN yarn build

# Running the app
CMD [ "yarn", "start" ]
