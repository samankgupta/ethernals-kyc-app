import React, { useState } from 'react'
import './homeStyles.css'
import { ToastContainer, toast } from 'react-toastify';
import { WebcamCapture } from './Webcam'
import { supabase } from '../supabaseClient'
import { Web3Storage } from 'web3.storage'


const Home = () => {

  const [loading, setLoading] = React.useState(false)
  const [userStatus, setUserStatus] = React.useState("new user")
  const user = supabase.auth.user()
  if (!user) {
    window.location = "/login";
  }

  const checkUserStatus = async () => {
    const { data, error } = await supabase
      .from('User')
      .select()
    for (let i = 0; i < data.length; i++) {
      if (data[i].email === user.email && data[i].name === user.user_metadata.name) {
        if (!data[i].cid) {
          setUserStatus("new user");
        }
        else {
          if (data[i].isVerified == true)
            setUserStatus("kyc approved");
          else
            setUserStatus("kyc pending");
        }
        break;
      }
    }
  }

  React.useEffect(() => {
    checkUserStatus()
  }, [])


  const [image, setImage] = useState('');

  const handleCallback = (childData) => {
    setImage(childData)
  }

  function makeStorageClient() {
    return new Web3Storage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDdmODc2ZDA3OTE1ZUQ2ODA3NmFhYzU3YzBhMDZlYzgwODUyNDk4QUYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDkwNTUyODMwNTYsIm5hbWUiOiJldGhlcm5hbHMifQ.JCQtNe3a_GjjqBuIGXnWZVPNwK79cjIisNPdJjhgRJA" })
  }

  function getFiles() {
    const fileInput = document.querySelectorAll('input[type="file"]')
    let tempFiles = []
    for (let i = 0; i < fileInput.length; i++) {
      if (fileInput[i].files[0])
        tempFiles.push(fileInput[i].files[0])
    }
    return tempFiles
  }

  async function storeFiles(files) {
    const client = makeStorageClient()
    const cid = await client.put(files)
    const { data, error } = await supabase
      .from('User')
      .update({ cid: cid })
      .match({ name: supabase.auth.user().user_metadata.name })
    if (data) {
      toast.success("KYC application successful!", {
        theme: "dark"
      })
      setLoading(false)
      setTimeout(() => {
        window.location.reload();
      }, 3000)
    }
  }

  const logOut = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signOut()
    if (!error) {
      window.location = '/login';
    }
  }


  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    let files = getFiles()
    if (image) {
      fetch(image)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "Photo Captured.png", { type: "image/png" })
          files.push(file)
          if (files.length != 3) {
            setLoading(false)
            toast.error("Upload your photo, Aadhar Card and PAN Card", {
              theme: "dark"
            })
          }
          else
            storeFiles(files)
        })
    }
    else {
      setLoading(false)
      toast.error("Capture your photo to submit your KYC Application", {
        theme: "dark"
      })
    }
  };

  return (
    <div className="home-container">
      <ToastContainer
        position="top-right"
        autoClose={2500}
      />
      <div className="container">
        <div className="text">
          <div className="flex justify-center items-center mb-6">
            <h1>Decentralized KYC Platform</h1>
            <button onClick={logOut} className="text-gray-900 font-bold py-2 px-5 rounded text-md bg-red-400 hover:bg-red-500 ml-6">Logout</button>
          </div>
          {userStatus === "new user" ?
            <form className="form" onSubmit={handleSubmit}>
              <WebcamCapture parentCallback={handleCallback} />
              Aadhar Card Image:<input type="file" accept=".jpg, .jpeg, .png" />
              Pan Card Image:<input type="file" accept=".jpg, .jpeg, .png" />
              {/* <input type="file" /> */}
              <button type="submit" className="button mt-4 inline-flex justify-center ">Submit {loading ? <svg class="animate-spin ml-2 mt-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg> : ''}</button>
            </form>
            :
            userStatus === "kyc pending" ?
              <div className="mt-4">
                <p className='text-3xl font-bold my-10'>Your KYC application is under verification.</p>
                <button onClick={logOut} className="text-gray-900 font-bold py-2 px-5 rounded text-md bg-red-400 hover:bg-red-500 mr-6">Logout</button>
              </div>
              :
              <div className="mt-4">
                <p className='text-3xl font-bold my-10'>Your KYC application is approved!</p>
                <button onClick={logOut} className="text-gray-900 font-bold py-2 px-5 rounded text-md bg-red-400 hover:bg-red-500 mr-6">Logout</button>
              </div>
          }
        </div>
      </div>
    </div>
  )
}
export default Home