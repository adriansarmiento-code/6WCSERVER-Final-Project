<template>
  <div class="landing-page">
    <AppHeader />

    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Find Trusted Local Service Providers</h1>
          <p class="hero-subtitle">
            Connect with verified professionals for all your household needs -
            plumbing, electrical, cleaning, and more
          </p>
          <div class="hero-buttons">
            <router-link to="/signup" class="btn btn-primary"
              >Get Started</router-link
            >
            <router-link to="/services" class="btn btn-secondary"
              >Browse Services</router-link
            >
          </div>
        </div>
        <div class="hero-image">
          <div class="placeholder-image"></div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <h2 class="section-title">Why Choose Fixify?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">✓</div>
            <h3>Verified Providers</h3>
            <p>
              All service providers are background-checked and skills-verified
              for your safety
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💬</div>
            <h3>Direct Communication</h3>
            <p>
              Negotiate terms and discuss details directly with providers
              through in-app chat
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💳</div>
            <h3>Secure Payments</h3>
            <p>
              Payment held safely until job completion - protecting both parties
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⭐</div>
            <h3>Transparent Reviews</h3>
            <p>
              Read honest reviews from real customers to make informed decisions
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📍</div>
            <h3>Location-Based</h3>
            <p>Find service providers near you with radius-based search</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📅</div>
            <h3>Easy Scheduling</h3>
            <p>
              Book services at your convenience with calendar-based scheduling
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Service Categories -->
    <section class="categories">
      <div class="container">
        <h2 class="section-title">Popular Services</h2>
        <div class="categories-grid">
          <div class="category-card">
            <div class="category-icon">🔧</div>
            <h3>Plumbing</h3>
            <p>Repairs, installations, maintenance</p>
          </div>
          <div class="category-card">
            <div class="category-icon">⚡</div>
            <h3>Electrical</h3>
            <p>Wiring, fixtures, troubleshooting</p>
          </div>
          <div class="category-card">
            <div class="category-icon">🧹</div>
            <h3>Cleaning</h3>
            <p>Home, office, deep cleaning</p>
          </div>
          <div class="category-card">
            <div class="category-icon">🔨</div>
            <h3>Carpentry</h3>
            <p>Furniture, repairs, installations</p>
          </div>
        </div>
        <div class="view-all">
          <router-link to="/services" class="btn btn-outline"
            >View All Services</router-link
          >
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="how-it-works">
      <div class="container">
        <h2 class="section-title">How Fixify Works</h2>
        <div class="steps-grid">
          <div class="step">
            <div class="step-number">1</div>
            <h3>Search & Browse</h3>
            <p>Find service providers by category or location</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h3>Review & Compare</h3>
            <p>Check profiles, ratings, and reviews</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h3>Book & Pay</h3>
            <p>Schedule service and make secure payment</p>
          </div>
          <div class="step">
            <div class="step-number">4</div>
            <h3>Get Service</h3>
            <p>Provider completes job, you confirm and review</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>
            Join thousands of satisfied customers finding reliable service
            providers
          </p>
          <div class="cta-buttons">
            <router-link to="/signup" class="btn btn-primary btn-large"
              >Sign Up Now</router-link
            >
            <router-link
              to="/signup?type=provider"
              class="btn btn-outline btn-large"
            >
              Become a Provider
            </router-link>
          </div>
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
  name: "LandingPage",
  components: {
    AppHeader,
    AppFooter,
  },
};
</script>

<style scoped>
/* Hero Section */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 0;
  min-height: 600px;
  display: flex;
  align-items: center;
}

.hero .container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-content {
  max-width: 600px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.95;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-image .placeholder-image {
  width: 100%;
  max-width: 500px;
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  background-image: url("@/assets/images/serviceprovider.jpg");
  background-size: cover;
  background-position: center;
}

.placeholder-image {
  width: 100%;
  max-width: 500px;
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(255, 255, 255, 0.3);
}

.placeholder-image span {
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.2rem;
}

/* Features Section */
.features {
  padding: 80px 0;
  background-color: #f8f9fa;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #2d3748;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: #2d3748;
}

.feature-card p {
  color: #718096;
  line-height: 1.6;
}

/* Categories Section */
.categories {
  padding: 80px 0;
  background: white;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.category-card {
  text-align: center;
  padding: 2.5rem 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.category-card:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: scale(1.05);
}

.category-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.category-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.view-all {
  text-align: center;
}

/* How It Works */
.how-it-works {
  padding: 80px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.step {
  text-align: center;
  padding: 2rem;
}

.step-number {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.step h3 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

.step p {
  opacity: 0.9;
  line-height: 1.6;
}

/* CTA Section */
.cta {
  padding: 80px 0;
  background-color: #f8f9fa;
}

.cta-content {
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #2d3748;
}

.cta-content p {
  font-size: 1.25rem;
  color: #718096;
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Button Styles */
.btn {
  display: inline-block;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  cursor: pointer;
}

.btn-primary {
  background-color: #667eea;
  color: white;
}

.btn-primary:hover {
  background-color: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background-color: white;
  color: #667eea;
  border-color: white;
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.9);
}

.btn-outline {
  background-color: transparent;
  color: #667eea;
  border-color: #667eea;
}

.btn-outline:hover {
  background-color: #667eea;
  color: white;
}

.btn-large {
  padding: 16px 40px;
  font-size: 1.125rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero .container {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.125rem;
  }

  .hero-buttons {
    flex-direction: column;
  }

  .hero-image {
    order: -1;
  }

  .section-title {
    font-size: 2rem;
  }

  .features-grid,
  .categories-grid,
  .steps-grid {
    grid-template-columns: 1fr;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    text-align: center;
  }
}
</style>
