import React, { useEffect, useState } from 'react'
import 'react-tabs/style/react-tabs.css';
import Navbar from '../components/Navbar'
import {Link} from "react-router"
import UploadImage from '../components/upload_image';
import ResultPreview from "../components/results-preview"
import { useNavigate } from 'react-router';
import Weather from '../components/weather';

function Index() {
  let navigate = useNavigate();
  let [render, set_render] = useState(false)
  let [token, set_token] = useState({username : "", id : ""})
  let [results, set_results] = useState(null)

  useEffect(()=>{
    let data = localStorage.getItem("token")
    if (data){
      try{
        let parsed_token = JSON.parse(data)
        set_token({
          id : parsed_token?.id,
          username : parsed_token?.username,

        });
        set_render(true)
        return;

      } catch{
        console.log("Error")
      }
    }

    navigate("/login")
  }, [])

  let updateResults = (results) =>{
    set_results(results)
  }

  if (render){
  return (
    <div className='main-content'>
        <Navbar username = {token.username}>
          <Link to={`/history/${token.id}`} className='nav-link'>History</Link>
        </Navbar>
        <Weather/>

        <div className='container'>
          <div className='mt-5'>
            <h1 className='text-center hd-2 mb-3'>Cattle disease Detection</h1>
            <div className='row flex-space'>
              <div className={`${results != null ? "col-md-5" : "col-md-12"} mt-3`}>
                <UploadImage id = {token.id} updateResults = {updateResults}/>
              </div>  
              {
                results != null ?
                <div className='col-md-7 mt-3'>
                  <ResultPreview results = {results}/>
                </div>:<></>
              }
              
            </div>  
          </div>  
        </div>
    </div>
  )} 
}

export default Index