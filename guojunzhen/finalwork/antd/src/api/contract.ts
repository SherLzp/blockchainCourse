import Web3 from 'web3'
import CrowdFunding from './CrowdFunding.json'

//@ts-ignore
const web3 = new Web3(window.ethereum);
//@ts-ignore
const contract = new web3.eth.Contract(CrowdFunding.abi, '0xda648db68Db1F0bdCeC53d89B4AE318D8aef2F25');
//@ts-ignore
window.ethereum.enable();

// 每一个众筹项目的定义
export declare interface Project {
  project_id: string,
  initiator: string,
  title: string,
  description: string,
  target: string,
  current_amount: string,
  total_amount: string,
  start: number,
  end: number,
  request_count: number,
  investment_count: number,
  i?: number,
}

export declare interface Request {
  request_id: number,
  description: string,
  amount: number,
  support_count: number,
  rate: number,
  state: boolean
}

async function myAccount() :Promise<string> {
  return (await web3.eth.getAccounts())[0];
}

async function create_project(title:string, description: string, target: string, time: number):Promise<void> {
  target = Web3.utils.toWei(target, 'ether');
  await contract.methods.create_project(title, description, target, time).send({
    from: await myAccount(),
    gas: 1000000
  })
}

async function get_all_project() : Promise<Project[]> {
  const size = await contract.methods.project_count().call();
  const projects = []
  for(let i=0; i<size; i++)
    projects.push(await get_project(i.toString()));
  return projects;
}

async function get_project(id: string) : Promise<Project> {
  const res:Project = await contract.methods.projects(id).call();
  return {
    ...res,
    current_amount: Web3.utils.fromWei(res.current_amount, 'ether'),
    target: Web3.utils.fromWei(res.target, 'ether'),
    total_amount: Web3.utils.fromWei(res.total_amount, 'ether'),
  }
}

async function create_investment(id: string, value: number) {
  await contract.methods.create_investment(id).send({
    from: await myAccount(),
    value: Web3.utils.toWei(value.toString(10), 'ether')
  })
}

async function get_request(id: string) :Promise<Request[]> {
  const size = await get_project(id);
  const requests:Request[] = []
  for(let i=0; i<size.request_count; i++) {
    const res = await contract.methods.get_request(id, i).call();
    const rate = await contract.methods.support_rate(id, i).call();
    const state = await contract.methods.check_support_amount(id, i).call();
    requests.push({
      request_id: i,
      description: res[0],
      amount: parseInt(Web3.utils.fromWei(res[1], 'ether')),
      support_count: res[2],
      rate,
      state
    });
  }
  return requests;
}

async function allow(id: string, request_id: string) {
  await contract.methods.allow(id, request_id).send({
    from: await myAccount(),
    gas: 1000000
  })
}

async function create_request(id: string, description: string, amount: string) {
  amount = Web3.utils.toWei(amount, 'ether')
  await contract.methods.create_request(id, description, amount).send({
    from: await myAccount(),
    gas: 1000000
  })
}

async function collect(id:string, request_id:string) {
  await contract.methods.collect(id, request_id).send({
    from: await myAccount(),
    gas: 1000000
  })
}

async function withdraw(id:string) {
  await contract.methods.withdraw(id).send({
    from: await myAccount(),
    gas: 1000000
  })
}

async function get_my_amount(id:string) {
  const project = await get_project(id);
  const account = await myAccount();
  const size = project.investment_count;
  let res = 0;
  for(let i=0; i<size; i++) {
    const people = await contract.methods.get_investment(id, i).call();
    if(people[0] === account)
      res += parseInt(Web3.utils.fromWei(people[1], 'ether'));
  }
  return res;
}

async function get_my():Promise<Project[]> {
  const project = await get_all_project();
  for(let i=0; i<project.length; i++) {
    project[i] = {
      ...project[i],
      i: await get_my_amount(project[i].project_id)
    }
  }
  return project;
}

export {
  create_project,
  get_all_project,
  get_project,
  create_investment,
  myAccount,
  get_request,
  create_request,
  allow,
  collect,
  withdraw,
  get_my_amount,
  get_my
}