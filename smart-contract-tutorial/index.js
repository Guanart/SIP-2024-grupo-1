const w3 = require('web3');
const config = require('./config.js');

// Set up a connection to the Ganache network
const web3 = new w3.Web3(new w3.Web3.providers.HttpProvider(config.PROVIDER_HTTP));

// Log the current block number to the console
web3.eth
	.getBlockNumber()
	.then((result) => {
		console.log('Current block number: ' + result);
	})
	.catch((error) => {
		console.error(error);
	});

