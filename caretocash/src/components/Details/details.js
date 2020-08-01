import React from "react";
//import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import "../Details/details.css";
// const useStyles = makeStyles({
//   table: {
//     minWidth: 350,
//     width: 100,
//     background: red,
//   },
// });

const Details = (props) => {
  //const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <button className="btn btn-danger" onClick={props.backHomeClicked}>
        Back
      </button>

      <Table className="table" aria-label="simple table">
        <TableHead className="tableHead">
          <TableRow>
            <TableCell>
              <div className="tableHeadText">Date</div>
            </TableCell>
            <TableCell align="right">
              {" "}
              <div className="tableHeadText">Amount</div>
            </TableCell>
            <TableCell align="right">
              {" "}
              <div className="tableHeadText">Balance</div>
            </TableCell>
            <TableCell align="right">
              {" "}
              <div className="tableHeadText">Description</div>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.transactions.map((x) => (
            <TableRow key={x.id}>
              <TableCell component="th" scope="row">
                {x.date}
              </TableCell>
              <TableCell align="right">{x.amount}</TableCell>
              <TableCell align="right">{x.endingBalance}</TableCell>
              <TableCell align="right">{x.info}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Details;
