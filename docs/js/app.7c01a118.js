(function(e){function n(n){for(var r,i,s=n[0],c=n[1],u=n[2],d=0,f=[];d<s.length;d++)i=s[d],o[i]&&f.push(o[i][0]),o[i]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(e[r]=c[r]);l&&l(n);while(f.length)f.shift()();return a.push.apply(a,u||[]),t()}function t(){for(var e,n=0;n<a.length;n++){for(var t=a[n],r=!0,s=1;s<t.length;s++){var c=t[s];0!==o[c]&&(r=!1)}r&&(a.splice(n--,1),e=i(i.s=t[0]))}return e}var r={},o={app:0},a=[];function i(n){if(r[n])return r[n].exports;var t=r[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,i),t.l=!0,t.exports}i.m=e,i.c=r,i.d=function(e,n,t){i.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,n){if(1&n&&(e=i(e)),8&n)return e;if(4&n&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(i.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)i.d(t,r,function(n){return e[n]}.bind(null,r));return t},i.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(n,"a",n),n},i.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},i.p="/20190804_three_js_and_vue_ts/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],c=s.push.bind(s);s.push=n,s=s.slice();for(var u=0;u<s.length;u++)n(s[u]);var l=c;a.push([0,"chunk-vendors"]),t()})({0:function(e,n,t){e.exports=t("cd49")},"034f":function(e,n,t){"use strict";var r=t("64a9"),o=t.n(r);o.a},"64a9":function(e,n,t){},cd49:function(e,n,t){"use strict";t.r(n);t("cadf"),t("551c"),t("f751"),t("097d");var r=t("2b0e"),o=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{attrs:{id:"app"}},[t("p",[e._v("ver 20190806 2224 test")]),t("div",[t("label",{attrs:{for:"speed"}},[e._v("speed")]),t("input",{directives:[{name:"model",rawName:"v-model.number",value:e.speed,expression:"speed",modifiers:{number:!0}}],attrs:{name:"speed",id:"speed",type:"range",min:"0.000",max:"0.1",step:"0.005"},domProps:{value:e.speed},on:{__r:function(n){e.speed=e._n(n.target.value)},blur:function(n){return e.$forceUpdate()}}})]),t("ThreeView",{attrs:{speed:e.speed}})],1)},a=[],i=t("d225"),s=t("b0b4"),c=t("308d"),u=t("6bb5"),l=t("4e2b"),d=t("9ab4"),f=t("60a3"),p=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("canvas",{attrs:{id:"canvas",width:"600",height:"400"}})},h=[],v=t("5a89"),b=t("34ad"),g=function(e){function n(){var e;return Object(i["a"])(this,n),e=Object(c["a"])(this,Object(u["a"])(n).apply(this,arguments)),e.speed=.02,e.scene=new v["Y"],e.camera=new v["P"](75,1.5,.1,1e3),e.light=new v["i"](16777215),e.cube=null,e}return Object(l["a"])(n,e),Object(s["a"])(n,[{key:"mounted",value:function(){var e=this,n=document.getElementById("canvas");this.renderer=new v["lb"]({antialias:!0,canvas:n}),this.camera.position.set(0,0,2),this.light.position.set(0,0,10),this.scene.add(this.light);var t=new v["c"](.3,.3,.3),r=new v["G"];this.cube=new v["E"](t,r),this.scene.add(this.cube);var o=new b["a"];o.load("./gltfs/third-chan_ver20190729-onemesh.gltf",function(n){var t=n.scene;e.scene.add(t)},function(e){console.log("progress: ".concat(Math.floor(e.loaded/e.total*100),"%"))},function(e){console.error("error : ",e)}),this.animate()}},{key:"animate",value:function(){requestAnimationFrame(this.animate),this.cube.rotation.x+=this.speed,this.cube.rotation.y+=this.speed,this.renderer.render(this.scene,this.camera)}}]),n}(f["c"]);d["a"]([Object(f["b"])()],g.prototype,"speed",void 0),g=d["a"]([f["a"]],g);var m=g,w=m,j=t("2877"),y=Object(j["a"])(w,p,h,!1,null,null,null),_=y.exports,O=function(e){function n(){var e;return Object(i["a"])(this,n),e=Object(c["a"])(this,Object(u["a"])(n).apply(this,arguments)),e.speed=.02,e}return Object(l["a"])(n,e),Object(s["a"])(n,[{key:"mounted",value:function(){}}]),n}(f["c"]);O=d["a"]([Object(f["a"])({components:{ThreeView:_}})],O);var k=O,x=k,P=(t("034f"),Object(j["a"])(x,o,a,!1,null,null,null)),S=P.exports,E=t("9483");Object(E["a"])("".concat("/20190804_three_js_and_vue_ts/","service-worker.js"),{ready:function(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered:function(){console.log("Service worker has been registered.")},cached:function(){console.log("Content has been cached for offline use.")},updatefound:function(){console.log("New content is downloading.")},updated:function(){console.log("New content is available; please refresh.")},offline:function(){console.log("No internet connection found. App is running in offline mode.")},error:function(e){console.error("Error during service worker registration:",e)}}),r["a"].config.productionTip=!1,new r["a"]({render:function(e){return e(S)}}).$mount("#app")}});
//# sourceMappingURL=app.7c01a118.js.map