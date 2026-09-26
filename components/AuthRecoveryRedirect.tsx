'use client';
import {useEffect} from 'react';

export default function AuthRecoveryRedirect(){
  useEffect(()=>{
    const hash=window.location.hash||'';
    const query=window.location.search||'';
    const recovery=/type=recovery/.test(hash)||/type=recovery/.test(query);
    if(recovery&&window.location.pathname!=='/admin/reset-password'){
      window.location.replace('/admin/reset-password'+query+hash);
    }
  },[]);
  return null;
}
