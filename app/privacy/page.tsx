import GlobalBackButton from "../../components/GlobalBackButton";
import Link from 'next/link';

export const metadata={title:'Privacy Policy',description:'Privacy information for morphitisantonis.live.'};

export default function PrivacyPage(){
 return <main className="listing legalPage"><GlobalBackButton/>
  <p className="eyebrow">LEGAL</p>
  <h1>Privacy Policy</h1>
  <p className="legalUpdated">Last updated: 27 September 2026</p>
  <section>
   <h2>1. Information we collect</h2>
   <p>When you contact us, request a service, purchase a website or course, or join a paid mentoring plan, we may receive information such as your name, email address, payment-related transaction details, project information and messages you choose to send.</p>
  </section>
  <section>
   <h2>2. Payments</h2>
   <p>Payments are processed by Stripe. Morphitis Antonis does not store your full card number on this website. Stripe may process payment, billing, fraud-prevention and transaction information under its own privacy terms.</p>
  </section>
  <section>
   <h2>3. Website services and storage</h2>
   <p>The website uses service providers for hosting, database, authentication and related technical functions, including Supabase and the website hosting provider. Information may be processed by these providers where necessary to operate the service securely.</p>
  </section>
  <section>
   <h2>4. Telegram and external services</h2>
   <p>If you choose to join a Telegram community or follow an external link, your use of that service is also subject to the privacy terms of the relevant third party.</p>
  </section>
  <section>
   <h2>5. Why information is used</h2>
   <p>Information is used to provide requested services, process and verify payments, manage subscriptions, respond to enquiries, provide customer access, protect the website against misuse and meet applicable legal or accounting obligations.</p>
  </section>
  <section>
   <h2>6. Retention and your rights</h2>
   <p>Information is kept only for as long as reasonably necessary for the purpose it was collected, including legal, accounting and security needs. Depending on applicable law, you may have rights to request access, correction, deletion, restriction or other action concerning your personal information.</p>
  </section>
  <section>
   <h2>7. Contact</h2>
   <p>For privacy questions or requests, contact <a href="mailto:morfitisantonis@gmail.com">morfitisantonis@gmail.com</a>.</p>
  </section>
  <p className="legalNote">This policy is intended to describe the current website setup. It should be reviewed whenever analytics, advertising pixels, newsletters or additional data-processing services are added.</p>
  <Link className="backLink" href="/">← Back to portfolio</Link>
 </main>
}
