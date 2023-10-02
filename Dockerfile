###################
# BUILD FOR PRODUCTION
###################

FROM node:14.21.3-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package.json package-lock.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm install

COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

USER node

###################
# PRODUCTION
###################

FROM node:14.21.3-alpine As production

WORKDIR /usr/src/app

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/config ./config
COPY --chown=node:node --from=build /usr/src/app/package.json ./
COPY --chown=node:node --from=build /usr/src/app/entrypoint.sh ./

RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]

# Start the server using the production build
# CMD [ "node", "dist/src/main.js" ]