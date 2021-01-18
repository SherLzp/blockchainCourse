import web3 from './web3'
import project from '../abi/project'

export default async function contribute(address, money) {
    const instance = project(address);
    const accounts = await web3.eth.getAccounts();
    await instance.methods.contribute().send({
        from: accounts[0],
        value: money,
    });
    window.location.reload();

}