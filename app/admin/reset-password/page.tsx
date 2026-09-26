'use client';
import {FormEvent,useEffect,useState} from 'react';
import {supabase} from '../../../lib/supabase';

export default function ResetPasswordPage(){
  const [password,setPassword]=useState('');
  const [confirmPassword,setConfirmPassword]=useState('');
  const [message,setMessage]=useState('');
  const [ready,setReady]=useState(false);
  const [checking,setChecking]=useState(true);
  const [busy,setBusy]=useState(false);
  const [done,setDone]=useState(false);

  useEffect(()=>{
    let active=true;

    supabase.auth.getSession().then(({data})=>{
      if(!active)return;
      setReady(Boolean(data.session));
      setChecking(false);
    });

    const {data:listener}=supabase.auth.onAuthStateChange((event,session)=>{
      if(!active)return;
      if(event==='PASSWORD_RECOVERY'||session){
        setReady(true);
        setChecking(false);
      }
    });

    return()=>{
      active=false;
      listener.subscription.unsubscribe();
    };
  },[]);

  async function updatePassword(e:FormEvent){
    e.preventDefault();
    setMessage('');
    if(password.length<8)return setMessage('Use at least 8 characters for your new password.');
    if(password!==confirmPassword)return setMessage('The passwords do not match.');

    setBusy(true);
    const {error}=await supabase.auth.updateUser({password});
    setBusy(false);

    if(error)return setMessage(error.message);

    await supabase.auth.signOut();
    setDone(true);
    setPassword('');
    setConfirmPassword('');
  }

  if(done)return <main className="adminLogin"><form><div className="adminMark">AM</div><h1>Password updated</h1><p>Your new admin password is ready.</p><button type="button" onClick={()=>window.location.href='/admin'}>Return to sign in</button></form></main>;

  if(checking)return <main className="adminLogin"><form><div className="adminMark">AM</div><h1>Reset password</h1><p>Checking your secure reset link…</p></form></main>;

  if(!ready)return <main className="adminLogin"><form><div className="adminMark">AM</div><h1>Reset link expired</h1><p>This password reset link is invalid or has expired.</p><button type="button" onClick={()=>window.location.href='/admin'}>Request a new reset link</button></form></main>;

  return <main className="adminLogin"><form onSubmit={updatePassword}><div className="adminMark">AM</div><h1>Create new password</h1><p>Enter a new password for your Portfolio Admin account.</p><input autoComplete="new-password" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="New password"/><input autoComplete="new-password" type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="Confirm new password"/><button disabled={busy}>{busy?'Updating…':'Update password'}</button>{message&&<p className="adminMsg">{message}</p>}</form></main>;
}
