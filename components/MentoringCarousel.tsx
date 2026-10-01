"use client";

const packages=[
 {
  tier:"START ONLINE",
  price:"Free",
  priceSuffix:"to join",
  title:"Start Online",
  description:"For people who want to start building online income but need encouragement, ideas and guidance for the first step.",
  benefits:[
   "Daily motivation and encouragement.",
   "Ideas for online income and digital projects.",
   "Examples from real projects.",
   "Introduction to my services and portfolio.",
   "Direct communication with me."
  ],
  platform:"ONLINE INCOME · DIGITAL PROJECTS",
  telegram:"Join the Telegram group instantly — free access.",
  cta:"Join the Free Group",
  href:"https://t.me/+0p0bdnLVt7szYTFk"
 }
];

export default function MentoringCarousel(){
 return <section id="mentoring" className="mentoringSection">
  <div className="mentoringIntro">
   <p className="eyebrow">MORPHITIS MENTORING CLUB</p>
   <h2>Build with guidance. Grow with a community.</h2>
   <p>A practical mentoring community for people who want clearer direction, stronger consistency and useful feedback while building their online presence and digital projects.</p>
  </div>

  <div className="mentoringCarousel">
   <div className="mentoringTrack">
    {packages.map((item)=><article className="mentoringCard" key={item.title}>
     <div className="mentoringCardTop"><span className="mentoringTier">{item.tier}</span><div className="mentoringPrice"><strong>{item.price}</strong><span>{item.priceSuffix}</span></div></div>
     <h3>{item.title}</h3>
     <p className="mentoringFor">{item.description}</p>
     <ul className="mentoringBenefits">{item.benefits.map(x=><li key={x}>{x}</li>)}</ul>
     <div className="mentoringPlatform">{item.platform}</div>
     <div className="mentoringTelegramNote">✈ {item.telegram}</div>
     <a className="mentoringCta" href={item.href} target="_blank" rel="noreferrer">{item.cta}</a>
    </article>)}
   </div>
  </div>
 </section>;
}
