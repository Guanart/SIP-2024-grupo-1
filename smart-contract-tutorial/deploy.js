const w3 = require('web3');
const fs = require('fs');
const path = require('path');
const config = require('./config.js');

const web3 = new w3.Web3(new w3.Web3.providers.HttpProvider(config.PROVIDER_HTTP));

const bytecodePath = path.join(__dirname, 'MyContractBytecode.bin');
const bytecode = fs.readFileSync(bytecodePath, 'utf8');

const abi = require('./MyContractAbi.json');
const myContract = new web3.eth.Contract(abi);
myContract.handleRevert = true;

async function deploy() {
    const providersAccounts = await web3.eth.getAccounts();
    const defaultAccount = providersAccounts[0];
    console.log('deployer account:', defaultAccount);

    const contractDeployer = myContract.deploy({
        data: '0x' + bytecode,
        arguments: [1],
    });

    const gas = await contractDeployer.estimateGas({
        from: defaultAccount,
    });
    console.log('estimated gas:', gas);

    try {
        const tx = await contractDeployer.send({
            from: defaultAccount,
            gas,
            gasPrice: 10000000000,
        });
        console.log('Contract deployed at address: ' + tx.options.address);

        const deployedAddressPath = path.join(__dirname, 'MyContractAddress.bin');
        fs.writeFileSync(deployedAddressPath, tx.options.address);
    } catch (error) {
        console.error(error);
    }
}

deploy();
