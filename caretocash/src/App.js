import React, { Component } from "react";
import { withAuthenticator } from "aws-amplify-react";
import { API, graphqlOperation, auth0SignInButton, a } from "aws-amplify";
import { listMembers, listTransactions } from "./graphql/queries";
import Amplify, { Auth } from "aws-amplify";
import Members from "./components/Members/Members";
import Transaction from "./components/Transaction/transaction";
import Details from "./components/Details/details";

import member from "./components/Member/Member";
import members from "./components/Members/Members";
import {
  createMember,
  updateMember,
  deleteMember,
  createTransaction,
} from "./graphql/mutations";

class App extends Component {
  state = {
    member: { id: "", name: "", owner: "", balance: 0, transactionCounter: 0 },
    transaction: {
      id: "",
      name: "",
      owner: "",
      type: "",
      date: "",
      amount: "",
      endingBalance: "",
      info: "",
      order: 0,
    },
    members: [],
    transactions: [],
    newMember: "",
    authuser: "",
    showMainPage: true,
    showTransactionPage: false,
    showDetailsPage: false,
    transactionType: "",
    credit: 0,
    charge: 0,
    todayDate: "",
  };

  hideAllPages = () => {
    this.state.showMainPage = false;
    this.state.showTransactionPage = false;
    this.state.showDetailsPage = false;
    this.setState({
      showMainPage: this.state.showMainPage,
      showTransactionPage: this.state.showTransactionPage,
      showDetailsPage: this.state.showDetailsPage,
    });
  };

  setMember = (event) => {
    this.setState({ newMember: event.target.value });
  };

  async componentDidMount() {
    this.loadMembers();
  }

  async loadMembers() {
    //first get Authenticated User
    const currentUser = await Auth.currentUserInfo();
    this.state.authuser = currentUser.username;
    this.setState({ authuser: currentUser.username });

    //now load members by the Auth User
    const allMembers = await API.graphql(graphqlOperation(listMembers));
    const allMembersByCurrentOwner = allMembers.data.listMembers.items.filter(
      (x) => x.owner == this.state.authuser
    );
    this.setState({ members: allMembersByCurrentOwner });
  }

  addMemberHandler = async () => {
    this.state.member.owner = this.state.authuser;
    const newMember = {
      name: this.state.newMember,
      owner: this.state.member.owner,
      balance: this.state.member.balance,
      transactionCounter: 0,
    };

    const result = await API.graphql(
      graphqlOperation(createMember, { input: newMember })
    );
    this.state.newMember = "";

    this.setState({
      member: this.state.member,
      newMember: this.state.newMember,
    });
    this.loadMembers();
  };

  openTransactionsByMemberId = (id, transactionType) => {
    const transactionMember = this.state.members.find((i) => i.id === id);
    this.state.transactionType = transactionType;
    this.hideAllPages();
    this.setState({
      member: transactionMember,
      transactionType: this.state.transactionType,
      showTransactionPage: true,
    });
  };

  deleteClicked = async (id) => {
    const result = this.state.members.find((m) => m.id == id);
    const input = { id: result.id };
    const result2 = await API.graphql(
      graphqlOperation(deleteMember, { input: input })
    );
    const updatedMembers = this.state.members.filter(
      (m) => m.id !== result2.data.deleteMember.id
    );
    this.setState({ members: updatedMembers });
  };

  sendTransaction = (transactionType) => {
    this.hideAllPages();
    this.state.showMainPage = true;

    this.state.members.map((item) => {
      if (item.id == this.state.member.id) {
        if (transactionType == "Credit")
          item.balance = item.balance + this.state.credit;
        if (transactionType == "Charge")
          item.balance = item.balance + this.state.charge;
      }
    });

    this.sendUpdate();
    this.state.newMember = "";
    this.setState({
      showMainPage: this.state.showMainPage,
      showTransactionPage: this.state.showTransactionPage,
      newMember: this.state.newMember,
      credit: this.state.credit,
      charge: this.state.charge,
      members: this.state.members,
      member: this.state.member,
    });
  };

  openDetailsByMemberId = (id) => {
    const currentMember = this.state.members.find((m) => m.id == id);

    this.hideAllPages();
    this.state.showDetailsPage = true;

    this.setState({
      showDetailsPage: this.state.showDetailsPage,
      member: currentMember,
    });
    this.getTransactionsByMember();
  };

