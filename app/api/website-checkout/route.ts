import {NextResponse} from 'next/server';
import Stripe from 'stripe';
import {supabaseService} from '../../../lib/supabase-server';

export async function POST(req:Request){
 try{
  const {offerId,checkoutType,days}=await req.json();
  if(!offerId||!['daily','monthly','buy'].includes(checkoutType)) return NextResponse.json({error:'Invalid checkout request.'},{status:400});
  const db=supabaseService();
  const {data:offer,error}=await db.from('website_offers').select('id,title,price,monthly_price,min_days,offer_type,published').eq('id',offerId).eq('published',true).single();
  if(error||!offer) return NextResponse.json({error:'Website offer is not available.'},{status:404});
  const secret=process.env.STRIPE_SECRET_KEY;
  if(!secret) return NextResponse.json({error:'Payments are not configured.'},{status:503});
  const stripe=new Stripe(secret);
  const origin=new URL(req.url).origin;
  let mode:'payment'|'subscription'='payment';
  let unitAmount=0;
  let description='';
  const metadata:Record<string,string>={website_offer_id:String(offer.id),checkout_type:String(checkoutType)};

  if(checkoutType==='buy'){
   if(offer.offer_type!=='buy') return NextResponse.json({error:'This website is not available for purchase.'},{status:400});
   unitAmount=Math.round(Number(offer.price||0)*100);
   description='One-time website purchase';
  }else{
   if(offer.offer_type!=='rent') return NextResponse.json({error:'This website is not available for rental.'},{status:400});
   if(checkoutType==='daily'){
    const min=Math.max(1,Number(offer.min_days||1));
    const rentalDays=Math.floor(Number(days));
    if(!Number.isFinite(rentalDays)||rentalDays<min||rentalDays>365) return NextResponse.json({error:`Rental must be between ${min} and 365 days.`},{status:400});
    unitAmount=Math.round(Number(offer.price||0)*rentalDays*100);
    description=`${rentalDays}-day website rental`;
    metadata.rental_days=String(rentalDays);
   }else{
    mode='subscription';
    unitAmount=Math.round(Number(offer.monthly_price||0)*100);
    description='Monthly website subscription';
   }
  }
  if(!Number.isSafeInteger(unitAmount)||unitAmount<50) return NextResponse.json({error:'This offer does not have a valid payment price.'},{status:400});

  const priceData:any={currency:'eur',unit_amount:unitAmount,product_data:{name:offer.title,description}};
  if(mode==='subscription') priceData.recurring={interval:'month'};
  const session=await stripe.checkout.sessions.create({
   mode,
   line_items:[{quantity:1,price_data:priceData}],
   success_url:origin+`/${offer.offer_type==='rent'?'rent':'buy'}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
   cancel_url:origin+`/${offer.offer_type==='rent'?'rent':'buy'}?payment=cancelled`,
   metadata,
   ...(mode==='payment'?{payment_intent_data:{metadata}}:{subscription_data:{metadata}})
  });
  return NextResponse.json({url:session.url});
 }catch(e:any){
  console.error('Website checkout error',e);
  return NextResponse.json({error:e?.message||'Unable to start checkout.'},{status:500});
 }
}
