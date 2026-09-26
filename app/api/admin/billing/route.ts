import {NextResponse} from 'next/server';
import Stripe from 'stripe';
import {supabaseService} from '../../../../lib/supabase-server';

async function requireAdmin(req:Request){
 const auth=req.headers.get('authorization')||'';
 const token=auth.startsWith('Bearer ')?auth.slice(7):'';
 if(!token) return null;
 const db=supabaseService();
 const {data,error}=await db.auth.getUser(token);
 if(error||!data.user) return null;
 return {db,user:data.user};
}

async function listAllCharges(stripe:Stripe){
 const rows:any[]=[];
 let startingAfter:string|undefined;
 for(let pageNo=0;pageNo<50;pageNo++){
  const page=await stripe.charges.list({
   limit:100,
   ...(startingAfter?{starting_after:startingAfter}:{}),
   expand:['data.customer','data.payment_intent']
  });
  rows.push(...page.data);
  if(!page.has_more||!page.data.length) break;
  startingAfter=page.data[page.data.length-1].id;
 }
 return rows;
}

async function listAllSubscriptions(stripe:Stripe){
 const rows:any[]=[];
 let startingAfter:string|undefined;
 for(let pageNo=0;pageNo<50;pageNo++){
  const page=await stripe.subscriptions.list({
   status:'all',
   limit:100,
   ...(startingAfter?{starting_after:startingAfter}:{}),
   expand:['data.customer']
  });
  rows.push(...page.data);
  if(!page.has_more||!page.data.length) break;
  startingAfter=page.data[page.data.length-1].id;
 }
 return rows;
}

function customerDetails(customer:any){
 if(customer&&typeof customer==='object'&&!customer.deleted){
  return {name:customer.name||'',email:customer.email||''};
 }
 return {name:'',email:''};
}

function moneyAmount(cents:any){
 const n=Number(cents||0);
 return Number.isFinite(n)?n/100:0;
}

