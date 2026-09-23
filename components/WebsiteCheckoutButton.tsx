'use client';
import {useState} from 'react';

export default function WebsiteCheckoutButton({offerId,type,days,label}:{offerId:string,type:'daily'|'monthly'|'buy',days?:number,label:string}){
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 async function checkout(){
  setBusy(true);setError('');
  try{
   const r=await fetch('/api/website-checkout',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({offerId,checkoutType:type,days})});
   const d=await r.json();
   if(!r.ok||!d.url){setError(d.error||'Unable to start payment.');setBusy(false);return}
   window.location.href=d.url;
  }catch{setError('Unable to start payment. Please try again.');setBusy(false)}
 }
 return <div className="websiteCheckout"><button type="button" className="pricingBuyButton" onClick={checkout} disabled={busy}>{busy?'OPENING SECURE CHECKOUT…':label}</button>{error&&<small className="checkoutError">{error}</small>}</div>;
}
