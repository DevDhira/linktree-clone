import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { LinksContext } from '../context/LinksContext'
import { BiEdit , BiTrashAlt, BiPlus,BiRefresh  } from "react-icons/bi";

export default function EditLinkGroup() {

  const [editingLinks, setEditingLinks] = useState({})
  const [editingGroupName, setEditingGroupName] = useState('')
  const [linkTitle, setLinktitle] = useState('')
  const [linkUrl, setLinkurl] = useState('')

  const { updateLinks, getLinkGroup, linksLoading, setCurrentLinkGroup, currentLinkGroup } = useContext(LinksContext)

  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {

    const check = () => {
      const isAuth = localStorage.getItem('isAuthenticated')
      if (isAuth == null) {
        navigate('/login')
      }
    }
    check()

  }, [])

  useEffect(() => {
    const getLinks = async () => {
      await getLinkGroup(id)
    }

    getLinks()
    console.log(currentLinkGroup)
  }, [])

  const handleAddLink = () => {

    setCurrentLinkGroup((prev) => ({
      ...prev,
      links: [
        ...prev.links,
        {
          title: linkTitle,
          url: linkUrl
        }
      ]
    }))

    setLinktitle('')
    setLinkurl('')

  }

  const handleGroupNameEditClick = () => {
    setEditingGroupName(true)
  }

  const handleGroupNameSaveClick = () => {
    setEditingGroupName(false)
  }

  const handleGroupNameCancelClick = () => {
    setEditingGroupName(false)
  }

  const handleEditClick = (link_id) => {
    setEditingLinks((prevEditingLinks) => ({
      ...prevEditingLinks,
      [link_id]: true
    }))
  }

  const handleSaveClick = (link_id, updatedTitle, updatedUrl) => {

    setEditingLinks((prevEditingLinks) => ({
      ...prevEditingLinks,
      [link_id]: false
    }))

  }

  const cancelClick = (link_id) => {
    setEditingLinks((prevEditingLinks) => ({
      ...prevEditingLinks,
      [link_id]: false
    }))
  }

  const deleteLink = (link_id) => {
    const updatedList = currentLinkGroup.links.filter((item) => item.id !== link_id)

    setCurrentLinkGroup((prev) => ({
      ...prev,
      links: updatedList
    }))
  }

  const finishUpdate = () => {
    updateLinks(id)
  }

  if (linksLoading) {
    return (
      <div className='h-full w-full flex justify-center items-center' >
        <span className="loading loading-spinner text-info loading-lg"></span>
      </div>
    )
  }

  else {
    if (Object.keys(currentLinkGroup).length != 0) {
      return (
        <div className='h-full w-full flex' >
          <div className='h-full w-full py-10' >

            <div className='h-full w-1/2 mx-auto my-4' >
              <div>
                <div className='my-8' >
                  <div className='flex gap-5 items-center' >
                    <h1 className='text-lg font-semibold' > Group Name </h1>
                    {editingGroupName ? (
                      <div>
                        <input 
                        type="text"
                        className='input input-bordered'
                        placeholder='Link Group Name'
                          value={currentLinkGroup.link_group.name}
                          onChange={(e) => setCurrentLinkGroup((prev) => ({
                            ...prev,
                            link_group: { ...prev.link_group, name: e.target.value }
                          }))}
                        />
                      </div>
                    )
                      : (
                        <h1 className='text-xl font-semibold' >{currentLinkGroup.link_group.name}</h1>
                      )}

                    {editingGroupName ? (
                      <div className='flex gap-5' >
                        <button className='btn btn-success text-white'
                          onClick={handleGroupNameSaveClick}
                        > Save </button>
                        <button className='btn btn-error text-white'
                          onClick={handleGroupNameCancelClick}
                        > Cancel </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleGroupNameEditClick}
                        className='btn btn-info text-white btn-sm'
                      > <BiEdit/> </button>

                    )}
                  </div>
                  <div className='divider' >

                  </div>
                </div>
                <div className='flex gap-3' >
                  <button className='btn btn-success text-white ' onClick={() => finishUpdate()} > Update <BiRefresh className='text-xl' /> </button>
                  <button className="btn btn-accent text-white" onClick={() => document.getElementById('my_modal_1').showModal()}>Add Link <BiPlus className='text-xl' /></button>              
                </div>
              </div>

             
              <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                  <div className='flex flex-col gap-3' >
                    <h1 className='text-lg font-semibold text-center my-2' > Add New Link </h1>
                    <input
                      className='input input-bordered'
                      type="text"
                      value={linkTitle}
                      onChange={(e) => setLinktitle(e.target.value)}
                      placeholder='Link Title'
                    />
                    <input
                      type="text"
                      className='input input-bordered'                      
                      value={linkUrl}
                      onChange={(e) => setLinkurl(e.target.value)}
                      placeholder='Link Url'
                    />
                  </div>
                  <div className="modal-action">
                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button onClick={handleAddLink} className="btn btn-success text-white">Add</button>
                    </form>
                  </div>
                </div>
              </dialog>

              <div className='my-5 flex flex-col gap-6' >
                {currentLinkGroup.links.map((item) => (
                  <div key={item.id} className='p-3 rounded shadow border flex flex-col gap-2' >

                    <div>
                      <h1> Title </h1>
                      {editingLinks[item.id] ? (
                        <input
                          type="text"
                          className='input input-bordered'      
                          value={item.title}
                          onChange={(e) => setCurrentLinkGroup((prev) => ({
                            ...prev,
                            links: prev.links.map((link) =>
                              link.id === item.id ? { ...link, title: e.target.value } : link
                            )
                          }))}
                        />
                      ) : (
                        <h1>{item.title}</h1>
                      )}
                    </div>

                    <div>
                      <h1> Link : </h1>

                      {editingLinks[item.id] ? (
                        <input
                          type="text"
                          className='input input-bordered'      
                          value={item.url}
                          onChange={(e) => setCurrentLinkGroup((prev) => ({
                            ...prev,
                            links: prev.links.map((link) =>
                              link.id === item.id ? { ...link, url: e.target.value } : link
                            )
                          }))}
                        />
                      ) : (
                        <h1>{item.url}</h1>
                      )}
                    </div>

                    <div>
                      {editingLinks[item.id] ? (
                        <div className='flex gap-5' >
                          <button className='btn btn-success text-white btn-sm'
                            onClick={() => handleSaveClick(item.id, item.title, item.url)}
                          > Save </button>
                          <button className='btn btn-error text-white btn-sm'
                            onClick={() => cancelClick(item.id)}
                          > Cancel </button>
                        </div>
                      ) : (
                        <div className='flex gap-5' >
                          <button
                            onClick={() => handleEditClick(item.id)}
                            className='btn btn-info text-white btn-sm'
                          > Edit </button>
                          <button
                            onClick={() => deleteLink(item.id)}
                            className='btn btn-error text-white btn-sm'
                          > Delete </button>
                        </div>

                      )

                      }
                    </div>

                  </div>
                ))}

              </div>


            </div>
          </div>
          <div className='h-hull w-full bg-black' >
                  <div className='half-screen-container animate-wave' > 
                    <h1
                    className='text-3xl mb-10 font-extrabold text-center text-white'
                    > {currentLinkGroup.link_group.name} </h1>
                  <div className='w-1/4 mx-auto flex flex-col gap-4' >
                  {currentLinkGroup.links.length > 0 && (currentLinkGroup.links.map((link)=>(
      
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
    else {
      return (
        <div className='h-full w-full flex justify-center items-center' >
          <h1> No Data Found </h1>
        </div>
      )
    }
  }


}
