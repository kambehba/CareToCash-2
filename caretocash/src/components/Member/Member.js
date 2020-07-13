import React from "react";
import classes from "../Member/member.css";

function Member(props) {
  return (
    <div className="test2" key={props.id}>
      {props.name} , Balance: {props.balance}{" "}
      <span>
        <button className="btn btn-success test" onClick={props.creditClicked}>
          Credit
        </button>
      </span>
      <span>
        <button className="btn btn-danger test" onClick={props.chargeClicked}>
          Charge
        </button>
      </span>
      <span>
        <button className="btn btn-warning test" onClick={props.detailsClicked}>
          Details
        </button>
      </span>
    </div>
  );
}

export default Member;
