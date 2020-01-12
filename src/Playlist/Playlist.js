import React, {Component} from 'react';
import Track from '../Track/Track';
import './Playlist.scss';

// TODO Generate a playlist for user, and add custom playlist cover
class Playlist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: '',
            playlist: [],
            playlistURI: [],
            ruri: 'https://iguannalin.github.io/spotify-recently-added/',
            userID: '',
            at: '',
            playlistCreated: false,
            endpoints: {
                authorize: 'https://accounts.spotify.com/authorize',
                token: 'https://accounts.spotify.com/api/token',
                users: 'https://api.spotify.com/v1/'
            },
            links: {
                authLink: ''
            }
        };
        this.getLibrary = this.getLibrary.bind(this);
        this.getToken = this.getToken.bind(this);
        this.getUserID = this.getUserID.bind(this);
        this.generateAuthLink = this.generateAuthLink.bind(this);
        this.addTracksToPlaylist = this.addTracksToPlaylist.bind(this);
        this.createPlaylist = this.createPlaylist.bind(this);
        this.createConfetti = this.createConfetti.bind(this);
        this.getCode = this.getCode.bind(this);
    };

    componentDidMount() {
        this.generateAuthLink();
        this.getToken(this.getCode());
    }

    getCode() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        this.setState({
            code: code
        });
        sessionStorage.setItem('mcode', code);
        return code;
    }

    generateAuthLink() {
        const scopes = encodeURIComponent('user-library-read playlist-modify-private');
        this.setState({
            links: {
                authLink: (this.state.endpoints.authorize + '?client_id=' + this.props.mid + '&response_type=code&redirect_uri=' + this.state.ruri + '&scope=' + scopes)
            }
        });
    }

    getToken(ac) {
        const refreshToken = sessionStorage.getItem('mtoken');
        let grantType = 'authorization_code';
        let codeType = 'code';
        if (refreshToken && refreshToken !== "undefined") {
            this.setState({at: refreshToken});
            ac = refreshToken;
            grantType = 'refresh_token';
            codeType = 'refresh_token';
        }

        const encodedBody = window.btoa(this.props.mid + ':' + this.props.ms);
        fetch(this.state.endpoints.token, {
            method: 'POST',
            'Access-Control-Allow-Headers': {
                'mode': 'no-cors',
                'access-control-allow-origin': '*'
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${encodedBody}`
            },
            body: `grant_type=${grantType}&${codeType}=${ac}&redirect_uri=${this.state.ruri}`,
        })
            .then(r => {
                if (r.ok) return r.json();
                else {
                    sessionStorage.removeItem('mcode');
                    console.error('Error: getToken');
                }
            })
            .then(data => {
                if (data && data.access_token) {
                    this.setState({
                        at: data.access_token
                    });
                    if (data.refresh_token) sessionStorage.setItem('mtoken', data.refresh_token);
                    this.getLibrary();
                }
            });

    }

    getLibrary() {
        fetch('https://api.spotify.com/v1/me/tracks?limit=20', {
            'Access-Control-Allow-Headers': {
                'mode': 'no-cors',
                'access-control-allow-origin': '*'
            },
            headers: {
                'Authorization': `Bearer ${this.state.at}`
            }
        })
            .then(r => {
                if (r.ok) return r.json(); else {
                    console.error('Error: getLibrary');
                    sessionStorage.removeItem('mtoken');
                }
            })
            .then(data => {
                if (data) this.compileList(data);
            })
            .then(() => {
                this.getUserID();
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
                        }),
                        albumArt: item.album.images
                    };
                    const tempPlaylist = this.state.playlist;
                    const tempPlaylistURI = this.state.playlistURI;
                    tempPlaylist.push(track);
                    tempPlaylistURI.push(item.uri);
                    this.setState({
                        playlist: tempPlaylist,
                        playlistURI: tempPlaylistURI
                    })
                }
            );
        }
    }

    createPlaylist() {
        const snapshotID = sessionStorage.getItem('playlistSnapshot');
        if (snapshotID) {
            this.addTracksToPlaylist(snapshotID);
        } else {
            fetch(this.state.endpoints.users + 'users/' + this.state.userID + '/playlists', {
                method: 'POST',
                'Access-Control-Allow-Headers': {
                    'mode': 'no-cors',
                    'access-control-allow-origin': '*'
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.state.at}`
                },
                body: `{"name":"Recently Added","public":false,"description":"Your top 20 recently added Spotify tracks. Happy 2020! - Anna :)"}`
            })
                .then(r => {
                    if (r.ok) return r.json();
                    else console.error('Error: createPlaylist');
                })
                .then(data => {
                    if (data) this.addTracksToPlaylist(data.id);
                });
        }
    }

    addTracksToPlaylist(playlistID) {
        fetch(this.state.endpoints.users + 'playlists/' + playlistID + '/tracks', {
            method: 'POST',
            'Access-Control-Allow-Headers': {
                'mode': 'no-cors',
                'access-control-allow-origin': '*'
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.at}`
            },
            body: `{"uris":${JSON.stringify(this.state.playlistURI)}}`
        })
            .then(r => r.json())
            .then(data => {
                if (data.error && data.error.status >= 400 && data.error.message === 'Invalid playlist Id') {
                    sessionStorage.removeItem('playlistSnapshot');
                    this.createPlaylist();
                } else if (data) {
                    sessionStorage.setItem('playlistSnapshot', data.snapshot_id);
                    this.setState({playlistCreated: true})
                }
            });
    }

    getUserID() {
        fetch((this.state.endpoints.users + 'me'), {
            'Access-Control-Allow-Headers': {
                'mode': 'no-cors',
                'access-control-allow-origin': '*'
            },
            headers: {
                'Authorization': `Bearer ${this.state.at}`
            }
        })
            .then(r => {
                if (r.ok) return r.json();
                else console.error('Error: getUserID');
            })
            .then(data => {
                    if (data) {
                        this.setState({userID: data.id});
                    }
                }
            );
    }

    getCircleX(deg, radius) {
        const radians = deg * (Math.PI / 180);
        return Math.sin(radians) * radius;
    }

    getCircleY(deg, radius) {
        const radians = deg * (Math.PI / 180);
        return Math.cos(radians) * radius;
    }

    getColor(i) {
        const colors = ['rgb(108, 220, 254)', 'rgb(55, 223, 159)', 'rgb(104, 74, 179)', 'rgb(245, 163, 199)', 'rgb(242, 107, 60)', 'rgb(241, 80, 98)', 'rgb(254, 253, 223)', 'rgb(105, 192, 123)',
            'rgb(183, 124, 168)'];
        const color = Math.round(i) % (colors.length);
        return (colors[color]);
    }

    createConfetti() {
        const container = document.getElementById('confetti-container');
        container.innerHTML = '';
        for (let i = 1; i <= 360; i += 30) {
            const elem = document.createElement('span');
            const r = (Math.random() * 7) + 5;
            const radius = 100;
            const x = Math.round(this.getCircleY(i, radius)).toString() + 'px';
            const y = Math.round(this.getCircleX(i, radius)).toString() + 'px';
            const coord = 'translate(' + x.toString() + ',' + y.toString() + ')';
            elem.style.webkitTransform = coord;
            elem.style.width = r.toString() + 'px';
            elem.style.height = r.toString() + 'px';
            elem.classList.add('confetti');
            elem.style.backgroundColor = this.getColor(i / 30);
            elem.style.webkitTranslate = 'transform 5s linear ease-in-out';
            container.appendChild(elem);
        }
        container.style.visibility = 'visible';
    }

    render() {
        return (
            <div className={this.state.playlist.length > 0 ? 'Playlist' : 'Playlist center-display'}>
                {this.state.playlist.length > 0 ? (
                    <h1 className="header playlist-h1">Here is a list of your 20 most recently added tracks:</h1>) : (
                    <h1 className="header">See your Spotify 20 Recently Added tracks, and make it into a
                        playlist</h1>)}
                {this.state.playlist.length > 0 ? (
                    <span>
                        <ul className="playlist-container">
                                {this.state.playlist.map(
                                    (track, index) => {
                                        return (
                                            <li key={index}><Track track={track}/></li>
                                        )
                                    }
                                )}
                        </ul>
                        <div className="button-div position-mid-right">
                            {this.state.playlistCreated ? (
                                    <p className="button-link" onClick={this.createConfetti}>Done!<span
                                        id="confetti-container"/></p>) :
                                (<button className="button-link" onClick={this.createPlaylist}>Create this playlist on
                                    Spotify for me
                                </button>)
                            }
                        </div>
                    </span>) : (
                    <span>
                        <div className="button-div margin-top"><a href={this.state.links.authLink}>Click on me to authorize
                            Spotify</a>
                        </div>
                    </span>
                )}
            </div>
        );
    }
}

export default Playlist;
