import GlobalBackButton from "../../components/GlobalBackButton";
import Link from "next/link";
import MentoringCarousel from "../../components/MentoringCarousel";
import CheckoutLegal from "../../components/CheckoutLegal";

export const metadata={title:"Mentoring",description:"Morphitis Mentoring Club plans, community guidance and online growth support."};

export default function Mentoring(){
 return <main className="categoryPage mentoringPage"><div className="pageBackTop darkPageBack"><GlobalBackButton/></div><MentoringCarousel/><div className="pageBackWrap"><CheckoutLegal/><Link className="backLink lightBackLink" href="/">← Back to portfolio</Link></div></main>
}
