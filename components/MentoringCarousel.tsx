"use client";
import {useEffect,useRef,useState} from "react";
import MentoringJoinButton from "./MentoringJoinButton";

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
  cta:"Join the Free Group",
  href:"https://t.me/+0p0bdnLVt7szYTFk"
 },
 {
  tier:"SOCIAL ACTION",
  price:"€15",
  priceSuffix:"/ month",
  title:"Social Action",
  description:"For small businesses, professionals and creators who want a more organized and consistent presence on Instagram and Facebook.",
  benefits:[
   "Daily encouragement and useful guidance.",
   "Organized presence on Instagram and Facebook.",
   "Ideas for new content.",
   "Support from the community.",
   "Share content in the group for feedback before publishing.",
   "Help with consistency and a stronger online presence."
  ],
  platform:"INSTAGRAM · FACEBOOK",
  cta:"Choose Social Action",
  href:""
 },
 {
  tier:"COMMUNITY GROWTH",
  price:"€25",
  priceSuffix:"/ month",
  title:"Community Growth",
  description:"For people who want more guidance, more ideas and support for building their presence across multiple platforms.",
  benefits:[
   "More detailed guidance and support from the bot.",
   "Ideas for different platforms.",
   "Participation in an active community.",
   "Exchange of ideas, experience and useful advice.",
   "Feedback from other members.",
   "Access to useful material and practical guidance.",
   "Flexible participation based on your available time."
  ],
  platform:"MULTI-PLATFORM GUIDANCE",
  cta:"Choose Community Growth",
  href:"",
  featured:true
 }
];

export default function MentoringCarousel(){
 const track=useRef<HTMLDivElement>(null);
 const [index,setIndex]=useState(0);

 const go=(next:number)=>{
  const target=Math.max(0,Math.min(packages.length-1,next));
  const card=track.current?.querySelector<HTMLElement>(".mentoringCard");
  if(track.current&&card){
   const gap=24;
   track.current.scrollTo({left:target*(card.offsetWidth+gap),behavior:"smooth"});
   setIndex(target);
  }
 };

 useEffect(()=>{
  const el=track.current;
  if(!el)return;
  const onScroll=()=>{
   const card=el.querySelector<HTMLElement>(".mentoringCard");
   if(!card)return;
   const next=Math.round(el.scrollLeft/(card.offsetWidth+24));
   setIndex(Math.max(0,Math.min(packages.length-1,next)));
  };
  el.addEventListener("scroll",onScroll,{passive:true});
  return()=>el.removeEventListener("scroll",onScroll);
 },[]);

 return <section id="mentoring" className="mentoringSection">
  <div className="mentoringIntro">
   <p className="eyebrow">MORPHITIS MENTORING CLUB</p>
   <h2>Build with guidance. Grow with a community.</h2>
   <p>A practical mentoring community for people who want clearer direction, stronger consistency and useful feedback while building their online presence and digital projects.</p>
  </div>

  <div className="mentoringCarousel">
   <button className="mentoringArrow mentoringPrev" type="button" onClick={()=>go(index-1)} disabled={index===0} aria-label="Previous mentoring package">‹</button>
   <div className="mentoringTrack" ref={track}>
    {packages.map((item,i)=><article className={"mentoringCard"+(item.featured?" mentoringFeatured":"")} key={item.title}>
     {item.featured&&<div className="mentoringBadge">RECOMMENDED</div>}
     <div className="mentoringCardTop"><span className="mentoringTier">{item.tier}</span><div className="mentoringPrice"><strong>{item.price}</strong><span>{item.priceSuffix}</span></div></div>
     <h3>{item.title}</h3>
     <p className="mentoringFor">{item.description}</p>
     <ul className="mentoringBenefits">{item.benefits.map(x=><li key={x}>{x}</li>)}</ul>
     {item.featured&&<div className="mentoringFlexNote"><b>Participate at your own pace.</b><p>You are not required to post every day or follow the full suggested program. You can join the group, discuss ideas, receive feedback and use the guidance even on days when you do not publish anything.</p></div>}
     <div className="mentoringPlatform">{item.platform}</div>
     {i===0?<a className="mentoringCta" href={item.href} target="_blank" rel="noreferrer">{item.cta}</a>:<MentoringJoinButton plan={i===1?"social-action":"community-growth"} label={item.cta}/>}
    </article>)}
   </div>
   <button className="mentoringArrow mentoringNext" type="button" onClick={()=>go(index+1)} disabled={index===packages.length-1} aria-label="Next mentoring package">›</button>
   <div className="mentoringDots">{packages.map((item,i)=><button type="button" key={item.title} className={i===index?"active":""} onClick={()=>go(i)} aria-label={"Mentoring package "+(i+1)}/>)}</div>
  </div>
 </section>;
}
