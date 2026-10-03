'use client';
import {useMemo,useState} from 'react';
import WebsiteCheckoutButton from './WebsiteCheckoutButton';

export default function RentalCheckout({offerId,dailyPrice,monthlyPrice,minDays}:{offerId:string;dailyPrice:number;monthlyPrice:number;minDays:number}){
 const minimum=Math.max(1,Number(minDays||1));
 const [days,setDays]=useState(minimum);
 const total=useMemo(()=>Math.max(minimum,days)*Number(dailyPrice||0),[days,dailyPrice,minimum]);
 return <div className="rentalOptions">
  {Number(dailyPrice)>0&&<div className="rentalChoice">
   <b>Pay per day</b>
   <p>€{Number(dailyPrice).toFixed(2)} / day</p>
   <label>Rental days
    <input type="number" min={minimum} max={365} value={days} onChange={e=>setDays(Math.min(365,Math.max(minimum,Number(e.target.value)||minimum)))}/>
   </label>
   <strong>Total: €{total.toFixed(2)}</strong>
   <WebsiteCheckoutButton offerId={offerId} type="daily" days={days} label={'Rent for '+days+' day'+(days===1?'':'s')+' →'}/>
  </div>}
  {Number(monthlyPrice)>0&&<div className="rentalChoice">
   <b>Monthly subscription</b>
   <p>€{Number(monthlyPrice).toFixed(2)} / month</p>
   <span>Renews monthly until cancelled.</span>
   <WebsiteCheckoutButton offerId={offerId} type="monthly" label="Start Monthly Subscription →"/>
  </div>}
 </div>;
}
