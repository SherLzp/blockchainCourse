<script>
import Web3 from "web3";
import Crowdfunding from "../build/contracts/Crowdfunding.json";

window.ethereum.enable();
const web3 = new Web3(window.ethereum);
//const web3 = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
const contract = new web3.eth.Contract(
  Crowdfunding.abi,
  "0x1d73CD48f88271166E7719b9458540471F7675F0"
);

export default {
  web3,
  contract,
  inCallback: false, // 异步回调函数锁

  methods: {
    addAccountChangeListener(callback) {
      console.log('add listner');
      window.ethereum.on('accountsChanged', callback)
    }
  }
};
</script>