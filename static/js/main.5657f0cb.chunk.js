(this["webpackJsonpspotify-recently-added"]=this["webpackJsonpspotify-recently-added"]||[]).push([[0],[,,,,,,,,,function(e,t,a){e.exports=a(18)},,,,,function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){"use strict";a.r(t);var n=a(0),s=a.n(n),r=a(8),i=a.n(r),o=(a(14),a(15),a(2)),c=a(3),l=a(5),u=a(4),m=a(1),d=a(6),h=(a(16),function(e){function t(){return Object(o.a)(this,t),Object(l.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(d.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return s.a.createElement("span",{className:"Track"},s.a.createElement("span",{className:"track-image-small"},s.a.createElement("img",{alt:"Album cover of "+this.props.track.name+" by "+this.props.track.artists[0].name,src:this.props.track.albumArt[1].url})),s.a.createElement("span",{className:"track-details"},s.a.createElement("h2",{className:"track-title"},s.a.createElement("a",{href:this.props.track.link},this.props.track.name)),s.a.createElement("p",{className:"track-artist"},this.props.track.artists.map((function(e,t){return s.a.createElement("a",{href:e.link,key:t},t>0?", ":""," ",e.name)})))))}}]),t}(n.Component)),p=(a(17),function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(l.a)(this,Object(u.a)(t).call(this,e))).state={code:"",playlist:[],playlistURI:[],ruri:"https://iguannalin.github.io/spotify-recently-added/",userID:"",at:"",playlistCreated:!1,endpoints:{authorize:"https://accounts.spotify.com/authorize",token:"https://accounts.spotify.com/api/token",users:"https://api.spotify.com/v1/"},links:{authLink:""}},a.getLibrary=a.getLibrary.bind(Object(m.a)(a)),a.getToken=a.getToken.bind(Object(m.a)(a)),a.getUserID=a.getUserID.bind(Object(m.a)(a)),a.generateAuthLink=a.generateAuthLink.bind(Object(m.a)(a)),a.addTracksToPlaylist=a.addTracksToPlaylist.bind(Object(m.a)(a)),a.createPlaylist=a.createPlaylist.bind(Object(m.a)(a)),a.createConfetti=a.createConfetti.bind(Object(m.a)(a)),a.getCode=a.getCode.bind(Object(m.a)(a)),a}return Object(d.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){this.generateAuthLink(),this.getToken(this.getCode())}},{key:"getCode",value:function(){var e=new URLSearchParams(window.location.search).get("code");return this.setState({code:e}),sessionStorage.setItem("mcode",e),e}},{key:"generateAuthLink",value:function(){var e=encodeURIComponent("user-library-read playlist-modify-private");this.setState({links:{authLink:this.state.endpoints.authorize+"?client_id="+this.props.mid+"&response_type=code&redirect_uri="+this.state.ruri+"&scope="+e}})}},{key:"getToken",value:function(e){var t=this,a=sessionStorage.getItem("mtoken"),n="authorization_code",s="code";a&&"undefined"!==a&&(this.setState({at:a}),e=a,n="refresh_token",s="refresh_token");var r=window.btoa(this.props.mid+":"+this.props.ms);fetch(this.state.endpoints.token,{method:"POST","Access-Control-Allow-Headers":{mode:"no-cors","access-control-allow-origin":"*"},headers:{"Content-Type":"application/x-www-form-urlencoded",Authorization:"Basic ".concat(r)},body:"grant_type=".concat(n,"&").concat(s,"=").concat(e,"&redirect_uri=").concat(this.state.ruri)}).then((function(e){if(e.ok)return e.json();sessionStorage.removeItem("mcode"),console.error("Error: getToken")})).then((function(e){e&&e.access_token&&(t.setState({at:e.access_token}),e.refresh_token&&sessionStorage.setItem("mtoken",e.refresh_token),t.getLibrary())}))}},{key:"getLibrary",value:function(){var e=this;fetch("https://api.spotify.com/v1/me/tracks?limit=20",{"Access-Control-Allow-Headers":{mode:"no-cors","access-control-allow-origin":"*"},headers:{Authorization:"Bearer ".concat(this.state.at)}}).then((function(e){if(e.ok)return e.json();console.error("Error: getLibrary"),sessionStorage.removeItem("mtoken")})).then((function(t){t&&e.compileList(t)})).then((function(){e.getUserID()}))}},{key:"compileList",value:function(e){var t=this;this.setState((function(){return{playlist:[]}})),e&&e.items&&e.items.forEach((function(e){var a=e.track,n={name:a.name,link:a.external_urls.spotify,artists:a.artists.map((function(e){return{name:e.name,link:e.external_urls.spotify}})),albumArt:a.album.images},s=t.state.playlist,r=t.state.playlistURI;s.push(n),r.push(a.uri),t.setState({playlist:s,playlistURI:r})}))}},{key:"createPlaylist",value:function(){var e=this,t=sessionStorage.getItem("playlistSnapshot");t?this.addTracksToPlaylist(t):fetch(this.state.endpoints.users+"users/"+this.state.userID+"/playlists",{method:"POST","Access-Control-Allow-Headers":{mode:"no-cors","access-control-allow-origin":"*"},headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(this.state.at)},body:'{"name":"Recently Added","public":false,"description":"Your top 20 recently added Spotify tracks. Happy 2020! - Anna :)"}'}).then((function(e){if(e.ok)return e.json();console.error("Error: createPlaylist")})).then((function(t){t&&e.addTracksToPlaylist(t.id)}))}},{key:"addTracksToPlaylist",value:function(e){var t=this;fetch(this.state.endpoints.users+"playlists/"+e+"/tracks",{method:"POST","Access-Control-Allow-Headers":{mode:"no-cors","access-control-allow-origin":"*"},headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(this.state.at)},body:'{"uris":'.concat(JSON.stringify(this.state.playlistURI),"}")}).then((function(e){return e.json()})).then((function(e){e.error&&e.error.status>=400&&"Invalid playlist Id"===e.error.message?(sessionStorage.removeItem("playlistSnapshot"),t.createPlaylist()):e&&(sessionStorage.setItem("playlistSnapshot",e.snapshot_id),t.setState({playlistCreated:!0}))}))}},{key:"getUserID",value:function(){var e=this;fetch(this.state.endpoints.users+"me",{"Access-Control-Allow-Headers":{mode:"no-cors","access-control-allow-origin":"*"},headers:{Authorization:"Bearer ".concat(this.state.at)}}).then((function(e){if(e.ok)return e.json();console.error("Error: getUserID")})).then((function(t){t&&e.setState({userID:t.id})}))}},{key:"getCircleX",value:function(e,t){var a=e*(Math.PI/180);return Math.sin(a)*t}},{key:"getCircleY",value:function(e,t){var a=e*(Math.PI/180);return Math.cos(a)*t}},{key:"getColor",value:function(e){var t=["rgb(108, 220, 254)","rgb(55, 223, 159)","rgb(104, 74, 179)","rgb(245, 163, 199)","rgb(242, 107, 60)","rgb(241, 80, 98)","rgb(254, 253, 223)","rgb(105, 192, 123)","rgb(183, 124, 168)"];return t[Math.round(e)%t.length]}},{key:"createConfetti",value:function(){var e=document.getElementById("confetti-container");e.innerHTML="";for(var t=1;t<=360;t+=30){var a=document.createElement("span"),n=7*Math.random()+5,s=Math.round(this.getCircleY(t,100)).toString()+"px",r=Math.round(this.getCircleX(t,100)).toString()+"px",i="translate("+s.toString()+","+r.toString()+")";a.style.webkitTransform=i,a.style.width=n.toString()+"px",a.style.height=n.toString()+"px",a.classList.add("confetti"),a.style.backgroundColor=this.getColor(t/30),a.style.webkitTranslate="transform 5s linear ease-in-out",e.appendChild(a)}e.style.visibility="visible"}},{key:"render",value:function(){return s.a.createElement("div",{className:this.state.playlist.length>0?"Playlist":"Playlist center-display"},this.state.playlist.length>0?s.a.createElement("span",null,s.a.createElement("ul",{className:"playlist-container","aria-label":"Here is a list of your 20 most recently added tracks:"},this.state.playlist.map((function(e,t){return s.a.createElement("li",{key:t},s.a.createElement(h,{track:e}))}))),s.a.createElement("div",{className:"button-div position-right"},this.state.playlistCreated?s.a.createElement("p",{className:"button-link",onClick:this.createConfetti},"Done!",s.a.createElement("span",{id:"confetti-container"})):s.a.createElement("button",{className:"button-link",onClick:this.createPlaylist},"Create this playlist on Spotify for me"))):s.a.createElement("div",{className:"button-div margin-top"},s.a.createElement("a",{href:this.state.links.authLink},"Click on me to authorize Spotify")))}}]),t}(n.Component)),y=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(l.a)(this,Object(u.a)(t).call(this,e))).state={mid:"6dc15fdee3cc4723b9f2a422b7f35305",ms:"a577356d88d340828944780fc72e6749",code:"",submitted:!1},a.retrieve=a.retrieve.bind(Object(m.a)(a)),a.handleSubmit=a.handleSubmit.bind(Object(m.a)(a)),a.handleUserInput=a.handleUserInput.bind(Object(m.a)(a)),a}return Object(d.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){this.retrieve()}},{key:"retrieve",value:function(){!this.state.mid&&sessionStorage.getItem("mid")&&this.setState({mid:sessionStorage.getItem("mid"),ms:sessionStorage.getItem("ms")})}},{key:"handleSubmit",value:function(e){e&&e.preventDefault(),this.setState({submitted:!0})}},{key:"handleUserInput",value:function(e){"mid"===e.target.name?(this.setState({mid:e.target.value}),sessionStorage.setItem("mid",e.target.value)):"ms"===e.target.name&&(this.setState({ms:e.target.value}),sessionStorage.setItem("ms",e.target.value))}},{key:"render",value:function(){return this.state.mid&&this.state.ms||this.state.submitted||this.state.code?s.a.createElement("div",{className:"Home"},s.a.createElement("h1",{className:"header"},"See your Spotify 20 Recently Added tracks, and make it into a playlist"),s.a.createElement(p,{mid:this.state.mid,ms:this.state.ms,code:this.state.code})):s.a.createElement("div",{className:"login-form"},s.a.createElement("div",{className:"login-form card"},s.a.createElement("h2",null,"To use this app, enter your client ID & secret here:"),s.a.createElement("form",{onSubmit:this.handleSubmit},s.a.createElement("div",null,s.a.createElement("label",null,"Client ID:",s.a.createElement("input",{type:"text",name:"mid",onChange:this.handleUserInput}))),s.a.createElement("div",null,s.a.createElement("label",null,"Secret:",s.a.createElement("input",{type:"text",name:"ms",onChange:this.handleUserInput}))),s.a.createElement("div",{className:"login-form buttons"},s.a.createElement("input",{type:"submit",value:"Submit"})))))}}]),t}(n.Component);var f=function(){return s.a.createElement("div",{className:"App"},s.a.createElement(y,null))};i.a.render(s.a.createElement(f,null),document.getElementById("root"))}],[[9,1,2]]]);
//# sourceMappingURL=main.5657f0cb.chunk.js.map