    import axios from "axios";
    import dayjs from "dayjs";
    import { useState } from "react";

    export default function Form1(props) {
        const [resp, setResponse] = useState(null);
        const [data,setdata]=useState(
            {
                first :'',
                family : '',
                cin: '',
                email: '',
                rib: '',
                balance: '',
            }
        );
        const date  = dayjs().format('YYYY-MM-DD');
        const handle = (e) => {
            const { name, value } = e.target;
            setdata({ ...data, [name]: value });
        };


        const sendSoapRequest = async (e) => {
            e.preventDefault();
            const url = 'http://127.0.0.1:8000/bank/management/'; 
            const soapEnvelope = `<x:Envelope
        xmlns:x="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:ban="bank.isg.tn"
        xmlns:ban1="bank_account_transaction_management.ComplexTypes">
        <x:Header/>
        <x:Body>
            <ban:add_account>
                <ban:account>
                    <ban1:rib>${data.rib}</ban1:rib>
                    <ban1:client>
                        <ban1:cin>${data.cin}</ban1:cin>
                        <ban1:name>${data.first}</ban1:name>
                        <ban1:familyName>${data.family}</ban1:familyName>
                        <ban1:email>${data.email}</ban1:email>
                    </ban1:client>
                    <ban1:balance>${data.balance}</ban1:balance>
                    <ban1:AccountType>?</ban1:AccountType>
                    <ban1:creationDate>${date}</ban1:creationDate>
                </ban:account>
            </ban:add_account>
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

        const successMessage = xmlDoc.getElementsByTagName("tns:add_accountResult")[0]?.textContent;

        if (successMessage) {
            setResponse(successMessage);
        } else {
            
        }
    } catch (error) {
        
        setResponse('Error occurred while adding the account');
    }
};

        
        return (
            <form onSubmit={sendSoapRequest} className='text-neutral-800 transition-all duration-300 font-regular text-[18px] px-8 w-full flex flex-col items-center gap-6'>
                <div className='flex gap-8 w-full h-full items-center'>
                    <div className='flex flex-col gap-1 w-full'>
                        <label  for='first'>First Name</label>
                        <input id='first' value={data.first} onChange={handle} name='first' className='ring-1 ring-neutral-500 rounded-sm outline-none px-2 py-1 text-[16px] text-neutral-700 '></input>
                    </div>
                    <div className='flex flex-col gap-1 w-full'>
                        <label  for='family'>Family Name</label>
                        <input id='family' value={data.family} onChange={handle}  name='family' className='ring-1 ring-neutral-500 rounded-sm outline-none px-2 py-1 text-[16px] text-neutral-700 '></input>
                    </div>
                </div>
                <div className='flex gap-8 w-full h-full items-center'>
                    <div className='flex flex-col gap-1 w-full'>
                        <label  for='cin'>CIN</label>
                        <input id='cin' name="cin" value={data.cin} onChange={handle}  className='ring-1 ring-neutral-500 rounded-sm outline-none px-2 py-1 text-[16px] text-neutral-700 '></input>
                    </div>
                    <div className='flex flex-col gap-1 w-full'>
                        <label  for='email'>Email</label>
                        <input id='email' name="email" value={data.email} onChange={handle}  className='ring-1 ring-neutral-500 rounded-sm outline-none px-2 py-1 text-[16px] text-neutral-700 '></input>
                    </div>
                </div>

            <div className='flex gap-8 w-full h-full items-center'>
                <div className='flex flex-col gap-1 w-full'>
                    <label  for='rib'>RIB</label>
                    <input id='rib' name="rib" value={data.rib} onChange={handle}  className='ring-1 ring-neutral-500 rounded-sm outline-none px-2 py-1 text-[16px] text-neutral-700 '></input>
                </div>
                <div className='flex flex-col gap-1 w-full'>
                    <label  for='balance'>Initial Balance</label>
                    <input id='balance' name="balance" value={data.balance} onChange={handle}  className='ring-1 ring-neutral-500 rounded-sm outline-none px-2 py-1 text-[16px] text-neutral-700 '></input>
                </div>
            </div>
                <button  type="submit" className='py-2 px-6 bg-neutral-800 hover:bg-neutral-900 transition-all duration-300  text-white rounded-md mt-4 w-full'> Add Account  </button>
                <div className='text-[16px] text-neutral-600 flex justify-center ml-6 gap-5 w-full'>
                    <button type='button' className='hover:text-neutral-800' onClick={()=>props.setForm(2)}> View Account</button>
                    -
                    <button type='button'  className='hover:text-neutral-800' onClick={()=>props.setForm(3)}>View All Accounts </button>
                </div>
                <p className="text-red-500">{resp}</p>
            </form>
        )
    }