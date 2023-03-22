const nodeAbi = require('node-abi');

console.log(nodeAbi.getAbi('10.15.3', 'node'));
console.log(nodeAbi.getAbi('8.0.3', 'electron'));
console.log(nodeAbi.getAbi('6.1.9', 'electron'));
