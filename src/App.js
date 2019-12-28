import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Songs extends Component {
  constructor(props) {
    super(props);
    this.getToken = this.getToken.bind(this);
  };

  componentDidMount() {
    this.getToken('', '');
  }

  getToken(mid, ms) {
    fetch(('https://accounts.spotify.com/api/token?scopes=user-library-read'), 
      {
        method: 'POST',
        'Access-Control-Allow-Headers': {
          'mode': 'no-cors',
          'access-control-allow-origin': '*'
        },
        headers: {
          'Authorization': 'Basic '+ btoa(mid+':'+ms),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      })
      .then(res => res.json())
      .then(data => this.getLibrary(data.access_token));
  }

  getLibrary(at) {
    fetch("https://api.spotify.com/v1/me/tracks?limit=20", {
        'Access-Control-Allow-Headers': {
          'mode': 'no-cors',
          'access-control-allow-origin': '*'
        },
        headers: {
          'Authorization': `Bearer ${at}`
        }
    })
    .then(r => r.json())
    .then(data=>{ console.log('tracks data ', data)});
  }

  render() {
    return (
      <div className="Song"></div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <Songs></Songs>
    </div>
  );
}

export default App;
