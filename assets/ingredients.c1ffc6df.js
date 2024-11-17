import{ay as J,a2 as O,x as m,z as P,a4 as p,a5 as y,ar as s,aa as u,c as n,a6 as r,bp as L,ad as _,aB as S,a9 as T,aw as U,at as h,ab as A,ac as M,a7 as D}from"./index.c008f4b7.js";import{_ as z}from"./deleteModal.554ad063.js";import{c as R,b as j}from"./VList.33efd938.js";import{V as G,a as H,b as K,c as Q,d as W}from"./VTable.3082b37a.js";import{V as X}from"./VForm.94c3fd6c.js";import{V as Y,a as q}from"./VRow.728c9e3d.js";import{V as Z}from"./VSelect.764374fb.js";import"./ssrBoot.472001c1.js";/* empty css              */import"./VSelectionControl.b676dcd8.js";import"./VChip.563f6689.js";const ee={class:"text-h2"},te={class:"d-flex flex-row flex-wrap"},le=s("th",null,null,-1),fe={__name:"ingredients",setup(ie){const{t:o}=J(),f=O(),d=m({visible:!1}),x=m(),i=m({expiresUnit:"minute",expiresAmount:0}),k=m(null),c=m(!1),V={required:e=>e?!0:o("forms.required")};m(!1),m(0),m("minute");const v={minute:6e4,hour:36e5,day:864e5};async function C(){if(await k.value.validate(),!c)return;let e=JSON.parse(JSON.stringify(i.value));if(e.limit=Number(e.limit),e.expires=E(),delete e.expiresAmount,delete e.expiresUnit,i.value.id){let t=Number(e.id);delete e.id,f.update("categories",t,e),d.value={visible:!0,type:"success",title:o("settings.ingredients.changes_saved_title"),message:o("settings.ingredients.changes_saved_text")}}else f.add("categories",e),d.value={visible:!0,type:"success",title:o("settings.ingredients.ingredient_added_title"),message:o("settings.ingredients.ingredient_added_text")};i.value={}}function B(e,t){i.value=JSON.parse(JSON.stringify(e)),i.value.id=t,x.value=0}function w(e){let t,l,a=["minute","hour","day"],g=0;for(let N in a)if(v[a[N]]>e.expires){g=Math.max(0,N-1);break}t=a[g];let $=0,b=Number(e.expires.toString());for(;b>v[a[g]];)$++,b-=v[a[g]];return b>0&&($+=b/v[a[g]]),l=$,[l,t]}function E(){return v[i.value.expiresUnit]*i.value.expiresAmount}function F(e){let[t,l]=w(e),a=t!=1?"s":"";return`${t} ${l}${a}`}P(i,(e,t)=>{if(i.value.expires!==void 0){let[l,a]=w(i.value);i.value.expiresAmount=l,i.value.expiresUnit=a}});function I(e){try{f.remove("categories",e),d.value={visible:!0,type:"success",title:o("settings.ingredients.ingredient_deleted_success_title"),message:o("settings.ingredients.ingredient_deleted_success_text")},i.value={}}catch(t){d.value={visible:!0,type:"error",title:o("settings.ingredients.ingredient_deleted_fail_title"),message:t}}}return(e,t)=>(p(),y(_,null,[s("h1",ee,u(e.$t("settings.ingredients.title")),1),s("p",null,u(e.$t("settings.ingredients.p1")),1),s("p",null,u(e.$t("settings.ingredients.p2")),1),n(R,null,{default:r(()=>[(p(!0),y(_,null,S([{subtitle:e.$t("settings.ingredients.name"),title:"Ibuprofen"},{subtitle:e.$t("settings.ingredients.limit"),title:"800"},{subtitle:e.$t("settings.ingredients.in_body"),title:e.$t("settings.ingredients.6_hour_example")}],(l,a)=>(p(),A(j,{key:a,title:l.title,subtitle:l.subtitle},null,8,["title","subtitle"]))),128))]),_:1}),s("p",null,u(e.$t("settings.ingredients.p3")),1),n(G,{class:"mt-2",modelValue:x.value,"onUpdate:modelValue":t[6]||(t[6]=l=>x.value=l)},{default:r(()=>[n(K,null,{default:r(()=>[n(Q,null,{default:r(()=>[T(u(e.$t("settings.ingredients.edit_add")),1)]),_:1}),n(W,null,{default:r(()=>[n(X,{ref_key:"categoryForm",ref:k,modelValue:c.value,"onUpdate:modelValue":t[5]||(t[5]=l=>c.value=l)},{default:r(()=>[n(U,{label:e.$t("settings.ingredients.name"),modelValue:i.value.name,"onUpdate:modelValue":t[0]||(t[0]=l=>i.value.name=l),rules:[V.required]},null,8,["label","modelValue","rules"]),n(U,{label:e.$t("settings.ingredients.limit")+" (mg)",modelValue:i.value.limit,"onUpdate:modelValue":t[1]||(t[1]=l=>i.value.limit=l),type:"number",min:"0",rules:[V.required]},null,8,["label","modelValue","rules"]),n(Y,null,{default:r(()=>[n(q,{cols:"6"},{default:r(()=>[n(U,{label:e.$t("settings.ingredients.in_body"),modelValue:i.value.expiresAmount,"onUpdate:modelValue":t[2]||(t[2]=l=>i.value.expiresAmount=l),type:"number",min:"0",rules:[V.required]},null,8,["label","modelValue","rules"])]),_:1}),n(q,{cols:"6"},{default:r(()=>[n(Z,{items:[{title:e.$t("settings.ingredients.minutes"),value:"minute"},{title:e.$t("settings.ingredients.hours"),value:"hour"},{title:e.$t("settings.ingredients.days"),value:"day"}],modelValue:i.value.expiresUnit,"onUpdate:modelValue":t[3]||(t[3]=l=>i.value.expiresUnit=l),class:"mx-1",rules:[V.required]},null,8,["items","modelValue","rules"])]),_:1})]),_:1}),s("div",te,[n(h,{onClick:C,color:"blue","prepend-icon":"mdi-content-save",style:{"flex-grow":"3"}},{default:r(()=>[T(u(e.$t("settings.ingredients.save_action")),1)]),_:1}),i.value.id?(p(),A(z,{key:0,style:{"flex-grow":"1","margin-left":"4px"},onDelete:t[4]||(t[4]=l=>I(i.value.id))})):M("",!0)])]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),n(L,{modelValue:d.value.visible,"onUpdate:modelValue":t[7]||(t[7]=l=>d.value.visible=l),type:d.value.type,title:d.value.title,text:d.value.message,class:"my-2",closable:""},null,8,["modelValue","type","title","text"]),n(H,{hover:""},{default:r(()=>[s("thead",null,[s("tr",null,[s("th",null,u(e.$t("settings.ingredients.name")),1),s("th",null,u(e.$t("settings.ingredients.limit")),1),s("th",null,u(e.$t("settings.ingredients.period")),1),le])]),s("tbody",null,[(p(!0),y(_,null,S(D(f).categories,(l,a)=>(p(),y("tr",{key:a},[s("td",null,u(l.name),1),s("td",null,u(l.limit)+" mg",1),s("td",null,u(F(l)),1),s("td",null,[n(h,{color:"blue",variant:"plain",icon:"mdi-square-edit-outline",onClick:g=>B(l,a)},null,8,["onClick"])])]))),128))])]),_:1})],64))}};export{fe as default};