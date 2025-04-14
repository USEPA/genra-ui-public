#!/bin/bash
set -e

# START: GenRA modifiations
source /genra/docker/add_env.sh runtime
# END: GenRA modifiations

if [ "${1#-}" != "${1}" ] || [ -z "$(command -v "${1}")" ]; then
  set -- node "$@"
fi

exec "$@"
