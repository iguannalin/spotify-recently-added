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
                        this.props.track.artists.map((artist, index) => {
                            return (<a href={artist.link} key={index}>{artist.name}</a>);
                        })
                    }
                </div>
            </div>
        );
    }
}

export default Song;
