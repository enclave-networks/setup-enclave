[![build-test](https://github.com/enclave-networks/enclave-setup-action/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/enclave-networks/enclave-setup-action/actions/workflows/test.yml)
# setup-enclave

This action sets up your build runner with [Enclave](https://enclave.io), so your Actions runner can connect to your Enclave network resources.

You can use Enclave in this way to connect to any on-premise or externally hosted component of your build process and connect to it, without opening any firewall
ports or reconfiguring your network.

This action automatically:

- Installs the latest version of Enclave, 
- Enrols the runner using one of your [Enrolment Keys](https://portal.enclave.io/my/keys).
- Automatically removes the enrolled system from your account at the end of the run.

> The current version of this action only supports Linux runners. Windows and MacOS runner support is coming soon.

See our [documentation](https://docs.enclave.io) for general instructions on using Enclave.

## Secrets

You should define two secrets in your repository for use by the action.

- `ENCLAVE_ENROLMENT_KEY` : 
    Containing the enrolment key you wish to bring systems into your organisation with. 
    If you apply tags to this key, you can define the policy your systems will obey when they are enrolled.

- `ENCLAVE_API_KEY` : 
    Containing a personal access token with rights to your account. This is used to remove the enrolled system at the end of the run.

## Example Usage

```yaml
# Setup enclave ready for signing
- name: Setup Enclave
  uses: enclave-alistair/enclave-setup-action@main
  with:
    # The enrolment key to 
    enrolment-key: ${{ secrets.ENCLAVE_ENROLMENT_KEY }}

    # We need the orgId and API key in order to revoke the system at
    # the end of the run, so we don't use up your available systems.
    # When Ephemeral Systems is released in November 2021 this won't be needed.
    orgId: <your organisation ID here>
    apiKey: ${{ secrets.ENCLAVE_API_KEY }}
 
# The enclave binary is placed on the path.
# Use the waitfor verb to pause until an Enclave connection is established to
# a named resource.
- name: Wait for Connection to your resource
  run: enclave waitfor my-server.enclave
```
