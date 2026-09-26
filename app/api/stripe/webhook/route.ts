import {NextResponse} from 'next/server';
import Stripe from 'stripe';
import {supabaseService} from '../../../../lib/supabase-server';

export async function POST(req:Request){
 const secret=process.env.STRIPE_SECRET_KEY;
 const webhookSecret=process.env.STRIPE_WEBHOOK_SECRET;
 if(!secret||!webhookSecret) return NextResponse.json({error:'Webhook is not configured'},{status:503});
 const stripe=new Stripe(secret);
 const body=await req.text();
 const sig=req.headers.get('stripe-signature');
 if(!sig) return NextResponse.json({error:'Missing signature'},{status:400});
 let event:Stripe.Event;
 try{event=stripe.webhooks.constructEvent(body,sig,webhookSecret)}
 catch(e:any){return NextResponse.json({error:'Invalid signature: '+e.message},{status:400})}
 try{
  if(event.type==='checkout.session.completed'){
   const session=event.data.object as Stripe.Checkout.Session;
   if(session.payment_status==='paid'||session.mode==='subscription'){
    const db=supabaseService();

    const courseId=session.metadata?.course_id;
    const code=session.metadata?.purchase_code;
    if(courseId&&code){
     const {data:valid}=await db.rpc('consume_course_purchase_code',{p_course_id:courseId,p_code:code});
     if(valid){
      const {error}=await db.rpc('record_paid_course_purchase',{p_course_id:courseId,p_payment_reference:session.id,p_amount:(session.amount_total||0)/100,p_customer_email:session.customer_details?.email||null});
      if(error) throw error;
     }
    }

    const paymentRequestId=session.metadata?.payment_request_id;
    if(paymentRequestId&&session.payment_status==='paid'){
     const {error}=await db.from('payment_requests').update({
      status:'paid',
      stripe_session_id:session.id,
      paid_at:new Date().toISOString(),
      updated_at:new Date().toISOString()
     }).eq('id',paymentRequestId);
     if(error) throw error;
    }

    // Website checkout sessions carry website_offer_id and checkout_type metadata.
    // Stripe remains the payment/subscription source of truth; no client-supplied price is trusted.
   }
  }
  if(event.type==='invoice.paid'||event.type==='invoice.payment_failed'||event.type==='customer.subscription.updated'||event.type==='customer.subscription.deleted'){
   console.log('Stripe billing event',event.type,event.id);
  }
  return NextResponse.json({received:true});
 }catch(e:any){
  console.error('Webhook processing error',e);
  return NextResponse.json({error:e?.message||'Webhook processing failed'},{status:500});
 }
}
