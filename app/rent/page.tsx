'use client';
import Link from "next/link";
import {useEffect,useState} from "react";
import {supabase} from "../../lib/supabase";

function RentalCard({x}:{x:any}){
 const min=Math.max(1,Number(x.min_days||1));
 const [days,setDays]=useState(min);
 const base=Math.max(0,Number(x.price||0));
 const monthly=Math.max(0,Number(x.monthly_price||0));
 const total=base*days;
 const imgs=(x.website_offer_images||[]).filter((im:any)=>im?.image_url).sort((a:any,b:any)=>Number(a.sort_order||0)-Number(b.sort_order||0));
 const [photo,setPhoto]=useState(0);
 useEffect(()=>{if(imgs.length<2)return;const t=setInterval(()=>setPhoto(v=>(v+1)%imgs.length),3000);return()=>clearInterval(t)},[imgs.length]);
 return <article className="rentalCard">
  {imgs.length?<div className="rentalGallery"><img src={imgs[photo]?.image_url} alt={x.title}/>{imgs.length>1&&<><button className="prev" onClick={()=>setPhoto((photo-1+imgs.length)%imgs.length)}>‹</button><button className="next" onClick={()=>setPhoto((photo+1)%imgs.length)}>›</button></>}</div>:<div className="preview">WEBSITE PREVIEW</div>}
  <div className="offerMeta"><span>{x.category}</span><span>{x.status}</span></div><h2>{x.title}</h2><p>{x.description}</p>
  {x.perfect_for?.length>0&&<div className="perfectFor"><b>Perfect for</b><p>{x.perfect_for.join(" · ")}</p></div>}
  {x.features?.length>0&&<p className="offerFeatures">{x.features.join(" · ")}</p>}
  <div className="rentalOptions">
   <div><b>Pay per day</b><strong>€{base.toFixed(2)} / day</strong><label>How many days?<input type="number" min={min} value={days} onChange={e=>setDays(Math.max(min,Number(e.target.value)||min))}/></label><small>Exact calculation: {days} × €{base.toFixed(2)}</small><h3>Total: €{total.toFixed(2)}</h3><div className="actions"><a href={`mailto:morfitisantonis@gmail.com?subject=Rent ${encodeURIComponent(x.title)} for ${days} days&body=Daily rental total: €${total.toFixed(2)}`}>Rent for {days} days →</a></div></div>
   {monthly>0&&<div><b>Monthly subscription</b><strong>€{monthly.toFixed(2)} / month</strong><p>Fixed monthly price. This price is independent from the daily rental rate.</p>{base>0&&monthly<base*30&&<p className="priceGood">Save €{(base*30-monthly).toFixed(2)} vs 30 days at the daily rate.</p>}<div className="actions"><a href={`mailto:morfitisantonis@gmail.com?subject=Monthly subscription - ${encodeURIComponent(x.title)}&body=Monthly subscription: €${monthly.toFixed(2)} per month`}>Choose monthly →</a></div></div>}
  </div>
  <div className="actions">{x.demo_url&&<a href={x.demo_url} target="_blank" rel="noreferrer">Live Demo →</a>}</div>
 </article>
}
export default function Page(){
 const [items,setItems]=useState<any[]>([]);
 useEffect(()=>{let active=true;async function load(){const {data}=await supabase.from("website_offers").select("*,website_offer_images(*)").eq("offer_type","rent").eq("published",true).order("sort_order");if(active)setItems((data||[]).map((x:any)=>({...x,website_offer_images:(x.website_offer_images||[]).filter((im:any)=>im?.image_url)})))}load();const channel=supabase.channel("rental-live").on("postgres_changes",{event:"*",schema:"public",table:"website_offer_images"},load).on("postgres_changes",{event:"*",schema:"public",table:"website_offers"},load).subscribe();return()=>{active=false;supabase.removeChannel(channel)}},[]);
 return <main className="listing"><p className="eyebrow">READY-MADE WEBSITES</p><h1>Rent a Website</h1><p>Choose pay-per-day rental for the exact number of days you need, or select the separate fixed monthly subscription.</p><div className="grid">{items.length===0?<article><h2>Coming soon</h2><p>New websites will appear here when published from the admin.</p></article>:items.map(x=><RentalCard key={x.id} x={x}/>)}</div><Link href="/">← Back to portfolio</Link></main>
}