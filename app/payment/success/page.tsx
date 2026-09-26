export default function PaymentSuccessPage(){
 return <main style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:24,background:'#f0f0f1',fontFamily:'Arial, sans-serif'}}>
  <section style={{width:'min(520px,100%)',background:'#fff',border:'1px solid #d8dadd',borderRadius:14,padding:'38px 32px',boxShadow:'0 8px 28px #00000012',textAlign:'center'}}>
   <div style={{width:58,height:58,borderRadius:'50%',display:'grid',placeItems:'center',margin:'0 auto 18px',background:'#17191d',color:'#fff',fontSize:28}}>✓</div>
   <h1 style={{margin:'0 0 12px',fontSize:32}}>Payment received</h1>
   <p style={{margin:'0 0 24px',color:'#667085',lineHeight:1.6}}>Thank you. Your payment was completed successfully. You can now close this page.</p>
   <a href="/" style={{display:'inline-block',padding:'12px 20px',background:'#2271b1',color:'#fff',textDecoration:'none',borderRadius:6,fontWeight:700}}>Back to website</a>
  </section>
 </main>
}
