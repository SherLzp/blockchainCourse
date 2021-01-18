import React, {useState, useEffect, useLayoutEffect} from 'react';
import getWeb3, {CONTRACT_ABI, CONTRACT_ADDRESS, PROJECT_CONTRACT_ABI} from '../utils/getWeb3';
import ProposalCard from "../components/ProposalCard";
import AddIcon from '@material-ui/icons/Add';
import { Fab, Grid, Toolbar, makeStyles, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, TextField, Button, MenuItem, Select, FormControl, InputLabel } from '@material-ui/core';

import styles from "../styles/HomePageStyles";
import AppHeader from "../components/AppHeader";
import AppDrawer from "../components/AppDrawer";

const useStyles = makeStyles(styles);

const ProposalPage = (props) => {

  const classes = useStyles();

  const [web3, setWeb3] = useState();
  const [account, setAccount] = useState();
  const [contract, setContract] = useState();
  const [proposals, setProposals] = useState();
  const [projects, setProjects] = useState(new Object());

  // Dialog States (Too lazy to create another component...)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogProjID, setDialogProjID] = useState(-1);
  const [dialogAmount, setDialogAmount] = useState();
  const [dialogTitle, setDialogTitle] = useState();
  const [dialogDes, setDialogDes] = useState();
  const [dialogDays, setDialogDays] = useState();
  const [dialogTo, setDialogTo] = useState();

  const [count, setCount] = useState(0)


  useEffect(() => {
    async function fetchData() {
      console.log("in fetch data()")
      const tempWeb3 = await getWeb3();  
      console.log("in fetch data() 2")
      setWeb3(tempWeb3);   

      const tempAccounts = await tempWeb3.eth.getAccounts();
      setAccount(tempAccounts[0]);      
      const tempContract = new tempWeb3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      setContract(tempContract);
      const tempProposals = await tempContract.getPastEvents('proposalRaised', {
        filter: {initiator: tempAccounts[0]},
        fromBlock: 0,
        toBlock: 'latest'
      });
      
      setProposals(tempProposals);
      const tempProjects = await tempContract.getPastEvents('projectCreated', {
        filter: {initiator: tempAccounts[0]},
        fromBlock: 0,
        toBlock: 'latest'
      });
      console.log(tempProjects);
      //Fetch all related projects ID and get their name
      for (let p of tempProjects) {
        const projectAddr = await tempContract.methods.projects(p.returnValues.projectID).call()
        const project = new tempWeb3.eth.Contract(PROJECT_CONTRACT_ABI, projectAddr);
        const title = await project.methods.title().call();
        let newProjects = projects;
        newProjects[title] = p.returnValues.projectID;
        setProjects(newProjects);
      }      
    }
    fetchData();
    console.log("In ProposalPage UseEffect()");
  });

  console.log(projects);

  console.log("In proposal Page")

  const transfer = (id, amount, proposal) => new Promise(
    function(resolve, reject) {
      contract.methods.transferForProposal(id).send({
        from: account,
        value: amount,
        gas: 6721975
      })
      .then(() => {
        proposal.methods.isFinished().call((err, res) => {
          resolve(res)
        })
      })
    }
  )
  
  const createProposal = (e) => {
    contract.methods.raiseProposal(dialogTo, dialogProjID, web3.utils.toWei(dialogAmount, "ether"), dialogTitle, dialogDes).send({ 
        from: account,
        gas: 6721975
    }).then(() => {
      contract.getPastEvents('proposalRaised', {
        filter: {initiator: account},
        fromBlock: 0,
        toBlock: 'latest'
      }, (err, res) => {
        setProposals(res);
      });
    })
    setDialogOpen(false);
  }

  const handleFABClick = () => {
    setDialogOpen(true);
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  const handleSelectChange = (e) => {
    setDialogProjID(e.target.value);
  }

  const handleAmountChange = (e) => {
    setDialogAmount(e.target.value);
  }

  const handleTitleChange = (e) => {
    setDialogTitle(e.target.value);
  }

  const handleDesChange = (e) => {
    setDialogDes(e.target.value);
  }

  const handleDaysChange = (e) => {
    setDialogDays(e.target.value);
  }

  const handleToChange = e => {
    setDialogTo(e.target.value)
  }



  return (
    <React.Fragment>

      <Grid container direction="column">
      {proposals ? proposals.map( (p, index) => (
        <Grid key={index} container item direction="row" justify="center" >
          <Grid item sm={8} md={6} lg={5}>
            <ProposalCard 
            id = {p.returnValues.proposalID}
            projectID = {p.returnValues.projectID}
            web3 = {web3}
            contract = {contract}
            account = {account}
            transfer = {transfer}
            />
          </Grid>
        </Grid>
      )) : null}
      </Grid> 

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Raise Your New Proposal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill the following fields.
          </DialogContentText>
          <FormControl style={{marginTop: 10}}>
            <InputLabel>Project</InputLabel>
            <Select value={dialogProjID} onChange={handleSelectChange} style={{minWidth: 120}} >
              {Object.keys(projects).map((title, index) => 
                <MenuItem value={projects[title]} key={index}>{title}</MenuItem>
              )}
            </Select>
          </FormControl>
          <TextField label="Amount (in ether)" onChange={handleAmountChange} fullWidth style={{marginTop: 10}} />
          <TextField label="Tranfer To" onChange={handleToChange} fullWidth style={{marginTop: 10}} />
          <TextField label="Name" onChange={handleTitleChange} fullWidth style={{marginTop: 10}}/>
          <TextField label="Description" onChange={handleDesChange} multiline fullWidth style={{marginTop: 10}}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={createProposal} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>


      <Fab color="primary" aria-label="add" className={classes.addBtn} onClick={handleFABClick}>
        <AddIcon />
      </Fab>

    </React.Fragment>
  );

}

export default ProposalPage;