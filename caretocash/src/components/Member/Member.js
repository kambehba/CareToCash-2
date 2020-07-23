import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper } from "@material-ui/core";

import "../Member/member.css";

const useStyles = makeStyles((theme) => ({
  grid: {
    width: "100%",
    margin: "0px",
  },

  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
  },
}));

const Member = (props) => {
  const classes = useStyles();
  return (
    <Grid container spacing={2} className={classes.grid}>
      <Grid item xs={6}>
        <Paper className={classes.paper}>
          <h1 className="name">{props.name}</h1> <h1> Current Balance:</h1>
          <h1 className="balance"> ${props.balance}</h1>
        </Paper>
      </Grid>

      <Grid item xs={6}>
        <button className="btn btn-success b1" onClick={props.creditClicked}>
          Credit
        </button>
        <button className="btn btn-danger b1" onClick={props.chargeClicked}>
          Charge
        </button>
        <button className="btn btn-warning b1" onClick={props.detailsClicked}>
          Details
        </button>
        <button className="btn btn-dark b1" onClick={props.deleteClicked}>
          Delete Members
        </button>
      </Grid>
    </Grid>
  );
};

export default Member;
