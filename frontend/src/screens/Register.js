import React, { useState } from 'react'
import "../styles/css/main.css"

function Register() {
    let [form_data, set_form_data] = useState({
        username : "",
        confirm_password  :"",
        password : "",
        email : "",

    })
    let [input_errors, set_input_errors] = useState({
        username : "",
        confirm_password  :"",
        password : "",
        email : "",
    })

    let onhandleChange = (e) =>{
        set_form_data(prev=>({
            ...prev,
            [e.target.name] : e.target.value
        }))
    }

    let handleRegister = ()=>{
        console.log("Registering")
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

        if(form_data.password !== form_data.confirm_password){
            set_input_errors(prev=>({
                ...prev,
                password : true,
                confirm_password : true
            }))
            is_valid = false;
        }

        if(is_valid){
            handleRegister();
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
                        <label>Email</label>
                        <input
                            name='email'
                            type='text'
                            value={form_data.email}
                            onChange={onhandleChange}
                            className={input_errors.email ? "input-error" : ""}
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
                    <div className='form-group flex flex-c'>
                        <label>Confirm Password</label>
                        <input
                            name='confirm_password'
                            type='password'
                            value={form_data.confirm_password}
                            onChange={onhandleChange}
                            className={input_errors.confirm_password ? "input-error" : ""}
                        />
                    </div>
                    <br/>
                    <button type='submit' className='btn btn-md w-100 btn-dark'>
                        Register
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Register