#!/bin/bash

set -euo pipefail

echo -e "Spawning Enclave background process"

# Launch enclave, daemonised.
sudo -E enclave run

echo -e "Enclave background process started"