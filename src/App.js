import React, {Component} from 'react';
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
            // ruri: 'http://localhost:3000/',
            endpoints: {
                authorize: 'https://accounts.spotify.com/authorize'
            }
        }
    };

    generateAuthLink() {
        return this.state.endpoints.authorize + '?client_id=' + this.props.mid + '&response_type=code&redirect_uri=' + this.state.ruri + '&scope=user-library-read';
    }

    componentDidMount() {
        this.getToken(this.props.code);
    }

    getToken(ac) {
        const encodedBody = window.btoa(this.props.mid + ':' + this.props.ms);
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
            .then(r => {
                if (r.ok) return r.json()
            })
            .then(data => {
                if (data && data.access_token) this.getLibrary(data.access_token)
            });
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
                } else {
                    console.log('Error: getLibrary');
                    return;
                }
            })
            .then(data => {
                if (data) this.compileList(data);
            });
    }

    compileList(tracks) {
        this.setState(() => {
            return {playlist: []}
        });

        if (tracks && tracks.items) {
            tracks.items.forEach(object => {
                    const item = object.track;
                    const track = {
                        name: item.name,
                        link: item.external_urls.spotify,
                        artists: item.artists.map(artist => {
                            return {name: artist.name, link: artist.external_urls.spotify}
                        })
                    }
                    const tempPlaylist = this.state.playlist;
                    tempPlaylist.push(track);
                    this.setState((state) => {
                        return {
                            playlist: tempPlaylist
                        }
                    })
                }
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
                    {this.state.playlist.map(
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

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mid: '',
            ms: '',
            code: '',
            submitted: false
        };

        this.getCode = this.getCode.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUserInput = this.handleUserInput.bind(this);
    }

    componentDidMount() {
        this.getCode();
    }


    getCode() {
        const urlParams = new URLSearchParams(window.location.search);
        this.setState({
            code: urlParams.get('code'),
            submitted: true
        });
    }

    handleSubmit(e) {
        console.log('SUBMITTED');
        if (e) {
            e.preventDefault();
        }
        this.setState({
            submitted: true
        });
    }

    handleUserInput(event) {
        if (event.target.name === 'mid') {
            this.setState({
                mid: event.target.value
            })
        } else if (event.target.name === 'ms') {
            this.setState({
                ms: event.target.value
            })
        }
    }

    render() {
        if (this.state.mid && this.state.ms && this.state.submitted) {
            return (
                <div className="Home">
                    <Songs mid={this.state.mid} ms={this.state.ms} code={this.state.code}></Songs>
                </div>
            )
        } else {
            return (
                <div className="project-form">
                    <div className="project-form card">
                        <h2>To use this app, enter your client ID & secret here:</h2>
                        <form onSubmit={this.handleSubmit}>
                            <div>
                                <label>Client ID:
                                    <input type="text" name="mid" onChange={this.handleUserInput}/></label>
                            </div>
                            <div>
                                <label>Secret:
                                    <input type="text" name="ms" onChange={this.handleUserInput}/></label>
                            </div>
                            <div className="project-form buttons">
                                <input type="submit" value="Submit"/>
                            </div>
                        </form>
                    </div>
                </div>
            )
        }
    }
}

function App() {
    return (
        <div className="App">
            <Home></Home>
        </div>
    );
}

export default App;
