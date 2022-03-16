import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import Colour from "./artifacts/contracts/Colour.sol/Colour.json";
import "bootstrap/dist/css/bootstrap.css";

declare let window: any;

interface IState {
  account: string;
  contract?: any;
  totalSupply?: any;
  colours?: any[];
}
class App extends Component<{}, IState> {
  colour: React.RefObject<HTMLInputElement>;

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load accounts
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const abi = Colour.abi;

    // TODO: use network rather then hardcode contact address
    // TODO: display alert if smart contract not detected on network 1:27
    //const networkId = await web3.eth.net.getId();
    //const networkData = Colour.networks[networkId];
    //const address = networkData.address;
    var contract = new web3.eth.Contract(
      abi,
      "0x5FbDB2315678afecb367f032d93F642f64180aa3" // hardcoded
    );
    this.setState({ contract });
    const totalSupply = await contract.methods.totalSupply().call();
    this.setState({ totalSupply });
    // load colours
    for (var i = 1; i <= totalSupply; i++) {
      let colour = await contract.methods.colours(i - 1).call();
      this.setState({
        colours: [...(this.state.colours ?? []), colour],
      });
    }
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

  mint = (colour: String | undefined) => {
    this.state.contract.methods
      .mint(colour)
      .send({ from: this.state.account })
      .once("receipt", (receipt: any) => {
        this.setState({
          colours: [...(this.state.colours ?? []), colour],
        });
      });
  };

  constructor(props: any) {
    super(props);

    this.colour = React.createRef();

    this.state = {
      account: "",
    };
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
            <main
              role="main"
              className="col-lg-12 d-flex text-center flex-wrap"
              style={{ alignContent: "center", flexDirection: "column" }}
            >
              <div className="content mr-auto ml-auto">
                <h1>Issue Token</h1>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    this.mint(this.colour.current?.value);
                  }}
                >
                  <input
                    type="text"
                    className="form-control mb-1"
                    placeholder="e.g. #FFFFFF"
                    ref={this.colour}
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
          <div className="row text-center">
            {this.state.colours?.map((colour, key) => {
              return (
                <div key={key} className="col-md-3 mb-3">
                  <div className="token" style={{ background: colour }}></div>
                  <div key={key}>{colour}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
