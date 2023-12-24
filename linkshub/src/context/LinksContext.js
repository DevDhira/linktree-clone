import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'


export const LinksContext = createContext()

axios.defaults.baseURL = 'http://127.0.0.1:8000'
if (localStorage.getItem('auth_token')) {
  axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('auth_token')}`
}
export default function LinksProvider({ children }) {

  const [linkGroups, setLinkGroups] = useState([])
  const [currentLinkGroup, setCurrentLinkGroup] = useState({})
  const [linksLoading, setLinksLoading] = useState(false)
  const [publicData, setPublicData] = useState({})

  useEffect(() => {
    console.log(currentLinkGroup)  
  }, [currentLinkGroup])
  



  const createGroup = async (name) => {

    setLinksLoading(true)
    let id = ''

    const data = {
      name
    }


    await axios.post('/api/user/linkgroups/create/', data)
      .then(response => {
        id = response.data.id
      })
      .catch(error => {
        console.log(error)
      })

    setLinksLoading(false)
    return id

  }

  const getAllLinks = async () => {
    setLinksLoading(true)

    await axios.get('/api/user/linkgroups/')
      .then(response => {
        setLinkGroups(response.data)
      })
      .catch((error) => {
        console.log(error)
      })

    setLinksLoading(false)
  }

  const deleteGroup = async (id) => {
    setLinksLoading(true)

    await axios.delete(`/api/user/linkgroups/${id}/`)
      .catch((error) => console.log(error))

    getAllLinks()

    setLinksLoading(false)
  }

  const getLinkGroup = async (id)=>{
    setLinksLoading(true)
    console.log("Called Get Links")
    await axios.get(`/api/group/${id}/links/`)
      .then(response => {
        setCurrentLinkGroup(response.data)
      })
      .catch((error) => {
        console.log(error)
      })

    setLinksLoading(false)
  }

  const updateLinks = async (id) => {
    setLinksLoading(true)
    await axios.post(`/api/group/${id}/links/`, currentLinkGroup)
    .then((response) => {
      console.log(response.data)
    })
    .catch((error)=>{
      console.log(error)
    })


    setLinksLoading(false)
  }

  const getPublicData = async (uniqie_string) => {

    setLinksLoading(true)
     
    await axios.get(`/r/${uniqie_string}/`)
    .then((response) => {
      setPublicData(response.data)
    })
    .catch((error) => {
      console.log(error)
    })

    setLinksLoading(false)

  }

  return (
    <LinksContext.Provider

      value={{
        createGroup,
        linkGroups,
        getAllLinks,
        linksLoading,
        deleteGroup,
        updateLinks,
        getLinkGroup,
        setCurrentLinkGroup,
        currentLinkGroup,
        getPublicData,
        publicData
      }}

    >
      {children}
    </LinksContext.Provider>
  )
}
