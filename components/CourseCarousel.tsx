"use client";
import {useEffect,useRef,useState} from "react";
import CourseBuyButton from "./CourseBuyButton";

export default function CourseCarousel({courses}:{courses:any[]}){
 const track=useRef<HTMLDivElement>(null);
 const [index,setIndex]=useState(0);
 const max=Math.max(0,courses.length-1);
 const go=(next:number)=>{
  const i=Math.max(0,Math.min(max,next));
  setIndex(i);
  const card=track.current?.querySelector<HTMLElement>(".trainingCard");
  if(track.current&&card) track.current.scrollTo({left:i*(card.offsetWidth+24),behavior:"smooth"});
 };
 useEffect(()=>{
  const el=track.current;if(!el)return;
  const onScroll=()=>{const card=el.querySelector<HTMLElement>(".trainingCard");if(card)setIndex(Math.round(el.scrollLeft/(card.offsetWidth+24)))};
  el.addEventListener("scroll",onScroll,{passive:true});return()=>el.removeEventListener("scroll",onScroll);
 },[]);
 return <div className="courseCarousel">
  <button className="courseArrow coursePrev" onClick={()=>go(index-1)} disabled={index===0} aria-label="Previous course">‹</button>
  <div className="trainingGrid" ref={track}>{courses.map((t:any)=><article className="trainingCard" key={t.id}>{t.image_url&&<img className="trainingImage" src={t.image_url} alt={t.title}/>}<div className="trainingBody"><div className="trainingTop"><span>{t.level||t.category}</span><span>{t.duration||"PROJECT-BASED"}</span></div><h3>{t.title}</h3><p className="trainingDesc">{t.description}</p><div className="trainingPrice"><strong>€{(Number(t.price||0)+Number(t.purchase_count||0)).toLocaleString("en-US")}</strong><span>CURRENT PRICE · +€1 AFTER EACH PURCHASE</span></div>{(t.what_you_learn||[]).length>0&&<div className="trainingBlock"><b>WHAT YOU’LL LEARN</b><ul>{t.what_you_learn.map((x:string)=><li key={x}>{x}</li>)}</ul></div>}{(t.modules||[]).length>0&&<div className="trainingBlock"><b>WHAT YOU CAN BUILD</b><div className="trainingTags">{t.modules.map((x:string)=><span key={x}>{x}</span>)}</div></div>}<div className="trainingActions"><CourseBuyButton courseId={t.id}/><a className="askCourse" href="/contact">Ask a question</a></div></div></article>)}</div>
  <button className="courseArrow courseNext" onClick={()=>go(index+1)} disabled={index>=max} aria-label="Next course">›</button>
  <div className="courseDots">{courses.map((_:any,i:number)=><button key={i} className={i===index?"active":""} onClick={()=>go(i)} aria-label={"Course "+(i+1)}/>)}</div>
 </div>
}
