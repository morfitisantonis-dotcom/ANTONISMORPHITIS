'use client';
import {useState} from 'react';

export default function CourseBuyButton({courseId}:{courseId:string}){
 const [open,setOpen]=useState(false),[code,setCode]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function checkout(){
  setBusy(true);setError('');
  try{
   const r=await fetch('/api/course-checkout',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({courseId,code})});
   const d=await r.json();
   if(!r.ok||!d.url){setError(d.error||'Unable to start payment.');setBusy(false);return}
   window.location.href=d.url;
  }catch{setError('Unable to start payment. Please try again.');setBusy(false)}
 }
 return <div className="courseCheckout">
  <button type="button" className="buyCourse" onClick={()=>setOpen(true)}>BUY THIS PROGRAM →</button>
  {open&&<div className="courseCodeBox"><b>Purchase access code</b><p>Enter the temporary code provided by the administrator to continue to secure payment.</p><input autoFocus value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="AM-XXXX-XXXX"/><div><button type="button" onClick={checkout} disabled={busy||!code.trim()}>{busy?'CHECKING…':'CONTINUE TO PAYMENT →'}</button><button type="button" className="codeCancel" onClick={()=>{setOpen(false);setError('')}}>Cancel</button></div>{error&&<small className="checkoutError">{error}</small>}</div>}
 </div>
}
