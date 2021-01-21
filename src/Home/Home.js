import React, {Component} from 'react';
import Playlist from '../Playlist/Playlist';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mid: '',
            ms: ''
        };
        this.retrieve = this.retrieve.bind(this);
    }

    componentDidMount() {
        this.retrieve();
    }

    retrieve() {
        // TODO: implement a reset sessionStorage, in case user wants to change ID
        if (!this.state.mid && sessionStorage.getItem('mid')) {
            this.setState({
                mid: sessionStorage.getItem('mid'),
                ms: sessionStorage.getItem('ms')
            });
        } else {
            Promise.all([
                fetch('https://spotify-secret.herokuapp.com/mid', {
                    'Access-Control-Allow-Headers': {
                        'mode': 'cors',
                        'access-control-allow-origin': '*'

                    }
                }),
                fetch('https://spotify-secret.herokuapp.com/ms', {
                    'Access-Control-Allow-Headers': {
                        'mode': 'cors',
                        'access-control-allow-origin': '*'
                    }
                })
            ]).then((r) => {
                return Promise.all(r.map((response) => {
                    return response.json();
                }))
            }).then((m) => {
                this.setState({mid: m[0], ms: m[1]});
                return {mid: m[0], ms: m[1]};
            });
        }
    }

    render() {
        if (!this.state.mid || !this.state.ms) {
            return (<div className="Home">
                <span>Loading...</span>
            </div>);
        } else {
            return (
                <div className="Home">
                    <Playlist mid={this.state.mid} ms={this.state.ms}/>
                </div>
            );
        }
    }
}

export default Home
