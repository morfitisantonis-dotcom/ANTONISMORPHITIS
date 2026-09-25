import Link from "next/link";
import MentoringCarousel from "../../components/MentoringCarousel";
export default function Mentoring(){
 return <main className="categoryPage mentoringPage"><MentoringCarousel/><div className="pageBackWrap"><Link className="backLink lightBackLink" href="/">← Back to portfolio</Link></div></main>
}
