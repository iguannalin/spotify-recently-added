import React, {Component} from 'react';
import Playlist from '../Playlist/Playlist';

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
        const code = urlParams.get('code');
        this.setState({
            code: code,
            submitted: !!(code)
        });
    }

    handleSubmit(e) {
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
                    <Playlist mid={this.state.mid} ms={this.state.ms} code={this.state.code}/>
                </div>
            )
        } else {
            return (
                <div className="login-form">
                    <div className="login-form card">
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
                            <div className="login-form buttons">
                                <input type="submit" value="Submit"/>
                            </div>
                        </form>
                    </div>
                </div>
            )
        }
    }
}

export default Home
