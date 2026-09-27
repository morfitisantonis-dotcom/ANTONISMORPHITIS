import Link from 'next/link';

export default async function PaymentSuccessPage({searchParams}:{searchParams:Promise<{kind?:string;return?:string}>}){
 const params=await searchParams;
 const allowed=['/rent','/buy','/courses','/mentoring'];
 const back=allowed.includes(String(params.return||''))?String(params.return):'/';
 const kind=String(params.kind||'payment');
 const message=kind==='course'
  ?'Your course payment was completed successfully. Your purchase will also be recorded through the secure payment confirmation process.'
  :kind==='website'
   ?'Your website payment was completed successfully. Your transaction is recorded securely and can be reviewed in the billing system.'
   :'Thank you. Your payment was completed successfully and has been sent for secure confirmation.';
 return <main style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:24,background:'#f0f0f1',fontFamily:'Arial, sans-serif'}}>
  <section style={{width:'min(560px,100%)',background:'#fff',border:'1px solid #d8dadd',borderRadius:14,padding:'38px 32px',boxShadow:'0 8px 28px #00000012',textAlign:'center'}}>
   <div style={{width:58,height:58,borderRadius:'50%',display:'grid',placeItems:'center',margin:'0 auto 18px',background:'#123f33',color:'#fff',fontSize:28}}>✓</div>
   <h1 style={{margin:'0 0 12px',fontSize:32}}>Payment successful</h1>
   <p style={{margin:'0 0 24px',color:'#667085',lineHeight:1.6}}>{message}</p>
   <Link href={back} style={{display:'inline-block',padding:'12px 20px',background:'#123f33',color:'#fff',textDecoration:'none',borderRadius:6,fontWeight:700}}>Continue</Link>
  </section>
 </main>
}
