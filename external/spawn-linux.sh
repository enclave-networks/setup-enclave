#!/bin/bash

set -euo pipefail

# Launch enclave, daemonised.
sudo -E $ENCLAVE_BINARY run > /dev/null