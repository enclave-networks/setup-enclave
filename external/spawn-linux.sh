#!/bin/bash

set -euo pipefail

# Launch enclave, daemonised.
sudo -E enclave run > /dev/null