  updateMemberHandler = async (item) => {
    this.state.member.balance = item;
    this.setState({ member: this.state.member });
    const { id, balance } = this.state.member;

    const input = { id, balance };

    const result = await API.graphql(graphqlOperation(updateMember, { input }));
    const ff = result.data.updateMember;
  };

  sendUpdate = async () => {
    const { id, balance, owner } = this.state.member;

    const input = {
      id: id,
      owner: owner,
      balance: balance,
    };

    const result = await API.graphql(
      graphqlOperation(updateMember, { input: input })
    );

    const transaction = {
      name: this.state.member.name,
      owner: this.state.member.owner,
      endingBalance: this.state.member.balance,
      info: this.state.transaction.info,
      date: this.getTodaysDate(),
      order: this.state.member.transactionCounter++,
    };

    if (this.state.transactionType == "Credit")
      transaction.amount = this.state.credit;

    if (this.state.transactionType == "Charge")
      transaction.amount = this.state.charge;

    const result2 = await API.graphql(
      graphqlOperation(createTransaction, { input: transaction })
    );

    const input2 = {
      id: this.state.member.id,
      transactionCounter: this.state.member.transactionCounter,
      owner: this.state.member.owner,
    };

    const result3 = await API.graphql(
      graphqlOperation(updateMember, { input: input2 })
    );
  };

  getTransactionsByMember = async () => {
    const allTransactions = await API.graphql(
      graphqlOperation(listTransactions)
    );
    const transactionOfCurrentUser = allTransactions.data.listTransactions.items
      .filter(
        (x) =>
          x.name == this.state.member.name && x.owner == this.state.member.owner
      )
      .sort((a, b) => b.order - a.order);

    this.setState({ transactions: transactionOfCurrentUser });
  };

  getTodaysDate() {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let dateObj = new Date();
    let month = monthNames[dateObj.getMonth()];
    let day = String(dateObj.getDate()).padStart(2, "0");
    let year = dateObj.getFullYear();

    return month + "\n" + day + "," + year;
  }

  onInputChange = (event) => {
    if (this.state.transactionType == "Credit")
      this.state.credit = parseInt(event.target.value);
    if (this.state.transactionType == "Charge")
      this.state.charge = parseInt(event.target.value) * -1;
  };

  onInfoChange = (event) => {
    this.state.transaction.info = event.target.value;
  };

  backHomeClicked = () => {
    this.hideAllPages();
    this.showMainPage = true;
    this.setState({ showMainPage: this.showMainPage });
  };

  render() {
    let members = null;
    let transaction = null;
    let addMember = null;
    let details = null;

    if (this.state.showMainPage) {
      transaction = null;
      members = (
        <div className="flex flex-column items-left pa5">
          <Members
            members={this.state.members}
            creditClicked={this.openTransactionsByMemberId}
            chargeClicked={this.openTransactionsByMemberId}
            detailsClicked={this.openDetailsByMemberId}
            deleteClicked={this.deleteClicked}
          />
        </div>
      );

      addMember = (
        <div className="flex flex-column items-center pa5">
          <input
            type="text"
            className="pa2 f4"
            placeholder="Member Name"
            value={this.state.newMember}
            onChange={this.setMember}
          />
          <br></br>
          <button onClick={this.addMemberHandler} className="btn-primary">
            Add a Member
          </button>
        </div>
      );
    }

    if (this.state.showTransactionPage) {
      transaction = (
        <div className="flex flex-column items-left pa5">
          <Transaction
            name={this.state.member.name}
            transactionType={this.state.transactionType}
            sendClick={this.sendTransaction}
            onInputChange={this.onInputChange}
            onInfoChange={this.onInfoChange}
          />
        </div>
      );
    }

    if (this.state.showDetailsPage) {
      details = (
        <div className="flex flex-column items-left pa5">
          <Details
            transactions={this.state.transactions}
            backHomeClicked={this.backHomeClicked}
          ></Details>
        </div>
      );
    }

    return (
      <div>
        <div className="flex flex-column items-center justify-center pa3 bg-washed-yellow b--hot-pink">
          <h1 className="f1 dark-blue lh-solid">
            CARE to CA<span Style="color:green">$</span>H
          </h1>
        </div>
        {addMember}
        {members}
        {transaction}
        {details}
      </div>
    );
  }
}

export default withAuthenticator(App, { includeGreetings: true });
