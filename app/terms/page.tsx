import Link from 'next/link';

export const metadata={title:'Terms & Conditions',description:'Terms for services, courses, mentoring and website offers on morphitisantonis.live.'};

export default function TermsPage(){
 return <main className="listing legalPage">
  <p className="eyebrow">LEGAL</p>
  <h1>Terms &amp; Conditions</h1>
  <p className="legalUpdated">Last updated: 27 September 2026</p>
  <section>
   <h2>1. About these terms</h2>
   <p>These terms apply to purchases and services offered through morphitisantonis.live by Morphitis Antonis, including website development, ready-made websites, website rentals, courses, mentoring and custom services.</p>
  </section>
  <section>
   <h2>2. Prices and payment</h2>
   <p>Prices shown on the website are displayed in euros unless stated otherwise. Payments may be processed through Stripe. A purchase is considered confirmed only after the payment provider reports successful payment.</p>
  </section>
  <section>
   <h2>3. Custom work and project scope</h2>
   <p>For custom work, the agreed description, deliverables, timetable, revisions and any additional written agreement form part of the service. Requests outside the agreed scope may require a separate quote.</p>
  </section>
  <section>
   <h2>4. Website purchases and rentals</h2>
   <p>A one-time website purchase and a website rental or subscription are different products. Rental or subscription access is limited to the paid period and any specific usage terms communicated with the offer. Ownership or transfer rights are provided only where expressly included in the relevant purchase.</p>
  </section>
  <section>
   <h2>5. Courses and mentoring</h2>
   <p>Courses and mentoring provide access to the content, guidance or community described for the selected offer. Results depend on the participant's own actions and circumstances; no specific business, income, audience or performance result is guaranteed.</p>
  </section>
  <section>
   <h2>6. Acceptable use</h2>
   <p>You must not misuse the website, payment links, private community invitations or purchased materials, attempt unauthorized access, or distribute private access links where they are intended only for the paying customer.</p>
  </section>
  <section>
   <h2>7. Cancellations, refunds and statutory rights</h2>
   <p>The separate Refund &amp; Cancellation Policy forms part of these terms. Nothing in these terms removes rights that cannot legally be excluded under applicable consumer law.</p>
  </section>
  <section>
   <h2>8. Contact</h2>
   <p>Questions about an order or service can be sent to <a href="mailto:morfitisantonis@gmail.com">morfitisantonis@gmail.com</a>.</p>
  </section>
  <Link className="backLink" href="/">← Back to portfolio</Link>
 </main>
}
