FROM node:12

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN yarn install

# Copy files to container
COPY . .

# Building app
RUN yarn build

# Start command
CMD [ "yarn", "start" ]