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
        <div className="trackTitle">
          <a href={this.props.track.link}>{this.props.track.name}</a>
        </div>
        <div className="trackArtist">
          {
            this.props.track.artists.map(artist => {
              return (<a href={artist.link}>{artist.name}</a>);
            })
          }
        </div>
      </div>
    );
  }
}


class Songs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist: [],
      ruri: 'https://iguannalin.github.io/spotify-recently-added/',
      mid: '6dc15fdee3cc4723b9f2a422b7f35305',
      ms: 'a577356d88d340828944780fc72e6749',
      endpoints: {
        authorize: 'https://accounts.spotify.com/authorize'
      }
    }
  };

  generateAuthLink() {
    return this.state.endpoints.authorize + '?client_id=' + this.state.mid + '&response_type=code&redirect_uri='+this.state.ruri+'&scope=user-library-read';
  }

  componentDidMount() {
    this.getToken(this.getCode());
  }

  getCode() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('code');
  }

  getToken(ac) {
    const encodedBody = window.btoa(this.state.mid+':'+this.state.ms);
    console.log('CODE', ac);

    fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      'Access-Control-Allow-Headers': {
        'mode': 'no-cors',
        'access-control-allow-origin': '*'
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${encodedBody}` 
      },
      body: `grant_type=authorization_code&code=${ac}&redirect_uri=${this.state.ruri}`,
    })
    .then(r => { if (r.ok) return r.json() })
    .then(data => { if (data && data.access_token) this.getLibrary(data.access_token) });
    return;
  }

  getLibrary(at) {
    console.log('TOKEN', at);
    fetch('https://api.spotify.com/v1/me/tracks?limit=20', {
        'Access-Control-Allow-Headers': {
          'mode': 'no-cors',
          'access-control-allow-origin': '*'
        },
        headers: {
          'Authorization': `Bearer ${at}`
        }
    })
    .then(r => {
      if (r.ok) {
        return r.json();
      }
      else {
        console.log('Error: getLibrary');
        return;
      }
    })
    .then(data => { if (data) this.compileList(data); });
  }

  compileList(tracks) {
    this.setState((state) => { return {playlist: []} });

    if (tracks && tracks.items) {
      tracks.items.forEach(object => {
        const item = object.track;
        const track = {
          name: item.name,
          link: item.external_urls.spotify,
          artists: item.artists.map(artist => { return { name: artist.name, link: artist.external_urls.spotify }})
        }
        const tempPlaylist = this.state.playlist;
        tempPlaylist.push(track);
        this.setState((state) => {return {
          playlist: tempPlaylist
        }})}
      );
    }
  }

  render() {
    const authLink = this.generateAuthLink();
    console.log('LINK ', authLink);
    return (
      <div className="Playlist">
        <a href={authLink}>LINK</a>
        <ul>
          { this.state.playlist.map(
              track => {
                return (
                  <Song track={track}></Song>
                )
              }
            )
          }
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
