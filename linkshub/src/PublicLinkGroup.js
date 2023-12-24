import React, { useContext, useEffect } from 'react'
import Nav from './components/Nav'
import { LinksContext } from './context/LinksContext'
import { useParams } from 'react-router'

export default function PublicLinkGroup() {

    const {unique_string} = useParams()
   const {getPublicData,publicData, linksLoading} = useContext(LinksContext)

   useEffect(() => {
    getPublicData(unique_string)
   }, [])
  
   if(linksLoading){
    return(
      <div className='w-full h-full bg-white flex justify-center items-center' >
        <span className="loading loading-spinner text-info loading-lg"></span>
      </div>
    )
   }
   else{
    if(Object.keys(publicData).length !== 0){
      return(
      
          <div className='h-screen' >
              <Nav/>
              <div className='h-hull w-full bg-white' >
                  <div className='half-screen-container ' > 
                    <h1
                    className='text-3xl mb-10 font-extrabold text-center text-white'
                    > {publicData.link_group.name} </h1>
                  <div className='w-1/4 mx-auto flex flex-col gap-4' >
                  {publicData.links.length > 0 && (publicData.links.map((link)=>(
      
                    <a 
                    href={link.url} 
                    target='_blank'
                    className='btn btn-outline btn-accent text-white'
                    > 
                    {link.title} 
                    </a>
      
                  )))}
                  </div>
                  </div>
              </div>
      
          </div>
        )
      
    }
    else{
      return(
        <div className='w-full h-full bg-white flex justify-center items-center' >
          <p> No Data </p>
        </div>
      )
    }
   }

 
}
