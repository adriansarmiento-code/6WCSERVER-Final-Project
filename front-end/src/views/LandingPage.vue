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
            <template v-if="!isAuthenticated">
              <router-link to="/signup" class="btn btn-primary"
                >Get Started</router-link
              >
              <router-link to="/services" class="btn btn-secondary"
                >Browse Services</router-link
              >
            </template>
            <template v-else>
              <button @click="navigateToDashboard" class="btn btn-primary">
                Go to Dashboard
              </button>
              <router-link to="/services" class="btn btn-secondary"
                >Browse Services</router-link
              >
            </template>
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
            <p>Find service providers in your area around Angeles City</p>
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

    <!-- CTA Section - only show if not logged in -->
    <section v-if="!isAuthenticated" class="cta">
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

    <!-- Alternative CTA for logged-in users -->
    <section v-else class="cta">
      <div class="container">
        <div class="cta-content">
          <h2>Welcome back, {{ currentUser?.name }}!</h2>
          <p>Ready to book a service or manage your account?</p>
          <div class="cta-buttons">
            <button
              @click="navigateToDashboard"
              class="btn btn-primary btn-large"
            >
              Go to Dashboard
            </button>
            <router-link to="/services" class="btn btn-outline btn-large">
              Browse Services
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
  data() {
    return {
      animatedCategories: false,
      observerInitialized: false,
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    currentUser() {
      return this.$store.getters.currentUser;
    },
  },
  mounted() {
    this.initScrollAnimations();
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  methods: {
    navigateToDashboard() {
      if (this.currentUser?.role === "provider") {
        this.$router.push("/provider-dashboard");
      } else {
        this.$router.push("/dashboard");
      }
    },
    initScrollAnimations() {
      const options = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      }, options);

      // Observe all animatable elements
      const animatables = document.querySelectorAll(
        ".feature-card, .category-card, .step, .hero-content, .hero-image"
      );
      animatables.forEach((el) => {
        el.classList.add("fade-in-up");
        this.observer.observe(el);
      });
    },
  },
};
</script>

<style scoped>
/* Animations */
.fade-in-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.fade-in-up.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 0;
  min-height: 600px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at 20% 50%,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 50%
  );
  pointer-events: none;
}

.hero .container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-content {
  max-width: 600px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
  background-image: url("@/assets/images/serviceprovide.png");
  background-size: cover;
  background-position: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.hero-image .placeholder-image:hover {
  transform: scale(1.02);
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
  font-weight: 700;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.2);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: inline-block;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1);
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: #2d3748;
  font-weight: 600;
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
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.category-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 0;
}

.category-card:hover::before {
  opacity: 1;
}

.category-card:hover {
  color: white;
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(102, 126, 234, 0.25);
}

.category-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
  transition: transform 0.4s ease;
}

.category-card:hover .category-icon {
  transform: scale(1.15);
}

.category-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
  font-weight: 600;
}

.category-card p {
  position: relative;
  z-index: 1;
}

.view-all {
  text-align: center;
}

/* How It Works */
.how-it-works {
  padding: 80px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.how-it-works::before {
  content: "";
  position: absolute;
  top: -50%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 70%
  );
  pointer-events: none;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  position: relative;
  z-index: 1;
}

.step {
  text-align: center;
  padding: 2rem;
  transition: transform 0.3s ease;
}

.step:hover {
  transform: scale(1.05);
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
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.step:hover .step-number {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(360deg);
}

.step h3 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.step p {
  opacity: 0.9;
  line-height: 1.6;
}

/* CTA Section */
.cta {
  padding: 80px 0;
  background: linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%);
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
  font-weight: 700;
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn:hover::before {
  width: 300px;
  height: 300px;
}

.btn-primary {
  background-color: #667eea;
  color: white;
  box-shadow: 0 4px 6px rgba(102, 126, 234, 0.2);
}

.btn-primary:hover {
  background-color: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background-color: white;
  color: #667eea;
  border-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.btn-outline {
  background-color: transparent;
  color: #667eea;
  border-color: #667eea;
}

.btn-outline:hover {
  background-color: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
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
