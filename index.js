web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
let account;
web3.eth.getAccounts().then((f) => {
    console.log(f);
    account = f[1];
});

abi = JSON.parse('[{"constant":true,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"totalVotesFor","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"validCandidate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"votesReceived","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"candidateList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"voteForCandidate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"candidateNames","type":"bytes32[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]')

const contract = new web3.eth.Contract(abi);
contract.options.address = "[[ADDRESS]]";

candidates = {"Alice": "candidate-1", "Bob": "candidate-2", "Charlie": "candidate-3"};

function voteForCandidate() {
    const candidateName = $("#candidate").val();
    console.log(candidateName);
    contract.methods.voteForCandidate(web3.utils.asciiToHex(candidateName)).send({from: account}).then(() => {
        let div_id = candidates[candidateName];
        console.log(web3.utils.asciiToHex(candidateName));
        contract.methods.totalVotesFor(web3.utils.asciiToHex(candidateName)).call().then((f) => {
            console.log(f);
            $("#" + div_id).html(f);
        }).catch(
            (e) => console.log(e)
        )
    })
}

$(document).ready(function() {
    const candidateNames = Object.keys(candidates);

    for(let i = 0; i < candidateNames.length; i++) {
        let name = candidateNames[i];

        contract.methods.totalVotesFor(web3.utils.asciiToHex(name)).call().then((f) => {
            $("#" + candidates[name]).html(f);
        })
    }
});