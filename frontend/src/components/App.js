import React, { Component } from 'react';
import api from '../endpoints';
import logo from '../images/logo.jpg';
import '../styles/App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      error: false,
      message: false,
      showSpinner: false,
    };
  }

  onChange = (event) => {
    event.preventDefault();
    this.setState({ address: event.target.value });
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.setState({
      showSpinner: true,
      error: false,
    })
    api.faucet({ address: this.state.address })
      .then((res) => {
        if (res.transactionHash) {
          this.setState({
            message: res.transactionHash,
            error: false,
            showSpinner: false,
          })
        } else if (res.response.data.error) {
          if (res.response.data.error.length) {
            this.setState({
              error: res.response.data.error,
              message: false,
              showSpinner: false,
            });
          } else {
            this.setState({
              error: 'Connection Problem',
              message: false,
              showSpinner: false,
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <h1 className="App-title" >Callisto Faucet</h1>
        <p className="App-intro">This is the Callisto faucet system for testnet</p>
        <form className="App-form" onSubmit={this.onSubmit}>
          <input
            className="App-form-input"
            value={this.state.address}
            onChange={this.onChange}
            placeholder="Address..."
            type="text"
            required
          />
          <a className="App-form-submit" onClick={(evt) => {
            if (this.state.address !== ""){
              this.onSubmit(evt);
            }            
          }}>Submit</a>
        </form>
        {this.state.showSpinner ? <i className="fas fa-circle-notch fa-spin fa-3x fa-fw App-Spinner" /> : null}
        {this.state.message ? <p className="App-message">transactionHash: {this.state.message}</p> : null}
        {this.state.error ? <p className="App-error">{this.state.error}</p> : null}
        <footer className="Footer">
          <a
            href="https://github.com/EthereumCommonwealth/Callisto-Faucet"
            target="_blank"
            className="Footer-Link"
            rel="noopener noreferrer"
          >
            <i className="fab fa-github" /> Source Code
          </a>
        </footer>
      </div>
    );
  }
}

export default App;
