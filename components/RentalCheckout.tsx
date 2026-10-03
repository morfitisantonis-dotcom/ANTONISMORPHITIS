'use client';
import {useMemo,useState} from 'react';
import WebsiteCheckoutButton from './WebsiteCheckoutButton';

export default function RentalCheckout({offerId,dailyPrice,monthlyPrice,minDays}:{offerId:string;dailyPrice:number;monthlyPrice:number;minDays:number}){
 const minimum=Math.max(1,Number(minDays||1));
 const [daysInput,setDaysInput]=useState(String(minimum));
 const days=Math.min(365,Math.max(minimum,parseInt(daysInput,10)||minimum));
 const total=useMemo(()=>days*Number(dailyPrice||0),[days,dailyPrice]);

 return <div className="rentalOptions">
  {Number(dailyPrice)>0&&<div className="rentalChoice">
   <b>Pay per day</b>
   <p>€{Number(dailyPrice).toFixed(2)} / day</p>
   <label>Rental days
    <input
     type="number"
     inputMode="numeric"
     min={minimum}
     max={365}
     step={1}
     value={daysInput}
     onChange={e=>{
      const value=e.target.value;
      if(value==='' || /^\d{0,3}$/.test(value)) setDaysInput(value);
     }}
     onBlur={()=>{
      const parsed=parseInt(daysInput,10);
      setDaysInput(String(Number.isFinite(parsed)?Math.min(365,Math.max(minimum,parsed)):minimum));
     }}
    />
   </label>
   <strong>Total: €{total.toFixed(2)}</strong>
   <WebsiteCheckoutButton offerId={offerId} type="daily" days={days} label={'Rent for '+days+' day'+(days===1?'':'s')+' — €'+total.toFixed(2)+' →'}/>
  </div>}
  {Number(monthlyPrice)>0&&<div className="rentalChoice">
   <b>Monthly subscription</b>
   <p>€{Number(monthlyPrice).toFixed(2)} / month</p>
   <span>Renews monthly until cancelled.</span>
   <WebsiteCheckoutButton offerId={offerId} type="monthly" label="Start Monthly Subscription →"/>
  </div>}
 </div>;
}
