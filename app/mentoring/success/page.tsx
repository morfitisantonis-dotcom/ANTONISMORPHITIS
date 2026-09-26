import Stripe from "stripe";
import Link from "next/link";

export const dynamic="force-dynamic";

export default async function MentoringSuccess({searchParams}:{searchParams:Promise<{session_id?:string}>}){
 const {session_id}=await searchParams;
 let plan="";
 let active=false;
 if(session_id&&process.env.STRIPE_SECRET_KEY){
  try{
   const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);
   const session=await stripe.checkout.sessions.retrieve(session_id,{expand:["subscription"]});
   plan=session.metadata?.mentoring_plan||"";
   active=session.mode==="subscription"&&(session.status==="complete");
  }catch{}
 }
 const invite=plan==="social-action"?process.env.TELEGRAM_SOCIAL_ACTION_INVITE:plan==="community-growth"?process.env.TELEGRAM_COMMUNITY_GROWTH_INVITE:"";
 const title=plan==="social-action"?"Social Action":plan==="community-growth"?"Community Growth":"Mentoring";
 return <main className="mentoringSuccess"><div className="mentoringSuccessCard">
  <span className="successCheck">✓</span>
  <p className="eyebrow">MORPHITIS MENTORING CLUB</p>
  <h1>{active?"Welcome to "+title:"Payment verification"}</h1>
  {active&&invite?<><p>Your subscription is active. Use the private button below to join your Telegram group.</p><a className="mentoringSuccessJoin" href={invite} target="_blank" rel="noreferrer">Join {title} on Telegram →</a><small>Keep this invitation private. Your access is linked to your active membership.</small></>:active?<p>Your payment is confirmed, but the Telegram invitation has not been configured yet. Please contact Morphitis Antonis and your access will be provided.</p>:<p>We could not verify an active mentoring subscription from this page.</p>}
  <Link href="/mentoring">← Back to Mentoring Plans</Link>
 </div></main>;
}
