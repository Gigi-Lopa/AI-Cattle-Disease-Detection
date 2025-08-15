import React, { useState } from 'react'
import "../styles/css/main.css"
import "js-cookie"
import { useNavigate } from 'react-router'

function Register() {
    let navigate = useNavigate()
    let [form_data, set_form_data] = useState({
        fullname : "",
        confirm_password  :"",
        password : "",
        email : "",

    })
    let [input_errors, set_input_errors] = useState({
        fullname : "",
        confirm_password  :"",
        password : "",
        email : "",
    })

    let [status_errors, set_status_errors] = useState({
        put_Error : false
    })
    let onhandleChange = (e) =>{
        set_form_data(prev=>({
            ...prev,
            [e.target.name] : e.target.value
        }))
    }

    let handleRegister = ()=>{
        let {password, fullname, email} = form_data
        fetch(`${import.meta.env.VITE_API_URL}/auth`,{
            method : "PUT",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({ fullname,password,email  })})
            .then(response => response.json())
            .then(response =>{
                if(response.status !== "OK"){
                    set_status_errors({put_Error : true})
                    setTimeout(()=>{set_status_errors({put_Error : false})}, 3500)
                    return;
                }

                localStorage.setItem("token", JSON.stringify({
                    id : response.id,
                    username : response.fullname
                }))

                navigate("/")
            })
            .catch(error=>{
                console.log(error)
                set_status_errors({put_Error : true})
                setTimeout(()=>{set_status_errors({put_Error : false})}, 3500)
                   
            })
}

 let handleSubmit = (e) => {
    e.preventDefault();
    let has_error = false;

    Object.keys(form_data).forEach((key) => {
        if (form_data[key].length <= 0) {
        set_input_errors((prev) => ({
            ...prev,
            [key]: true,
        }));
        has_error = true;
        } else {
        set_input_errors((prev) => ({
            ...prev,
            [key]: false,
        }));
        }
    });

    if (form_data.password !== form_data.confirm_password) {
        set_input_errors((prev) => ({
        ...prev,
        password: true,
        confirm_password: true,
        }));
        has_error = true;
    }

    if (!has_error) {
        handleRegister();
    }
};

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
                        <label>fullname</label>
                        <input
                            name='fullname'
                            type='text'
                            value={form_data.fullname}
                            onChange={onhandleChange}
                            className={input_errors.fullname ? "input-error" : ""}
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
                    <div className='form-group flex flex-c mb-3'>
                        <label>Confirm Password</label>
                        <input
                            name='confirm_password'
                            type='password'
                            value={form_data.confirm_password}
                            onChange={onhandleChange}
                            className={input_errors.confirm_password ? "input-error" : ""}
                        />
                    </div>
                   {status_errors.put_Error && 
                   <div className='alert alert-danger' role='alert'>
                        An error occured.
                    </div>}
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