import axios from "axios";
import { useState } from "react";

export default function Form3(props) {
    const [resp, setResponse] = useState([]);

    const sendSoapRequest = async (e) => {
        e.preventDefault();
        const url = 'http://127.0.0.1:8000/bank/management/';
        const soapEnvelope = `<x:Envelope xmlns:x="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ban="bank.isg.tn">
            <x:Header/>
            <x:Body>
                <ban:get_all_accounts></ban:get_all_accounts>
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

            let accounts = [];
            let data = xmlDoc.getElementsByTagName("s0:Account");

            for (let acc of data) {
                const rib = acc.getElementsByTagName("s0:rib")[0]?.textContent;
                const cin = acc.getElementsByTagName("s0:client")[0].getElementsByTagName("s0:cin")[0]?.textContent;
                const name = acc.getElementsByTagName("s0:client")[0].getElementsByTagName("s0:name")[0]?.textContent;
                const familyName = acc.getElementsByTagName("s0:client")[0].getElementsByTagName("s0:familyName")[0]?.textContent;
                const email = acc.getElementsByTagName("s0:client")[0].getElementsByTagName("s0:email")[0]?.textContent;
                const balance = acc.getElementsByTagName("s0:balance")[0]?.textContent;
                const balanceValue = balance ? balance.replace("Decimal('", '').replace("')", '') : ''; // Cleaning up the balance value
                const creationDate = acc.getElementsByTagName("s0:creationDate")[0]?.textContent;

                accounts.push({ rib, cin, name, familyName, email, balanceValue, creationDate });
            }

            setResponse(accounts);

        } catch (error) {
            setResponse('Error occurred while fetching the accounts');
        }
    };

    return (
        <form onSubmit={sendSoapRequest} className='text-neutral-800 transition-all duration-300 font-regular text-[18px] px-8 w-full flex flex-col items-center gap-6'>
            <table className="min-w-full table-auto border-collapse bg-neutral-100 text-neutral-700">
                <thead>
                    <tr className="bg-neutral-600 text-white">
                        <th className="px-4 py-2 text-left">rib</th>
                        <th className="px-4 py-2 text-left">cin</th>
                        <th className="px-4 py-2 text-left">name</th>
                        <th className="px-4 py-2 text-left">family</th>
                        <th className="px-4 py-2 text-left">mail</th>
                        <th className="px-4 py-2 text-left">balance</th>
                        <th className="px-4 py-2 text-left">creation</th>
                    </tr>
                </thead>
                <tbody>
                    {resp.length === 0 ? (
                        <tr><td colSpan="7" className="text-center px-4 py-2 text-neutral-500">No accounts found</td></tr>
                    ) : (
                        resp.map((acc, index) => (
                            <tr key={index} className={`border-t ${index % 2 === 0 ? 'bg-neutral-50' : 'bg-neutral-200'}`}>
                                <td className="px-4 py-2">{acc.rib}</td>
                                <td className="px-4 py-2">{acc.cin}</td>
                                <td className="px-4 py-2">{acc.name}</td>
                                <td className="px-4 py-2">{acc.familyName}</td>
                                <td className="px-4 py-2">{acc.email}</td>
                                <td className="px-4 py-2">{acc.balanceValue}</td>
                                <td className="px-4 py-2">{acc.creationDate}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <button type="submit" className='py-2 px-6 bg-neutral-800 hover:bg-neutral-900 transition-all duration-300 text-white rounded-md mt-4 w-full'>
                View All
            </button>
            <div className='text-[16px] text-neutral-600 flex justify-center ml-6 gap-5 w-full'>
                <button type="button" className='hover:text-neutral-800' onClick={() => props.setForm(1)}>
                    Add Account
                </button>
                -
                <button type="button" className='hover:text-neutral-800' onClick={() => props.setForm(2)}>
                    View Account
                </button>
            </div>
        </form>
    );
}
