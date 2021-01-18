import React, { useState, useEffect } from 'react';
import { makeStyles, Fab, Grid, Toolbar, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions, Button, TextField} from '@material-ui/core';
import getWeb3, {CONTRACT_ABI, CONTRACT_ADDRESS} from '../utils/getWeb3';
import AddIcon from '@material-ui/icons/Add';
import ProjectCard from '../components/ProjectCard';
import AppHeader from '../components/AppHeader';

import styles from  '../styles/HomePageStyles';
import AppDrawer from '../components/AppDrawer';


const useStyles = makeStyles(styles);


const HomePage = (props) => {

  const classes = useStyles();

  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [projects, setProjects] = useState(null);

  // Dialog States (Too lazy to create another component...)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAmount, setDialogAmount] = useState();
  const [dialogTitle, setDialogTitle] = useState();
  const [dialogDes, setDialogDes] = useState();
  const [dialogDays, setDialogDays] = useState();

  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const tempWeb3 = await getWeb3();     
      const tempAccount = await tempWeb3.eth.getAccounts();
      const tempContract = new tempWeb3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      const tempProjects = await tempContract.methods.getAllProjects().call(); 
      setWeb3(tempWeb3);
      setAccount(tempAccount[0]);
      setContract(tempContract);
      setProjects(tempProjects);
    }
    fetchData();
    console.log("In HomePage UseEffect()")
  }, []);
  
  // console.log("account "+account+" contract "+contract+" projects "+projects);

  const invest = (id, amount) => ( 
    new Promise(
      function (resolve, reject) {
        console.log(`id: ${id}, amount: ${amount}`);
        web3.eth.getAccounts()
        .then(accounts => accounts[0])
        .then(account => {
          contract.methods.investProject(id).send({
            from: account,
            gas: 6721975,
            value: web3.utils.toWei(amount, "ether")
          }).then( () => contract.methods.getBalanceOfProject(id).call((err, res) => resolve(res)) )
        })
      })
  )

  const createProject = () => {
    contract.methods.createProject(web3.utils.toWei(dialogAmount, "ether"), dialogTitle, dialogDes, dialogDays*24*60*60*1000).send({ 
      from: account,
      gas: 6721975
    }).then(() => {
      contract.methods.getAllProjects().call((err, res) => {
        setProjects(res);
      })
    })
    setDialogOpen(false);
  }

  const handleFABClick = () => {
    setDialogOpen(true);
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
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

  

  return (
    <React.Fragment>


      
      <Grid container direction="column" >
      {projects ? projects.map((p, i) => (
        <Grid container item direction="row" justify="center" key={i}>
          <Grid item sm={8} md={5} lg={5}>
            <ProjectCard 
            id={i} 
            address={p}
            web3={web3}
            invest={invest}
            />
          </Grid>
        </Grid>
      )) : null}   

      </Grid>

      <Fab color="primary" aria-label="add" className={classes.addBtn} onClick={handleFABClick}>
        <AddIcon />
      </Fab>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Create Your Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Let's broadcast your excellent ideas on the blockchain!
          </DialogContentText>
          <TextField label="Goal (in ether)" onChange={handleAmountChange} fullWidth style={{marginTop: 10}} />
          <TextField label="Name" onChange={handleTitleChange} fullWidth style={{marginTop: 10}}/>
          <TextField label="Description" onChange={handleDesChange} multiline fullWidth style={{marginTop: 10}}/>
          <TextField label="Days" onChange={handleDaysChange} fullWidth style={{marginTop: 10}} />
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={createProject}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

    </React.Fragment>
  )
}

export default HomePage;