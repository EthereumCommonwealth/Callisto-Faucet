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
    };
  }

  onChange = (event) => {
    event.preventDefault();
    this.setState({ address: event.target.value });
  }

  onSubmit = (event) => {
    event.preventDefault();
    api.faucet({ address: this.state.address })
      .then((res) => {
        if (res.transactionHash) {
          this.setState({
            message: res.transactionHash,
            error: false,
          })
        } else if (res.response.data.error) {
          this.setState({
            error: res.response.data.error,
            message: false,
          })
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
          />
          <input type="submit" className="App-form-submit" value="Submit"/>
        </form>
        {this.state.message ? <p className="App-message">transactionHash: {this.state.message}</p> : null}
        {this.state.error ? <p className="App-error">Error: {this.state.error}</p> : null}
      </div>
    );
  }
}

export default App;
