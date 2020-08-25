import React from "react";
import Paper from "@material-ui/core/Paper";
import "../Detail/Detail.css";

const Detail = (props) => {
  return (
    <Paper elevation={3} className="detailContainer">
      <h3>{props.date}</h3>
      <hr></hr>
      <p>{props.info}</p>
      <p className={props.transactionSign}>${props.amount}</p>
      <p>
        Ending Balance:<span className="endingBalance">${props.balance}</span>
      </p>
    </Paper>
  );
};

export default Detail;
