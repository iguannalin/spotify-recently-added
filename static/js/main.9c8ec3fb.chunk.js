(this["webpackJsonpspotify-recently-added"]=this["webpackJsonpspotify-recently-added"]||[]).push([[0],[,,,,,,,function(e,t,n){e.exports=n.p+"static/media/logo.930c9814.svg"},,,function(e,t,n){e.exports=n(17)},,,,,function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),c=n(3),r=n.n(c),i=(n(15),n(4)),s=n(5),l=n(8),u=n(6),d=n(1),m=n(9),p=n(7),f=n.n(p),h=(n(16),function(e){function t(e){var n;return Object(i.a)(this,t),(n=Object(l.a)(this,Object(u.a)(t).call(this,e))).getToken=n.getToken.bind(Object(d.a)(n)),n}return Object(m.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){this.getToken()}},{key:"getToken",value:function(){var e=new URLSearchParams(window.location.search).get("code");console.log("CODE",e)}},{key:"getLibrary",value:function(e){fetch("https://api.spotify.com/v1/me/tracks?limit=20",{"Access-Control-Allow-Headers":{mode:"no-cors","access-control-allow-origin":"*"},headers:{Authorization:"Bearer ".concat(e)}}).then((function(e){return e.json()})).then((function(e){console.log("tracks data ",e)}))}},{key:"render",value:function(){return o.a.createElement("div",{className:"Song"},o.a.createElement("a",{href:"authEndpoint"},"LINK"))}}]),t}(a.Component));var g=function(){return o.a.createElement("div",{className:"App"},o.a.createElement("header",{className:"App-header"},o.a.createElement("img",{src:f.a,className:"App-logo",alt:"logo"})),o.a.createElement(h,null))};r.a.render(o.a.createElement(g,null),document.getElementById("root"))}],[[10,1,2]]]);
//# sourceMappingURL=main.9c8ec3fb.chunk.js.map