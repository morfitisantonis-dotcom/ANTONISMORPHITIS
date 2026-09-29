"use client";

import {useRouter} from "next/navigation";

export default function GlobalBackButton(){
 const router=useRouter();
 return <button
  type="button"
  className="pageBackButton"
  onClick={()=>{if(window.history.length>1) router.back(); else router.push("/")}}
  aria-label="Go back"
 >← Back</button>;
}
