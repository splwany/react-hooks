(this["webpackJsonpreact-hooks"]=this["webpackJsonpreact-hooks"]||[]).push([[0],{14:function(t,e,n){},15:function(t,e,n){},17:function(t,e,n){},19:function(t,e,n){"use strict";n.r(e);var r=n(1),c=n.n(r),a=n(9),o=n.n(a),u=(n(14),n(15),n(4)),i=n.n(u),s=n(8),l=n(2),b=n(6),f=(n(17),n(0));function j(t){return new Promise((function(e,n){var r=new FileReader;r.onloadend=function(t){var n=t.target.result;e(n)},r.onerror=function(t){return n(t)},r.readAsDataURL(t)}))}function d(t){var e=t.map((function(t){return new Promise((function(e,n){var r=new Image;r.src=t,r.onload=function(){var t=document.createElement("canvas");t.setAttribute("width",r.width.toString()),t.setAttribute("height",r.height.toString());var c=t.getContext("2d");null===c||void 0===c||c.drawImage(r,0,0);var a=null===c||void 0===c?void 0:c.getImageData(0,0,t.width,t.height);a?e(a):n("\u56fe\u7247\u8bfb\u53d6\u5931\u8d25")}}))}));return Promise.all(e)}function g(t,e,n){var r=t.data,c=t.width,a=t.height,o=4*c*Math.floor(a*e),u=4*c*Math.floor(a*(1-n)),i=r.subarray(o,u);return new ImageData(i,c)}function h(t){if(0===t.length)return"";var e=t[0].width.toString(),n=[0].concat(Object(b.a)(t.map((function(t){return t.height})))),r=n.reduce((function(t,e){return t+e})).toString(),c=document.createElement("canvas");c.setAttribute("width",e),c.setAttribute("height",r);var a=c.getContext("2d");return t.forEach((function(t,e){null===a||void 0===a||a.putImageData(t,0,n[e])})),c.toDataURL()}var m=function(t){var e,n=t.src,c=t.onChange,a=Object(r.useState)(!1),o=Object(l.a)(a,2),u=o[0],i=o[1],s=Object(r.useState)(0),b=Object(l.a)(s,2),j=b[0],d=b[1],g=Object(r.useState)(0),h=Object(l.a)(g,2),m=h[0],v=h[1],O=Object(r.useState)(!1),p=Object(l.a)(O,2),x=p[0],w=p[1],N=Object(r.useState)(0),y=Object(l.a)(N,2),S=y[0],k=y[1],C=Object(r.useState)(0),R=Object(l.a)(C,2),D=R[0],A=R[1],E=Object(r.useRef)(null),I=Object(r.useRef)(null),M=Object(r.useRef)(null),F=null===(e=M.current)||void 0===e?void 0:e.clientHeight,L=function(t){var e=!1,n=function(){return e=!1};return function(){e||(e=!0,t.apply(void 0,arguments),requestAnimationFrame(n))}}((function(t){if(u){var e=t.pageY-j,n=m+e;n<0?n=0:n>F-D&&(n=F-D),E.current.style.top="".concat(n,"px");var r=n/F,c=1-D/F;M.current.style.background="\n                linear-gradient(to bottom,\n                rgba(0,0,0,0.7) ".concat(100*r,"%,\n                rgba(0,0,0,0) ").concat(100*r,"%,\n                rgba(0,0,0,0) ").concat(100*c,"%,\n                rgba(0,0,0,0.7) ").concat(100*c,"%)")}else if(x){var a=S-t.pageY,o=D+a;o<0?o=0:o>F-m&&(o=F-m),I.current.style.bottom="".concat(o,"px");var i=m/F,s=1-o/F;M.current.style.background="\n                linear-gradient(to bottom,\n                rgba(0,0,0,0.7) ".concat(100*i,"%,\n                rgba(0,0,0,0) ").concat(100*i,"%,\n                rgba(0,0,0,0) ").concat(100*s,"%,\n                rgba(0,0,0,0.7) ").concat(100*s,"%)")}}));return Object(r.useEffect)((function(){var t=function(){var t=E.current.style.top;t=t.substring(0,t.length-2),v(Number(t));var e=I.current.style.bottom;e=e.substring(0,e.length-2),A(Number(e)),(u||x)&&c(Number(t)/F,Number(e)/F),i(!1),w(!1)},e=document.querySelector("body");return e.addEventListener("mouseup",t),function(){e.removeEventListener("mouseup",t)}}),[F,c,u,x]),Object(f.jsxs)("div",{className:"area-selector",onMouseMove:L,children:[Object(f.jsx)("img",{className:"source-image",src:n,alt:"\u56fe\u7247"}),Object(f.jsxs)("div",{className:"area-box",ref:M,children:[Object(f.jsx)("div",{className:"bar top-bar",ref:E,onMouseDown:function(t){i(!0),d(t.pageY)}}),Object(f.jsx)("div",{className:"bar bottom-bar",ref:I,onMouseDown:function(t){w(!0),k(t.pageY)}})]})]})},v=function(){var t=Object(r.useRef)(null),e=Object(r.useRef)(null),n=Object(r.useState)([]),c=Object(l.a)(n,2),a=c[0],o=c[1],u=Object(r.useState)([]),v=Object(l.a)(u,2),O=v[0],p=v[1],x=Object(r.useRef)(null),w=Object(r.useState)(""),N=Object(l.a)(w,2),y=N[0],S=N[1],k=function(){var t=Object(s.a)(i.a.mark((function t(e){var n,r,c,a;return i.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:n=e.target.files,r=[],c=0;case 3:if(!(c<n.length)){t.next=10;break}return a=n[c],t.next=7,j(a).then((function(t){r.push(t)}),(function(t){return console.log(t)}));case 7:++c,t.next=3;break;case 10:S(""),o(r),p(new Array(r.length).fill([0,0]));case 13:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),C=function(){var t=Object(s.a)(i.a.mark((function t(){var e,n,r;return i.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,d(a);case 2:e=t.sent,n=e.map((function(t,e){return g.apply(void 0,[t].concat(Object(b.a)(O[e])))})),r=h(n),S(r);case 6:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return Object(f.jsxs)("div",{className:"image-stitcher",children:[Object(f.jsx)("input",{ref:t,type:"file",multiple:!0,onChange:k}),Object(f.jsxs)("div",{className:"button-group",children:[Object(f.jsx)("button",{className:"select-file-btn",onClick:function(){var e;return null===(e=t.current)||void 0===e?void 0:e.click()},children:"\u9009\u62e9\u56fe\u7247"}),a.length>0&&Object(f.jsxs)("div",{className:"stitch-btn-group",children:[Object(f.jsx)("button",{className:"reset-btn",onClick:function(){S("")},children:"\u91cd\u7f6e"}),Object(f.jsx)("button",{className:"stitch-btn",onClick:C,children:"\u62fc\u63a5"})]})]}),""===y&&Object(f.jsx)("div",{className:"image-list",ref:e,children:a.map((function(t,e){return Object(f.jsx)(m,{src:t,onChange:function(t,n){return function(t,e,n){O[t]=[e,n],p(Object(b.a)(O))}(e,t,n)}},"selector-".concat(e))}))}),""!==y&&Object(f.jsx)("div",{className:"result",children:Object(f.jsx)("img",{className:"result-image",ref:x,src:y,alt:"\u62fc\u63a5\u540e\u7684\u56fe\u7247"})})]})},O=function(){return Object(f.jsx)("div",{className:"app",children:Object(f.jsx)(v,{})})},p=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,20)).then((function(e){var n=e.getCLS,r=e.getFID,c=e.getFCP,a=e.getLCP,o=e.getTTFB;n(t),r(t),c(t),a(t),o(t)}))};o.a.render(Object(f.jsx)(c.a.StrictMode,{children:Object(f.jsx)(O,{})}),document.getElementById("root")),p()}},[[19,1,2]]]);
//# sourceMappingURL=main.ed90658f.chunk.js.map