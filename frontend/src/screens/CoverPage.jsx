import '../styles/css/cp.css'; 
import HeroCattleImage from '../styles/images/hero_v1.jpg'; 
import BlurredLogo from '../styles/images/cow.svg'; 

function CoverPage() {
  return (
    <div className="cover-page-wrapper">
      <div className="top-navbar-design">
        <div className="container-fluid d-flex justify-content-between align-items-center py-3">
          <div className="logo-placeholder flex flex-row">
            <img src={BlurredLogo} alt="Company Logo" className="blurred-logo" />
            <h3 className='self-center'>Cattle Disease Detection</h3>
          </div>
          <nav className="d-flex align-items-center">
            <ul className="nav-links list-unstyled d-flex mb-0 me-4">
              <li className="nav-item"><a href="/login" className="nav-link text-decoration-none">LOGIN</a></li>
            </ul>
            <div className="contact-info d-flex align-items-center">
              <a href='/register' className="btn btn-contact">Get Started</a>
            </div>
          </nav>
        </div>
      </div>

      <div className="hero-section d-flex">
        <div className="hero-text-content d-flex flex-column justify-content-center p-5">
          <p className="welcome-tag">WELCOME TO</p>
          <h1 className="hero-headline mb-4">
            Advanced cattle disease detection using Deep learning technology </h1>
          <div className="hero-buttons d-flex">
            <a href="/login" className="btn btn-dark-outline me-3">Login</a>
            <a href="/register" className="btn btn-light-outline">Register</a>
          </div>
        </div>
        <div className="hero-image-content">
          <img src={HeroCattleImage} alt="Cattle in a field" className="img-fluid" />
        </div>
      </div>
    </div>
  );
}

export default CoverPage;