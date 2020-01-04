import React, {Component} from 'react';

class Track extends Component {
    render() {
        return (
            <div className="Track">
                <div className="track-title">
                    <a href={this.props.track.link}>{this.props.track.name}</a>
                </div>
                <div className="track-artist">
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

export default Track;
