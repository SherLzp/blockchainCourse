import { Card, Typography, makeStyles, CardContent, Grid, CardActions, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, DialogContentText } from '@material-ui/core';
import React, {useState, useEffect} from 'react';
import {PROJECT_CONTRACT_ABI} from '../utils/getWeb3';
import styles from '../styles/ProjectCardStyles';


const useStyles = makeStyles(styles);

const ProjectCard = (props) => {

  const classes = useStyles();

  const [project, setProject] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [goal, setGoal] = useState();
  const [balance, setBalance] = useState();
  const [dialopOpen, setDialogOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  

  useEffect(() => {
    async function fetchData() {
      const tempProject = new props.web3.eth.Contract(PROJECT_CONTRACT_ABI, props.address);
      setProject(tempProject);
      const tempTitle = await tempProject.methods.title().call();
      setTitle(tempTitle);
      const tempDes = await tempProject.methods.description().call();
      setDescription(tempDes);
      const tempGoal = await tempProject.methods.targetAmount().call();
      setGoal(tempGoal);
      const tempBalance = await tempProject.methods.balance().call();
      setBalance(tempBalance);
    }
    fetchData();
  }, [])

  const handleInvestBtnClick = (e) => {
    setDialogOpen(true);
  }

  const handleDialogClose = (e) => {
    setDialogOpen(false);
  }

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  }

  const invest = async (e) => {
    setDialogOpen(false);
    const tmpBalance = await props.invest(props.id, amount)
    console.log(tmpBalance);
    setBalance(tmpBalance);
  }

  return (
    <React.Fragment>
      <Card className={classes.projectCard} elevation={3} >
        <CardContent>
          <Grid container direction="row" justify="space-between" alignItems="center" style={{marginBottom: 10, marginLeft: -5}}>
            <Grid item>
              <Typography variant="h4" >{title}</Typography>
            </Grid>
            <Grid item >
              <Grid item >
                <Typography variant="subtitle2">
                  {goal ? `Goal: ${props.web3.utils.fromWei(String(goal))} ether(s)` : null}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="subtitle2">
                  {balance ? `Balance: ${props.web3.utils.fromWei(String(balance))} ether(s)` : null}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Typography variant="body2" color="textSecondary" >
            {description}
          </Typography>         
        </CardContent>
        <CardActions >
          <Grid container direction="row" justify="space-between" alignItems="center">
            <Grid item>
              <Button size="small" className={classes.cardLearnMoreBtn}>
                Learn more
              </Button>
            </Grid>
            <Grid item>
              <Button size="small" className={classes.cardInvestBtn} onClick={handleInvestBtnClick}>
                Invest now
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
      <Dialog open={dialopOpen} onClose={handleDialogClose}>
        <DialogTitle>Invest {title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To invest this project, please enter the ether amount here. 
          </DialogContentText>
          <TextField 
          id="amount"
          onChange={handleAmountChange}
          autoFocus
          margin="normal"
          fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={invest} color="primary">
            Invest
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}


export default ProjectCard;