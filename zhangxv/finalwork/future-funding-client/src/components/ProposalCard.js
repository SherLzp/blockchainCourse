import { Card, Typography, CardContent, Grid, CardActions, Button, makeStyles } from '@material-ui/core';
import React, {useState, useEffect} from 'react';
import {PROPOSAL_CONTRACT_ABI, PROJECT_CONTRACT_ABI} from '../utils/getWeb3';
import styles from '../styles/ProposalCardStyles';

const useStyles = makeStyles(styles);

const ProposalCard = (props) => {

  const classes = useStyles();

  const [address, setAddress] = useState();
  const [proposal, setProposal] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [amount, setAmount] = useState();
  const [isApproved, setIsApproved] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [to, setTo] = useState();
  const [projectTitle, setProjectTitle] = useState();

  useEffect(() => {
    async function fetchData() {
      //get the proposal address
      const tmpAddress = await props.contract.methods.proposals(props.id).call();
      setAddress(tmpAddress);
      //instantiate the proposal
      const tmpProposal = new props.web3.eth.Contract(PROPOSAL_CONTRACT_ABI, tmpAddress);
      setProposal(tmpProposal);
      //get the title, description, amount, to, isApproved, and isFinished.
      const tmpTitle = await tmpProposal.methods.title().call();
      const tmpDescription = await tmpProposal.methods.description().call();
      const tmpAmount = await tmpProposal.methods.amount().call();
      const tmpTo = await tmpProposal.methods.to().call();
      const tmpIsApproved = await tmpProposal.methods.isApproved().call();
      const tmpIsFinished = await tmpProposal.methods.isFinished().call();
      setTitle(tmpTitle);
      setDescription(tmpDescription);
      setAmount(tmpAmount);
      setIsApproved(tmpIsApproved);
      setIsFinished(tmpIsFinished);
      console.log(`to: ${tmpTo}`);
      //get the project name
      const tmpProjAddress = await props.contract.methods.projects(props.projectID).call();
      const tmpProject = new props.web3.eth.Contract(PROJECT_CONTRACT_ABI, tmpProjAddress);
      const tmpProjectTitle = await tmpProject.methods.title().call()
      setProjectTitle(tmpProjectTitle);
    }
    fetchData();
  }, []);

  const handleTransfer = async () => {
    const result = await props.transfer(props.id, amount, proposal);
    setIsFinished(result);
  }


  return (
    <React.Fragment>
      <Card className={classes.proposalCard} elevation={3}>
        <CardContent>
          <Grid container direction="row" justify="space-between" alignItems="center" style={{marginBottom: 10, marginLeft: -5}}>
            <Grid item>
              <Typography variant="h4" >{title}</Typography>
            </Grid>
            <Grid item >
              <Grid item >
                <Typography variant="subtitle2">
                  {projectTitle ? `Project: ${projectTitle}` : null}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="subtitle2">
                  {amount ? `Requires: ${props.web3.utils.fromWei(String(amount))} ether(s)` : null}
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
              {
                isApproved ? (
                  isFinished ? 
                  <Typography className={classes.finishedHint}>
                    Finished
                  </Typography> : 
                  <Button size="small" className={classes.cardTransferBtn} onClick={handleTransfer}>
                    Transfer now
                  </Button>
                ) :
                <Typography className={classes.votingHint}>
                  To be voted
                </Typography>
              }
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </React.Fragment>

  );
}


export default ProposalCard;