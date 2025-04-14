# genra-ui

## Build Setup

First, copy `template.env` into file called `.env`.
While the fields are prepopulated with some default values, you may want to adjust them.

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Running UI dev mode in Docker
```bash
# create a .env file in the docker/dev directory, use your network name and a port that is in your assigned range in place of cvalone and 5300
    DOCKER_DEV_USERNAME=cvalone
    DOCKER_DEV_PORT=5300
    COMPOSE_PROJECT_NAME=genra-ui-cvalone-docker-dev


# build for local development 
$ cd docker/dev
$ docker-compose up --build

# Check docker output for ip and port to reach the application
Edit the base .env file with CYPRESS_BASE_URL = "DOCKER_IP_AND_PORT"

# Run cypress tests 
$ docker exec -it <container-name> /bin/bash
$ yarn e2e
```


## Docker notes (not used for UI dev docker defined above)

Build with something like:
```shell
docker build -t tbrown02_genra-ui --file docker/Dockerfile .
```
i.e. tag with a name that won't conflict with others working on the same
system.  Run with something like:
```shell
docker run --rm -it -p 30000:3000 tbrown02_genra-ui
```

At image build time the UI is built in production mode.  The image's default
behavior is to run the UI in production mode using this pre-built
configuration, allowing for quick startup.  You can change the container's
`CMD` to `yarn dev` from the command line to run in dev mode, which takes a bit
longer to start up.

### Running Cypress tests in Docker

Just run the image like this:
```shell
docker run --rm -it  --network="genra_dev_default" \
    --env APPLICATION_GENRA_API_BASE=http://genra_api:5000 \
    --name tbrown02_ui_test tbrown02_genra-ui yarn dev
```
For some reason the Cypress process can't see
`http://v2626umcth804.rtord.epa.gov:11001`, so work out which Docker network
the API is running on (use `docker inspect <api container ID>`) and run the UI
on the same network (`genra_dev_default` above).  Then you can use
`genra_api:5000` as the API URL, set with the `--env` param. above.  The
`--name` is useful for connecting to the container.  And you have to run it in
dev mode (trailing `yarn dev`) for the `--env` param. to take effect, see below.

Then just
```shell
docker exec -it tbrown02_ui_test bash
yarn e2e
```

### Docker environment vars.

The [`.env`](./.env) file, which is part of the repo., defines variables used
by the UI.  **The UI does not read actual OS environment variables.**  The
docker setup for this project allows the use of actual OS environment variables
by writing to the `.env` file from [`add_env.sh`](./docker/add_env.sh) in the
[`Dockerfile`](./docker/Dockerfile) (for image build time variables) and in the
`ENTRYPOINT` (for runtime variables).

**Only variables already in the .env file are updated from
OS environment variables.**  Other variables may be set in the OS environment
but will not be updated in the .env file.

**Changing variables at runtime will only affect the UI running in dev mode.**
This could be changed by deferring the production server build to container
launch time, at the cost of a slower startup.

#### Build time environment variables

OS env. vars. are written to the `.env` file at image build time, but it's
cumbersome because each variable requires a
```docker
ARG APPLICATION_GENRA_API_BASE
ENV APPLICATION_GENRA_API_BASE=${APPLICATION_GENRA_API_BASE}
```
entry in the Dockerfile.  This doesn't matter too much, because at image build
time you can just edit the `.env` file.

#### Run time environment variables

OS env. vars. are written to the `.env` file at run time, without any need to
edit the Dockerfile.

Example output at container launch:
```shell
# buildtime values from env. vars. Wed Feb 24 14:45:44 UTC 2021
APPLICATION_GENRA_API_BASE=http://www.google.com
# runtime values from env. vars. Wed Feb 24 14:49:16 UTC 2021
APPLICATION_GENRA_API_BASE=http://v2626umcth804.rtord.epa.gov:11001
yarn run v1.22.5
...
```
Here a variable was modified at both image build time and runtime.  Note that
any variable modified only at build time will be listed as modified at runtime
as well, as it will be present in the Docker OS at run time.  The value you
will be the same in this case.

Example run time setting of variables:
```shell
docker run --rm -it -p 30001:3000 \
    --env APPLICATION_ROUTER_BASE="/read-across/" \
    tbrown02_genra-ui yarn dev
```
**Note `yarn dev` at end to run in dev mode.**   
