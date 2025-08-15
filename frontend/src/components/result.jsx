import React from 'react'

function Result({ label, score, message}) {
  return (
    <div className='result mt-4'>
        <div className='result-infor'>
          <div className='col-md-12'>
            <h5 className='primary-color'>{label}</h5>
            <i className='secondary-color'>Confidence: {score}%</i>
            {
              message &&
              <p className='secondary-color'>
                {message}
              </p>
            }
          </div>
        </div>
    </div>
  )
}

export default Result