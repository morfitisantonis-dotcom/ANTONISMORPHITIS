const DEFAULT_SITE_URL='https://morphitisantonis.live';

export function getSiteUrl(){
 const configured=String(process.env.NEXT_PUBLIC_SITE_URL||process.env.SITE_URL||DEFAULT_SITE_URL).trim();
 try{
  const url=new URL(configured);
  if(url.protocol!=='https:'&&url.protocol!=='http:') return DEFAULT_SITE_URL;
  return url.origin.replace(/\/$/,'');
 }catch{
  return DEFAULT_SITE_URL;
 }
}
