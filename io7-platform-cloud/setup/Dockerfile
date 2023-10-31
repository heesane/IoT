# Dockerfile to create a docker container image to run nodejs proejct
# refer to https://github.com/yhur/my-node-container.git
#
FROM node:16-slim

# Set to a non-root built-in user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/app

WORKDIR /home/node/app

ENV NODE_PATH=/home/node/app/node_modules:/usr/src/node-red/node_modules:/data/node_modules

CMD [ "/bin/bash", "/home/node/app/docker.run" ]
