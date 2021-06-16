#!/bin/bash

set -euo pipefail

echo -e "Spawning Enclave background process"

sudo chmod 755 $ENCLAVE_BINARY
sudo chown root: $ENCLAVE_BINARY

# Launch enclave, daemonised.
sudo -E $ENCLAVE_BINARY run </dev/null &>/dev/null &

echo -e "Enclave background process started"