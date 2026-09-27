import Link from 'next/link';

export default function CheckoutLegal(){
 return <div className="checkoutLegal">
  <span>Secure payments are processed by Stripe.</span>
  <span>Please review <Link href="/terms">Terms</Link>, <Link href="/privacy">Privacy</Link> and <Link href="/refund">Refunds &amp; Cancellations</Link> before purchasing.</span>
 </div>
}
