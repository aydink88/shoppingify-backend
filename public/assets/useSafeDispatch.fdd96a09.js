import{r}from"./vendor.f851533e.js";globalThis.jotaiAtomCache=globalThis.jotaiAtomCache||{cache:new Map,get(e,t){return this.cache.has(e)?this.cache.get(e):(this.cache.set(e,t),t)}};function s(e){const t=r.exports.useRef(!1);return r.exports.useLayoutEffect(()=>(t.current=!0,()=>{t.current=!1}),[]),r.exports.useCallback((...a)=>t.current?e(...a):void 0,[e])}export{s as u};