const express = require('express');
const w3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
const { abi, bytecode } = require('./compiledContract.json'); // Debes compilar tu contrato ERC-20 y guardar el ABI y el bytecode en un archivo JSON


// Leer la clave privada del archivo generado anteriormente
// const userData = fs.readFileSync('newUser.json', 'utf8');
// const { privateKey } = JSON.parse(userData);
const { privateKey } = require('./newUser.json');


// const web3 = new w3.Web3();

// Crear una instancia de Web3 con una conexión a la red Ethereum

// Crear una instancia de Wallet con la clave privada
// const account = w3.eth.accounts.privateKeyToAccount(privateKey);

// Obtener la frase mnemotécnica
// const mnemonic = account.mnemonic.phrase; // Debes reemplazar esto con tu mnemónico de Metamask o similar
// console.log("Frase mnemotécnica:", mnemonic);
const infuraUrl = 'https://goerli.infura.io/v3/46e83cdf507c452e9eb33058343fdfe5'; // Reemplaza YOUR_INFURA_PROJECT_ID con tu ID de proyecto Infura

const provider = new HDWalletProvider   ({
    // mnemonic: {
    //     phrase: mnemonic
    // },
    privateKeys: [privateKey],
    providerOrUrl: infuraUrl
});

const web3 = new w3.Web3(provider);

// const app = express();
// app.use(express.json());

// app.post('/create-token', async (req, res) => {
    // try {
    //     const accounts = await web3.eth.getAccounts();
    //     const account = accounts[0];
    //     console.log(account)
    //     const contract = new web3.eth.Contract(abi);

    //     const tx = {
    //         from: account,
    //         data: bytecode,
    //         gas: 6000000
    //     };

    //     const newContract = await contract.deploy(tx).send();
    //     res.json({ contractAddress: newContract.options.address });
    // } catch (err) {
    //     console.error(err);
    //     res.status(500).json({ error: 'Internal server error' });
    // }
// });

// app.listen(3000, () => {
//     console.log('Server running on port 3000');
// });

async function init() {
    try {
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        const contract = new web3.eth.Contract(abi);

        const tx = {
            // from: accounts[0],
            from: "0xE592012ee100A126BE4675d350F1B7A8EEebd9A8",
            data: bytecode,
            gas: 6000000
        };

        const newContract = await contract.deploy(tx).send();
        console.log({ contractAddress: newContract.options.address });
        // res.json({ contractAddress: newContract.options.address });
    } catch (err) {
        console.error(err);
        // res.status(500).json({ error: 'Internal server error' });
    }
}

init()