import React, { useState } from 'react'

function useDetectionHistory() {
  let [data, set_data] = useState({df:""});
  
  return{
    data
  }
}

export default useDetectionHistory