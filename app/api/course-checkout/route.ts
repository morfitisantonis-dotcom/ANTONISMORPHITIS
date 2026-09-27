import {NextResponse} from 'next/server';
import Stripe from 'stripe';
import {supabaseService} from '../../../lib/supabase-server';
import {getSiteUrl} from '../../../lib/site-url';

export async function POST(req:Request){
 try{
  const {courseId,code}=await req.json();
  if(!courseId||!code) return NextResponse.json({error:'Enter your purchase code.'},{status:400});
  const db=supabaseService();
  const {data:course,error}=await db.from('training_examples').select('id,title,price,purchase_count,published').eq('id',courseId).eq('published',true).single();
  if(error||!course) return NextResponse.json({error:'Course not available.'},{status:404});
  const {data:validation,error:ve}=await db.rpc('validate_course_purchase_code',{p_course_id:courseId,p_code:String(code).trim()});
  const check=Array.isArray(validation)?validation[0]:validation;
  if(ve||!check?.valid) return NextResponse.json({error:check?.message||'Invalid purchase code.'},{status:400});
  const secret=process.env.STRIPE_SECRET_KEY;
  if(!secret) return NextResponse.json({error:'Payments are not configured yet.'},{status:503});
  const stripe=new Stripe(secret);
  const amount=Math.round((Number(course.price||0)+Number(course.purchase_count||0))*100);
  if(!Number.isSafeInteger(amount)||amount<50) return NextResponse.json({error:'This course does not have a valid payment price.'},{status:400});
  const siteUrl=getSiteUrl();
  const metadata={course_id:String(course.id),purchase_code:String(code).trim()};
  const session=await stripe.checkout.sessions.create({
   mode:'payment',
   line_items:[{quantity:1,price_data:{currency:'eur',unit_amount:amount,product_data:{name:course.title,description:'Project-based 1-to-1 training program'}}}],
   success_url:siteUrl+'/payment/success?kind=course&return=%2Fcourses&session_id={CHECKOUT_SESSION_ID}',
   cancel_url:siteUrl+'/payment/cancelled?return=%2Fcourses',
   metadata,
   payment_intent_data:{metadata:{course_id:String(course.id)}}
  });
  return NextResponse.json({url:session.url});
 }catch(e:any){
  console.error('Course checkout error',e);
  return NextResponse.json({error:e?.message||'Unable to start checkout.'},{status:500});
 }
}
