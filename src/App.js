import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

 class Song extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="track">
        { this.props.track }
      </div>
    );
  }
}


class Songs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist: []
    }
  };

  componentDidMount() {
    this.getLibrary(this.getToken());
  }

  getToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    console.log('CODE', code)
    return code;
  }

  getLibrary(at) {
    console.log('CODE', at);
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
    .then(data=>{ this.compileList(data); });
  }

  compileList(tracks) {
    this.setState({playlist: []});
    console.log('list tracks', tracks);

    if (tracks.items) {
      tracks.items.forEach(item => {
        const track = {
          name: item.name,
          link: item.href,
          artists: item.artists.map(artist => { return { name: artist.name, link: artist.href }})
        }
        this.setState({
          playlist: this.state.playlist.push(track)
        })}
      );
    }
  }

  render() {
    const mid = '6dc15fdee3cc4723b9f2a422b7f35305';
    const ruri = 'https://iguannalin.github.io/spotify-recently-added/';
    const authEndpoint = "https://accounts.spotify.com/authorize?client_id="+mid+"&response_type=code&redirect_uri="+ruri+"&scope=user-library-read";
    return (
      <div className="Playlist">
        <a href={`${authEndpoint}`}>LINK</a>
        <ul>
          { this.state.playlist.forEach(
            track => {
              return (
                <Song track={track}></Song>
              )
            }
          )}
        </ul>
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
