const ABI = 
   [ { inputs: [],
       payable: false,
       stateMutability: 'nonpayable',
       type: 'constructor',
       constant: undefined },
     { constant: true,
       inputs: [],
       name: 'owner',
       outputs: [Array],
       payable: false,
       stateMutability: 'view',
       type: 'function',
       signature: '0x8da5cb5b' },
     { constant: true,
       inputs: [Array],
       name: 'projects',
       outputs: [Array],
       payable: false,
       stateMutability: 'view',
       type: 'function',
       signature: '0x107046bd' } ]
const address = '0xD7F5538c09D3fBa445b674C62AB1E113ec4a8d6C'

export {address, ABI}