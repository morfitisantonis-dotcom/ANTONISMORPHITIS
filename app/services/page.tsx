import Link from "next/link";
const services=[
 ["Website Development","Professional websites designed around your business, brand and customer journey."],
 ["E-commerce Solutions","Online stores, product experiences and checkout flows built for real business use."],
 ["Custom Development","Tailored digital functionality when an off-the-shelf solution is not enough."],
 ["AI & Automation","Practical AI and automation systems that reduce repetitive work and support growth."],
 ["Brand & Strategy","Digital direction, positioning and project structure for new or evolving ideas."],
 ["Maintenance & Support","Ongoing improvements, updates and technical support after launch."]
];
export default function Services(){
 return <main className="listing categoryListing"><p className="eyebrow">WHAT I DO</p><h1>Services</h1><p>Professional digital solutions built around real business needs.</p><div className="cards servicePageCards">{services.map(([title,text])=><article key={title}><h2>{title}</h2><p>{text}</p></article>)}</div><Link className="backLink" href="/">← Back to portfolio</Link></main>
}
