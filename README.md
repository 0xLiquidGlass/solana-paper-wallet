# Solana Paper Wallet For NodeJS
This is a solana paper wallet written using NodeJS, designed to generate a new solana keypair

## Usage

`solwallet <options>`

--version or -v (Show the current version of the paper wallet)

--qr or -q (Generate a QR code for the generated address)

--help or -h (This only shows the option to generate the QR code.
              Can be ignored for now)

## Examples

`solwallet > foo.txt`

Generates a Solana keypair to a file called foo.txt in the current directory

`solwallet -q > foo.txt`

Generates a Solana keypair to a file called foo.txt with a QR code being saved in the current directory

## Installation

If you are using solwallet on __Windows__, get the latest NodeJS [here](https://nodejs.org/en/download)

If you are using solwallet on __Linux__ or __MacOS__, follow the installation instructions [here](https://nodejs.org/en/download/package-manager)

To install this script, run

`npm install -g solwallet`

To verify if the package has been installed correctly, run

`solwallet -v`

It should show the lastest version of the script installed

## Contributing

Any contributions to the code are welcome. This can come in the form of opening pull requests if you would like to contribute to the code directly or filing an issue if you would like to suggest any improvements

## Credits

[Solana Cookbook](https://solanacookbook.com/references/keypairs-and-wallets.html#how-to-generate-a-new-keypair),
[@solana/web3.js](https://www.npmjs.com/package/@solana/web3.js/v/0.30.8),
[micro-ed25519-hdkey](https://www.npmjs.com/package/micro-ed25519-hdkey),
[bip39](https://www.npmjs.com/package/bip39),
[qrcode](https://www.npmjs.com/package/qrcode),

## License

solwallet uses the [MIT license](https://opensource.org/license/mit)
