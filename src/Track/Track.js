import React, {Component} from 'react';
import './Track.scss';

class Track extends Component {
    render() {
        return (
            <div className="Track">
                <div className="track-image-small">
                    <img alt={'Album cover of ' + this.props.track.name + ' by ' + this.props.track.artists[0].name}
                         src={this.props.track.albumArt[1].url}/>
                </div>
                <div className="track-details">
                    <div className="track-title">
                        <a href={this.props.track.link}>{this.props.track.name}</a>
                    </div>
                    <div className="track-artist">
                        {
                            this.props.track.artists.map((artist, index) => {
                                return (<a href={artist.link} key={index}>
                                    { index > 0 ? (', ') : ('') } {artist.name}
                                </a>);
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Track;
