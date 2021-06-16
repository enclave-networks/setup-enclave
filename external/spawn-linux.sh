#!/bin/bash

set -euo pipefail

echo -e "Spawning Enclave background process"

# Launch enclave, daemonised.
sudo -E enclave run </dev/null &> /dev/null &