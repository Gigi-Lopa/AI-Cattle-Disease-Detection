import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Navbar from '../components/Navbar'
import {Link} from "react-router"
import UploadImage from '../components/upload_image';
import ResultPreview from "../components/results-preview"

function Index() {

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
                <UploadImage/>
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