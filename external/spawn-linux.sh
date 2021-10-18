#!/bin/bash

set -euo pipefail

echo -e "Spawning Enclave background process"

sudo chown runner: $ENCLAVE_BINARY
sudo chmod 755 $ENCLAVE_BINARY

export DOTNET_BUNDLE_EXTRACT_BASE_DIR=$RUNNER_TEMP/enclave-daemon-extract
# Launch enclave, daemonised.
sudo -E $ENCLAVE_BINARY run </dev/null &>$RUNNER_TEMP/enclave-launch &

cat $RUNNER_TEMP/enclave-launch

echo -e "Enclave background process started"