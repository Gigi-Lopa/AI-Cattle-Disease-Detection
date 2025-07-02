import React from 'react'
import Result from './result'

function ResultPreview() {
  return (
    <div className='result-preview mb-3'>
        <div className='result-header'>
            <div className='flex flex-r '>
                <span className='bi bi-check2-circle me-2 primary-color'></span>
                <h4>Detection results</h4>
            </div>
            <p className='secondary-color'>AI analysis of your plant image</p>
        </div>
        <div className='result-body mt-3'>
            <h5>Top Prediction:</h5>
            <Result most_likely={true}/>
            <Result />
            <Result />
            <Result />
            <Result />

        </div>
    </div>
  )
}

export default ResultPreview