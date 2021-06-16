#!/bin/bash

set -euo pipefail

echo -e "Spawning Enclave background process"

sudo chown runner: $ENCLAVE_BINARY
sudo chmod 755 $ENCLAVE_BINARY

# Run without sudo once so that the extract directory 
# doesn't get created with root ownership
$ENCLAVE_BINARY version

# Launch enclave, daemonised.
sudo -E $ENCLAVE_BINARY run </dev/null &>/dev/null &

echo -e "Enclave background process started"