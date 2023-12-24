import React, { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Nav() {


  const location = useLocation()

  const isDashboard = location.pathname.startsWith('/dashboard')
  const navigate = useNavigate()

  const { onLogout } = useContext(AuthContext)

  const handleLogout = async () => {

    await onLogout()
    navigate('/login')

  }

  return (
    <header className="text-gray-600 body-font shadow w-full h-16 flex items-center">
      <div className="w-full flex justify-between items-center px-4">
        <div>
          <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="ml-3 text-xl">LinksHub</span>
          </a>
        </div>

    { isDashboard ?(
       <div className='flex gap-7 justify-end items-center '>

        <Link to={'/dashboard'} className='' > Dashboard </Link>
      
       <button 
       className='btn btn-error btn-outline btn-sm text-white'
       onClick={handleLogout}
       >Logout
         <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
           <path d="M5 12h14M12 5l7 7-7 7"></path>
         </svg>
       </button>
     </div>
    ) :(
      <div className='flex gap-3'>
      <nav className=" md:ml-auto flex-wrap flex items-center text-base justify-center">
        <Link to={'/'} className="mr-5 hover:text-gray-900">Home</Link>
      </nav>
      <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
        <Link to={'/register'} className="mr-5 hover:text-gray-900">Register</Link>
      </nav>
      <Link to={'/login'} className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Login
        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7"></path>
        </svg>
      </Link>
    </div>
    )}


       
      </div>

    </header>
  )
}
