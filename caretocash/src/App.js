import React, { Component } from "react";

import { withAuthenticator } from "aws-amplify-react";

import { API, graphqlOperation, auth0SignInButton, a } from "aws-amplify";

import {
  createMember,
  updateMember,
  deleteMember,
  createTransaction,
} from "./graphql/mutations";

import { listMembers } from "./graphql/queries";

import Amplify, { Auth } from "aws-amplify";

import Members from "./components/Members/Members";

import Transaction from "./components/Transaction/transaction";
import member from "./components/Member/Member";
import members from "./components/Members/Members";

class App extends Component {
  state = {
    member: { id: "", name: "", owner: "", balance: 0 },
    transaction: {
      id: "",
      name: "",
      owner: "",
      type: "",
      date: "",
      amount: "",
      info: "",
    },
    members: [],
    authuser: "",
    showMainPage: true,
    showTransactionPage: false,
    transactionType: "",
    credit: 0,
    charge: 0,
  };

  async getAuthUser() {
    const currentUser = await Auth.currentUserInfo();
    this.state.authuser = currentUser.username;
    this.setState({ authuser: currentUser.username });
  }

  async componentDidMount() {
    this.getAuthUser();
    this.loadMembers();
  }

  async loadMembers() {
    const allMembers = await API.graphql(graphqlOperation(listMembers));
    const allMembersByCurrentOwner = allMembers.data.listMembers.items.filter(
      (x) => x.owner == this.state.authuser
    );
    this.setState({ members: allMembersByCurrentOwner });
  }

  setMember = (event) => {
    this.setState({
      member: { ...this.state.member, name: event.target.value },
    });
  };

  addMemberHandler = async () => {
    this.state.member.owner = this.state.authuser;
    const newMember = {
      name: this.state.member.name,
      owner: this.state.member.owner,
      balance: this.state.member.balance,
    };

    const result = await API.graphql(
      graphqlOperation(createMember, { input: newMember })
    );
    this.loadMembers();
  };

  openTransactionsByMemberId = (id, transactionType) => {
    const transactionMember = this.state.members.find((i) => i.id === id);
    this.state.transactionType = transactionType;
    this.setState({
      member: transactionMember,
      transactionType: this.state.transactionType,
      showMainPage: false,
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
    this.state.showMainPage = true;
    this.state.showTransactionPage = false;
    this.setState({ credit: this.state.credit, charge: this.state.charge });

    this.state.members.map((item) => {
      if (item.id == this.state.member.id) {
        if (this.state.transactionType == transactionType) {
          item.balance = item.balance + this.state.credit;
        }

        if (this.state.transactionType == transactionType) {
          item.balance = item.balance - this.state.charge;
        }
      }
    });

    this.setState({
      showMainPage: this.state.showMainPage,
      showTransactionPage: this.state.showTransactionPage,
      members: this.state.members,
      member: this.state.member,
    });

    this.sendUpdate();
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

    const result2 = await API.graphql(
      graphqlOperation(createTransaction, { input: input })
    );
  };

  onInputChange = (event) => {
    if (this.state.transactionType == "Credit")
      this.state.credit = parseInt(event.target.value);
    if (this.state.transactionType == "Charge")
      this.state.charge = parseInt(event.target.value);
  };

  render() {
    let members = null;
    let transaction = null;
    let addMember = null;

    if (this.state.showMainPage) {
      transaction = null;
      members = (
        <div className="flex flex-column items-left pa5">
          <Members
            members={this.state.members}
            creditClicked={this.openTransactionsByMemberId}
            chargeClicked={this.openTransactionsByMemberId}
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
            value={this.state.member.name}
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
          />
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
      </div>
    );
  }
}

export default withAuthenticator(App, { includeGreetings: true });
