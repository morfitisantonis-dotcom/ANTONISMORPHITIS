import Link from "next/link";
import {supabase} from "../../lib/supabase";
export const revalidate=0;
export default async function Page(){
 const {data}=await supabase.from("website_offers").select("*").eq("offer_type","buy").eq("published",true).order("sort_order");
 const items=data||[];
 return <main className="listing"><p className="eyebrow">AVAILABLE PROJECTS</p><h1>Buy a Website</h1><p>Complete websites available for one-time purchase and personalization.</p><div className="grid">{items.length===0?<article><h2>Coming soon</h2><p>New websites will appear here when published from the admin.</p></article>:items.map((x:any)=><article key={x.id}>{x.image_url?<img className="offerImage" src={x.image_url} alt={x.title}/>:<div className="preview">WEBSITE PREVIEW</div>}<div className="offerMeta"><span>{x.category}</span><span>{x.status}</span></div><h2>{x.title}</h2><p>{x.description}</p>{x.features?.length>0&&<p className="offerFeatures">{x.features.join(" · ")}</p>}<h3>{x.price!=null?`€${x.price}${x.offer_type==="rent"?` / ${x.billing_period||"month"}`:""}`:"Price on request"}</h3><div className="actions">{x.demo_url&&<a href={x.demo_url} target="_blank" rel="noreferrer">Live Demo →</a>}<a href="mailto:morfitisantonis@gmail.com?subject=Buy%20Website">Contact Me →</a></div></article>)}</div><Link href="/">← Back to portfolio</Link></main>
}