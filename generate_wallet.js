const Web3 = require('web3');
const fs = require('fs');

// Conectarse a una red Ethereum (por ejemplo, Ropsten)
const web3 = new Web3.Web3('https://goerli.infura.io/v3/46e83cdf507c452e9eb33058343fdfe5');

// Función para generar una nueva dirección Ethereum y clave privada
function generateNewAddress() {
    const account = web3.eth.accounts.create();
    return {
        address: account.address,
        privateKey: account.privateKey,
        mnemonic: account.mnemonic
    };
}

// Ejemplo de uso
const newUser = generateNewAddress();
console.log("Nueva dirección Ethereum:", newUser.address);
console.log("Clave privada:", newUser.privateKey);

// Guardar la dirección y la clave privada en un archivo (¡No recomendado en producción!)
fs.writeFileSync('newUser.json', JSON.stringify(newUser, null, 2));
console.log("Dirección Ethereum y clave privada guardadas en newUser.json");
