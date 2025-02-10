import axios from 'axios'
import  { useRef } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'


const FetchExample = () => {
  const [Data,setData]= useState([])
  const [newName,setNewName]=useState('')
  const [editId,setEditId]=useState(null)
  const inputRef=useRef(null);
  const Focus=()=>{
    inputRef.current.focus();
  }
  
  useEffect(()=>{
    axios.get('http://localhost:3000/users')
          .then((response)=>{
            setData(response.data);
          })
          .catch((error)=>{
            console.error("Error",error)
          })
  },[]);
  const HandleAdd = (e) => {
    e.preventDefault();
    if(newName===''){
      alert('Complete the name first....!')
      return;
     }     
   if(editId){
    axios.put(`http://localhost:3000/users/${editId}`,{
      name:newName
    })
    .then(()=>{
      setData((prevData)=>
        prevData.map((item)=> editId===item.id?{...item,name:newName}:item)
      )
      setNewName('')
      setEditId(null)
      Focus();
    })
    .catch((error)=>{
      console.error('Error:',error)
    })
   }
   else{
    axios.post('http://localhost:3000/users',{
      id:Date.now().toString(),
      name:newName
    })
    .then((response)=>{
      setData((prevData) => [...prevData, response.data]); 
      setNewName('');
      Focus();
    })
    .catch((error)=>{
      console.error("Error:",error)
    })
   }
    console.log(Data)
  };
  const HandleChange=(e)=>{
    setNewName(e.target.value);
  }
  const HandleDelete=(id)=>{
    console.log(id)
    axios.delete(`http://localhost:3000/users/${id}`)
    .then(()=>{
      console.log('success')
      setData((prevData)=>prevData.filter((items)=>items.id!==id))
    })
    .catch((error)=>{
      console.error("Error:",error)
    })
  }
const HandleEdit=(id,index)=>{
  setEditId(id);
  const ToEdit=Data[index];
  setNewName(ToEdit.name);
}
const HandleCancel=()=>{
  setEditId(null);
  setNewName('')
  Focus();
}
  
  return (
    <div>
      <h1 className='text-center mt-3'>Data Fetch from data.json</h1>
      <div className='w-50 mx-auto mt-2 mb-2'>
        <label className='form-label'>Input name</label>
        <input type="text" className='form-control 'onChange={HandleChange} ref={inputRef} value={newName} placeholder='input name' />
        <button type='button' className='btn btn-success mt-3' onClick={HandleAdd} >{editId!==null?"SAVE":"ADD"}</button>
        <button type='reset' className='btn btn-danger mt-3 mx-3' onClick={HandleCancel}>Cancel</button>
      </div>
      <div className=' d-flex rounded-5 flex-column p-5 gap-4  w-75  mx-auto shadow list-unstyled fs-3 fw-bold'>
      
        {Data.map((item,index) => (
            <div key={item.id} className="w-100 d-flex p-2 justify-content-between align-items-center ">
           <h2>{item.name}</h2>
            <div>
            <button type='button' className='btn btn-danger ' onClick={()=>HandleDelete(item.id)} >Delete</button>
            <button type='button' className='btn btn-warning ms-3' onClick={()=>HandleEdit(item.id,index)}>Edit</button>
            </div>
            </div>
        
        ))}
      
      </div>
    </div>
  )
}

export default FetchExample
