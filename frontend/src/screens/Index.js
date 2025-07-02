import React , {useState} from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Navbar from '../components/Navbar'
import {Link} from "react-router"
import UploadImage from '../components/upload_image';
import ResultPreview from "../components/results-preview"
import Alert from '@mui/material/Alert';

function Index() {
  let [showError, set_showError] = useState({
    display : false,
    message  : ""
  });
  
  let detectDisease = (file, options) => {
    if(!options.skin_detection && !options.fmd) {
      set_showError({
        display: true,
        message: "Please select at least one detection option"
      });
      setTimeout(() => {
        set_showError({
          display: false,
          message: ""
        });
      }, 3000);

    } else {
     let formData = new FormData();
     options.user_id = 3;
     formData.append('file', file);
     formData.append('options', JSON.stringify(options)); 

     fetch("http://localhost:5000/detect-skin-disease", {
       method: "POST",
       body: formData
     }) 
     .then(response => response.json())
     .then(response => {
        console.log(response)
        if(response.status === undefined ||
           response.status !== "success"){
          set_showError({
            display : true,
            message :"OOP's Something bad happened. Please upload only .PNG, .JPEG, .JPG"
          })
          return
        }

        if (response.options.skin_disease && !response.options.response.options.fmd){

        } else if (response.options.fmd && !response.options.skin_disease) {

        } else if (response.options.skin_disease && response.options.fmd){

        }

     })
     .catch(error =>{
        console.log(error)
     });
     
  }}

  return (
    <div className='main-content'>
        <Navbar username = "Gilbert">
          <Link to={"/history/3"} className='nav-link'>History</Link>
        </Navbar>
        <div className='container'>
          <div className='mt-5'>
            <h2 className='text-center hd-2 mb-3'>AI Cattle disease Detection</h2>
            <div className='row flex-space'>
              <div className='col-md-5 mt-3'>
                <UploadImage 
                showError = {showError}
                set_showError = {set_showError}/>
              </div>  
              <div className='col-sm-7 mt-3'>
                <ResultPreview/>
              </div>  
            </div>  
          </div>  
        </div>
    </div>
  )
}

export default Index