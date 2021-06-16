#!/bin/bash

set -euo pipefail

echo "DNS=$ENCLAVE_ADDR" | sudo tee -a /etc/systemd/resolved.conf
sudo systemctl restart systemd-resolved