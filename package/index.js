#!/usr/bin/env node

process.argv.push('--no-deprecation');

const { Keypair, PublicKey} = require("@solana/web3.js");
const { HDKey } = require("micro-ed25519-hdkey");
const bip39 = require("bip39");
const qr = require('qrcode');
const fs = require('fs');

// Variables
const versionNumber = "0.1.0";

function generateKeypair(){
    // Generate seed phrase
    const mnemonic = bip39.generateMnemonic();
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const hd = HDKey.fromMasterSeed(Buffer.from(seed, "hex"));

    // Derive public and private keys from seed phrase
    const path = `m/44'/501'/0'/0'`;
    const keypair = Keypair.fromSeed(hd.derive(path).privateKey);

    return { keypair, mnemonic };
}

function invalidKeypair(){
    console.log("The generated keypair is invalid. Please try again");
}

function outputKeypair(generatedPubKey, mnemonic){
    console.log(generatedPubKey);
    console.log("Seed Phrase:", mnemonic);

    // Output address as QR if needed
    if (process.argv[2] === "--qr" || "-q"){
        qr.toFile("./sol-qr-address.png", generatedPubKey, {
            color: {
                dark: "#000",
                light: "#fff"
            }
        }, (err) => {
            if (err) throw err;
        });
    }
}

function main(){
    switch (process.argv[2]){
        case "--help":
        case "-h":
            console.log("\nUse '--qr' or '-q' to generate a QR code alongside the generated address");
            console.log("The QR code can be found as 'sol-qr-address.png' in the same folder\n");
            break;
        case "--version":
        case "-v":
            console.log(versionNumber);
            break;
        default:
            const { keypair, mnemonic } = generateKeypair();

            // Check if the keypair is generated properly
            const generatedPubKey = keypair.publicKey.toBase58();

            if (PublicKey.isOnCurve(generatedPubKey)){
                outputKeypair(generatedPubKey, mnemonic);
            } else {
                invalidKeypair();
            }
        }
    
}

main()
