import React, {useRef, useState} from 'react'

function UploadImage() {
  let input_ref = useRef();
  let [file, set_file] = useState(null);
  let [is_dragging, set_is_dragging] = useState(false)
  let [preview, set_preview] = useState(null)
  let [options, set_options] = useState({
    skin_disease : true,
    fmd : false
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

  let onhandleOption = (e) => {
    set_options(prev => ({
      ...prev,
      [e.target.name]: !prev[e.target.name]
    }));
  };

  let reset_form = () =>{
    set_file(null)
    set_preview(null)
    set_options({
      skin_disease : true,
      fmd : false
    })
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
            <form className='c-p flex flex-c flex-center'>
              <img
                src={preview}
                alt='preview'
                className='preview'
              />
              <div className='mt-2'>
                <div className='flex flex-r'>
                  <input
                    type='checkbox'
                    checked={options.skin_disease}
                    name='skin_disease'
                    onChange={onhandleOption}
                    className='me-2'
                  />
                  <label style={{fontSize : "0.9rem"}}>Detect skin disease</label>
                </div> 
                <div className='flex flex-r'>
                  <input
                    type='checkbox'
                    checked={options.fmd}
                    name='fmd'
                    onChange={onhandleOption}
                    className='me-2'
                  />
                  <label style={{fontSize : "0.9rem"}}>Detect foot and mouth disease</label>
                </div> 
              </div>
              <div className='flex flex-r mt-3'>
                <button type='submit' className='btn btn-sm btn-dark me-3'>
                  <span className='bi bi-file-image me-2'></span>
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