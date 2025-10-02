<template>
  <div class="about-page">
    <AppHeader />

    <!-- Hero Section -->
    <section class="about-hero">
      <div class="container">
        <h1>About Fixify</h1>
        <p class="hero-subtitle">
          Connecting communities with trusted service providers
        </p>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="mission-section">
      <div class="container">
        <div class="mission-content">
          <div class="mission-text">
            <h2>Our Mission</h2>
            <p>
              Fixify was created to solve a common problem: finding reliable,
              trustworthy service providers for household and office needs. We
              believe everyone deserves access to quality services without the
              stress of uncertainty, fraud, or poor workmanship.
            </p>
            <p>
              Our platform bridges the gap between skilled service providers and
              customers who need their expertise. By implementing verification
              systems, secure payment escrow, and transparent reviews, we create
              a trusted marketplace that benefits both parties.
            </p>
          </div>
          <div class="mission-image">
            <div class="placeholder-box">Mission Image</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="values-section">
      <div class="container">
        <h2 class="section-title">Our Core Values</h2>
        <div class="values-grid">
          <div class="value-card">
            <div class="value-icon">🔒</div>
            <h3>Trust & Safety</h3>
            <p>
              All service providers undergo background checks and skill
              verification. Payments are held in escrow until job completion.
            </p>
          </div>
          <div class="value-card">
            <div class="value-icon">💎</div>
            <h3>Transparency</h3>
            <p>
              Clear pricing, honest reviews, and open communication ensure no
              hidden surprises for customers or providers.
            </p>
          </div>
          <div class="value-card">
            <div class="value-icon">🤝</div>
            <h3>Fairness</h3>
            <p>
              We protect both customers and providers with fair policies,
              dispute resolution, and equal representation.
            </p>
          </div>
          <div class="value-card">
            <div class="value-icon">⚡</div>
            <h3>Convenience</h3>
            <p>
              Easy booking, scheduling, communication, and payment - all in one
              platform designed for simplicity.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works-section">
      <div class="container">
        <h2 class="section-title">How Fixify Works</h2>
        <div class="process-grid">
          <div class="process-step">
            <div class="step-number">1</div>
            <h3>Browse & Search</h3>
            <p>
              Find service providers by category or location. Filter by ratings,
              distance, and availability.
            </p>
          </div>
          <div class="process-step">
            <div class="step-number">2</div>
            <h3>Review Profiles</h3>
            <p>
              Check verified credentials, past reviews, pricing, and service
              details before making a decision.
            </p>
          </div>
          <div class="process-step">
            <div class="step-number">3</div>
            <h3>Book & Pay</h3>
            <p>
              Schedule your service and pay securely. Your payment is held
              safely until the job is completed.
            </p>
          </div>
          <div class="process-step">
            <div class="step-number">4</div>
            <h3>Confirm & Review</h3>
            <p>
              Once the service is done, confirm completion to release payment
              and leave a review to help others.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="team-section">
      <div class="container">
        <h2 class="section-title">Meet the Team</h2>
        <p class="team-intro">
          Fixify is developed by a dedicated team of students from Holy Angel
          University as part of the 6WCSERVER course project.
        </p>
        <div class="team-grid">
          <div class="team-member">
            <div class="member-photo">
              <div class="placeholder-avatar">AS</div>
            </div>
            <h3>Adrian P. Sarmiento</h3>
            <p class="role">Project Leader & Backend & Frontend Developer</p>
            <p class="bio">
              Leads project coordination and develops backend functionality
              including APIs and database management.
            </p>
          </div>
          <div class="team-member">
            <div class="member-photo">
              <div class="placeholder-avatar">RD</div>
            </div>
            <h3>Ryna Mae F. David</h3>
            <p class="role">Frontend & Backend Developer</p>
            <p class="bio">
              Works on full-stack development, implementing features and
              integrating frontend with backend systems.
            </p>
          </div>
          <div class="team-member">
            <div class="member-photo">
              <div class="placeholder-avatar">MV</div>
            </div>
            <h3>Martin Conrad S. Villanueva</h3>
            <p class="role">Frontend Developer & UI/UX Designer</p>
            <p class="bio">
              Designs and develops user interfaces with focus on user experience
              and responsive design.
            </p>
          </div>
          <div class="team-member">
            <div class="member-photo">
              <div class="placeholder-avatar">KS</div>
            </div>
            <h3>Kurt Justine T. Sicat</h3>
            <p class="role">Technical Writer & Backend Developer</p>
            <p class="bio">
              Prepares technical documentation and contributes to backend
              development and database handling.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Technology Section -->
    <section class="technology-section">
      <div class="container">
        <h2 class="section-title">Built With Modern Technology</h2>
        <div class="tech-content">
          <div class="tech-list">
            <div class="tech-category">
              <h3>Frontend</h3>
              <ul>
                <li>Vue.js 3</li>
                <li>HTML5 & CSS3</li>
                <li>Responsive Design</li>
              </ul>
            </div>
            <div class="tech-category">
              <h3>Backend</h3>
              <ul>
                <li>Node.js</li>
                <li>Express.js</li>
                <li>MongoDB</li>
              </ul>
            </div>
            <div class="tech-category">
              <h3>Features</h3>
              <ul>
                <li>Real-time Chat (Socket.IO)</li>
                <li>Map Integration (Google Maps/Leaflet)</li>
                <li>Push Notifications (Firebase)</li>
              </ul>
            </div>
          </div>
          <div class="tech-description">
            <p>
              Fixify is built using the Agile Scrum methodology, ensuring
              iterative development, continuous testing, and regular updates.
              Our technology stack prioritizes security, scalability, and user
              experience.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="contact-section">
      <div class="container">
        <div class="contact-content">
          <h2>Get In Touch</h2>
          <p>Have questions or feedback? We'd love to hear from you.</p>
          <div class="contact-info">
            <div class="contact-item">
              <strong>Email:</strong>
              <a href="mailto:fixify@hau.edu.ph">fixify@hau.edu.ph</a>
            </div>
            <div class="contact-item">
              <strong>GitHub:</strong>
              <a
                href="https://github.com/adriansarmiento-code/6WCSERVER-Final-Project"
                target="_blank"
              >
                View Repository
              </a>
            </div>
            <div class="contact-item">
              <strong>Institution:</strong>
              <span>Holy Angel University</span>
            </div>
          </div>
          <router-link to="/contact" class="btn btn-primary">
            Contact Us
          </router-link>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script>
