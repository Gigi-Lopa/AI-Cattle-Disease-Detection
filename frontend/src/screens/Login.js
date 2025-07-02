import React, { useState } from 'react'
import "../styles/css/main.css"

function Login() {
    let [form_data, set_form_data] = useState({
        username : "",
        password : ""
    })
    let [input_errors, set_input_errors] = useState({
        username : false,
        password : false
    })

    let onhandleChange = (e) =>{
        set_form_data(prev=>({
            ...prev,
            [e.target.name] : e.target.value
        }))
    }

    let handleLogin = ()=>{
        console.log("LOGGING IN")
    }
    let handleSubmit = (e)=>{
        //VALIDATE FORM 
        e.preventDefault();
        let is_valid = false;

        Object.keys(form_data).map((value, index)=>{
           if(form_data[value].length <= 0){
                set_input_errors(prev=>({
                    ...prev,
                    [value] : true
                }))
                is_valid = true
           } else{
                set_input_errors(prev=>({
                    ...prev,
                    [value] : false
                }))
                is_valid = false
           }
        })

        if(is_valid){
            handleLogin();
        }
    }
  return (
    <div className='auth'>
        <div className='auth-container c-p flex flex-c flex-center'>
            <form className='auth-form' method='post' onSubmit={handleSubmit}>
                <div className='form-header'>
                    <div className='flex flex-r flex-center'>
                        <div className='rounded-icon'>
                            <span className='bi bi-hurricane'></span>
                        </div>
                    </div>
                    <div className='form-header-info'>
                        <h2>AI Cattle Disease Detection</h2>
                        <p>Sign in to detect diseases in your cattle images using AI</p>
                    </div>
                </div>
                <div className='form-body'> 
                    <div className='form-group flex flex-c'>
                        <label>Username</label>
                        <input
                            name='username'
                            type='text'
                            value={form_data.username}
                            onChange={onhandleChange}
                            className={input_errors.username ? "input-error" : ""}
                        />
                    </div>
                    <div className='form-group flex flex-c'>
                        <label>Password</label>
                        <input
                            name='password'
                            type='password'
                            value={form_data.password}
                            onChange={onhandleChange}
                            className={input_errors.password ? "input-error" : ""}
                        />
                    </div>
                    <br/>
                    <button type='submit' className='btn btn-md w-100 btn-dark'>
                        Login
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Login