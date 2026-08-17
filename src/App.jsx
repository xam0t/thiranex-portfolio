import { useState } from 'react'
import './App.css'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  const [formData, setFormData] = useState({
  name: '',
  email: '',
  message: ''
})

const [formStatus, setFormStatus] = useState({
  type: '',
  message: ''
})

const [isSubmitting, setIsSubmitting] = useState(false)

const handleChange = (event) => {
  const { name, value } = event.target

  setFormData((previousData) => ({
    ...previousData,
    [name]: value
  }))
}

const handleSubmit = async (event) => {
  event.preventDefault()

  setIsSubmitting(true)

  setFormStatus({
    type: '',
    message: ''
  })

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong.')
    }

    setFormStatus({
      type: 'success',
      message: 'Your message has been sent successfully!'
    })

    setFormData({
      name: '',
      email: '',
      message: ''
    })

  } catch (error) {

  console.error(error)

  setFormStatus({
    type: 'error',
    message: error.message || 'Unable to send your message. Please try again.'
  })

} finally {
    setIsSubmitting(false)
  }
}


  return (
    <div className="portfolio">

      {/* Navigation */}
<nav className="navbar">
  <div className="nav-container">

    <a href="#home" className="logo">
      Adnan.
    </a>

    <button
      className="menu-button"
      onClick={() => setMenuOpen(!menuOpen)}
      aria-label="Toggle navigation menu"
    >
      ☰
    </button>

    <div className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>

      <a href="#about" onClick={() => setMenuOpen(false)}>
        About
      </a>

      <a href="#skills" onClick={() => setMenuOpen(false)}>
        Skills
      </a>

      <a href="#projects" onClick={() => setMenuOpen(false)}>
        Projects
      </a>

      <a href="#education" onClick={() => setMenuOpen(false)}>
        Education
      </a>

      <a href="#contact" onClick={() => setMenuOpen(false)}>
        Contact
      </a>

    </div>

  </div>
</nav>


      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content">

          <div className="hero-badge">
            <span className="status-dot"></span>
            Available for opportunities
          </div>

          <p className="hero-greeting">Hello, I'm</p>

          <h1>
            Syed Muhammad <span>Adnan</span>
          </h1>

          <h2>
            Computer Science Engineering Student & Developer
          </h2>

          <p className="hero-description">
            I build practical software solutions using modern technologies,
            with a focus on full-stack development, mobile applications,
            APIs and databases.
          </p>

          <div className="hero-buttons">

            <a href="#projects" className="primary-button">
              View My Projects
            </a>

            <a
              href="https://github.com/xam0t"
              target="_blank"
              rel="noreferrer"
              className="secondary-button"
            >
              GitHub
            </a>

            <a
              href="https://www.linkedin.com/in/syedmuhammadadnan/"
              target="_blank"
              rel="noreferrer"
              className="secondary-button"
            >
              LinkedIn
            </a>

          </div>

          <p className="hero-learning">
            Currently learning: <strong>Full Stack Development</strong>
          </p>

        </div>
      </section>


      {/* About Section */}
      <section id="about" className="section">
        <div className="section-container">

          <p className="section-label">ABOUT ME</p>

          <h2 className="section-title">
            A little about me
          </h2>

          <p className="about-text">
            I am a Computer Science Engineering student at Sai Vidya
            Institute Of Technology, pursuing my B.E. and graduating in 2028.
            I am interested in software development and building applications
            that solve practical problems.
          </p>

          <p className="about-text">
            I enjoy working with frontend technologies, backend development,
            databases and APIs. I am currently expanding my full-stack
            development skills through projects and practical experience.
          </p>

        </div>
      </section>


      {/* Skills Section */}
      <section id="skills" className="section skills-section">
        <div className="section-container">

          <p className="section-label">SKILLS</p>

          <h2 className="section-title">
            Technologies I work with
          </h2>

          <div className="skills-grid">

            <div className="skill-card">C</div>
            <div className="skill-card">C++</div>
            <div className="skill-card">Python</div>
            <div className="skill-card">JavaScript</div>
            <div className="skill-card">React</div>
            <div className="skill-card">React Native</div>
            <div className="skill-card">Node.js</div>
            <div className="skill-card">MongoDB</div>
            <div className="skill-card">MySQL</div>
            <div className="skill-card">REST APIs</div>
            <div className="skill-card">JWT Authentication</div>
            <div className="skill-card">Git & GitHub</div>

          </div>

        </div>
      </section>


      {/* Projects Section */}
      <section id="projects" className="section">
        <div className="section-container">

          <p className="section-label">PROJECTS</p>

          <h2 className="section-title">
            Things I've built
          </h2>

          <div className="projects-grid">

            {/* Smart Inventory Project */}
<article className="project-card featured-project">

  <div className="project-visual">
    <div className="visual-window">
      <div className="window-top">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="dashboard-preview">
        <div className="preview-sidebar"></div>

        <div className="preview-content">
          <div className="preview-header"></div>

          <div className="preview-cards">
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div className="preview-chart"></div>
        </div>
      </div>
    </div>
  </div>

  <div className="project-top">

    <div>
      <span className="project-number">01</span>
      <span className="project-type">Existing Project</span>
    </div>

    <div className="project-links">
      <a
        href="https://github.com/xam0t"
        target="_blank"
        rel="noreferrer"
      >
        GitHub ↗
      </a>
    </div>

  </div>

  <h3>Smart Inventory Management Application</h3>

  <p className="project-description">
    A business-focused inventory and billing solution designed for
    small businesses to simplify their daily operations and make
    better decisions using sales and inventory data.
  </p>

  <div className="project-features">

    <div className="feature">
      <strong>📦 Inventory Management</strong>
      <span>
        Manage products, monitor stock and keep track of inventory
        efficiently.
      </span>
    </div>

    <div className="feature">
      <strong>📊 Sales & Profit Analytics</strong>
      <span>
        Track sales and profits while identifying best-selling and
        slow-moving products.
      </span>
    </div>

    <div className="feature">
      <strong>🧾 Automated Billing</strong>
      <span>
        Generate bills automatically and send them directly to
        customers through WhatsApp.
      </span>
    </div>

  </div>

  <div className="project-tech">
    <span>React Native</span>
    <span>Node.js</span>
    <span>REST API</span>
    <span>MongoDB</span>
    <span>JWT</span>
  </div>

</article>

            {/* THIRANEX Project */}
            <article className="project-card project-placeholder">

              <div className="project-top">

                <span className="project-number">
                  02
                </span>

                <span className="project-status">
                  In Progress
                </span>

              </div>

              <h3>
                Personal Portfolio Website
              </h3>

              <p className="project-description">
                A responsive full-stack developer portfolio built as
                part of my Full Stack Development internship at THIRANEX.
              </p>

              <div className="project-tech">
                <span>React</span>
                <span>JavaScript</span>
                <span>Node.js</span>
                <span>MongoDB</span>
              </div>

            </article>

          </div>

        </div>
      </section>


      {/* Education Section */}
      <section id="education" className="section education-section">
        <div className="section-container">

          <p className="section-label">EDUCATION</p>

          <h2 className="section-title">
            My academic journey
          </h2>

          <div className="education-timeline">

            {/* B.E. */}
            <div className="education-item">

              <div className="education-dot"></div>

              <div className="education-content">

                <div className="education-header">
                  <span className="education-year">
                    2024 — 2028
                  </span>

                  <span className="education-status">
                    Currently Studying
                  </span>
                </div>

                <h3>
                  B.E. Computer Science and Engineering
                </h3>

                <p className="education-college">
                  Sai Vidya Institute Of Technology
                </p>

                <p className="education-university">
                  Visvesvaraya Technological University (VTU)
                </p>

                <p className="education-description">
                  Pursuing a Bachelor's degree in Computer Science and
                  Engineering, with a focus on programming, data structures,
                  software development, databases and full-stack technologies.
                </p>

              </div>

            </div>


            {/* Higher Secondary */}
            <div className="education-item">

              <div className="education-dot"></div>

              <div className="education-content">

                <div className="education-header">

                  <span className="education-year">
                    2022 — 2024
                  </span>

                </div>

                <h3>
                  Higher Secondary Education
                </h3>

                <p className="education-college">
                  Government Boys Higher Secondary School, Hadipora
                </p>

                <p className="education-description">
                  Completed Classes 11 and 12 as part of my higher
                  secondary education.
                </p>

              </div>

            </div>


            {/* School */}
            <div className="education-item">

              <div className="education-dot"></div>

              <div className="education-content">

                <div className="education-header">

                  <span className="education-year">
                    2012 — 2022
                  </span>

                </div>

                <h3>
                  Secondary School Education
                </h3>

                <p className="education-college">
                  St. Joseph's Higher Secondary School, Baramulla
                </p>

                <p className="education-description">
                  Completed Classes 1 through 10, with my Class 10 final
                  examination completed in 2021.
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* Contact Section */}
<section id="contact" className="section contact-section">
  <div className="section-container">

    <p className="section-label">CONTACT</p>

    <h2 className="section-title">Let's connect</h2>

    <p className="contact-text">
      Have a question, opportunity or just want to connect?
      Send me a message and I'll get back to you.
    </p>

    <div className="contact-layout">

      {/* Contact Form */}
      <form className="contact-form" onSubmit={handleSubmit}>

  {/* Name */}
  <div className="form-group">
    <label htmlFor="name">Name</label>

    <input
      id="name"
      name="name"
      type="text"
      placeholder="Your name"
      value={formData.name}
      onChange={handleChange}
      required
    />
  </div>


  {/* Email */}
  <div className="form-group">
    <label htmlFor="email">Email</label>

    <input
      id="email"
      name="email"
      type="email"
      placeholder="your@email.com"
      value={formData.email}
      onChange={handleChange}
      required
    />
  </div>


  {/* Message */}
  <div className="form-group">
    <label htmlFor="message">Message</label>

    <textarea
      id="message"
      name="message"
      placeholder="Write your message..."
      rows="6"
      maxLength={2000}
      value={formData.message}
      onChange={handleChange}
      required
    ></textarea>

    <p className="character-count">
     {formData.message.length}/2000
    </p>

  </div>


  {/* Submit */}
  <button
    type="submit"
    className="submit-button"
    disabled={isSubmitting}
  >
    {isSubmitting ? 'Sending...' : 'Send Message'}
  </button>


  {/* Status */}
  {formStatus.message && (
    <p className={`form-status ${formStatus.type}`}>
      {formStatus.message}
    </p>
  )}

</form>


      {/* Contact Information */}
      <div className="contact-info">

        <h3>Other ways to reach me</h3>

        <a
          href="mailto:imailadnan0@gmail.com"
          className="contact-info-link"
        >
          <span>Email</span>
          <strong>imailadnan0@gmail.com</strong>
        </a>

        <a
          href="https://github.com/xam0t"
          target="_blank"
          rel="noreferrer"
          className="contact-info-link"
        >
          <span>GitHub</span>
          <strong>github.com/xam0t</strong>
        </a>

        <a
          href="https://www.linkedin.com/in/syedmuhammadadnan/"
          target="_blank"
          rel="noreferrer"
          className="contact-info-link"
        >
          <span>LinkedIn</span>
          <strong>/in/syedmuhammadadnan</strong>
        </a>

      </div>

    </div>

  </div>
</section>


      {/* Footer */}
      <footer className="footer">
        <p>
          © 2026 Syed Muhammad Adnan. Built with React.
        </p>
      </footer>

    </div>
  )
}

export default App