import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import Color from "../../artifacts/contracts/Colour.sol/Colour.json";
import "bootstrap/dist/css/bootstrap.css";

declare let window: any;

class App extends Component<{}, { account: string }> {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load accounts
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
  }

  constructor(props: any) {
    super(props);
    this.state = {
      account: "",
    };
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-ethereum browser detected. You should consider trying MetaMask."
      );
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <div className="navbar-brand col-sm-3 col-md-2 mr-0">
            Colour Tokens
          </div>
          <div className="account-brand col-sm-3 col-md-2">
            <small>{this.state.account}</small>
          </div>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Issue Token</h1>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                  }}
                >
                  <input
                    type="text"
                    className="form-control mb-1"
                    placeholder="e.g. #FFFFFF"
                    ref={(input) => {}}
                  />
                  <input
                    type="submit"
                    className="btn btn-block btn-primary"
                    value="MINT"
                  />
                </form>
              </div>
            </main>
          </div>
          <hr />
          <div className="row text-center"></div>
        </div>
      </div>
    );
  }
}

export default App;
