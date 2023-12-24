import axios from "axios";
import { createContext, useState } from "react";



axios.defaults.baseURL = 'http://127.0.0.1:8000/'

export const AuthContext = createContext()


export default function AuthProvider({children}) {

    const [loading, setLoading] = useState(false)


    const onLogin = async (email, password) => {
        const data = {
            email,
            password
        }
        setLoading(true)
        await axios.post('/auth/token/login/', data)
        .then((response)=>{
            console.log(response)
            localStorage.setItem('auth_token', response.data.auth_token)
            localStorage.setItem('isAuthenticated', true)
        })
        .catch((error) => {
            console.log(error)
        })
        setLoading(false)
    
    }
    
    const onRegister = async (email , password , re_password) => {
        setLoading(true)
        const data = {
            email,
            password,
            re_password
        }

        
    
        await axios.post('/auth/users/', data)
        .then((response)=>{
           console.log(response.data)
        })
        .catch((error) => {
            console.log(error)
        })
        
        setLoading(false)
    }
    
    const onLogout = async() => {
        await localStorage.removeItem('auth_token')
        await localStorage.removeItem('isAuthenticated')
    
    } 

  return (
   <AuthContext.Provider
   value={{
    onLogin,
    onRegister,
    onLogout,
    loading
   }}
   >
    {children}
   </AuthContext.Provider>
  )
}
