#!/bin/bash

set -euo pipefail

echo -e "Spawning Enclave background process"

# Launch enclave, daemonised.
sudo -E $ENCLAVE_BINARY run

echo -e "Enclave background process started"