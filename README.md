[![build-test](https://github.com/enclave-networks/enclave-setup-action/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/enclave-networks/enclave-setup-action/actions/workflows/test.yml)
# setup-enclave

This action sets up your build runner with [Enclave](https://enclave.io), so your Actions runner can connect to your Enclave network resources.

You can use Enclave in this way to connect to any on-premise or externally hosted component of your build process and connect to it, without opening any firewall
ports or reconfiguring your network.

This action automatically:

- Installs the latest version of Enclave,
- Enrols the runner using one of your [Enrolment Keys](https://portal.enclave.io/my/keys).

> The current version of this action only supports Linux runners. Windows and MacOS runner support is coming soon.

See our [documentation](https://docs.enclave.io) for general instructions on using Enclave.

## Enrolment Key Secret

You should define a secret in your repository, `ENCLAVE_ENROLMENT_KEY` for use by the action.

This secret contains the enrolment key you wish to bring systems into your organisation with. It should be an Ephemeral Enrolment Key.

If you apply tags to this key, you can define the policy your systems will obey when they are enrolled.

## Example Usage

```yaml
# Setup enclave ready for signing
- name: Setup Enclave
  uses: enclave-networks/setup-enclave@v1
  with:
    # The enrolment key to enrol with (should be an Ephemeral key)
    enrolment-key: ${{ secrets.ENCLAVE_ENROLMENT_KEY }}
 
# The enclave binary is placed on the path.
# Use the waitfor verb to pause until an Enclave connection is established to
# a named resource.
- name: Wait for Connection to your resource
  run: enclave waitfor my-server.enclave
```
