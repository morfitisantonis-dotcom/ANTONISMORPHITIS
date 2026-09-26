"use client";
import {useState} from "react";

export default function MentoringJoinButton({plan,label}:{plan:"social-action"|"community-growth",label:string}){
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState("");
 const start=async()=>{
  setLoading(true);setError("");
  try{
   const res=await fetch("/api/mentoring-checkout",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({plan})});
   const data=await res.json();
   if(!res.ok||!data.url) throw new Error(data.error||"Unable to start checkout.");
   window.location.href=data.url;
  }catch(e:any){setError(e?.message||"Unable to start checkout.");setLoading(false)}
 };
 return <div className="mentoringJoinWrap"><button className="mentoringCta" type="button" onClick={start} disabled={loading}>{loading?"Opening secure checkout…":label}</button>{error&&<small className="mentoringCheckoutError">{error}</small>}</div>;
}
