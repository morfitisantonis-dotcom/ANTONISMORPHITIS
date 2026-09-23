import {NextResponse} from 'next/server';
import Stripe from 'stripe';
import {supabaseService} from '../../../lib/supabase-server';

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
  const origin=new URL(req.url).origin;
  const session=await stripe.checkout.sessions.create({
   mode:'payment',
   line_items:[{quantity:1,price_data:{currency:'eur',unit_amount:amount,product_data:{name:course.title,description:'Project-based 1-to-1 training program'}}}],
   success_url:origin+'/?course_payment=success#courses',
   cancel_url:origin+'/?course_payment=cancelled#courses',
   metadata:{course_id:course.id,purchase_code:String(code).trim()},
   payment_intent_data:{metadata:{course_id:course.id}}
  });
  return NextResponse.json({url:session.url});
 }catch(e:any){return NextResponse.json({error:e?.message||'Unable to start checkout.'},{status:500})}
}
