import React from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router'
import useDetectionHistory from '../hooks/useDetectionHistory'
import HistoryCard from '../components/history_card';

export default function DetectionHistory() {
    let {data} = useDetectionHistory();
  return (
    <div className='main-content'>
            <Navbar username = "Gilbert">
            <Link to={"/"} className='nav-link'>Home</Link>
            </Navbar>
            <div className='container'>
                <div className='mt-5'>
                    <h2 className='text-center hd-2 mb-3'>Detection History</h2>
                    <div className='detection-history'>
                        {
                            Boolean(data) ?
                            <div className='row'>
                                <HistoryCard/>
                            </div> :
                            <div className="c-p flex flex-c flex-center">
                                <span className='bi bi-clock-history '></span>
                                <h4 className='text-center'>No history</h4>
                            </div>
                        }
                    </div>
                </div>  
            </div>  
        </div>
  )
}
