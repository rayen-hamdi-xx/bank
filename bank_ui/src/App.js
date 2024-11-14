import { useState } from 'react';
import './App.css';
import Form1 from './form1';
import Form2 from './form2';
import Form3 from './form3';
function App() {
    const [form,setForm] = useState(1);
  return (
    <div className='bg-slate-200 w-full h-[100vh] transition-all duration-300 flex items-center justify-center'>
        <div className='h-[80%] min-w-[40%] w-fit transition-all duration-300 bg-white p-8 drop-shadow-md rounded-lg flex flex-col items-center gap-12  '>
            <h1 className='text-[36px] font-semibold text-neutral-900'>Bank Mangement</h1>
            {form === 1 ? (
                    <Form1 setForm={setForm} />
            ) : form === 2 ? (
                    <Form2 setForm={setForm} />
            ) : (
                    <Form3 setForm={setForm} />
            )}
        </div>

    </div>
  )
}

export default App;