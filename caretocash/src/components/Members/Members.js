import React from "react";
import Member from "../Member/Member";

const members = (props) =>
  props.members.map((m) => {
    return (
      <Member
        key={m.id}
        balance={m.balance}
        creditClicked={() => props.creditClicked(m.id, "Credit")}
        chargeClicked={() => props.chargeClicked(m.id, "Charge")}
        deleteClicked={() => props.deleteClicked(m.id)}
        name={m.name}
      ></Member>
    );
  });

export default members;
