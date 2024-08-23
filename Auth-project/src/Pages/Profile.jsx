import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import{getDownloadURL, getStorage, uploadBytesResumable} from 'firebase/storage'
import{ app } from '../firebase'
import { ref } from 'firebase/storage'
import { useDispatch } from 'react-redux'
import { updateUserStart, updateUserfailure, updateUserSuccess, deleteUserSuccess, deleteUserfailure, deleteUserStart, signOut} from '../redux/User/userSlice'



export default function Profile() {
  const dispatch = useDispatch();
  

  const fileRef = useRef(null);
  const[image, setImage]= useState(undefined);
  const[imagePercent, setImagePercent]= useState(0);
  const[imageError, setImageError]= useState(false);
  const[formData, setformData]= useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
 

    const {currentUser, loading, error} =  useSelector(state => state.user)
    useEffect(()=>{
      if(image){
        handleFileUpload(image);
      }
    },[image]);

    const handleFileUpload = async (image) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + image.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, image);
  
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImagePercent(Math.round(progress));
        },
        (error) => {
          setImageError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            setformData({ ...formData, profilePicture: downloadURL });
          });
        }
      );
    };

    const handleChange = (e) =>{
      setformData ({...formData, [e.target.id]: e.target.value});
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        dispatch(updateUserStart());
        
        // Assuming you store the authentication token in local storage or Redux
        const token = currentUser.token || localStorage.getItem('token');
        
        const res = await fetch(`/api/user/update/${currentUser._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,  // Include the token in the headers
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        console.log('API Response:', data);
    
        if (data.success === false) {
          dispatch(updateUserfailure(data));
          return;
        }
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
      } catch (error) {
        console.error('Update error:', error);
        dispatch(updateUserfailure(error));
      }
    };

    const handleDeleteAccount = async ()=>{
      try{
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method:'DELETE',
       });
       const data = await res.json();
       console.log(data);
       
       if(data.success===false){
        dispatch(deleteUserfailure(data))
        return;
       }
       dispatch(deleteUserSuccess(data))
      }catch(error){
        dispatch(deleteUserfailure(error))

      }
    }

    const handleSignOut = async()=>{
      try{
        await fetch('/api/auth/signout');
        dispatch(signOut());
      }
      catch(error){
        console.log(error);
      }
    }
    

    

//     const handleSubmit = async (e) =>{
//       e.preventDefault();
//       try{
//         dispatch(updateUserStart());
//         const res = await fetch(`/api/user/update/${currentUser._id}`, {
//           method: 'POST', 
//           headers:{
//             'Content-Type':'application/json'      
//               },
//               body:JSON.stringify(formData),
//         });
//         const data = await res.json();
//         if (data.success  === false){
//           dispatch(updateUserfailure(data));
//           return;
//         }
//         dispatch(updateUserSuccess(data));
//         setUpdateSuccess(true);
        
//       } catch(error){
//         dispatch(updateUserfailure(error));
// }
//     };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font font-semibold text-center
      my-7'>Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4"> 
        <input type="file" ref={fileRef} hidden  accept='image/*' onChange={(e)=> setImage(e.target.files[0])}/>
        
        {/* 
        Firebase storage rules:
        allow read;
      allow write:if 
      request.resource.size<2*1024*1024 &&
      request.resource.contentType.matches('image/.*') */}

        <img src={formData.profilePicture || currentUser.profilePicture} alt="profile"
        className='h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2' 
        onClick={()=> fileRef.current.click()}/>

        <p className='text-sm self-center'>
          {imageError?(
            <span className='text-red-700'> Error uploading image (File must be less than 2MB)</span>): imagePercent>0 && imagePercent<100 ? (
              <span className='text-slate-700'> {`Uploading image: ${imagePercent}% `}</span> ): 
              imagePercent===100?(
                <span className='text-green-700'> Image uploaded successfully</span>) : ''}
              
        </p>
      
      <input  defaultValue ={currentUser.username}type="text"  id='username' placeholder='Username' 
      className='bg-slate-100 rouned-lg p-3' onChange={handleChange} />

      <input  defaultValue ={currentUser.email}type="email"  id='email' placeholder='E-mail'
       className='bg-slate-100 rouned-lg p-3' onChange={handleChange} />

      <input type="text"  id='password' placeholder='Password'
       className='bg-slate-100 rouned-lg p-3'  onChange={handleChange} />


<button 
  className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-85' 
  disabled={loading}>
  {loading ? 'Loading...' : 'Update'}
</button>

      
      </form>
      <div className='flex justify-between mt-4'>
        <span  onClick ={handleDeleteAccount}className='text-red-600 cursor-pointer'>  Delete Account </span>
          <span onClick={handleSignOut}  className='text-red-600 cursor-pointer'> Sign Out </span>
      </div>
      <p className='text-red-700 mt-5'>{error && 'Something went wrong!'}</p>
      <p className='text-green-700 mt-5'>{updateSuccess && 'User is updated successfully'}</p>
      
    </div>
  )
}
