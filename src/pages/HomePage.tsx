import Navbar from '../components/Navbar'

function HomePage() {
  return (
    <div className="app-shell">
      <Navbar />

      <main>
        <section className="hero-section">
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <div className="hero-content">
                  <span className="hero-badge">
                    🎓 Built for campus life
                  </span>

                  <h1>
                    Your Campus.
                    <br />
                    <span>One Marketplace.</span>
                  </h1>

                  <p className="hero-description">
                    Buy, sell, discover, and connect with students
                    around your campus — all in one place.
                  </p>

                  <div className="hero-actions">
                    <a
                      href="#marketplace"
                      className="btn btn-primary-brand btn-lg"
                    >
                      Explore Marketplace
                    </a>

                    <a
                      href="#how-it-works"
                      className="btn btn-outline-brand btn-lg"
                    >
                      How It Works
                    </a>
                  </div>

                  <div className="hero-trust">
                    <div className="trust-item">
                      <strong>Buy</strong>
                      <span>Find what you need</span>
                    </div>

                    <div className="trust-item">
                      <strong>Sell</strong>
                      <span>Turn unused items into cash</span>
                    </div>

                    <div className="trust-item">
                      <strong>Connect</strong>
                      <span>Deal with students directly</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="hero-visual">
                  <div className="hero-card hero-card-main">
                    <img
                      src="/src/assets/images/uniagora-logo.png"
                      alt="UniAGORA Campus Marketplace"
                    />

                    <div className="hero-marketplace-card">
                      <span>Campus Marketplace</span>
                      <strong>Everything you need, closer.</strong>
                    </div>
                  </div>

                  <div className="floating-card floating-card-one">
                    <span className="floating-icon">🛍️</span>
                    <div>
                      <strong>Buy & Sell</strong>
                      <small>Right on campus</small>
                    </div>
                  </div>

                  <div className="floating-card floating-card-two">
                    <span className="floating-icon">💬</span>
                    <div>
                      <strong>Chat directly</strong>
                      <small>Connect with sellers</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="marketplace" className="marketplace-preview">
          <div className="container">
            <div className="section-heading">
              <span className="section-eyebrow">EXPLORE</span>
              <h2>What are you looking for?</h2>
              <p>
                Discover products and services available around your
                campus.
              </p>
            </div>

            <div className="row g-4">
              {[
                ['📚', 'Books & Materials', 'Textbooks, notes and study materials'],
                ['💻', 'Electronics', 'Laptops, phones and accessories'],
                ['👕', 'Fashion', 'Clothing, shoes and accessories'],
                ['🏠', 'Hostel Essentials', 'Everything for your room'],
              ].map(([icon, title, description]) => (
                <div className="col-sm-6 col-lg-3" key={title}>
                  <div className="category-card">
                    <div className="category-icon">{icon}</div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <span>Explore →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="how-it-works">
          <div className="container">
            <div className="section-heading">
              <span className="section-eyebrow">SIMPLE & FAST</span>
              <h2>How UniAGORA works</h2>
              <p>
                Everything you need to make campus buying and selling
                easier.
              </p>
            </div>

            <div className="row g-4">
              <div className="col-md-4">
                <div className="step-card">
                  <span className="step-number">01</span>
                  <h3>Find what you need</h3>
                  <p>
                    Browse products from students and vendors around
                    your university.
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="step-card">
                  <span className="step-number">02</span>
                  <h3>Connect with the seller</h3>
                  <p>
                    Start a conversation and ask questions before
                    making your decision.
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="step-card">
                  <span className="step-number">03</span>
                  <h3>Make the deal</h3>
                  <p>
                    Meet, exchange, and complete your transaction
                    within your campus community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-content">
            <div>
              <strong>UniAGORA</strong>
              <p>Campus marketplace for students.</p>
            </div>

            <span>© {new Date().getFullYear()} UniAGORA</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage