const fs = require('fs');
const solc = require('solc');
const path = require('path');


const absolutePath = 'contracts/UserToken.sol';
const source = fs.readFileSync(absolutePath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'UserToken.sol': {
            content: source
    }
  },
settings: {
    outputSelection: {
        '*': {
            '*': ['*']
        }
    }
}
};

function findImports(relativePath) {
    //my imported sources are stored under the node_modules folder!
    const absolutePath = path.resolve(__dirname, 'node_modules', relativePath);
    // const absolutePath = 'contracts/UserToken.sol';
    const source = fs.readFileSync(absolutePath, 'utf8');
    return { contents: source };
}

// New syntax (supported from 0.5.12, mandatory from 0.6.0)
var output = JSON.parse(
    solc.compile(JSON.stringify(input), { import: findImports })
);


// const contractPath = 'contracts/UserToken.sol'; // Ruta al archivo del contrato ERC-20
const contractName = 'UserToken'; // Nombre del contrato ERC-20

// const contractCode = fs.readFileSync(contractPath, 'utf8');

// const input = {
//     language: 'Solidity',
//     sources: {
//         [contractName + '.sol']: {
//             content: contractCode
//         }
//     },
//     settings: {
//         outputSelection: {
//             '*': {
//                 '*': ['*']
//             }
//         }
//     }
// };

// const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (false) {
    console.error('Error al compilar el contrato:', output.errors);
} else {
    const contract = output.contracts[contractName + '.sol'][contractName];
    const compiledContract = {
        abi: contract.abi,
        bytecode: contract.evm.bytecode.object
    };
    fs.writeFileSync('compiledContract.json', JSON.stringify(compiledContract, null, 2));
    console.log('Contrato compilado y guardado en compiledContract.json');
}
