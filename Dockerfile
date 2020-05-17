FROM node:12

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN yarn install --network-timeout 100000

# Copy files to container
COPY . .

# Building app
RUN yarn build

# Start command
CMD [ "yarn", "start" ]