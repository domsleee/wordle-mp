"use strict";(self["webpackChunkwordle_mp"]=self["webpackChunkwordle_mp"]||[]).push([[535],{5535:function(e,t,n){n.r(t),n.d(t,{default:function(){return _}});var o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-container",{staticStyle:{"max-width":"450px"}},[n("v-row",{staticClass:"mx-2 my-5",attrs:{justify:"end"}},[n("v-btn",{attrs:{block:"",loading:e.createLoading,disabled:e.createLoading,color:"primary",outlined:"",height:"56","x-large":""},on:{click:function(t){return e.createGame()}},scopedSlots:e._u([{key:"loader",fn:function(){return[n("span",[e._v("Loading...")])]},proxy:!0}])},[e._v(" Create Game ")])],1),n("v-row",{staticClass:"mx-2 my-5",scopedSlots:e._u([{key:"loader",fn:function(){return[n("span",[e._v("Loading...")])]},proxy:!0}])},[n("v-text-field",{staticStyle:{width:"0px"},attrs:{label:"lobby code",height:"34","hide-details":"auto",outlined:""},on:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.joinGame.apply(null,arguments)}},model:{value:e.lobbyCode,callback:function(t){e.lobbyCode=t},expression:"lobbyCode"}}),n("v-tooltip",{attrs:{bottom:"",disabled:""!=e.lobbyCode},scopedSlots:e._u([{key:"activator",fn:function(t){var o=t.on;return[n("div",e._g({staticClass:"tooltip-helper",staticStyle:{"flex-grow":"inherit"}},o),[n("v-btn",{staticClass:"ma-0 ml-1",staticStyle:{"flex-grow":"inherit"},attrs:{loading:e.joinLoading,disabled:e.joinLoading||""===e.lobbyCode,color:"primary",outlined:"",height:"56","x-large":""},on:{click:e.joinGame}},[e._v("Join game ")])],1)]}}])},[n("span",[e._v("Enter a lobby code to join.")])])],1)],1)},r=[],i=n(6198),a=(n(5666),n(144)),s=n(6226),c=n(4229),l=n(919),d=n(2043),u=n(1062),p=n(179),b=(0,d.getLogger)("home-view"),g=a.Z.extend({name:"HomeView",mounted:function(){var e,t;null===(e=c.$.GameClient)||void 0===e||null===(t=e.destroy)||void 0===t||t.call(e),p.x.reset()},data:function(){return{createLoading:!1,joinLoading:!1,lobbyCode:""}},methods:{createGame:function(){var e=(0,i.Z)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!this.createLoading){e.next=2;break}return e.abrupt("return");case 2:return this.confirmAndResetGame(),this.createLoading=!0,e.prev=4,e.next=7,c.$.PeerToPeer.setupAsHost();case 7:c.$.registerGameHost(),this.gotoLobby(),e.next=16;break;case 11:throw e.prev=11,e.t0=e["catch"](4),u.F.raiseNotification({type:"error",msg:"unable to create game",error:e.t0}),this.createLoading=!1,e.t0;case 16:case"end":return e.stop()}}),e,this,[[4,11]])})));function t(){return e.apply(this,arguments)}return t}(),joinGame:function(){var e=(0,i.Z)(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!this.joinLoading){e.next=2;break}return e.abrupt("return");case 2:return this.confirmAndResetGame(),this.joinLoading=!0,t=this.lobbyCode,e.prev=5,e.next=8,c.$.PeerToPeer.setupByConnectingToId(t);case 8:this.gotoLobby(),e.next=16;break;case 11:throw e.prev=11,e.t0=e["catch"](5),u.F.raiseNotification({type:"error",msg:'unable to join lobby code "'.concat(t,'"'),error:e.t0}),this.joinLoading=!1,e.t0;case 16:case"end":return e.stop()}}),e,this,[[5,11]])})));function t(){return e.apply(this,arguments)}return t}(),confirmAndResetGame:function(){c.$.PeerToPeer.getIsConnected()&&b.warn("overriding existing game"),p.x.reset(),c.$.PeerToPeer.dispose()},gotoLobby:function(){c.$.registerGameClient(),p.x.addPlayer((0,l.tj)(c.$.PeerToPeer.getId())),s.C.push("/lobby/"+c.$.PeerToPeer.getId())}}}),m=g,f=n(1001),h=n(3453),y=n.n(h),v=n(4345),x=n(9846),w=n(2877),k=n(5337),C=n(6053),L=(0,f.Z)(m,o,r,!1,null,"38ff0128",null),_=L.exports;y()(L,{VBtn:v.Z,VContainer:x.Z,VRow:w.Z,VTextField:k.Z,VTooltip:C.Z})}}]);
//# sourceMappingURL=535-legacy.b0c03250.js.map