import React from "react";
import "../Transaction/transaction.css";

import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper } from "@material-ui/core";

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

function Transaction(props) {
  const classes = useStyles();
  return (
    <Grid container className={classes.grid}>
      <Grid item xs={1}></Grid>
      <Grid item xs={1}>
        <h1 className="transactioType"> {props.transactionType}</h1>
      </Grid>
      <Grid item xs={1}>
        <h1 className="memberName"> {props.name}</h1>
      </Grid>
      <Grid item xs={9}></Grid>

      <Grid item xs={1}>
        <div className="dollarSign">$</div>
      </Grid>

      <Grid item xs={1}>
        <input
          className="inputBox"
          type="number"
          placeholder="Enter Amount"
          value={props.intialInput}
          onChange={(event) => props.onInputChange(event)}
        />
      </Grid>
      <Grid item xs={10}></Grid>

      <Grid item xs={10}>
        <input
          className="info"
          type="text"
          placeholder="Reason for this Transaction ?"
          value={props.info}
          onChange={(event) => props.onInfoChange(event)}
        />
      </Grid>

      <Grid item xs={10}>
        <button
          className="btn btn-success sendButton"
          onClick={() => props.sendClick(props.transactionType)}
        >
          Send
        </button>
      </Grid>
    </Grid>
  );
}

export default Transaction;
