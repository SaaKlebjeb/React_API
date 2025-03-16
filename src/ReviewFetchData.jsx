import { useEffect } from "react";
import { useState } from "react";

export default function ReviewFetchData() {
    const [Data,setData] = useState([]);
    const [Name,setName] = useState('');
    const [Email,setEmail] = useState('');
    useEffect(()=>{
        fetch('https://api.jsonbin.io/v3/b/67d238f08960c979a57077c0/latest',{
            method:'GET',
            headers:{
                 "X-Master-Key":'$2a$10$nLpUbmglxhqpx8Fg.BoJiecuJDl3tlqY7mYNqcieU9nOqAgmOERGa'
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
    },[])
    const TimeDate=new Date().toLocaleString();
    const HandleAdd = async (e) => {
        e.preventDefault();
    
        if (Name === '' || Email === '') {
            alert('Please fill all fields');
            return;
        }
    
        try {
            // ✅ Fetch latest data to prevent overwriting old data
            const res = await fetch('https://api.jsonbin.io/v3/b/67d238f08960c979a57077c0/latest', {
                method: 'GET',
                headers: {
                    "X-Master-Key": "$2a$10$nLpUbmglxhqpx8Fg.BoJiecuJDl3tlqY7mYNqcieU9nOqAgmOERGa"
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
                    "X-Master-Key": "$2a$10$nLpUbmglxhqpx8Fg.BoJiecuJDl3tlqY7mYNqcieU9nOqAgmOERGa"
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
    
  return (
    <>
    <div className="w-[40%] mx-auto p-5 shadow-lg rounded-lg h-auto mt-16">
        <form action="#">
            <label className="block">Enter name</label>
            <input onInput={(e)=>setName(e.target.value)} type="text" name="name" value={Name} placeholder="Name..." className="w-full h-12 mt-2 border-gray-500 outline-none focus:border-transparent focus:ring-sky-400 focus:ring-2 border-collapse border-2 b p-3  rounded-md" />
            <label className="block mt-3">Enter email</label>
            <input onInput={(e)=>setEmail(e.target.value)} type="text" name="email" value={Email} placeholder="Email..." className="w-full h-12 mt-2 border-gray-500 outline-none focus:border-transparent focus:ring-sky-400 focus:ring-2 border-collapse border-2 b p-3  rounded-md" />
            <div>
                <button onClick={HandleAdd} type="submit"  className="w-20 h-10 rounded-lg text-white font-bold mt-4 bg-green-400 hover:bg-green-500 active:scale-105">ADD</button>
            </div>
        </form>
        
    </div>
    <div className="w-[80%] mx-auto mt-10 p-5 shadow-lg rounded-lg overflow-x-auto">    
        <table className=" table-responsive border-2 w-full table-auto ">
            <thead>
                <tr className="w-full ">
                    <th className="text-center px-4 py-3 border-2 border-gray-500">ID</th>
                    <th className="text-center px-4 py-3 border-2 border-gray-500">Name</th>
                    <th className="text-center px-4 py-3 border-2 border-gray-500">Email</th>
                    <th className="text-center px-4 py-3 border-2 border-gray-500">Date</th>
                    <th className="text-center px-4 py-3 border-2 border-gray-500">Action</th>
                </tr>
            </thead>
            <tbody>
               {
                Data.length>0?(
                    Data.map((item)=>(
                    <tr key={item.id} className="w-full">
                        <td className="text-center px-4 py-3 border-2 border-gray-500">{item.id}</td>
                        <td className="text-center px-4 py-3 border-2 border-gray-500">{item.name}</td>
                        <td className="text-center px-4 py-3 border-2 border-gray-500">{item.email}</td>
                        <td className="text-center px-4 py-3 border-2 border-gray-500">{item.date}</td>
                        <td className="text-center   px-4 py-3 border-2 border-gray-500">
                           <div className="flex justify-center w-full flex-col sm:flex-row">
                           <button className="w-16 sm:w-14 m-2 h-12 mx-1 bg-yellow-400 rounded-md">Edit</button>
                           <button className="w-16 m-2 h-12 mx-1 bg-red-400 rounded-md">Delete</button>
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
