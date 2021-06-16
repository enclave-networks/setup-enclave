#!/bin/bash

set -euo pipefail

echo -e "Spawning Enclave background process"

chmod 755 $ENCLAVE_BINARY

# Launch enclave, daemonised.
sudo -E $ENCLAVE_BINARY run </dev/null &>/dev/null &

echo -e "Enclave background process started"