import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from '../supabaseClient'
function Admin() {

  const [isAdmin, setIsAdmin] = React.useState(false)
  const [allUsers, setAllUsers] = React.useState([])

  const getUsers = async () => {
    if (isAdmin) {
      const { data, error } = await supabase
        .from('User')
        .select()
      setAllUsers(data)
    }
  }
  const checkUser = async () => {
    const user = supabase.auth.user()
    if (user) {
      const { data, error } = await supabase
        .from('Admin')
        .select()
      for (let i = 0; i < data.length; i++) {
        if (data[i].email === user.email && data[i].name === user.user_metadata.name) {
          setIsAdmin(true)
          break;
        }
      }
    }
  }
  React.useEffect(() => {
    checkUser()
    getUsers()
  }, [isAdmin])

  const verifyUser = async (name) => {
    const { data, error } = await supabase
      .from('User')
      .update({ isVerified: true })
      .match({ name: name })
    if (data) {
      toast.success("User Verified!", {
        theme: "dark"
      })
      setTimeout(() => {
        window.location.reload();
      }, 3000)
    }
  }

  const logOut = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signOut()
    if (!error) {
      window.location.reload();
    }
  }

  const submitForm = async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { user, session, error } = await supabase.auth.signIn(
      {
        email: email,
        password: password,
      }
    )
    if (error) {
      toast.error(error.message, {
        theme: "dark"
      })
    } else if (user) {
      const { data, error } = await supabase
        .from('Admin')
        .select()
      for (let i = 0; i < data.length; i++) {
        if (data[i].email === user.email && data[i].name === user.user_metadata.name) {
          setIsAdmin(true)
          break;
        }
      }
      if (isAdmin) {
        document.getElementById("signinform").reset();
        toast.success("Sign In successful!", {
          theme: "dark"
        })
      }
      else {
        toast.error("You are not an admin!", {
          theme: "dark"
        })
        const { error } = await supabase.auth.signOut()
      }
    }
  }
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={2500}
      />
      {!isAdmin ?
        <div className="flex items-center min-h-screen bg-gray-50">
          <div className="flex-1 h-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
            <div className="flex flex-col md:flex-row">
              <div className="h-32 md:h-auto md:w-1/2">
                <img className="object-cover w-full h-full" src="https://source.unsplash.com/user/erondu/1600x900"
                  alt="img" />
              </div>
              <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
                <div className="w-full">
                  <div className="flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 text-blue-600" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path
                        d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                  </div>
                  <h1 className="mb-4 text-2xl font-bold text-center text-gray-700">
                    Admin Sign In
                  </h1>
                  <form id='signinform'>
                    <div className="mt-4">
                      <label className="block text-sm">
                        Email
                      </label>
                      <input type="email"
                        id='email'
                        className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                        placeholder="Email Address" />
                    </div>
                    <div>
                      <label className="block mt-4 text-sm">
                        Password
                      </label>
                      <input
                        id='password'
                        className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                        placeholder="Password" type="password" />
                    </div>
                    <button
                      onClick={submitForm}
                      className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
                      href="#">
                      Sign In
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        :
        <div>
          <div className="flex justify-center items-center mt-6 my-10">
            <h2 className='text-2xl text-center font-bold mr-4'>Admin Area</h2>
            <button onClick={logOut} className="text-gray-900 font-bold py-2 px-5 rounded text-md bg-red-400 hover:bg-red-500 mr-6">Logout</button>
          </div>
          <h1 className='text-xl font-semibold my-4'>Unverified Users</h1>
          <div className="w-2/3 mx-auto">
            <div className="bg-white shadow-md rounded my-6">
              <table className="text-left w-full border-collapse">
                <thead>
                  <tr>
                    <th className="py-4 px-6 bg-gray-400 font-bold uppercase text-sm text-gray-900 border-b border-gray-600">Name</th>
                    <th className="py-4 px-6 bg-gray-400 font-bold uppercase text-sm text-gray-900 border-b border-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map(user =>
                    !user.isVerified ?
                      <tr className="hover:bg-gray-100">
                        <td className="py-4 px-6 border-b border-gray-600">{user.name}</td>
                        <td className="py-4 px-6 border-b border-gray-600">
                          <button onClick={() => verifyUser(user.name)} className="text-gray-900 font-bold py-1 px-3 rounded text-xs bg-green-400 hover:bg-green-500 mr-6">Verify</button>
                          <a href={"https://" + user.cid + ".ipfs.dweb.link/"} target="_blank" className="text-gray-900 font-bold py-1 px-3 rounded text-xs bg-blue-400 hover:bg-blue-500">View Details</a>
                        </td>
                      </tr>
                      :
                      ''
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <h1 className='text-xl font-semibold mt-12 mb-4'>Verified Users</h1>
          <div className="w-2/3 mx-auto">
            <div className="bg-white shadow-md rounded my-6">
              <table className="text-left w-full border-collapse">
                <thead>
                  <tr>
                    <th className="py-4 px-6 bg-gray-400 font-bold uppercase text-sm text-gray-900 border-b border-gray-600">Name</th>
                    <th className="py-4 px-6 bg-gray-400 font-bold uppercase text-sm text-gray-900 border-b border-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map(user =>
                    user.isVerified ?
                      <tr className="hover:bg-gray-100">
                        <td className="py-4 px-6 border-b border-gray-600">{user.name}</td>
                        <td className="py-4 px-6 border-b border-gray-600">
                          <button className="text-gray-900 font-bold py-1 px-3 rounded text-xs bg-green-500 mr-6" disabled>Verified</button>
                          <a href={"https://" + user.cid + ".ipfs.dweb.link/"} target="_blank" className="text-gray-900 font-bold py-1 px-3 rounded text-xs bg-blue-400 hover:bg-blue-500">View Details</a>
                        </td>
                      </tr>
                      :
                      ''
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default Admin