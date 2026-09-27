import Link from 'next/link';

export default async function PaymentCancelledPage({searchParams}:{searchParams:Promise<{return?:string}>}){
 const params=await searchParams;
 const allowed=['/rent','/buy','/courses','/mentoring'];
 const back=allowed.includes(String(params.return||''))?String(params.return):'/';
 return <main style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:24,background:'#f0f0f1',fontFamily:'Arial, sans-serif'}}>
  <section style={{width:'min(560px,100%)',background:'#fff',border:'1px solid #d8dadd',borderRadius:14,padding:'38px 32px',boxShadow:'0 8px 28px #00000012',textAlign:'center'}}>
   <div style={{width:58,height:58,borderRadius:'50%',display:'grid',placeItems:'center',margin:'0 auto 18px',background:'#6d6253',color:'#fff',fontSize:26}}>×</div>
   <h1 style={{margin:'0 0 12px',fontSize:32}}>Payment cancelled</h1>
   <p style={{margin:'0 0 24px',color:'#667085',lineHeight:1.6}}>No payment was completed. You can return to the offer and try again whenever you are ready.</p>
   <Link href={back} style={{display:'inline-block',padding:'12px 20px',background:'#123f33',color:'#fff',textDecoration:'none',borderRadius:6,fontWeight:700}}>Return to offer</Link>
  </section>
 </main>
}
