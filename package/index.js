#!/usr/bin/env node --no-deprecation

const { Keypair, PublicKey} = require("@solana/web3.js");
const { HDKey } = require("micro-ed25519-hdkey");
const bip39 = require("bip39");
const qr = require('qrcode');
const fs = require('fs');
const path = require("path")
const { exec } = require("child_process");

// Variables
const versionNumber = "0.2.0";

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

function generateQrCode(generatedPubKey){
    qr.toFile("./sol-qr-address.png", generatedPubKey, {
        color: {
            dark: "#000",
            light: "#fff"
        }
     }, (err) => {
         if (err) throw err;
     });
}

function getCurrentDateTime(){
    const currentDateTime = new Date();

    const year = currentDateTime.getFullYear();
    const month = String(currentDateTime.getMonth()).padStart(2, "0");
    const day = String(currentDateTime.getDate()).padStart(2, "0");

    const hours = String(currentDateTime.getHours()).padStart(2, "0");
    const minutes = String(currentDateTime.getMinutes()).padStart(2, "0");
    const seconds = String(currentDateTime.getSeconds()).padStart(2, "0");

    const readableDateTime = `${year}-${month}-${day}T${hours}-${minutes}-${seconds}`;
    return readableDateTime;
}

function checkoutFolder(folderPath){
    // Check if folder exists
    // If the folder is not created, the folder will be created
    try{
        fs.accessSync(folderPath, fs.constants.F_OK);
    } catch (err) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
}

function outputKeypair(generatedPubKey, mnemonic){
    // Output address as QR if needed
    switch (process.argv[2]){
        case "--generate":
        case "-g":
           console.log("\nAddress:", generatedPubKey);
           console.log("\nSeed Phrase:", mnemonic);
           generateQrCode(generatedPubKey);
    }

    // Output encrypted keypair and QR code
    // For this to work, GPG must be installed
    switch (process.argv[2]){
        case "--encrypt":
        case "-e":
            const folderPath = "./sol/";
            const currentDateTime = getCurrentDateTime();
            checkoutFolder(folderPath);

            const filenameOut = folderPath + "sol-" + currentDateTime + ".asc";
            const plaindata = "Address: " + generatedPubKey + "\n" + "Seed Phrase: " + mnemonic;
            const encryptData = exec("gpg -c -a -o " + filenameOut, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                    return;
                }
                generateQrCode(generatedPubKey);
            });
             encryptData.stdin.write(plaindata);
             encryptData.stdin.end();

    }
}

function readHelpMe(){
    const solwalletWhere = path.dirname(require.resolve("solwallet"));
    const helpmePath = path.join(solwalletWhere, "helpme.txt");

    fs.readFile(helpmePath, "utf8", (error, helpmeData) => {
        if (error) {
            console.error(`Error: ${error}`);
            return;
        }
        console.log(helpmeData);
    });
}

function main(){
    switch (process.argv[2]){
        case "--help":
        case "-h":
            readHelpMe();
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
                console.log("The generated keypair is invalid. Please try again");
            }
        }
    
}

main();