import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";

export default {
  name: "AboutPage",
  components: {
    AppHeader,
    AppFooter,
  },
};
</script>

<style scoped>
.about-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 0;
  text-align: center;
}

.about-hero h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.5rem;
  opacity: 0.95;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #2d3748;
}

/* Mission Section */
.mission-section {
  padding: 80px 0;
  background: white;
}

.mission-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.mission-text h2 {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.mission-text p {
  color: #4a5568;
  line-height: 1.8;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.mission-image {
  display: flex;
  justify-content: center;
}

.placeholder-box {
  width: 100%;
  aspect-ratio: 1;
  background: #f7fafc;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #e2e8f0;
  color: #a0aec0;
  font-size: 1.2rem;
}

/* Values Section */
.values-section {
  padding: 80px 0;
  background: #f7fafc;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.value-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.value-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.value-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.value-card h3 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1rem;
}

.value-card p {
  color: #718096;
  line-height: 1.6;
}

/* How It Works Section */
.how-it-works-section {
  padding: 80px 0;
  background: white;
}

.process-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
}

.process-step {
  text-align: center;
}

.step-number {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 1.5rem;
}

.process-step h3 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1rem;
}

.process-step p {
  color: #718096;
  line-height: 1.6;
}

/* Team Section */
.team-section {
  padding: 80px 0;
  background: #f7fafc;
}

.team-intro {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 3rem;
  color: #4a5568;
  font-size: 1.1rem;
  line-height: 1.8;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.team-member {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.member-photo {
  margin-bottom: 1.5rem;
}

.placeholder-avatar {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  margin: 0 auto;
}

.team-member h3 {
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.role {
  color: #667eea;
  font-weight: 600;
  margin-bottom: 1rem;
}

.bio {
  color: #718096;
  line-height: 1.6;
  font-size: 0.95rem;
}

/* Technology Section */
.technology-section {
  padding: 80px 0;
  background: white;
}

.tech-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4rem;
  align-items: start;
}

.tech-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.tech-category h3 {
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 1rem;
}

.tech-category ul {
  list-style: none;
  padding: 0;
}

.tech-category li {
  color: #4a5568;
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
}

.tech-category li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #667eea;
  font-weight: bold;
}

.tech-description p {
  color: #4a5568;
  line-height: 1.8;
  font-size: 1.05rem;
}

/* Contact Section */
.contact-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.contact-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.contact-content h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.contact-content > p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.95;
}

.contact-info {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.contact-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-item strong {
  font-size: 0.9rem;
  opacity: 0.9;
}

.contact-item a {
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
  transition: opacity 0.3s ease;
}

.contact-item a:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.contact-item span {
  font-size: 1.1rem;
}

.contact-content .btn {
  background: white;
  color: #667eea;
}

.contact-content .btn:hover {
  background: rgba(255, 255, 255, 0.9);
}

@media (max-width: 768px) {
  .about-hero h1 {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .mission-content {
    grid-template-columns: 1fr;
  }

  .mission-image {
    order: -1;
  }

  .tech-content {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 2rem;
  }
}
</style>
