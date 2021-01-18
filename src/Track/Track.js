import React, {Component} from 'react';
import './Track.scss';

class Track extends Component {
    render() {
        return (
            <span className="Track">
                <span className="track-vinyl-center"></span>
                <span className="track-image-small">
                    <img alt={'Album cover of ' + this.props.track.name + ' by ' + this.props.track.artists[0].name}
                         src={this.props.track.albumArt[1].url}/>
                </span>
                <span className="track-details">
                    <h2 className="track-title">
                        <a href={this.props.track.link}>{this.props.track.name}</a>
                    </h2>
                    <p className="track-artist">
                        {
                            this.props.track.artists.map((artist, index) => {
                                return (<a href={artist.link} key={index}>
                                    { index > 0 ? (', ') : ('') } {artist.name}
                                </a>);
                            })
                        }
                    </p>
                </span>
            </span>
        );
    }
}

export default Track;
