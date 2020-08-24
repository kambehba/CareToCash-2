import React from "react";
import Paper from "@material-ui/core/Paper";
import "../Member/member.css";

const Member = (props) => {
  return (
    <Paper elevation={3} className="memberContainer">
      <div className="memberInfoContainer">
        <div className="name">{props.name}</div>
        <div className="balancetext"> Balance:</div>
        <div className="balance">
          <span className={props.balanceSign}>${props.balance}</span>
        </div>
      </div>
      <div className="memberInfoContainer">
        {" "}
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
      </div>
    </Paper>
  );
};

export default Member;
