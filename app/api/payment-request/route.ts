import {NextResponse} from 'next/server';
import Stripe from 'stripe';
import {supabaseService} from '../../../lib/supabase-server';

const CATEGORIES=[
 'Website Development',
 'Ready-Made Website',
 'Website Rental',
 'Course / Training',
 'Mentoring',
 'Marketing',
 'E-commerce',
 'Custom Service'
] as const;

async function requireAdmin(req:Request){
 const auth=req.headers.get('authorization')||'';
 const token=auth.startsWith('Bearer ')?auth.slice(7):'';
 if(!token) return null;
 const db=supabaseService();
 const {data,error}=await db.auth.getUser(token);
 if(error||!data.user) return null;
 return {db,user:data.user};
}

export async function GET(req:Request){
 try{
  const auth=await requireAdmin(req);
  if(!auth) return NextResponse.json({error:'Unauthorized'},{status:401});
  const {data,error}=await auth.db.from('payment_requests').select('*').order('created_at',{ascending:false});
  if(error) throw error;
  return NextResponse.json({requests:data||[]});
 }catch(e:any){
  return NextResponse.json({error:e?.message||'Unable to load payment requests.'},{status:500});
 }
}

export async function POST(req:Request){
 try{
  const auth=await requireAdmin(req);
  if(!auth) return NextResponse.json({error:'Unauthorized'},{status:401});

  const body=await req.json();
  const customerName=String(body.customer_name||'').trim();
  const customerEmail=String(body.customer_email||'').trim();
  const category=String(body.category||'').trim();
  const description=String(body.description||'').trim();
  const amount=Number(body.amount);

  if(!customerName) return NextResponse.json({error:'Customer name is required.'},{status:400});
  if(!customerEmail||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) return NextResponse.json({error:'Enter a valid customer email.'},{status:400});
  if(!CATEGORIES.includes(category as any)) return NextResponse.json({error:'Choose a valid category.'},{status:400});
  if(!Number.isFinite(amount)||amount<0.5||amount>999999) return NextResponse.json({error:'Enter a valid amount of at least €0.50.'},{status:400});

  const secret=process.env.STRIPE_SECRET_KEY;
  if(!secret) return NextResponse.json({error:'Stripe is not configured.'},{status:503});
  const stripe=new Stripe(secret);

  const rounded=Math.round(amount*100)/100;
  const {data:created,error:createError}=await auth.db.from('payment_requests').insert({
   customer_name:customerName,
   customer_email:customerEmail,
   category,
   description,
   amount:rounded,
   currency:'eur',
   status:'pending'
  }).select('*').single();
  if(createError||!created) throw createError||new Error('Unable to create payment request.');

  try{
   const price=await stripe.prices.create({
    currency:'eur',
    unit_amount:Math.round(rounded*100),
    product_data:{
     name:category,
     ...(description?{description}:{})
    }
   });

   const origin=new URL(req.url).origin;
   const paymentMetadata={payment_request_id:String(created.id),payment_category:category};
   const link=await stripe.paymentLinks.create({
    line_items:[{price:price.id,quantity:1}],
    metadata:paymentMetadata,
    payment_intent_data:{
     metadata:paymentMetadata,
     description:description||category
    },
    after_completion:{
     type:'redirect',
     redirect:{url:origin+'/payment/success'}
    }
   });

   const {data:updated,error:updateError}=await auth.db.from('payment_requests').update({
    payment_url:link.url,
    stripe_payment_link_id:link.id,
    stripe_price_id:price.id,
    updated_at:new Date().toISOString()
   }).eq('id',created.id).select('*').single();
   if(updateError) throw updateError;

   return NextResponse.json({request:updated});
  }catch(e){
   await auth.db.from('payment_requests').delete().eq('id',created.id);
   throw e;
  }
 }catch(e:any){
  console.error('Payment request error',e);
  return NextResponse.json({error:e?.message||'Unable to create payment link.'},{status:500});
 }
}

export async function PATCH(req:Request){
 try{
  const auth=await requireAdmin(req);
  if(!auth) return NextResponse.json({error:'Unauthorized'},{status:401});
  const {id,action}=await req.json();
  if(!id||action!=='cancel') return NextResponse.json({error:'Invalid request.'},{status:400});

  const {data:row,error}=await auth.db.from('payment_requests').select('*').eq('id',id).single();
  if(error||!row) return NextResponse.json({error:'Payment request not found.'},{status:404});
  if(row.status==='paid') return NextResponse.json({error:'A paid request cannot be cancelled.'},{status:400});

  const secret=process.env.STRIPE_SECRET_KEY;
  if(secret&&row.stripe_payment_link_id){
   const stripe=new Stripe(secret);
   await stripe.paymentLinks.update(row.stripe_payment_link_id,{active:false});
  }

  const {data:updated,error:updateError}=await auth.db.from('payment_requests').update({
   status:'cancelled',
   updated_at:new Date().toISOString()
  }).eq('id',id).select('*').single();
  if(updateError) throw updateError;

  return NextResponse.json({request:updated});
 }catch(e:any){
  return NextResponse.json({error:e?.message||'Unable to cancel payment request.'},{status:500});
 }
}
