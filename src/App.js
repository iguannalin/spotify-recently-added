import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Songs extends Component {
  constructor(props) {
    super(props);
    this.getToken = this.getToken.bind(this);
  };

  componentDidMount() {
    this.getToken();
  }

  getToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    console.log('CODE', code)
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
    const mid = '';
    const ruri = '';
    return (
      <div className="Song">
        <a href="https://accounts.spotify.com/authorize?client_id="+mid+"&response_type=code&redirect_uri="+ruri+"&scopes=user-library-read">LINK</a>
      </div>
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
