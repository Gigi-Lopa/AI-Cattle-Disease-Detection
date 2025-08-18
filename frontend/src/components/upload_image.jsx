import React, {useRef, useState} from 'react'

function UploadImage({ id , updateResults}) {
  let input_ref = useRef();
  let [file, set_file] = useState(null);
  let [is_dragging, set_is_dragging] = useState(false)
  let [preview, set_preview] = useState(null)
  let [is_loading, set_isloading] = useState(false)
  let [options, set_options] = useState({
    skin_disease : true,
    fmd : true
  })
  let [status, set_status] = useState({
    isOptionsChecked : false
  })

  let onPreview = (file) =>{
    const reader = new FileReader();
    reader.onload = () => {
      set_preview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  let handleDrop = (e) => {
    e.preventDefault();
    set_is_dragging(false);

    const droppedFile = e.dataTransfer.files[0];
    set_file(droppedFile);
    onPreview(droppedFile)

  };

  let reset_form = () =>{
    set_isloading(false);
    set_file(null)
    set_preview(null)
    set_options({
      skin_disease : true,
      fmd : false
    })
    setTimeout(() => {
      input_ref.current?.click();
    }, 0);
  }
  
  let handle_submit_form = (e) =>{
    e.preventDefault();

    if (!options.fmd && !options.skin_disease){
      set_status(prev=>({...prev, isOptionsChecked : true }))
      setTimeout(()=>{ set_status(prev=>({ ...prev, isOptionsChecked : false})) },3500)
      return;
    }

    set_isloading(true)

    let form_data = new FormData();
    form_data.append("image", file);
    form_data.append("id", id);
    form_data.append("options", JSON.stringify(options))

    fetch(`${import.meta.env.VITE_API_URL}/detect`, {
      method : "PUT",
      body : form_data
    })
    .then(response => response.json())
    .then(response => {
      if(response?.isNotCow){
        alert("Upload on a cattle. No cow / Bull / Cattle detected")
        return;
      }

      console.log(response)
      if(response.status){
        updateResults(response?.predictions)
      }
    })
    .catch((error)=>{
      console.log(error);
      alert("An error occured")
    })
    .finally(()=> set_isloading(false))
   
  }
  return (
    <div className='image-upload-container'>
      <div className='image-upload c-p'
        onDragOver={(e) => {e.preventDefault(); set_is_dragging(true)}}
        onDrop={handleDrop}
        onDragLeave={() => set_is_dragging(false)}
      > 
       {
          !is_dragging && !file &&
          <div className='upload-content c-p flex flex-c flex-center' 
            onClick={() => input_ref.current.click()}
            >
              <p className='text-center bi bi-download'></p>
              <p className='text-center s'>Click, drag and drop any PNG,JPEG or JPG</p>
              <input
                type='file'
                  hidden
                  accept='.png,.jpeg,.jpg'
                  onChange={(e) => {set_file(e.target.files[0]); onPreview(e.target.files[0])}}
                  ref={input_ref}
              />
          </div> 
        }
        {
          file &&
          <div className='upload-preview c-p'>
            <form className='c-p flex flex-c flex-center' onSubmit={handle_submit_form} method='POST'>
              <img
                src={preview}
                alt='preview'
                className='preview'
              />
              {
                status.isOptionsChecked &&
                <div className='alert alert-danger mt-2'>
                  At least check one option
                </div>
              }
          
              <div className='flex flex-r mt-3'>
                <button  disabled = {is_loading} type='submit' className='btn btn-sm btn-dark me-3'>
                  { 
                    is_loading ?
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="sr-only"></span>
                    </div> : 
                  <span className='bi bi-file-image me-2'></span>
                  }
                
                  Detect Disease
                </button>
                <button type='button' onClick={reset_form} className='btn btn-sm btn-outline-dark'>
                  Choose different image
                </button>
              </div>
            </form>
          </div>
        }
       
      </div>  
    </div>
  )
}

export default UploadImage