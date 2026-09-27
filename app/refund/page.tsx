import Link from 'next/link';

export const metadata={title:'Refund & Cancellation Policy',description:'Refund and cancellation information for purchases and subscriptions.'};

export default function RefundPage(){
 return <main className="listing legalPage">
  <p className="eyebrow">LEGAL</p>
  <h1>Refund &amp; Cancellation Policy</h1>
  <p className="legalUpdated">Last updated: 27 September 2026</p>
  <section>
   <h2>Subscriptions</h2>
   <p>You may request cancellation of a recurring mentoring or website subscription before the next renewal. Cancellation stops future renewals; access may continue until the end of the period already paid for unless otherwise stated.</p>
  </section>
  <section>
   <h2>One-time services and website purchases</h2>
   <p>Where work has not started, contact us as soon as possible if you need to cancel. Once custom work, setup, personalization, transfer or another agreed service has started, any refund will depend on the work already completed, costs already incurred and applicable law.</p>
  </section>
  <section>
   <h2>Courses and digital access</h2>
   <p>If digital access, materials or a scheduled service have already been supplied, refund eligibility may depend on the circumstances and applicable consumer law. Please contact us promptly if there is a problem with access or the service delivered.</p>
  </section>
  <section>
   <h2>Duplicate or incorrect charges</h2>
   <p>If you believe you were charged twice, charged an incorrect amount or paid for something you did not receive, contact us with the payment email and transaction details so the payment can be reviewed.</p>
  </section>
  <section>
   <h2>Statutory rights</h2>
   <p>Nothing in this policy limits mandatory consumer rights. Where a legal cooling-off or withdrawal right applies, it will be handled in accordance with applicable law, including rules that may apply when a service begins or digital content is supplied at the customer's request.</p>
  </section>
  <section>
   <h2>Contact</h2>
   <p>Refund and cancellation requests can be sent to <a href="mailto:morfitisantonis@gmail.com">morfitisantonis@gmail.com</a>.</p>
  </section>
  <Link className="backLink" href="/">← Back to portfolio</Link>
 </main>
}
