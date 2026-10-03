import Link from "next/link";
import {supabase} from "../../lib/supabase";
import RentalCheckout from "../../components/RentalCheckout";
export const revalidate=0;
export const metadata={title:"Rent a Website",description:"Ready websites available for daily rental or monthly subscription."};

export default async function Page(){
 const {data}=await supabase.from("website_offers").select("*,website_offer_images(*)").eq("offer_type","rent").eq("published",true).order("sort_order");
 const items=data||[];
 return <main className="listing"><p className="eyebrow">READY TO USE</p><h1>Rent a Website</h1><p>Choose a ready website and rent it by the day, or use the monthly subscription option when available.</p><div className="grid">{items.length===0?<article><h2>Coming soon</h2><p>Rental websites will appear here when published from the admin.</p></article>:items.map((x:any)=>{const imgs=(x.website_offer_images||[]).sort((a:any,b:any)=>a.sort_order-b.sort_order);return <article key={x.id}>{imgs[0]?<img className="offerImage" src={imgs[0].image_url} alt={x.title}/>:x.image_url?<img className="offerImage" src={x.image_url} alt={x.title}/>:<div className="preview">WEBSITE PREVIEW</div>}<div className="offerMeta"><span>{x.category}</span><span>{x.status}</span></div><h2>{x.title}</h2><p>{x.description}</p>{x.perfect_for?.length>0&&<p className="offerFeatures"><b>Perfect for:</b> {x.perfect_for.join(" · ")}</p>}{x.features?.length>0&&<p className="offerFeatures">{x.features.join(" · ")}</p>}{x.demo_url&&<div className="actions"><a href={x.demo_url} target="_blank" rel="noreferrer">Live Demo →</a></div>}<RentalCheckout offerId={x.id} dailyPrice={Number(x.price||0)} monthlyPrice={Number(x.monthly_price||0)} minDays={Number(x.min_days||1)}/></article>})}</div><Link href="/">← Back to portfolio</Link></main>;
}
