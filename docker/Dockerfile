FROM ghcr.io/usepa/node-20:latest

# extra packages needed to run Cypress
RUN apt-get update \
 && apt-get install -y libxcursor1 libnss3 libgdk-pixbuf2.0-0 wget \
            libgtk-3-dev libxss-dev libasound2-dev xvfb

WORKDIR /genra/

COPY ./package.json ./yarn.lock /genra/

SHELL ["bash", "-c"]

RUN yarn install 

COPY . /genra/

# localhost -> 0.0.0.0, don't just listen on localhost
RUN sed -i "s/host: 'localhost',/host: '0.0.0.0',/" nuxt.config.ts \
 # write OS env. vars. to .env
 && source /genra/docker/add_env.sh buildtime \
 && yarn build

ENTRYPOINT ["bash", "/genra/docker/entry.sh"]

# CMD ["yarn", "dev"]
CMD ["yarn", "start"]
