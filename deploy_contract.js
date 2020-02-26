const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3("http://localhost:8545");

const bytecode = fs.readFileSync('Voting_sol_Voting.bin').toString();
const abi = JSON.parse(fs.readFileSync('Voting_sol_Voting.abi').toString());
const deployedContract = new web3.eth.Contract(abi);

const listOfCandidates = ['Alice', 'Bob', 'Charlie'];

web3.eth.getAccounts((error, accounts) => {
        deployedContract.deploy({
            data: bytecode,
            arguments: [listOfCandidates.map(name => web3.utils.asciiToHex(name))]
        }).send({
            from: accounts[0],
            gas: 1500000,
            gasPrice: web3.utils.toWei('0.00003', 'ether')
        }).then((newContractInstance) => {
            const constractAddress = newContractInstance.options.address;
            deployedContract.options.address = constractAddress;
            replaceContractAddress(constractAddress);
            console.log(constractAddress);
        })
    }
);

function replaceContractAddress(address) {
    fs.readFile('index.js', 'utf8', function (err,data) {
        const result = data.replace(/\[\[ADDRESS]]/g, address);
        fs.writeFile('index.js', result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
}