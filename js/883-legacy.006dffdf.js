"use strict";(self["webpackChunkwordle_mp"]=self["webpackChunkwordle_mp"]||[]).push([[883],{3237:function(t,e,a){a.d(e,{Z:function(){return l}});var n=a(4367),r=(a(9653),a(4944),a(3792),a(7474)),s=a(7342),o=a(6505),i=a(3325),l=(0,i.Z)(s.Z,o.Z,r.Z).extend({name:"v-card",props:{flat:Boolean,hover:Boolean,img:String,link:Boolean,loaderHeight:{type:[Number,String],default:4},raised:Boolean},computed:{classes:function(){return(0,n.Z)((0,n.Z)({"v-card":!0},o.Z.options.computed.classes.call(this)),{},{"v-card--flat":this.flat,"v-card--hover":this.hover,"v-card--link":this.isClickable,"v-card--loading":this.loading,"v-card--disabled":this.disabled,"v-card--raised":this.raised},r.Z.options.computed.classes.call(this))},styles:function(){var t=(0,n.Z)({},r.Z.options.computed.styles.call(this));return this.img&&(t.background='url("'.concat(this.img,'") center center / cover no-repeat')),t}},methods:{genProgress:function(){var t=s.Z.options.methods.genProgress.call(this);return t?this.$createElement("div",{staticClass:"v-card__progress",key:"progress"},[t]):null}},render:function(t){var e=this.generateRouteLink(),a=e.tag,n=e.data;return n.style=this.styles,this.isClickable&&(n.attrs=n.attrs||{},n.attrs.tabindex=0),t(a,this.setBackgroundColor(this.color,n),[this.genProgress(),this.$slots.default])}})},7118:function(t,e,a){a.d(e,{h7:function(){return s},ZB:function(){return i},EB:function(){return l}});var n=a(3237),r=a(4589),s=(0,r.Ji)("v-card__actions"),o=(0,r.Ji)("v-card__subtitle"),i=(0,r.Ji)("v-card__text"),l=(0,r.Ji)("v-card__title");n.Z},4883:function(t,e,a){a.r(e),a.d(e,{default:function(){return T}});var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",[a("div",{staticClass:"grid-container"},[a("transition-group",{attrs:{name:"fade",tag:"p"}},[t._l(t.items,(function(e,n){return a("div",{key:e,staticClass:"item"},[t._v(" "+t._s(n)+" ")])})),t._l(t.players,(function(e){return a("PlayerInfoComponent",{key:e.id,staticClass:"item",class:{secondary:e.id===t.myId},attrs:{player:e,isHost:e.id===t.hostId}})}))],2)],1),a("v-container",{staticStyle:{"max-width":"450px"}},[a("v-row",{staticClass:"my-5 mx-2",attrs:{justify:"end"}},[a("v-text-field",{staticClass:"inline-text-field",attrs:{outlined:"",label:"name",maxlength:"12","hide-details":"auto"},on:{keydown:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.changeName.apply(null,arguments)}},model:{value:t.name,callback:function(e){t.name=e},expression:"name"}},[t._v("Name")]),a("v-btn",{staticClass:"ml-2",attrs:{color:"primary",outlined:"",height:"56","x-large":""},on:{click:t.changeName}},[t._v("Update")])],1),a("v-row",{staticClass:"my-5 mx-2",attrs:{justify:"end"}},[a("v-tooltip",{attrs:{bottom:"",disabled:t.myId===t.hostId},scopedSlots:t._u([{key:"activator",fn:function(e){var n=e.on;return[a("div",t._g({staticClass:"tooltip-helper"},n),[a("v-btn",{staticStyle:{width:"100%"},attrs:{outlined:"",height:"56","x-large":"",color:"primary",disabled:t.myId!==t.hostId},on:{click:t.startGame}},[t._v("Start Game")])],1)]}}])},[a("span",[t._v("Only the host can start the game.")])])],1)],1)],1)},r=[],s=(a(8309),a(144)),o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-card",[a("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(e){var n=e.on,r=e.attrs;return[t.isHost?a("i",t._g(t._b({staticClass:"fas fa-crown",staticStyle:{color:"orange",transform:"rotate(30deg)",position:"absolute",right:"5px",top:"2px"}},"i",r,!1),n)):t._e()]}}])},[a("span",[t._v(t._s(t.player.name)+" is the host.")])]),a("v-card-title",[t._v(t._s(t.player.name))])],1)},i=[],l=s.Z.extend({props:{player:Object,isHost:{type:Boolean,default:!1}}}),c=l,d=a(1001),u=a(3453),m=a.n(u),p=a(3237),h=a(7118),v=a(6053),f=(0,d.Z)(c,o,i,!1,null,"34845ecc",null),y=f.exports;m()(f,{VCard:p.Z,VCardTitle:h.EB,VTooltip:v.Z});var g=a(919),_=a(4229),Z=a(179),k=s.Z.extend({components:{PlayerInfoComponent:y},data:function(){return{items:new Array,name:""}},computed:{players:function(){return Z.x.players},hostId:function(){return _.$.PeerToPeer.getHostId()},myId:function(){return _.$.PeerToPeer.getId()}},methods:{addItem:function(){this.items.push(this.items.length)},changeName:function(){Z.x.changeName({name:this.name,player:(0,g["in"])(Z.x,_.$.PeerToPeer.getId())})},startGame:function(){_.$.PeerToPeer.broadcastAndToSelf({command:"START_GAME"})}}}),x=k,b=a(4345),C=a(9846),I=a(2877),P=a(5337),w=(0,d.Z)(x,n,r,!1,null,"59042842",null),T=w.exports;m()(w,{VBtn:b.Z,VContainer:C.Z,VRow:I.Z,VTextField:P.Z,VTooltip:v.Z})}}]);
//# sourceMappingURL=883-legacy.006dffdf.js.map