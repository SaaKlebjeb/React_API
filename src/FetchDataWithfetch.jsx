import { useEffect, useRef, useState } from 'react'

const FetchDataWithfetch = () => {
    const [Data,setData]=useState([])
    const [name,setName]=useState('')
    const [email,setEmail]=useState('');
    const [editId,setEditId]=useState(null)
    const [sort,setSort]=useState('asc')
    const inputRef=useRef(null);
    const Focus=()=>{
      inputRef.current.focus();
    }

    useEffect(()=>{
        fetch('http://localhost:3000/users')
        .then((response)=>response.json())
        .then((data)=>setData(data))
        .catch((error)=>  console.error('Error:',error))
        console.log(Data)
    },[Data])
    const HandleChange=(e)=>{
        const {name,value}=e.target;
        if(name==='name'){
          setName(value);
        }
        else if(name==='email'){
          setEmail(value)
        }
    }
    const HandleAdd = (e) => {
      e.preventDefault();
    
      if (name === '' || email === '') {
        alert('Complete form first...!');
        return Focus();
      }
    
      const currentDate = new Date().toLocaleString(); // Get the current date and time
    
      if (editId) {
        fetch(`http://localhost:3000/users/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: editId,
            Name: name,
            Email: email,
            Date: currentDate, // Update the date when editing
          }),
        })
          .then((response) => response.json())
          .then((updatedUser) => {
            const updatedData = Data.map((item) =>
              item.id === editId ? updatedUser : item
            );
            setData(updatedData);
            setName('');
            setEmail('');
            setEditId(null);
            Focus();
          })
          .catch((error) => console.error('Error:', error));
      } else {
        fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: Date.now().toString(),
            Name: name,
            Email: email,
            Date: currentDate, // Add the current date and time
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            setData([...Data, data]);
            setName('');
            setEmail('');
            setEditId(null);
            Focus();
          })
          .catch((error) => console.error('Error:', error));
      }
    };
    
    const HandleDelete=(id)=>{
      fetch(`http://localhost:3000/users/${id}`,{
        method:'DELETE',
      })
      .then(()=>{
          setData((prevData)=>prevData.filter((item)=>item.id!==id))
      })
      .catch((error)=>{
        console.error("Error:",error);
      })

    }
     const HandleEdit=(id,index)=>{
      setEditId(id)
      const ToEdit=Data[index];
      setName(ToEdit.Name);
      setEmail(ToEdit.Email);
      Focus()
    }
    const HandleCancel=()=>{
      setEditId(null);
      setName('');
      setEmail('');
      Focus();
    }
    const HandleSorted=()=>{
      setSort(sort==='asc'?'dsc':'asc');
    }
    const DatawithSorted=Data.sort((a,b)=> sort==='asc'? a.Name.localeCompare(b.Name):b.Name.localeCompare(a.Name))
  return (
    <div >
      <h1 className='text-center mt-5 underline text-blue-600 font-sans text-2xl font-bold uppercase'>Fetch Data With AJAX(Fetch)</h1>
      <div className='w-[100%] md:w-[70%] text-center bg-white shadow-2xl rounded-xl mx-auto mt-5 text-lg p-4 '>
        <form className='w-full p-3'>
            <label className='block w-full text-start'>Enter name</label>
            <input type="text" id='name' name='name' ref={inputRef} onChange={HandleChange} value={name} className='mt-3 w-full p-2 focus:ring focus:border-gray-50  rounded-md border-2 border-gray-400 outline-none'  placeholder='Input name' required />
            <label className='block w-full text-start mt-1'>Enter email</label>
            <input type="text" id='email' name='email' onChange={HandleChange} value={email} className='mt-3 w-full p-2 focus:ring focus:border-gray-50  rounded-md border-2 border-gray-400 outline-none'  placeholder='Input email' />
        </form>
        <div className='text-start w-full flex flex-col items-center sm:flex-row justify-between p-3'>
            <div className='flex flex-col md:flex-row justify-center items-center'>
              <button className='md:w-16 w-20  h-10 text-md bg-green-500 hover:bg-green-600 rounded-lg' onClick={HandleAdd}>{editId===null?'Add':'Save'}</button>
              <button type='button' className='w-20 mt-2 md:mt-0 h-10 text-md  md:ml-2 bg-red-600 rounded-lg hover:bg-red-700' onClick={HandleCancel}>Cancel</button>
            </div>
            <div className='md:w-[35%] mr-2 p-1 w-[100%] flex justify-center items-center mt-2 sm:w-[35%] '>
              <button type='button' className='md:w-40 w-72 p-2 md:p-0 h-16 flex justify-center items-center  sm:h-10  ml-2 md:ml-0 md:mt-0 bg-blue-500 font-semibold rounded-lg hover:bg-blue-600' onClick={HandleSorted}>Sort {sort==='asc'?'Descending':'Ascending'}</button>
            </div>
        </div>
      </div>
      <div className='overflow-x-auto mx-auto p-1 shadow-2xl rounded-md mt-10'>
        <table className='w-full mx-auto border-collapse border-2  table-auto'>
        <thead>
  <tr className='bg-slate-800 text-white'>
    <th className='border border-gray-300 px-4 py-4'>ID</th>
    <th className='border border-gray-300 px-4 py-4'>Name</th>
    <th className='border border-gray-300 py-4'>Email</th>
    <th className='border border-gray-300 py-4'>Date</th>
    <th className='border border-gray-300 px-4 py-4'>Action</th>
  </tr>
</thead>
<tbody>
  {DatawithSorted.map((item, index) => (
    <tr key={index} className='text-center'>
      <td className='border border-gray-400 px-4 py-4'>{item.id}</td>
      <td className='border border-gray-400 px-4 py-4'>{item.Name}</td>
      <td className='border border-gray-400 px-4 py-4'>{item.Email}</td>
      <td className='border border-gray-400 px-4 py-4'>{item.Date}</td>
      <td className='border border-gray-400 px-4 py-4 flex flex-col justify-center items-center sm:flex-row '>
        <button
          type='button'
          className='btn-add w-16 h-10 bg-red-600 hover:bg-red-700 rounded-md'
          onClick={() => HandleDelete(item.id)}
        >
          Delete
        </button>
        <button
          type='button'
          className='btn-edit w-16 h-10 bg-yellow-300 hover:bg-yellow-400 rounded-md mt-2 sm:w-12 sm:ml-2 sm:mb-2'
          onClick={() => HandleEdit(item.id, index)}
        >
          Edit
        </button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
    </div>
  )
}

export default FetchDataWithfetch
