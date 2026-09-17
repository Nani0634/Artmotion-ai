import CreativeScene from "../components/3d/CreativeScene";
import GenerateArt from "../components/art/GenerateArt";

export default function Home() {
  return (
    <div className="app">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="sidebar">

        {/* LOGO */}

        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            🎨
          </div>

          <div>
            <h1>ArtMotion AI</h1>
            <span>Creative Studio</span>
          </div>
        </div>

        {/* NAVIGATION */}

        <nav className="sidebar-nav">

          <a
            href="#home"
            className="sidebar-nav-item active"
          >
            <span className="sidebar-nav-icon">
              🏠
            </span>

            <span>Home</span>
          </a>

          <a
            href="#create"
            className="sidebar-nav-item"
          >
            <span className="sidebar-nav-icon">
              ✨
            </span>

            <span>Create</span>
          </a>

          <a
            href="#explore"
            className="sidebar-nav-item"
          >
            <span className="sidebar-nav-icon">
              🌌
            </span>

            <span>Explore</span>
          </a>
          <a
  href="#tutorials"
  className="sidebar-nav-item"
>
  <span className="sidebar-nav-icon">
    📚
  </span>

  <span>Tutorials</span>
</a>

          <a
            href="#projects"
            className="sidebar-nav-item"
          >
            <span className="sidebar-nav-icon">
              🖼️
            </span>

            <span>My Projects</span>
          </a>

          <a
            href="#settings"
            className="sidebar-nav-item"
          >
            <span className="sidebar-nav-icon">
              ⚙️
            </span>

            <span>Settings</span>
          </a>

        </nav>

        {/* SIDEBAR SPACER */}

        <div className="sidebar-spacer" />

        {/* PRO CARD */}

        <div className="sidebar-pro-card">

          <div className="sidebar-pro-icon">
            🚀
          </div>

          <h3>ArtMotion Pro</h3>

          <p>
            Unlock more creativity and
            advanced AI tools.
          </p>

          <button
            type="button"
            className="sidebar-pro-button"
          >
            Upgrade
          </button>

        </div>

        {/* SIDEBAR FOOTER */}

        <div className="sidebar-footer">

          <div className="sidebar-user-avatar">
            A
          </div>

          <div className="sidebar-user-info">
            <strong>Artist</strong>
            <span>Creative Explorer</span>
          </div>

          <span className="sidebar-user-arrow">
            ⋮
          </span>

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="main-content">

        {/* ===================================================
            TOP HEADER
        =================================================== */}

        <header className="top-header">

          <div className="top-header-left">
            <span className="top-header-label">
              ART MOTION
            </span>
          </div>

          <div className="top-header-right">

            <button
              type="button"
              className="header-icon-button"
              aria-label="Notifications"
            >
              🔔
            </button>

            <div className="header-profile">

              <div className="header-avatar">
                A
              </div>

              <div className="header-profile-text">
                <strong>Artist</strong>
                <span>Creative Explorer</span>
              </div>

              <span className="header-profile-arrow">
                ▾
              </span>

            </div>

          </div>

        </header>


        {/* ===================================================
            HOME
        =================================================== */}

        <div
          id="home"
          className="home-content"
        >

          {/* =================================================
              HERO SECTION
          ================================================= */}

          <section className="hero-section">

            {/* HERO TEXT */}

            <div className="hero-content">

              <div className="hero-badge">
                <span>✦</span>

                <span>
                  AI Creative Studio
                </span>
              </div>

              <h1 className="hero-title">

                Turn your ideas
                <br />

                into{" "}

                <span className="hero-gradient-text">
                  amazing
                </span>

                <br />

                artwork.

              </h1>

              <p className="hero-description">

                Create stunning artwork with
                the power of AI. Explore,
                experiment, and bring your
                imagination to life.

              </p>

              {/* HERO BUTTONS */}

              <div className="hero-actions">

                <a
                  href="#create"
                  className="hero-primary-button"
                >
                  <span>✨</span>

                  <span>
                    Start Creating
                  </span>
                </a>

                <a
                  href="#explore"
                  className="hero-secondary-button"
                >
                  Explore Projects
                </a>

              </div>


              {/* HERO FEATURES */}

              <div className="hero-features">

                <div className="hero-feature">

                  <div className="hero-feature-icon">
                    ∞
                  </div>

                  <div>
                    <strong>
                      Creative Ideas
                    </strong>

                    <span>
                      Unlimited possibilities
                    </span>
                  </div>

                </div>


                <div className="hero-feature">

                  <div className="hero-feature-icon">
                    AI
                  </div>

                  <div>
                    <strong>
                      Powered
                    </strong>

                    <span>
                      Intelligent generation
                    </span>
                  </div>

                </div>


                <div className="hero-feature">

                  <div className="hero-feature-icon">
                    3D
                  </div>

                  <div>
                    <strong>
                      Experience
                    </strong>

                    <span>
                      Interactive artwork
                    </span>
                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                FRONT 3D ARTWORK
            ================================================= */}

            <div className="hero-3d">

              <CreativeScene />

            </div>

          </section>


          {/* =================================================
              CREATE ART SECTION
          ================================================= */}

          <section
            id="create"
            className="section create-section"
          >

            <GenerateArt />

          </section>


          {/* =================================================
              EXPLORE SECTION
          ================================================= */}

          <section
            id="explore"
            className="section explore-section"
          >

            <div className="section-header">

              <div>

                <span className="section-eyebrow">
                  DISCOVER
                </span>

                <h2>
                  Explore Creative Possibilities
                </h2>

                <p>
                  Discover different styles,
                  ideas and visual directions
                  for your next creation.
                </p>

              </div>

            </div>


            <div className="explore-grid">

              <div className="explore-card">

                <div className="explore-card-icon">
                  🎨
                </div>

                <h3>
                  Digital Art
                </h3>

                <p>
                  Modern digital artwork with
                  rich colors and creative
                  compositions.
                </p>

              </div>


              <div className="explore-card">

                <div className="explore-card-icon">
                  🪐
                </div>

                <h3>
                  3D Worlds
                </h3>

                <p>
                  Build immersive scenes,
                  objects and imaginative
                  environments.
                </p>

              </div>


              <div className="explore-card">

                <div className="explore-card-icon">
                  🌌
                </div>

                <h3>
                  Fantasy
                </h3>

                <p>
                  Create magical worlds,
                  characters and cinematic
                  environments.
                </p>

              </div>


              <div className="explore-card">

                <div className="explore-card-icon">
                  🤖
                </div>

                <h3>
                  Cyberpunk
                </h3>

                <p>
                  Neon cities, futuristic
                  technology and atmospheric
                  compositions.
                </p>

              </div>

            </div>

          </section>


          {/* =================================================
              PROJECTS SECTION
          ================================================= */}

          <section
            id="projects"
            className="section projects-section"
          >

            <div className="section-header">

              <div>

                <span className="section-eyebrow">
                  YOUR WORK
                </span>

                <h2>
                  My Projects
                </h2>

                <p>
                  Your generated artwork will
                  appear here.
                </p>

              </div>

            </div>


            <div className="projects-empty">

              <div className="projects-empty-icon">
                🖼️
              </div>

              <h3>
                No projects yet
              </h3>

              <p>
                Start creating artwork and
                your projects will appear here.
              </p>

              <a
                href="#create"
                className="projects-create-button"
              >
                ✨ Create Your First Artwork
              </a>

            </div>

          </section>


          {/* =================================================
              SETTINGS SECTION
          ================================================= */}

          <section
            id="settings"
            className="section settings-section"
          >

            <div className="section-header">

              <div>

                <span className="section-eyebrow">
                  PREFERENCES
                </span>

                <h2>
                  Settings
                </h2>

                <p>
                  Customize your ArtMotion AI
                  experience.
                </p>

              </div>

            </div>


            <div className="settings-grid">

              <div className="settings-card">

                <div className="settings-card-icon">
                  🎨
                </div>

                <div>

                  <h3>
                    Creative Experience
                  </h3>

                  <p>
                    Interactive 3D artwork is
                    enabled.
                  </p>

                </div>

                <span className="settings-status">
                  Active
                </span>

              </div>


              <div className="settings-card">

                <div className="settings-card-icon">
                  🖐️
                </div>

                <div>

                  <h3>
                    Hand Interaction
                  </h3>

                  <p>
                    Use hand gestures to
                    interact with artwork.
                  </p>

                </div>

                <span className="settings-status">
                  Ready
                </span>

              </div>


              <div className="settings-card">

                <div className="settings-card-icon">
                  🖱️
                </div>

                <div>

                  <h3>
                    Mouse Interaction
                  </h3>

                  <p>
                    Drag to rotate and scroll
                    to zoom the artwork.
                  </p>

                </div>

                <span className="settings-status">
                  Ready
                </span>

              </div>

            </div>

          </section>


          {/* =================================================
              FOOTER
          ================================================= */}

          <footer className="home-footer">

            <div>
              © 2026 ArtMotion AI
            </div>

            <div>
              Creative technology for
              everyone.
            </div>

          </footer>

        </div>

      </main>

    </div>
  );
}