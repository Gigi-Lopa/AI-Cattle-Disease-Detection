import React from 'react'

function Result({most_likely}) {
  return (
    <div className='result mt-4'>
        <div className='result-infor'>
          <div className='col-md-12'>
            <h5 className='primary-color'>PhotoSensation</h5>
            <i className='secondary-color'>Confidence: 75%</i>
            <p className='secondary-color'>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatem totam aliquam cum, temporibus quis animi.
            </p>
          </div>
          {
            most_likely &&
            <div className='pill pill-primary'>
              most likely
            </div>
          }
       
        </div>
    </div>
  )
}

export default Result