import React, { Component } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';

const getBackendUrl = () => {
  if (window.location.host === '10.0.2.2:3000') {
    return 'http://10.0.2.2:8080'
  } else {
    return 'http://localhost:8080'
  }
}

class App extends Component {
  state = {
    name: null,
    error: null,
  }

  async componentDidMount() {
    const token = window.location.hash.split('=')[1];

    if (token) {
      try {
        const res = await axios.get(getBackendUrl() + '/api/me?access_token=' + token);
        console.log(res)
        const name = res.data.profile.first_name;
        this.setState({name})
      } catch(er) {
        this.setState({error: er})
        console.error(er);
      }
    }
  }

  render() {
    return (
      <div style={{ background: 'lightblue' }}>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p>
          {window.location.href} <br/>
        </p>
        {
          this.state.name &&
          <h2>Welcome, {this.state.name}</h2>
        }
        {
          this.state.error &&
          <p>err: {JSON.stringify(this.state.error)}</p>
        }
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
