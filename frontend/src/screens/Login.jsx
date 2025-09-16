import React, { useState } from 'react'
import "../styles/css/main.css"
import { useNavigate } from 'react-router'
import Cow from "../styles/images/cow.svg"
function Login() {

    let navigate = useNavigate();
    let [form_data, set_form_data] = useState({
        email : "",
        password : ""
    })
    let [input_errors, set_input_errors] = useState({
        email : false,
        password : false
    })

    let [status, set_status] = useState({
        error : false,
        is_account_invalid : false,
        is_password_invalid : false
   
    })

    let onhandleChange = (e) =>{
        set_form_data(prev=>({
            ...prev,
            [e.target.name] : e.target.value
        }))
    }

    let handleLogin = ()=>{
        fetch(`${import.meta.env.VITE_API_URL}/auth`, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            }, 
            body : JSON.stringify({
                email : form_data.email.trim(),
                password : form_data.password
            })
        })
        .then(response => response.json())
        .then(response => {
            if (!response?.isAccount) {
                set_status(prev => ({ ...prev, is_account_invalid: true }));
                setTimeout(() => {
                    set_status(prev => ({ ...prev, is_account_invalid: false }));
                }, 3500);
                return;
            }

            if (!response?.isPassword) {
                set_status(prev => ({ ...prev, is_password_invalid: true }));
                setTimeout(() => {
                    set_status(prev => ({ ...prev, is_password_invalid: false }));
                }, 3500);
                return;
            }
            localStorage.setItem("token", JSON.stringify({
                id: response.id,
                username: response.fullname
            }));

            navigate("/home");
        })

        .catch(err=>{
            console.log(err)
            set_status(prev=> ({...prev, error : true}))
            setTimeout(()=>{
                set_status(prev=> ({...prev, error : false}))
            },3500)
            return;
        })
    }
  let handleSubmit = (e) => {
    e.preventDefault();
    let is_valid = true;

    Object.keys(form_data).forEach((key) => {
        if (form_data[key].length <= 0) {
            is_valid = false;
            set_input_errors((prev) => ({
                ...prev,
                [key]: true,
            }));
        } else {
            set_input_errors((prev) => ({
                ...prev,
                [key]: false,
            }));
        }
    });

    if (is_valid) {
        handleLogin();
    }
};

  return (
    <div className='auth'>
        <div className='auth-container c-p flex flex-c flex-center'>
            <form className='auth-form' method='post' onSubmit={handleSubmit}>
                <div className='form-header'>
                    <div className='flex flex-r flex-center'>
                        <div className='rounded-icon'>
                           <img src={Cow} height={30} width={30}></img>
                        </div>
                    </div>
                    <div className='form-header-info'>
                        <h2>Cattle Disease Detection</h2>
                        <p>Sign in to detect diseases in your cattle images using deep learning</p>
                    </div>
                </div>
                <div className='form-body'> 
                    <div className='form-group flex flex-c'>
                        <label>Email</label>
                        <input
                            name='email'
                            type='email'
                            value={form_data.email}
                            onChange={onhandleChange}
                            className={input_errors.email ? "input-error" : ""}
                        />
                    </div>
                    <div className='form-group flex flex-c mb-3'>
                        <label>Password</label>
                        <input
                            name='password'
                            type='password'
                            value={form_data.password}
                            onChange={onhandleChange}
                            className={input_errors.password ? "input-error" : ""}
                        />
                    </div>
                    {
                        status.is_account_invalid &&
                        <div className='alert alert-danger' role='alert'>
                            Invalid Account
                        </div>
                    }
                    {
                        status.is_password_invalid &&
                        <div className='alert alert-danger'>
                            Invalid Password
                        </div>
                    }
                    {
                        status.error &&
                        <div className='alert alert-danger'>
                            An error occured
                        </div>
                    }
                    <br/>
                    <div className='text-center mb-3'>
                        <a className='' href='/register'>
                            Create Account instead
                        </a>
                    </div>
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