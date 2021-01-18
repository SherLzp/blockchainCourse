import platform from '../abi/platform'
import web3 from './web3'

export default async function createProject(props) {
    const title = props.title;
    const description = props.description;
    const duration = props.duration;
    const amount = props.amount;
    const accounts = await web3.eth.getAccounts();
    const gas = await platform.methods.startProject(title, description, duration, amount).estimateGas();
    await platform.methods.startProject(title, description, duration, amount).send({
        from: accounts[0],
        gas
    });
    window.location.reload();

}