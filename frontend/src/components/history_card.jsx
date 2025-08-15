import React from 'react'
import dying_cow from "./20160902_151546.png"

function HistoryCard() {
  return (
    <div className='history-card'>
        <div className='img'>
            <img
                alt='A skin dying cow is supposed to be here'
                className='dying-cow'
                src={dying_cow}
           />
        </div>
        <div className='card-result'>
            <h6>Dying Cow Disease</h6>
            <i>Confidence: 85%</i>
        </div>
    </div>
  )
}

export default HistoryCard