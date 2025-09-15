import React from 'react'
import Cow from "../styles/images/cow.svg"

function Navbar({ username, children }) {
  
  let onLogout = () =>{
    localStorage.removeItem("token")
    location.reload()
  }

  return (
    <div className='navbar'>
      <div className='container'>
        <div className='nav-header col-md-5'>
          <div className='flex flex-r'>
            <div className='rounded-icon'>
              <img src={Cow} height={25} width={25}></img>
            </div>
            <h3 className='self-center'>Cattle Disease Detection</h3>
          </div>
        </div>
        <div className='nav-body col-md-5'>
            
          {children}
          <div className='user-profile flex flex-r'>
            <span className='bi bi-person'></span>
            <span>{username}</span>
          </div>
          <div>
            <button onClick={onLogout} className='btn btn-outline-dark btn-logout'>
              <span className='bi bi-arrow-bar-right me-2'></span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Navbar);
