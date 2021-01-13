import { Drawer, List, ListItem, makeStyles, Typography, Divider } from '@material-ui/core';
import React from 'react';
import {useHistory, Link} from 'react-router-dom';

import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import NotListedLocationOutlinedIcon from '@material-ui/icons/NotListedLocationOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import HowToVoteOutlinedIcon from '@material-ui/icons/HowToVoteOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';

import styles from '../styles/AppDrawerStyles';

const useStyles = makeStyles(styles);

const AppDrawer = (props) => {

  const classes = useStyles();
  const history = useHistory();

  const handleHomeJump = e => {
    history.push("/");
    window.location.reload();
  }

  const handleProposalsJump = e => {
    history.push("/proposals");
    window.location.reload();
  }

  const handleVotesJump = e => {
    history.push("/votes");
    window.location.reload();
  }

  return (
    <React.Fragment>
      <Drawer 
      onClose={props.onClose}
      open={props.open}
      BackdropProps={{invisible: true}}
      >
        <List>
          <ListItem>
            <Typography variant="h6" className={classes.appName}>
              Future Funding
            </Typography>
          </ListItem>
        </List>
        <Divider />
        <List className={classes.drawerList}>
          <ListItem button onClick={handleHomeJump}>
            <HomeOutlinedIcon color="action" className={classes.listIcons} />
            <Typography variant="subtitle2" className={classes.listText}> Home </Typography>
          </ListItem>
          <ListItem button onClick={handleProposalsJump}>
            <DescriptionOutlinedIcon color="action" className={classes.listIcons} />
            <Typography variant="subtitle2" className={classes.listText}> My Proposals </Typography>
          </ListItem>
          <ListItem button onClick={handleVotesJump}>
            <HowToVoteOutlinedIcon color="action" className={classes.listIcons} />
            <Typography variant="subtitle2" className={classes.listText}> Votes </Typography>
          </ListItem>
        </List>
        <Divider />
        <List className={classes.drawerList}>
          <ListItem button>
            <PersonOutlineOutlinedIcon color="action" className={classes.listIcons} />
            <Typography variant="subtitle2" className={classes.listText}> Account </Typography>
          </ListItem>
          <ListItem button>
            <SettingsOutlinedIcon color="action" className={classes.listIcons} />
            <Typography variant="subtitle2" className={classes.listText}> Settings </Typography>
          </ListItem>
          <ListItem button>
            <NotListedLocationOutlinedIcon color="action" className={classes.listIcons} />
            <Typography variant="subtitle2" className={classes.listText}> Help & Feedback </Typography>
          </ListItem>
          <ListItem button>
            <InfoOutlinedIcon color="action" className={classes.listIcons} />
            <Typography variant="subtitle2" className={classes.listText}> About </Typography>
          </ListItem>
        </List>
      </Drawer>
    </React.Fragment>
  )
}

export default AppDrawer;