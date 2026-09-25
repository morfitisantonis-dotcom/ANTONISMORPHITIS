import {supabase} from "../lib/supabase";
export const revalidate=0;

const nav=[
 ["Home","/","Start here"],
 ["Projects","/projects","Explore my work"],
 ["Services","/services","What I can build"],
 ["Courses","/courses","Learn & build with me"],
 ["Mentoring","/mentoring","Community & guidance"],
 ["Rent","/rent","Rent a website"],
 ["Buy","/buy","Own a website"],
 ["About","/about","My story"],
 ["Contact","/contact","Let's work together"]
];

export default async function Home(){
 const {data:settings}=await supabase.from("site_settings").select("*").eq("id","main").maybeSingle();
 return <><header><div className="brand"><b>AM　ANTONIS MORFITIS</b><small>DIGITAL SOLUTIONS</small></div><nav>{nav.map(([label,href,sub])=><a key={label} href={href}><b>{label.toUpperCase()}</b><small>{sub}</small></a>)}</nav></header><main>
  <section className="hero"><div><p>CREATOR • ENTREPRENEUR • DIGITAL BUILDER</p><h1>Discipline today.<br/>A better tomorrow.</h1><p>I’m Antonis Morfitis — a creator and entrepreneur focused on turning ideas into real digital projects. I build, experiment, learn and improve, with one simple belief: progress comes from taking action consistently.</p><div className="actions"><a href="/projects">View My Work →</a><a href="/about">Who I Am →</a></div></div><div className="portrait">{settings?.hero_image_url?<img src={settings.hero_image_url} alt="Antonis Morfitis"/>:"ANTONIS MORFITIS"}</div></section>

  <section className="homeCategorySection"><p className="eyebrow">SELECTED WORK</p><h2>Projects</h2><p>Explore websites, e-commerce brands and digital systems I have built.</p><a className="button" href="/projects">Explore My Projects →</a></section>

  <section className="homeCategorySection"><p className="eyebrow">WHAT I DO</p><h2>Services</h2><p>Professional digital solutions for websites, e-commerce, automation, branding and ongoing support.</p><a className="button" href="/services">Explore Services →</a></section>

  <section className="homeCategorySection"><p className="eyebrow">PROJECT-BASED TRAINING</p><h2>Courses</h2><p>Learn by building a real project with personal guidance from the first idea to a finished launch.</p><a className="button" href="/courses">Explore Courses →</a></section>

  <section className="homeCategorySection homeMentoringTeaser"><p className="eyebrow">MORPHITIS MENTORING CLUB</p><h2>Mentoring Plans</h2><p>Choose the level of guidance, community support and online growth help that fits you best.</p><a className="lightButton" href="/mentoring">Explore Mentoring Plans →</a></section>

  <section className="homeCategorySection"><p className="eyebrow">READY-MADE</p><h2>Rent a Website</h2><p>Choose a ready-made website and personalize it with your own brand, services and contact details.</p><a className="button" href="/rent">Explore Rental Websites →</a></section>

  <section className="homeCategorySection"><p className="eyebrow">OWN IT</p><h2>Buy a Website</h2><p>Purchase a complete website once and make it yours.</p><a className="button" href="/buy">Explore Websites for Sale →</a></section>

  <section className="homeCategorySection"><p className="eyebrow">WHO I AM</p><h2>About Me</h2><p>Read the story, mindset and principles behind the projects I build.</p><a className="button" href="/about">Read My Story →</a></section>

  <section className="homeCategorySection dark"><p className="eyebrow">CONTACT</p><h2>Let’s Build Something Great</h2><p>New opportunities start with a conversation.</p><a className="lightButton" href="/contact">Contact Me →</a></section>
 </main><footer><b>AM　ANTONIS MORFITIS</b><span>© 2026 Antonis Morfitis.</span></footer></>
}
