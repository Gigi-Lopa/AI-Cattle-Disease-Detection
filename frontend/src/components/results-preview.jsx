import React, { useEffect, useState } from 'react'
import Result from './result'

function ResultPreview({results}) {

  let [sk_most_likely, set_sk_most_likey] = useState(null);
  let [fmd, set_fmd] = useState(null)

  useEffect(() => {
    if (results?.skin_disease_results && Object.keys(results.skin_disease_results).length !== 0) {
      set_sk_most_likey(results.skin_disease_results.mostLikely);
    } else {
      set_sk_most_likey(null);
    }

    if (results?.fmd_disease_results && Object.keys(results.fmd_disease_results).length !== 0) {
      set_fmd({
        label: "Foot and Mouth",
        Message: results.fmd_disease_results.message,
        confidence: results.fmd_disease_results.confidence,
        fileLocation : results.fmd_disease_results.filename
      });

    } else {
      set_fmd(null);
    }
  }, [results]);

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
             {
              fmd &&
              <div className='flex flex-c gap -3'>
                <div className='image-fluid rounded'>
                  <img src={`${import.meta.env.VITE_API_URL}/image/${fmd.fileLocation}?mode=fmd`} className='rounded' alt="affect cow" />
                </div>
                <Result 
                  label={fmd.label}
                  message={fmd.Message}
                  score = {Math.round(fmd.confidence * 100)}
                />
              </div>
             
            }
            {
              sk_most_likely &&
               <Result 
                label={sk_most_likely.label}
                score = {Math.round(sk_most_likely.score * 100)}
              />
            }
        </div>
    </div>
  )
}

export default ResultPreview