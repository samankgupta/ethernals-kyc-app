import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from '../supabaseClient'
function Login() {

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
      document.getElementById("signinform").reset();
      toast.success("Sign In successful!", {
        theme: "dark"
      })
      setTimeout(() => {
        window.location = "/";
      }, 3000)
    }
  }

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={2500}
      />
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
                  Sign In
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
                <div className="mt-4 text-center">
                  <p className="text-sm">Don't have an account yet?<a href="/register"
                    className="text-blue-600 hover:underline"> Sign Up.</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login