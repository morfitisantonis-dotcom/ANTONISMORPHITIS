import "./globals.css";
import "./category-pages.css";
import AuthRecoveryRedirect from "../components/AuthRecoveryRedirect";
export const metadata={title:"Antonis Morphitis | Digital Solutions",description:"Portfolio, projects, services, courses, mentoring and ready-made websites."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><AuthRecoveryRedirect/>{children}</body></html>}
