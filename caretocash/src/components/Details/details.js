import React from "react";
import "../Details/details.css";
import Detail from "../Detail/Detail";

const details = (props) =>
  props.transactions.map((m) => {
    let transactionSign = "";
    if (m.amount < 0) transactionSign = "balanceSignNegative";
    if (m.amount >= 0) transactionSign = "balanceSignPositive";

    return (
      <Detail
        key={m.id}
        date={m.date}
        balance={m.endingBalance}
        amount={m.amount}
        info={m.info}
        transactionSign={transactionSign}
      ></Detail>
    );
  });

export default details;
