import type {MetadataRoute} from 'next';

export default function sitemap():MetadataRoute.Sitemap{
 const base='https://morphitisantonis.live';
 const paths=['','/projects','/services','/courses','/mentoring','/buy','/about','/contact','/privacy','/terms','/refund'];
 return paths.map((path)=>({
  url:base+path,
  lastModified:new Date(),
  changeFrequency:path===''?'weekly':'monthly',
  priority:path===''?1:0.7
 }));
}
