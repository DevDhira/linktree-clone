import React from 'react'
import Nav from './Nav'

export default function Layout({children}) {
  return (
    <div className='w-full h-screen' >

    <Nav/>

        <div className="h-full w-full">
            {children}
        </div>
    </div>
  )
}
