import project from '../abi/project'
import web3 from './web3'

export default async function createProposal(projectAddress, description, money) {
    const instance = project(projectAddress);
    let p = await instance.methods.getDetails().call();
    if (p.current<money) {
        alert('Plz request money less than the current money!');
    } else {
        const accounts = await web3.eth.getAccounts();
        //const gas = await instance.methods.createProposal(description, money).estimateGas();
        //console.log('test');
        console.log('test');
        await instance.methods.createProposal(description, money).send({
            from: accounts[0],
        });
    }
    window.location.reload();
}


