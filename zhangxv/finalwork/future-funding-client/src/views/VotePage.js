import React, {useEffect, useState} from "react";
import {Grid, Toolbar, Typography} from "@material-ui/core";
import getWeb3, {CONTRACT_ABI, CONTRACT_ADDRESS} from "../utils/getWeb3";
import VoteCard from "../components/VoteCard";

import AppHeader from "../components/AppHeader";
import AppDrawer from "../components/AppDrawer";


const VotePage = (props) => {

  const [web3, setWeb3] = useState();
  const [account, setAccount] = useState();
  const [contract, setContract] = useState();
  const [proposals, setProposals] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  useEffect(() => {
    async function fetchData() {
      const tmpWeb3 = await getWeb3();  
      const tmpAccounts = await tmpWeb3.eth.getAccounts();
      const tmpAccount = tmpAccounts[0];
      const tmpContract = new tmpWeb3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      const tmpInvestments = await tmpContract.getPastEvents("projectInvested", {
        filter: {investor: tmpAccount},
        fromBlock: 0,
        toBlock: 'latest'
      })
      // Find all invested projects
      let investSet = new Set();
      tmpInvestments.forEach( invest => {
        investSet.add(invest.returnValues.projectID)
      })
      // Find all proposals of projects that have been invested by current account
      let tmpProposals = new Set();
      for (let projID of investSet) {
        let proposals = await tmpContract.getPastEvents("proposalRaised", {
          filter: {projectID: projID},
          fromBlock: 0,
          toBlock: 'latest'
        });
        proposals.forEach( p => tmpProposals.add(p.returnValues.proposalID) );
      }
      setWeb3(tmpWeb3);
      setAccount(tmpAccount);
      setContract(tmpContract);
      setProposals(Array.from(tmpProposals));
      console.log("In VotePage UseEffect");
    }
    fetchData();
  }, [])

  const vote = (proposalID, proposal) => new Promise (
    function(resolve, reject) {
      contract.methods.voteForProposal(proposalID).send({
        from: account,
        gas: 6721975
      })
      .then((res) => {
        proposal.methods.getIsVoted().call({from: account}, (err, res) => {
          resolve(res);
        })
      })
    }
  )

  const handleDrawerOpen = e => {
    setDrawerOpen(true);
  }

  const handleDrawerClose = e => {
    setDrawerOpen(false);
  }

  return (
    <React.Fragment>
      <Grid container direction="column">
        {proposals.map((id, index) => (
          <Grid container item direction="row" justify="center" key={index}>
            <Grid item sm={8} md={5} lg={5}>
              <VoteCard
              proposalID = {id}
              web3 = {web3}
              contract = {contract}
              account = {account}
              vote={vote}
              />
            </Grid>
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
}

export default VotePage;