import { Link } from 'react-router-dom'
import logo from '../assets/images/uniagora-logo.png'

function Navbar() {
  return (
    <header className="site-header">
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <Link
            to="/"
            className="navbar-brand d-flex align-items-center"
            aria-label="UniAGORA home"
          >
            <img
              src={logo}
              alt="UniAGORA"
              className="brand-logo"
            />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavigation"
            aria-controls="mainNavigation"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div
            className="collapse navbar-collapse"
            id="mainNavigation"
          >
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" to="/">
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#marketplace">
                  Marketplace
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#how-it-works">
                  How It Works
                </a>
              </li>
            </ul>

            <div className="navbar-actions d-flex align-items-center gap-2">
              <Link to="/login" className="btn btn-login">
                Log in
              </Link>

              <Link to="/register" className="btn btn-primary-brand">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar