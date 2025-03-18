
import { useEffect } from "react";
import { useState } from "react";
// const API_URL=import.meta.env.VITE_JSONBIN_URL
// const API_KEY=import.meta.env.VITE_JSONBIN_KEY
// const API_UP_DEL=import.meta.env.VITE_JSONBIN_UPDATE_OR_DELETE

export default function ReviewFetchData() {
    const [Data,setData] = useState([]);
    const [Name,setName] = useState('');
    const [Email,setEmail] = useState('');
    const [EditID,setEditID] = useState('');
    
    //fetch
    const FetchData=async()=>{
        fetch('https://api.jsonbin.io/v3/b/67d238f08960c979a57077c0/latest',{
            method:'GET',
            headers:{
                "Accept": "application/json",
                 "X-Master-Key":'$2a$10$.qByQ.x2uNIFXkvsNYretuA2eAsncorzoSs3gO2/7w7BVERmxfUfi'
            }
        })
        .then((res)=>{
            if(!res.ok){
                throw new Error('Failed to fetch data')
            }
            return res.json()
        })
        .then(data=>{
            setData(data.record?.users|| [])
            console.log('My fetched data',data.record?.users)
        })
        .catch(err=>console.log(err))
    }

    useEffect(()=>{
       FetchData();
    },[])
    const TimeDate=new Date().toLocaleString();
    const HandleAdd = async (e) => {
        e.preventDefault();
    
        if (Name.trim() === '' || Email.trim() === '') {
            alert('Please fill all fields');
            return;
        }
    
        try {
            // ✅ Fetch latest data to prevent overwriting old data
            const res = await fetch('https://api.jsonbin.io/v3/b/67d238f08960c979a57077c0/latest', {
                method: 'GET',
                headers: {
                    "Accept": "application/json",
                    "X-Master-Key": '$2a$10$.qByQ.x2uNIFXkvsNYretuA2eAsncorzoSs3gO2/7w7BVERmxfUfi'
                }
                
            });
    
            const data = await res.json();
            let CurrentData = data.record?.users || []; // ✅ Ensure it's an array
    
            // ✅ Add new user to the existing array
            const newUser = {
                id: Date.now(),
                name: Name,
                email: Email,
                date: TimeDate
            };
            console.log('new user',newUser)
            const UpdatedData =[...CurrentData, newUser];
       
    
            // ✅ Save the updated array back to JSONBin
            await fetch('https://api.jsonbin.io/v3/b/67d238f08960c979a57077c0', {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": '$2a$10$.qByQ.x2uNIFXkvsNYretuA2eAsncorzoSs3gO2/7w7BVERmxfUfi'
                },
                body: JSON.stringify({users:UpdatedData}) // ✅ Ensures old data is not lost
            });
            console.log('old and new user',UpdatedData)
            // ✅ Update state so UI remains in sync
            setData(UpdatedData);
            setName("");
            setEmail("");
    
            console.log("Successfully updated JSONBin with new user:", newUser);
    
        } catch (err) {
            console.log("Error updating data:", err);
        }
    };

    //Handle Edit
    const HandleEdit=(item,id)=>{
        setEditID(id)
        setName(item.name)
        setEmail(item.email)
        }
    
    //button save after edit
    const HandleSave=async(e)=>{
        e.preventDefault();
        try{
            const response= await fetch('https://api.jsonbin.io/v3/b/67d238f08960c979a57077c0/latest',{
                method:'GET',
                headers:{
                    "Accept": "application/json",
                    "X-Master-Key":'$2a$10$.qByQ.x2uNIFXkvsNYretuA2eAsncorzoSs3gO2/7w7BVERmxfUfi'
                }
            })
            const data=await response.json();
            let CurrentData=data.record?.users || [];
            console.log("Current data func save",CurrentData)
            const UserForUpdate={
                id:EditID,
                name:Name,
                email:Email,
                date:TimeDate
            }
            console.log('User for update',UserForUpdate)
            const UpdatedUser=CurrentData.map((item)=>item.id===EditID?UserForUpdate:item)
            console.log('Updated user',UpdatedUser)
            // save it
            await fetch('https://api.jsonbin.io/v3/b/67d238f08960c979a57077c0',{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json',
                    "X-Master-Key":'$2a$10$.qByQ.x2uNIFXkvsNYretuA2eAsncorzoSs3gO2/7w7BVERmxfUfi'
                },
                body:JSON.stringify({users:UpdatedUser})
            })
            setData(UpdatedUser)
            setEditID(null)
            setName('')
            setEmail('')
        }
        catch(err){
            console.error("Error:", err);
        }
    }

    //delete
    const HandleDelete=async(id)=>{
        try{
            const res = await fetch('https://api.jsonbin.io/v3/b/67d238f08960c979a57077c0/latest', {
                method: 'GET',
                headers: {
                    "Accept": "application/json",
                    "X-Master-Key": '$2a$10$.qByQ.x2uNIFXkvsNYretuA2eAsncorzoSs3gO2/7w7BVERmxfUfi'
                }
                
            });
    
            const data = await res.json();
            let CurrentData = data.record?.users || []; // ✅ Ensure it's an array
           
            const DeletedData=CurrentData?.filter((item)=>item.id!==id) || [];

            await fetch('https://api.jsonbin.io/v3/b/67d238f08960c979a57077c0',{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json',
                    "X-Master-Key":'$2a$10$.qByQ.x2uNIFXkvsNYretuA2eAsncorzoSs3gO2/7w7BVERmxfUfi'
                },
                body:JSON.stringify({users:DeletedData})
            })
            setData(DeletedData)

        }
        catch(err){
            console.log('Message error:',err);
        }
    }
    //
    const SortedData=[...Data].sort((a,b)=>a.name.localeCompare(b.name))
    
  return (
    <>
    <div className="w-[40%] mx-auto p-5 shadow-xl rounded-xl h-auto mt-16">
        <form action="#">
            <label className="block">Enter name</label>
            <input onInput={(e)=>setName(e.target.value)} type="text" name="name" value={Name} placeholder="Name..." className="w-full h-12 mt-2 border-gray-500 outline-none focus:border-transparent focus:ring-sky-400 focus:ring-2 border-collapse border-2 b p-3  rounded-md" />
            <label className="block mt-3">Enter email</label>
            <input onInput={(e)=>setEmail(e.target.value)} type="text" name="email" value={Email} placeholder="Email..." className="w-full h-12 mt-2 border-gray-500 outline-none focus:border-transparent focus:ring-sky-400 focus:ring-2 border-collapse border-2 b p-3  rounded-md" />
            <div className="flex w-full justify-between items-center">
                <button onClick={EditID?HandleSave:HandleAdd} type="submit"  className="w-20 h-10 rounded-lg text-white font-bold mt-4 bg-green-400 hover:bg-green-500 active:scale-105">{EditID?'SAVE':'ADD'}</button>
                <button onClick={()=>{setName('');setEmail('');setEditID(null)}} type="reset" className="w-20 h-10 rounded-lg text-white font-bold mt-4 bg-red-400 hover:bg-red-500 active:scale-105">RESET</button>
            </div>
            
        </form>
        
    </div>
    <div className="w-[80%] mx-auto mt-10 p-5 shadow-2xl rounded-xl overflow-x-auto">    
        <table className=" table-responsive  w-full table-auto ">
            <thead>
                <tr className="w-full ">
                    <th className="text-center px-4 py-3 ">ID</th>
                    <th className="text-center px-4 py-3 ">Name</th>
                    <th className="text-center px-4 py-3 ">Email</th>
                    <th className="text-center px-4 py-3 ">Date</th>
                    <th className="text-center px-4 py-3 ">Action</th>
                </tr>
            </thead>
            <tbody>
               {
                SortedData.length>0?(
                    SortedData.map((item)=>(
                    <tr key={item.id} className="w-full">
                        <td className="text-center px-4 py-3 ">{item.id}</td>
                        <td className="text-center px-4 py-3 ">{item.name}</td>
                        <td className="text-center px-4 py-3 ">{item.email}</td>
                        <td className="text-center px-4 py-3 ">{item.date}</td>
                        <td className="text-center   px-4 py-3 ">
                           <div className="flex justify-center w-full flex-col sm:flex-row">
                               <svg onClick={()=>HandleEdit(item,item.id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-7 m-2 text-yellow-600 active:scale-110 hover:cursor-pointer">
                                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                               </svg>

                               <svg onClick={()=>HandleDelete(item.id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-7 m-2 text-red-500 active:scale-110 hover:cursor-pointer">
                                <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                               </svg>

                           </div>
                        </td>
                    </tr>
                    ))
                  ):(
                        <tr>
                                <td colSpan="4" className="text-center py-3">No data found</td>
                        </tr>
                    )
               }
            </tbody>
        </table>
      
    </div>
    </>
  )
}
