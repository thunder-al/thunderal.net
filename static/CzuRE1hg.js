import{r as y,d as x,u as T,s as j,o as k,a as D,c as O,h as A,b as F,e as G,f as L,g as B}from"./vendor-dKczY4EO.js";import{S as E,W as I,P as N,V as m,a as V,D as W,C,b as X,M,c as Y,B as q,d as H}from"./treejs-CjWA-ERS.js";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function t(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(o){if(o.ep)return;o.ep=!0;const n=t(o);fetch(o.href,n)}})();function K(){const e=new Map;function r(n,s){e.has(n)||e.set(n,[]),e.get(n).push(s)}function t(n,s){if(!e.has(n))return;const a=e.get(n),l=a.indexOf(s);l!==-1&&a.splice(l,1)}function i(n,s){if(!e.has(n))return;const a=e.get(n);for(const l of a)l(s)}function o(){e.clear()}return{on:r,off:t,dispatch:i,destroy:o}}function U(e){const r=new E,t=new I({canvas:e,alpha:!0}),i=K(),o=y({}),n=y(e.getBoundingClientRect()),s=new ResizeObserver(()=>{const c=e.getBoundingClientRect();n.value=c,t.setPixelRatio(window.devicePixelRatio),t.setSize(c.width,c.height,!1),i.dispatch("canvasResize",c)});s.observe(e);let a=null;function l(c){a=c}function p(c=90){if(a)return a;const d=new N(c);return l(d),d.aspect=n.value.width/n.value.height,d.updateProjectionMatrix(),i.on("canvasResize",f=>{d.aspect=f.width/f.height,d.updateProjectionMatrix()}),d}function u(c){a&&(i.dispatch("render",c),t.render(r,a))}function v(){t.setAnimationLoop(u)}function P(){i.dispatch("destroy",null),s.disconnect(),t.dispose(),i.destroy()}const g={scene:r,canvasEl:e,renderer:t,render:u,startRenderCycle:v,setCamera:l,get camera(){return a},destroy:P,createPerspectiveCamera:p,canvasProps:o,canvasInfo:n,events:i,use:h};function h(c){return c(g)}return g}function Z(e){return x({setup(){const r=T("canvas"),t=j();k(()=>{t.value=U(r.value),e(t.value),t.value.startRenderCycle()}),D(()=>{t.value&&t.value.destroy()});const i=O(()=>{var o,n;return((n=(o=t.value)==null?void 0:o.canvasProps)==null?void 0:n.value)??{}});return()=>A("canvas",{ref:"canvas",...i.value})}})}function z(e){return function(t){return function(o){const n=[];function s(){for(const u of n)u()}function a(u){n.push(u)}const l=Object.assign(Object.create(o),{destroy:s,onDestroy:a});return{payload:e(l,t),ctx:l}}}}function S(e){return e*(Math.PI/180)}const J=z((e,r)=>{const t=new AbortController,i=e.camera;if(!i)return;const o=r.center??new m(0,0,0),n=i.position.clone(),s=n.distanceTo(o);e.canvasEl.addEventListener("mousemove",a=>{if(!i)return;const{clientX:l,clientY:p}=a,{width:u,height:v}=e.canvasInfo.value,P=(l-u/2)/u,g=(p-v/2)/v,h=r.maxAngle??S(45),c=-P*h,d=g*h,f=s/2,b=f*Math.sin(c)+n.x,_=f*Math.sin(d)+n.y,R=f*Math.cos(c)*Math.cos(d)+n.z;i.position.set(b,_,R),i.lookAt(o)},{signal:t.signal}),e.onDestroy(()=>t.abort())}),Q=`varying vec3 localPosition;
varying vec4 worldPosition;

uniform vec3 worldCamProjPosition;
uniform vec3 worldPlanePosition;
uniform float fadeDistance;
uniform bool infiniteGrid;
uniform bool followCamera;

void main() {
    localPosition = position.xzy;
    if (infiniteGrid) localPosition *= 1.0 + fadeDistance;

    worldPosition = modelMatrix * vec4(localPosition, 1.0);
    if (followCamera) {
        worldPosition.xyz += (worldCamProjPosition - worldPlanePosition);
        localPosition = (inverse(modelMatrix) * worldPosition).xyz;
    }

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}`,$=`varying vec3 localPosition;
varying vec4 worldPosition;

uniform vec3 worldCamProjPosition;
uniform float cellSize;
uniform float sectionSize;
uniform vec3 cellColor;
uniform vec3 sectionColor;
uniform float fadeDistance;
uniform float fadeStrength;
uniform float fadeFrom;
uniform float cellThickness;
uniform float sectionThickness;

float getGrid(float size, float thickness) {
    vec2 r = localPosition.xz / size;
    vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
    float line = min(grid.x, grid.y) + 1.0 - thickness;
    return 1.0 - min(line, 1.0);
}

void main() {
    float g1 = getGrid(cellSize, cellThickness);
    float g2 = getGrid(sectionSize, sectionThickness);

    vec3 from = worldCamProjPosition * vec3(fadeFrom);
    float dist = distance(from, worldPosition.xyz);
    float d = 1.0 - min(dist / fadeDistance, 1.0);
    vec3 color = mix(cellColor, sectionColor, min(1.0, sectionThickness * g2));

    gl_FragColor = vec4(color, (g1 + g2) * pow(d, fadeStrength));
    gl_FragColor.a = mix(0.75 * gl_FragColor.a, gl_FragColor.a, g2);
    if (gl_FragColor.a <= 0.0) discard;

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}`,w=new V({uniforms:{cellSize:{value:.5},sectionSize:{value:1},fadeDistance:{value:100},fadeStrength:{value:1},fadeFrom:{value:1},cellThickness:{value:.5},sectionThickness:{value:1},cellColor:{value:new C("#000000")},sectionColor:{value:new C("#0000ff")},infiniteGrid:{value:!0},followCamera:{value:!1},worldCamProjPosition:{value:new m},worldPlanePosition:{value:new m}},vertexShader:Q,fragmentShader:$,side:W,transparent:!0}),ee=z(e=>{const r=new X(1,1),t=new M(r,w);e.scene.add(t),e.onDestroy(()=>{e.scene.remove(t)});const i=new Y,o=new m(0,1,0),n=new m(0,0,0);function s(){i.setFromNormalAndCoplanarPoint(o,n).applyMatrix4(t.matrixWorld);const a=w.uniforms.worldCamProjPosition,l=w.uniforms.worldPlanePosition;i.projectPoint(e.camera.position,a.value),l.value.set(0,0,0).applyMatrix4(t.matrixWorld)}e.events.on("render",s)}),ne=Z(e=>{e.canvasProps.value.style={width:"100vw",height:"100vh"};const r=e.createPerspectiveCamera();r.position.x=0,r.position.y=6,r.position.z=5,r.lookAt(new m(0,0,0));const t=new q(1,1,1),i=new H({color:65280}),o=new M(t,i);e.scene.add(o),e.use(J({maxAngle:S(15)})),e.use(ee(null))}),oe=x({__name:"Root",setup(e){return(r,t)=>(G(),F(L(ne)))}});function te(){const e=document.getElementById("app");if(e)return e;const r=document.createElement("div");return r.id="app",document.body.appendChild(r),r}const re=te(),ie=B(oe);ie.mount(re);
