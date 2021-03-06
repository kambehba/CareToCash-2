import React from "react";
import "../Transaction/transaction.css";

function Transaction(props) {
  return (
    <div className="flex-container">
      <div className="f1">
        <div>
          <h2 className="transactioType"> {props.transactionType} for :</h2>
        </div>
        <div>
          <h2 className="memberName"> {props.name}</h2>
        </div>
      </div>

      <div className="f1">
        <div>
          <p className="dollarSign">$</p>
        </div>
        <div>
          <input
            className="inputBox"
            type="number"
            placeholder="Enter Amount"
            value={props.intialInput}
            onChange={(event) => props.onInputChange(event)}
          />
        </div>
      </div>

      <div className="f1">
        <div>
          <textarea
            rows="3"
            className="info"
            type="text"
            placeholder="Reason for this Transaction ?"
            value={props.info}
            onChange={(event) => props.onInfoChange(event)}
          />
        </div>
      </div>

      <div className="f1">
        <div>
          <button
            className="s2 btn btn-success"
            onClick={() => props.sendClick(props.transactionType)}
          >
            Send
          </button>
        </div>

        <div>
          <button
            className="s2 btn btn-danger"
            onClick={() => props.cancelClick()}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Transaction;
