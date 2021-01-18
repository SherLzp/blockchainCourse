import React, {useState, useEffect} from "react";
import { Card, Typography, CardContent, Grid, CardActions, Button, makeStyles } from '@material-ui/core';
import styles from '../styles/VoteCardStyles';
import {PROPOSAL_CONTRACT_ABI, PROJECT_CONTRACT_ABI} from '../utils/getWeb3';

const useStyles = makeStyles(styles);

const VoteCard = (props) => {

  const classes = useStyles(styles);

  const [address, setAddress] = useState();
  const [proposal, setProposal] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [amount, setAmount] = useState();
  const [isApproved, setIsApproved] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [to, setTo] = useState();
  const [projectTitle, setProjectTitle] = useState();
  const [isVoted, setIsVoted] = useState(false);

  useEffect(() => {
    async function fetchData() {
      //get the proposal address
      const tmpAddress = await props.contract.methods.proposals(props.proposalID).call();
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
      const tmpIsVoted = await tmpProposal.methods.getIsVoted().call({from: props.account});
      setTitle(tmpTitle);
      setDescription(tmpDescription);
      setAmount(tmpAmount);
      setIsApproved(tmpIsApproved);
      setIsFinished(tmpIsFinished);
      setIsVoted(tmpIsVoted);
      console.log(`isVoted: ${isVoted}`);
      //get the project name
      const tmpProjID = await tmpProposal.methods.projectID().call();
      const tmpProjAddress = await props.contract.methods.projects(tmpProjID).call();
      const tmpProject = new props.web3.eth.Contract(PROJECT_CONTRACT_ABI, tmpProjAddress);
      const tmpProjectTitle = await tmpProject.methods.title().call()
      setProjectTitle(tmpProjectTitle);
    }
    fetchData();
  }, []);

  const handleVote = async (e) => {
    const newIsVoted = await props.vote(props.proposalID, proposal);
    setIsVoted(newIsVoted);
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
                  {amount ? `Required: ${props.web3.utils.fromWei(String(amount))} ether(s)` : null}
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
                isVoted ? 
                <Typography className={classes.votedHint}>
                  Voted
                </Typography>
                :
                <Button size="small" className={classes.cardTransferBtn} onClick={handleVote}>
                   Approve
                </Button>
              }
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </React.Fragment>
  )
}

export default VoteCard;