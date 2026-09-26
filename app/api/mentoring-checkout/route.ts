import {NextResponse} from "next/server";
import Stripe from "stripe";

const plans={
 "social-action":{name:"Morphitis Mentoring Club — Social Action",amount:1500},
 "community-growth":{name:"Morphitis Mentoring Club — Community Growth",amount:2500}
} as const;

export async function POST(req:Request){
 try{
  const secret=process.env.STRIPE_SECRET_KEY;
  if(!secret) return NextResponse.json({error:"Stripe is not configured."},{status:503});
  const body=await req.json();
  const plan=String(body.plan||"") as keyof typeof plans;
  const selected=plans[plan];
  if(!selected) return NextResponse.json({error:"Invalid mentoring plan."},{status:400});
  const stripe=new Stripe(secret);
  const origin=new URL(req.url).origin;
  const session=await stripe.checkout.sessions.create({
   mode:"subscription",
   line_items:[{quantity:1,price_data:{currency:"eur",unit_amount:selected.amount,recurring:{interval:"month"},product_data:{name:selected.name}}}],
   allow_promotion_codes:true,
   billing_address_collection:"auto",
   metadata:{checkout_type:"mentoring_subscription",mentoring_plan:plan},
   subscription_data:{metadata:{checkout_type:"mentoring_subscription",mentoring_plan:plan}},
   success_url:origin+"/mentoring/success?session_id={CHECKOUT_SESSION_ID}",
   cancel_url:origin+"/mentoring"
  });
  return NextResponse.json({url:session.url});
 }catch(e:any){
  console.error("Mentoring checkout error",e);
  return NextResponse.json({error:e?.message||"Unable to start checkout."},{status:500});
 }
}