export async function GET(req:Request){
 try{
  const auth=await requireAdmin(req);
  if(!auth) return NextResponse.json({error:'Unauthorized'},{status:401});

  const secret=process.env.STRIPE_SECRET_KEY;
  if(!secret) return NextResponse.json({error:'Stripe is not configured.'},{status:503});
  const stripe=new Stripe(secret);

  const [
   charges,
   subscriptions,
   offerRes,
   courseRes,
   requestRes
  ]=await Promise.all([
   listAllCharges(stripe),
   listAllSubscriptions(stripe),
   auth.db.from('website_offers').select('id,title,offer_type'),
   auth.db.from('training_examples').select('id,title'),
   auth.db.from('payment_requests').select('id,category,description,customer_name,customer_email')
  ]);

  const offers=new Map((offerRes.data||[]).map((x:any)=>[String(x.id),x]));
  const courses=new Map((courseRes.data||[]).map((x:any)=>[String(x.id),x]));
  const requests=new Map((requestRes.data||[]).map((x:any)=>[String(x.id),x]));

  const payments=charges.map((charge:any)=>{
   const pi=charge.payment_intent&&typeof charge.payment_intent==='object'?charge.payment_intent:null;
   const meta=pi?.metadata||{};
   const customer=customerDetails(charge.customer);
   const request=meta.payment_request_id?requests.get(String(meta.payment_request_id)):null;
   const offer=meta.website_offer_id?offers.get(String(meta.website_offer_id)):null;
   const course=meta.course_id?courses.get(String(meta.course_id)):null;

   let source='Payment';
   if(request) source=request.category||'Custom payment';
   else if(course) source=course.title||'Course / Training';
   else if(offer) source=offer.title||'Website';
   else if(charge.invoice) source='Subscription payment';
   else if(pi?.description) source=pi.description;
   else if(charge.description) source=charge.description;

   const method=charge.payment_method_details||{};
   const card=method.card||{};
   const methodLabel=method.type==='card'
    ? [card.brand?String(card.brand).toUpperCase():'Card',card.last4?'•••• '+card.last4:''].filter(Boolean).join(' ')
    : (method.type?String(method.type).replaceAll('_',' '):'');

   return {
    id:charge.id,
    created:charge.created,
    amount:moneyAmount(charge.amount),
    amount_refunded:moneyAmount(charge.amount_refunded),
    currency:String(charge.currency||'eur').toUpperCase(),
    status:charge.refunded?'refunded':String(charge.status||''),
    paid:Boolean(charge.paid),
    customer_name:charge.billing_details?.name||customer.name||request?.customer_name||'',
    customer_email:charge.billing_details?.email||customer.email||request?.customer_email||pi?.receipt_email||'',
    source,
    type:charge.invoice?'Subscription / Invoice':'One-time',
    payment_method:methodLabel,
    receipt_url:charge.receipt_url||'',
    payment_intent_id:pi?.id||String(charge.payment_intent||''),
    invoice_id:typeof charge.invoice==='string'?charge.invoice:(charge.invoice?.id||'')
   };
  });

  const subscriptionRows=subscriptions.map((s:any)=>{
   const customer=customerDetails(s.customer);
   const items=s.items?.data||[];
   const first=items[0]||{};
   const meta=s.metadata||{};
   const offer=meta.website_offer_id?offers.get(String(meta.website_offer_id)):null;

   const amount=items.reduce((sum:number,item:any)=>{
    const unit=Number(item.price?.unit_amount||0);
    const qty=Number(item.quantity||1);
    return sum+(Number.isFinite(unit)?unit:0)*(Number.isFinite(qty)?qty:1);
   },0)/100;

   const recurring=first.price?.recurring||{};
   const periodStart=Number(first.current_period_start||s.current_period_start||0);
   const periodEnd=Number(first.current_period_end||s.current_period_end||0);
   const cancelAt=Number(s.cancel_at||0);
   const endedAt=Number(s.ended_at||s.canceled_at||0);
   const activeLike=['active','trialing','past_due','unpaid','paused'].includes(String(s.status));
   const scheduledEnd=cancelAt||((s.cancel_at_period_end&&periodEnd)?periodEnd:0)||(endedAt||0);
   const nextRenewal=activeLike&&!scheduledEnd?periodEnd:0;

   return {
    id:s.id,
    status:String(s.status||''),
    customer_name:customer.name||'',
    customer_email:customer.email||'',
    service:offer?.title||first.price?.nickname||'Subscription',
    amount,
    currency:String(first.price?.currency||'eur').toUpperCase(),
    interval:String(recurring.interval||'month'),
    interval_count:Number(recurring.interval_count||1),
    created:Number(s.created||0),
    start_date:Number(s.start_date||s.created||0),
    current_period_start:periodStart,
    current_period_end:periodEnd,
    next_renewal:nextRenewal,
    ends_at:scheduledEnd,
    cancel_at_period_end:Boolean(s.cancel_at_period_end),
    auto_renew:activeLike&&!scheduledEnd,
    website_offer_id:meta.website_offer_id||''
   };
  });

  const totalReceived=payments.filter((p:any)=>p.paid&&p.status==='succeeded').reduce((sum:number,p:any)=>sum+Math.max(0,p.amount-p.amount_refunded),0);
  const activeSubscriptions=subscriptionRows.filter((s:any)=>['active','trialing'].includes(s.status));
  const monthlySubscriptionValue=activeSubscriptions.reduce((sum:number,s:any)=>{
   if(s.interval==='month') return sum+(s.amount/Math.max(1,s.interval_count));
   if(s.interval==='year') return sum+(s.amount/(12*Math.max(1,s.interval_count)));
   return sum;
  },0);

  return NextResponse.json({
   summary:{
    total_received:totalReceived,
    successful_payments:payments.filter((p:any)=>p.paid&&p.status==='succeeded').length,
    active_subscriptions:activeSubscriptions.length,
    monthly_subscription_value:monthlySubscriptionValue
   },
   payments,
   subscriptions:subscriptionRows,
   generated_at:new Date().toISOString()
  });
 }catch(e:any){
  console.error('Admin billing error',e);
  return NextResponse.json({error:e?.message||'Unable to load billing data.'},{status:500});
 }
}
