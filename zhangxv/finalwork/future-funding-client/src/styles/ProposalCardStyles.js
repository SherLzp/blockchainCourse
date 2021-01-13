import blue from '@material-ui/core/colors/blue';
import yellow from '@material-ui/core/colors/yellow';
import green from '@material-ui/core/colors/green';

const styles = theme=> ({
  proposalCard: {
    padding: theme.spacing(2, 2, 1, 2),
    margin: theme.spacing(1, 0, 1, 0),
  },
  cardTransferBtn: {
    color: blue[800],
    marginRight: 30,
    fontWeight: 900,
  },
  cardLearnMoreBtn: {
    marginLeft: 6,
    fontWeight: 500,
  },
  votingHint: {
    marginRight: 30,  
    fontWeight: 700,
    color: yellow[800],
  },
  finishedHint: {
    marginRight: 30,  
    fontWeight: 700,
    color: green[700],
  }
})

export default styles;