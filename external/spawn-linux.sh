#!/bin/bash

set -euo pipefail

echo -e "Spawning Enclave background process"

# Launch enclave, daemonised.
sudo nohup -E enclave run </dev/null &>/dev/null &

echo -e "Enclave background process started"