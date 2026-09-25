import Link from "next/link";
import CourseCarousel from "../../components/CourseCarousel";
import {supabase} from "../../lib/supabase";
export const revalidate=0;

export default async function Courses(){
 const {data:training}=await supabase.from("training_examples").select("*").eq("published",true).order("sort_order");
 return <main className="categoryPage"><section className="trainingSection standaloneSection"><div className="trainingIntro"><p className="eyebrow">PROJECT-BASED TRAINING</p><h1>Courses</h1><h2>Learn by building a real project.</h2><p>Personal 1-to-1 guidance from the first idea to a finished launch. Choose the project you want to build and complete it with a clear fixed price.</p></div><CourseCarousel courses={training||[]}/>{(!training||training.length===0)&&<p>Programs will appear here when published from the admin.</p>}<Link className="backLink" href="/">← Back to portfolio</Link></section></main>
}
