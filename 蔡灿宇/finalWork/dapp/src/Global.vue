<script>
import Web3 from "web3";
import Crowdfunding from "../build/contracts/CrowdFunding.json";

window.ethereum.enable();
const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(
  Crowdfunding.abi,
  "0xc41BaA8Cd98BB98A97b50c3f810E3D88d6664dc9"
);

async function getAccount() {
    return (await web3.eth.getAccounts())[0];
}

export default {
  web3,
  contract,
  getAccount,
};
</script>