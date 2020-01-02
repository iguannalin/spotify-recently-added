import React, {Component} from 'react';

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

export default Song;
