import{p as g,I as A,aU as q,m as D,aC as M,f as H,g as G,C as T,ai as w,o as u,ak as K,aT as L,q as N,t as o,u as U,c as f,b2 as Y,s as P,x as Z,bh as z,P as J,b5 as O,R as Q,E as B,bi as W,ah as X,aD as p,aY as F,K as ee,aZ as le,bj as ae}from"./index.c008f4b7.js";const R=Symbol.for("vuetify:selection-control-group"),_=g({color:String,disabled:{type:Boolean,default:null},defaultsTarget:String,error:Boolean,id:String,inline:Boolean,falseIcon:A,trueIcon:A,ripple:{type:Boolean,default:!0},multiple:{type:Boolean,default:null},name:String,readonly:Boolean,modelValue:null,type:String,valueComparator:{type:Function,default:q},...D(),...M(),...H()},"SelectionControlGroup"),te=g({..._({defaultsTarget:"VSelectionControl"})},"VSelectionControlGroup");G()({name:"VSelectionControlGroup",props:te(),emits:{"update:modelValue":e=>!0},setup(e,i){let{slots:s}=i;const l=T(e,"modelValue"),t=w(),m=u(()=>e.id||`v-selection-control-group-${t}`),d=u(()=>e.name||m.value),a=new Set;return K(R,{modelValue:l,forceUpdate:()=>{a.forEach(n=>n())},onForceUpdate:n=>{a.add(n),L(()=>{a.delete(n)})}}),N({[e.defaultsTarget]:{color:o(e,"color"),disabled:o(e,"disabled"),density:o(e,"density"),error:o(e,"error"),inline:o(e,"inline"),modelValue:l,multiple:u(()=>!!e.multiple||e.multiple==null&&Array.isArray(l.value)),name:d,falseIcon:o(e,"falseIcon"),trueIcon:o(e,"trueIcon"),readonly:o(e,"readonly"),ripple:o(e,"ripple"),type:o(e,"type"),valueComparator:o(e,"valueComparator")}}),U(()=>{var n;return f("div",{class:["v-selection-control-group",{"v-selection-control-group--inline":e.inline},e.class],style:e.style,role:e.type==="radio"?"radiogroup":void 0},[(n=s.default)==null?void 0:n.call(s)])}),{}}});const ne=g({label:String,trueValue:null,falseValue:null,value:null,...D(),..._()},"VSelectionControl");function oe(e){const i=X(R,void 0),{densityClasses:s}=p(e),l=T(e,"modelValue"),t=u(()=>e.trueValue!==void 0?e.trueValue:e.value!==void 0?e.value:!0),m=u(()=>e.falseValue!==void 0?e.falseValue:!1),d=u(()=>!!e.multiple||e.multiple==null&&Array.isArray(l.value)),a=u({get(){const v=i?i.modelValue.value:l.value;return d.value?v.some(r=>e.valueComparator(r,t.value)):e.valueComparator(v,t.value)},set(v){if(e.readonly)return;const r=v?t.value:m.value;let c=r;d.value&&(c=v?[...F(l.value),r]:F(l.value).filter(V=>!e.valueComparator(V,t.value))),i?i.modelValue.value=c:l.value=c}}),{textColorClasses:n,textColorStyles:C}=ee(u(()=>a.value&&!e.error&&!e.disabled?e.color:void 0)),S=u(()=>a.value?e.trueIcon:e.falseIcon);return{group:i,densityClasses:s,trueValue:t,falseValue:m,model:a,textColorClasses:n,textColorStyles:C,icon:S}}const ie=G()({name:"VSelectionControl",directives:{Ripple:Y},inheritAttrs:!1,props:ne(),emits:{"update:modelValue":e=>!0},setup(e,i){let{attrs:s,slots:l}=i;const{group:t,densityClasses:m,icon:d,model:a,textColorClasses:n,textColorStyles:C,trueValue:S}=oe(e),v=w(),r=u(()=>e.id||`input-${v}`),c=P(!1),V=P(!1),b=Z();t==null||t.onForceUpdate(()=>{b.value&&(b.value.checked=a.value)});function k(y){c.value=!0,le(y.target,":focus-visible")!==!1&&(V.value=!0)}function I(){c.value=!1,V.value=!1}function E(y){e.readonly&&t&&ae(()=>t.forceUpdate()),a.value=y.target.checked}return U(()=>{var h,x;const y=l.label?l.label({label:e.label,props:{for:r.value}}):e.label,[$,j]=z(s);return f("div",B({class:["v-selection-control",{"v-selection-control--dirty":a.value,"v-selection-control--disabled":e.disabled,"v-selection-control--error":e.error,"v-selection-control--focused":c.value,"v-selection-control--focus-visible":V.value,"v-selection-control--inline":e.inline},m.value,e.class]},$,{style:e.style}),[f("div",{class:["v-selection-control__wrapper",n.value],style:C.value},[(h=l.default)==null?void 0:h.call(l),J(f("div",{class:["v-selection-control__input"]},[d.value&&f(Q,{key:"icon",icon:d.value},null),f("input",B({ref:b,checked:a.value,disabled:!!(e.readonly||e.disabled),id:r.value,onBlur:I,onFocus:k,onInput:E,"aria-disabled":!!(e.readonly||e.disabled),type:e.type,value:S.value,name:e.name,"aria-checked":e.type==="checkbox"?a.value:void 0},j),null),(x=l.input)==null?void 0:x.call(l,{model:a,textColorClasses:n,textColorStyles:C,props:{onFocus:k,onBlur:I,id:r.value}})]),[[O("ripple"),e.ripple&&[!e.disabled&&!e.readonly,null,["center","circle"]]]])]),y&&f(W,{for:r.value,clickable:!0},{default:()=>[y]})])}),{isFocused:c,input:b}}});export{ie as V,ne as m};