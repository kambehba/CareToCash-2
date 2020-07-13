import React, { Component } from "react";

import { withAuthenticator } from "aws-amplify-react";

import { API, graphqlOperation, auth0SignInButton } from "aws-amplify";

import { createMember, updateMember } from "./graphql/mutations";

import { listMembers } from "./graphql/queries";

import Amplify, { Auth } from "aws-amplify";

import Member from "./components/Member/Member";

class App extends Component {
  state = {
    member: { id: "", name: "", owner: "", balance: 0 },
    members: [],
    authuser: "",
  };

  async getAuthUser() {
    const g = await Auth.currentUserInfo();
    this.state.authuser = g.username;
    this.setState({ authuser: g.username });
  }

  async componentDidMount() {
    this.getAuthUser();
    const g = await API.graphql(graphqlOperation(listMembers));
    const ww = g.data.listMembers.items.filter(
      (x) => x.owner == this.state.authuser
    );
    this.setState({
      members: ww,
    });
  }

  setMember = (event) => {
    this.setState({
      member: { ...this.state.member, name: event.target.value },
    });
  };

  addMemberHandler = () => {
    this.state.member.owner = this.state.authuser;
    this.state.members.push(this.state.member);
    this.setState({
      members: this.state.members,
      member: { ...this.member, name: "" },
    });

    API.graphql(graphqlOperation(createMember, { input: this.state.member }));
  };

  async getMembers() {
    const g = await API.graphql(graphqlOperation(listMembers));
    this.setState({ members: g.data.listMembers.items });
  }

  addCredit = (id) => {
    this.state.members.forEach((element) => {
      if (element.name == id) {
        element.balance++;
        this.state.member = element;
      }
    });

    this.setState({ members: this.state.members, member: this.state.member });
  };

  deductCredit = (id) => {
    this.state.members.forEach((element) => {
      if (element.name == id) {
        element.balance--;
        this.state.member = element;
      }
    });

    this.setState({ members: this.state.members, member: this.state.member });
  };

  // saveMembers = async () => {
  //   await API.graphql(
  //     graphqlOperation(updateMember, { input: this.state.member })
  //   );

  // this.state.members.forEach(item=>{
  //   const result =  await API.graphql(graphqlOperation(updateMember, { input: item }));
  // });
  //};

  // saveMember = async (item) => {
  //   const result = await API.graphql(
  //     graphqlOperation(updateMember, { input: item })
  //   );
  //   alert(result.data.updateMember);
  // };

  // dothis = async () => {
  //   this.state.members.map((m) => {
  //     this.saveMember(m);
  //   });
  // };

  updateMemberHandler = async (item) => {
    this.state.member.balance = item;
    this.setState({ member: this.state.member });
    const { id, balance } = this.state.member;

    const input = { id, balance };

    const result = await API.graphql(graphqlOperation(updateMember, { input }));
    const ff = result.data.updateMember;
  };

  // saveBalance = ({balance,id}) => {
  //   this.setState({balance,id});
  //   const g = await API.graphql(
  //     graphqlOperation(updateMember, { input: this.state.member })
  //   );
  // };

  render() {
    return (
      <div>
        <div className="flex flex-column items-center justify-center pa3 bg-washed-yellow b--hot-pink">
          <h1 className="f1 dark-blue lh-solid">
            CARE to CA<span Style="color:green">$</span>H
          </h1>
        </div>

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

          {/* <div className="flex flex-column items-left pa5">
            {this.state.members.map((x) => (
              <div key={x.name}>
                {x.name} , Balance: {x.balance}{" "}
                <span>
                  <button
                    className="btn btn-success"
                    onClick={this.addCredit.bind(this, x.name)}
                  >
                    +
                  </button>
                </span>
                <span>
                  <button
                    className="btn btn-danger"
                    onClick={this.deductCredit.bind(this, x.name)}
                  >
                    -
                  </button>
                </span>
                <div>
                  <button
                    className="btn btn-warning"
                    onClick={() => this.updateMemberHandler(x.balance)}
                  >
                    Save
                  </button>
                </div>
              </div>
            ))}
          </div> */}
          <div className="flex flex-column items-left pa5">
            {this.state.members.map((x) => (
              <Member
                name={x.name}
                balance={x.balance}
                creditClicked={this.addCredit.bind(this, x.name)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default withAuthenticator(App, { includeGreetings: true });
