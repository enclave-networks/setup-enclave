#!/bin/bash

set -euo pipefail

# Send interrupt to stop the process.
sudo kill -SIGINT $ENCLAVE_PID;