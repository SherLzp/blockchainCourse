import blue from '@material-ui/core/colors/blue';

const styles = theme=> ({
  projectCard: {
    padding: theme.spacing(2, 2, 1, 2),
    margin: theme.spacing(1, 0, 1, 0),
  },
  cardInvestBtn: {
    color: blue[800],
    marginRight: 30,
    fontWeight: 900,
  },
  cardLearnMoreBtn: {
    marginLeft: 6,
    fontWeight: 500,
  }
})

export default styles;