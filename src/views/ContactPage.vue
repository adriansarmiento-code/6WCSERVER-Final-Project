<template>
  <div class="contact-page">
    <AppHeader />

    <!-- Hero Section -->
    <section class="contact-hero">
      <div class="container">
        <h1>Get In Touch</h1>
        <p>
          We'd love to hear from you. Send us a message and we'll respond as
          soon as possible.
        </p>
      </div>
    </section>

    <div class="container">
      <div class="contact-layout">
        <!-- Contact Form -->
        <main class="contact-form-section">
          <div class="form-card">
            <h2>Send Us a Message</h2>
            <form @submit.prevent="handleSubmit" class="contact-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    v-model="formData.firstName"
                    placeholder="Your first name"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    v-model="formData.lastName"
                    placeholder="Your last name"
                    required
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  v-model="formData.email"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  v-model="formData.phone"
                  placeholder="09XX XXX XXXX (Optional)"
                />
              </div>

              <div class="form-group">
                <label for="subject">Subject *</label>
                <select id="subject" v-model="formData.subject" required>
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="provider">Become a Provider</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="feedback">Feedback</option>
                  <option value="complaint">Complaint</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div class="form-group">
                <label for="message">Message *</label>
                <textarea
                  id="message"
                  v-model="formData.message"
                  rows="6"
                  placeholder="Tell us more about your inquiry..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                class="btn btn-primary btn-full"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? "Sending..." : "Send Message" }}
              </button>

              <div v-if="successMessage" class="success-message">
                {{ successMessage }}
              </div>

              <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
              </div>
            </form>
          </div>
        </main>

        <!-- Contact Information Sidebar -->
        <aside class="contact-info-section">
          <div class="info-card">
            <h3>Contact Information</h3>
            <div class="info-list">
              <div class="info-item">
                <div class="info-icon">📧</div>
                <div class="info-content">
                  <strong>Email</strong>
                  <a href="mailto:fixify@hau.edu.ph">fixify@hau.edu.ph</a>
                </div>
              </div>

              <div class="info-item">
                <div class="info-icon">📱</div>
                <div class="info-content">
                  <strong>Phone</strong>
                  <a href="tel:+639123456789">+63 912 345 6789</a>
                </div>
              </div>

              <div class="info-item">
                <div class="info-icon">📍</div>
                <div class="info-content">
                  <strong>Address</strong>
                  <p>
                    Holy Angel University<br />Angeles City, Pampanga<br />Philippines
                  </p>
                </div>
              </div>

              <div class="info-item">
                <div class="info-icon">🕒</div>
                <div class="info-content">
                  <strong>Business Hours</strong>
                  <p>
                    Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM -
                    4:00 PM<br />Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="info-card">
            <h3>Quick Links</h3>
            <div class="quick-links">
              <router-link to="/about" class="quick-link"
                >About Fixify</router-link
              >
              <router-link to="/services" class="quick-link"
                >Browse Services</router-link
              >
              <router-link to="/signup" class="quick-link">Sign Up</router-link>
              <a
                href="https://github.com/adriansarmiento-code/6WCSERVER-Final-Project"
                target="_blank"
                class="quick-link"
                >GitHub Repository</a
              >
            </div>
          </div>

          <div class="info-card">
            <h3>FAQ</h3>
            <div class="faq-list">
              <details class="faq-item">
                <summary>How do I book a service?</summary>
                <p>
                  Browse our service categories, select a provider, choose your
                  preferred date/time, and complete the booking form with
                  payment.
                </p>
              </details>
              <details class="faq-item">
                <summary>Are providers verified?</summary>
                <p>
                  Yes, all providers undergo background checks and skill
                  verification before being approved on the platform.
                </p>
              </details>
              <details class="faq-item">
                <summary>How does payment work?</summary>
                <p>
                  Payments are held in escrow and only released to providers
                  after you confirm service completion.
                </p>
              </details>
              <details class="faq-item">
                <summary>Can I cancel a booking?</summary>
                <p>
                  Yes, free cancellation up to 24 hours before service. See our
                  cancellation policy for details.
                </p>
              </details>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script>
import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";

export default {
  name: "ContactPage",
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      formData: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      },
      isSubmitting: false,
      successMessage: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleSubmit() {
      this.successMessage = "";
      this.errorMessage = "";
      this.isSubmitting = true;

      try {
        // Simulate API call - replace with actual backend call later
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Success
        this.successMessage =
          "Thank you for your message! We'll get back to you within 24-48 hours.";

        // Clear form
        this.formData = {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        };

        // Scroll to success message
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } catch (error) {
        this.errorMessage =
          "Failed to send message. Please try again or email us directly.";
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
.contact-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 0;
  text-align: center;
}

.contact-hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.contact-hero p {
  font-size: 1.25rem;
  opacity: 0.95;
  max-width: 600px;
  margin: 0 auto;
}

.contact-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  padding: 3rem 0 4rem;
}

/* Form Section */
.contact-form-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-card {
  padding: 2rem;
}

.form-card h2 {
  font-size: 1.75rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.btn-full {
  width: 100%;
  padding: 14px;
  font-size: 1.05rem;
}

.btn-primary {
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.success-message {
  background: #d1fae5;
  color: #065f46;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.95rem;
  border: 2px solid #a7f3d0;
}

.error-message {
  background: #fed7d7;
  color: #c53030;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.95rem;
  border: 2px solid #fca5a5;
}

/* Info Section */
.contact-info-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-card h3 {
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  gap: 1rem;
}

.info-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
}

.info-content strong {
  display: block;
  color: #2d3748;
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
}

.info-content a {
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s ease;
}

.info-content a:hover {
  color: #5a67d8;
  text-decoration: underline;
}

.info-content p {
  color: #4a5568;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
}

/* Quick Links */
.quick-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.quick-link {
  color: #667eea;
  text-decoration: none;
  padding: 0.75rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.quick-link:hover {
  background: #eef2ff;
  padding-left: 1rem;
}

/* FAQ */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.faq-item summary {
  padding: 1rem;
  cursor: pointer;
  font-weight: 600;
  color: #2d3748;
  list-style: none;
  transition: background 0.3s ease;
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

.faq-item summary::after {
  content: "+";
  float: right;
  font-size: 1.5rem;
  line-height: 1;
}

.faq-item[open] summary::after {
  content: "−";
}

.faq-item summary:hover {
  background: #f7fafc;
}

.faq-item p {
  padding: 0 1rem 1rem 1rem;
  color: #4a5568;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 1024px) {
  .contact-layout {
    grid-template-columns: 1fr;
  }

  .contact-info-section {
    order: 2;
  }
}

@media (max-width: 768px) {
  .contact-hero h1 {
    font-size: 2rem;
  }

  .contact-hero p {
    font-size: 1.1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-card,
  .info-card {
    padding: 1.5rem;
  }
}
</style>
