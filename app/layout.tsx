import type {Metadata} from "next";
import "./globals.css";
import "./category-pages.css";
import AuthRecoveryRedirect from "../components/AuthRecoveryRedirect";

export const metadata:Metadata={
 metadataBase:new URL("https://morphitisantonis.live"),
 title:{default:"Morphitis Antonis | Digital Solutions",template:"%s | Morphitis Antonis"},
 description:"Portfolio, digital services, project-based courses, mentoring and ready-made websites by Morphitis Antonis.",
 applicationName:"Morphitis Antonis",
 authors:[{name:"Morphitis Antonis"}],
 creator:"Morphitis Antonis",
 openGraph:{
  type:"website",
  url:"https://morphitisantonis.live",
  siteName:"Morphitis Antonis",
  title:"Morphitis Antonis | Digital Solutions",
  description:"Digital projects, services, courses, mentoring and ready-made websites."
 },
 twitter:{
  card:"summary",
  title:"Morphitis Antonis | Digital Solutions",
  description:"Digital projects, services, courses, mentoring and ready-made websites."
 },
 robots:{index:true,follow:true}
};

export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="en"><body><AuthRecoveryRedirect/>{children}</body></html>
}
