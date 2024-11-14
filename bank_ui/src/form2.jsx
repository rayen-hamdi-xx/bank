import axios from "axios";
import { useState } from "react";

export default function Form2(props) {
    const [resp, setResponse] = useState({});
        const [data,setdata]=useState('');


        const sendSoapRequest = async (e) => {
            e.preventDefault();
            const url = 'http://127.0.0.1:8000/bank/management/'; 
            const soapEnvelope = `<x:Envelope
    xmlns:x="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:ban="bank.isg.tn">
    <x:Header/>
    <x:Body>
        <ban:get_account_details>
            <ban:email>${data}</ban:email>
        </ban:get_account_details>
    </x:Body>
</x:Envelope>`;
        
    const config = {
        headers: {
            'Content-Type': 'text/xml;charset=UTF-8',
        },
    };

    try {
        const response = await axios.post(url, soapEnvelope, config);
        
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "text/xml");

        const rib = xmlDoc.getElementsByTagName("s0:rib")[0]?.textContent;
        const cin = xmlDoc.getElementsByTagName("s0:cin")[0]?.textContent;
        const name = xmlDoc.getElementsByTagName("s0:name")[0]?.textContent;
        const familyName = xmlDoc.getElementsByTagName("s0:familyName")[0]?.textContent;
        const email = xmlDoc.getElementsByTagName("s0:email")[0]?.textContent;
        const balance = xmlDoc.getElementsByTagName("s0:balance")[0]?.textContent;
        const creationDate = xmlDoc.getElementsByTagName("s0:creationDate")[0]?.textContent;
        setResponse({ rib, cin, name, familyName, email, balance, creationDate });

    } catch (error) {
        
        setResponse('Error occurred while adding the account');
    }
};
    return (
        <form onSubmit={sendSoapRequest} className='text-neutral-800 transition-all duration-300 font-regular text-[18px] px-8 w-full flex flex-col items-center gap-6'>
               <div className='flex flex-col gap-1 w-full'>
               <label  for='mail'>Email</label>
               <input id='mail' value={data} onChange={(e)=>setdata(e.target.value)}  name='mail' className='ring-1 ring-neutral-500 rounded-sm outline-none px-2 py-1 text-[16px] text-neutral-700 '></input>
               {resp.rib ? <><p>RIB: {resp.rib}</p>
                <p>CIN: {resp.cin}</p>
                <p>Name: {resp.name}</p>
                <p>Family Name: {resp.familyName}</p>
                <p>Email: {resp.email}</p>
                <p>Balance: {resp.balance}</p>
                <p>Creation Date: {resp.creationDate}</p></>
                :
                <p>does not exist</p>
                }
               
               </div>
               <button className='py-2 px-6 bg-neutral-800 hover:bg-neutral-900 transition-all duration-300  text-white rounded-md mt-4 w-full'>View Account </button>
               <div className='text-[16px] text-neutral-600 flex justify-center ml-6 gap-5 w-full'>
                <button type='button' className='hover:text-neutral-800' onClick={()=>props.setForm(1)}>  Add Account  </button>
                -
                <button type='button'  className='hover:text-neutral-800' onClick={()=>props.setForm(3)}>View All Accounts </button>
               </div>
        </form>
    )
}