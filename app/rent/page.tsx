'use client';
import Link from "next/link";
import {useEffect,useState} from "react";
import {supabase} from "../../lib/supabase";

function RentalCard({x}:any){
 const min=Math.max(1,Number(x.min_days||1));
 const [days,setDays]=useState(min);
 const base=Number(x.price||0);
 const discount=days>=30?Number(x.discount_30_days||0):days>=10?Number(x.discount_10_days||0):0;
 const daily=base*(1-discount/100);
 const total=daily*days;
 const imgs=(x.website_offer_images||[]).sort((a:any,b:any)=>a.sort_order-b.sort_order);
 const [photo,setPhoto]=useState(0);
 useEffect(()=>{if(imgs.length<2)return;const t=setInterval(()=>setPhoto(v=>(v+1)%imgs.length),3000);return()=>clearInterval(t)},[imgs.length]);
 return <article className="rentalCard">
  {imgs.length?<div className="rentalGallery"><img src={imgs[photo]?.image_url} alt={x.title}/>{imgs.length>1&&<><button className="prev" onClick={()=>setPhoto((photo-1+imgs.length)%imgs.length)}>‹</button><button className="next" onClick={()=>setPhoto((photo+1)%imgs.length)}>›</button></>}</div>:<div className="preview">WEBSITE PREVIEW</div>}
  <div className="offerMeta"><span>{x.category}</span><span>{x.status}</span></div><h2>{x.title}</h2><p>{x.description}</p>
  {x.perfect_for?.length>0&&<div className="perfectFor"><b>Perfect for</b><p>{x.perfect_for.join(" · ")}</p></div>}
  {x.features?.length>0&&<p className="offerFeatures">{x.features.join(" · ")}</p>}
  <div className="rentalOptions"><div><b>Flexible rental</b><strong>€{base.toFixed(2)} / day</strong><label>How many days?<input type="number" min={min} value={days} onChange={e=>setDays(Math.max(min,Number(e.target.value)||min))}/></label>{discount>0&&<small>{discount}% long-stay discount applied</small>}<h3>Total: €{total.toFixed(2)}</h3></div>{x.monthly_price!=null&&<div><b>Permanent customer</b><strong>€{Number(x.monthly_price).toFixed(2)} / month</strong><p>Monthly subscription for continuous use.</p></div>}</div>
  <div className="actions">{x.demo_url&&<a href={x.demo_url} target="_blank" rel="noreferrer">Live Demo →</a>}<a href={`mailto:morfitisantonis@gmail.com?subject=Rent ${encodeURIComponent(x.title)} for ${days} days&body=Rental total: €${total.toFixed(2)}`}>Rent this website →</a></div>
 </article>
}
export default function Page(){
 const [items,setItems]=useState<any[]>([]);
 useEffect(()=>{supabase.from("website_offers").select("*,website_offer_images(*)").eq("offer_type","rent").eq("published",true).order("sort_order").then(({data})=>setItems(data||[]))},[]);
 return <main className="listing"><p className="eyebrow">READY-MADE WEBSITES</p><h1>Rent a Website</h1><p>Choose exactly how many days you need a website, or use a monthly plan for continuous use. Your total is calculated automatically.</p><div className="grid">{items.length===0?<article><h2>Coming soon</h2><p>New websites will appear here when published from the admin.</p></article>:items.map(x=><RentalCard key={x.id} x={x}/>)}</div><Link href="/">← Back to portfolio</Link></main>
}