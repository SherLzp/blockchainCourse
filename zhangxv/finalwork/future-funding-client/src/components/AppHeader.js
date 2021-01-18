import { AppBar, IconButton, makeStyles, Toolbar, Typography } from "@material-ui/core";
import React from "react";
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';

import styles from '../styles/AppHeaderStyles';

const useStyles = makeStyles(styles);

const AppHeader = (props) => {

  const classes = useStyles();

  return (
    <React.Fragment>
      <AppBar position="sticky" className={classes.appBar} >
        <Toolbar >
          <IconButton onClick={props.handleDrawerOpen} edge="start" className={classes.menuIcon}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.headerText}>
            {props.text}
          </Typography>
          <IconButton className={classes.accountIcon}>
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  )
}

export default AppHeader;