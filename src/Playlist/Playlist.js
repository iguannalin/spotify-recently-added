import React, {Component} from 'react';
import Track from '../Track/Track';
import './Playlist.scss';

// TODO Generate a playlist for user, and add custom playlist cover
class Playlist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playlist: [],
            playlistURI: [],
            ruri: 'http://localhost:3000/',
            userID: '',
            at: '',
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
        this.getUserID = this.getUserID.bind(this);
        this.generateAuthLink = this.generateAuthLink.bind(this);
    };

    componentDidMount() {
        this.generateAuthLink();
        this.getToken(this.props.code);
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
        if (!ac) return;
        const encodedBody = window.btoa(this.props.mid + ':' + this.props.ms);
        console.log('CODE', ac);
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
            body: `grant_type=authorization_code&code=${ac}&redirect_uri=${this.state.ruri}`,
        })
            .then(r => {
                if (r.ok) return r.json();
                else {
                    console.error('Error: getToken');
                    sessionStorage.removeItem('mcode');
                }
            })
            .then(data => {
                if (data && data.access_token) {
                    this.setState({
                        at: data.access_token
                    });
                    this.getLibrary();
                }
            });
    }

    getLibrary() {
        console.log('TOKEN', this.state.at);
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
                if (r.ok) {
                    return r.json();
                } else {
                    console.error('Error: getLibrary');
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

    // TODO look for existing 'Recently Added' playlist or delete previous one, to prevent from recreating one over and over again
    createPlaylist() {
        const snapshotID = sessionStorage.getItem('playlistSnapshot');
        console.log('MEOW');
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
                body: `{"name":"Recently Added","public":false,"description":"Your top 20 recently added Spotify tracks :)"}`
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
        console.log('addtracksto', playlistID);
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
            .then(r => {
                if (r.ok) return r.json();
                else {
                    console.error('Error: addTracksToPlaylist');
                    sessionStorage.removeItem('playlistSnapshot');
                    this.createPlaylist();
                }
            })
            .then(data => {
                if (data) sessionStorage.setItem('playlistSnapshot', data.snapshot_id)
            });
    }

    getUserID() {
        console.log('AT', this.state.at);
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
                        console.log('USER ID', data);
                    }
                }
            );
    }


    render() {
        return (
            <div className="Playlist">
                {this.state.playlist.length > 0 ? (
                    <div className="button-div position-right">
                        <button className="button-link" onClick={this.createPlaylist()}>Create this playlist on Spotify
                            for me
                        </button>
                    </div>) : (
                    <div className="button-div"><a href={this.state.links.authLink}>Click on me to authorize Spotify</a>
                    </div>
                )}
                <ul>
                    {this.state.playlist.map(
                        (track, index) => {
                            return (
                                <li key={index}><Track track={track}/></li>
                            )
                        }
                    )
                    }
                </ul>
            </div>
        );
    }
}

export default Playlist;
