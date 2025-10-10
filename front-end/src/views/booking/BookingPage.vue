<template>
  <div class="booking-page">
    <AppHeader />

    <!-- Add loading state -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading booking details...</p>
    </div>

    <!-- Show error if fetch fails -->
    <div v-else-if="error" class="error-container">
      <h2>{{ error }}</h2>
      <button class="btn btn-primary" @click="$router.back()">Go Back</button>
    </div>

    <!-- Only render when provider data is loaded -->
    <div v-else-if="provider" class="container">
      <div class="booking-header">
        <h1>Book a Service</h1>
        <p>Complete your booking details</p>
      </div>

      <div class="booking-layout">
        <!-- Booking Form -->
        <main class="booking-form-container">
          <form @submit.prevent="handleBooking" class="booking-form">
            <!-- Provider Summary -->
            <section class="form-section">
              <h2>Service Provider</h2>
              <div class="provider-summary">
                <img :src="provider.image" :alt="provider.name" />
                <div class="provider-details">
                  <h3>{{ provider.name }}</h3>
                  <p>
                    {{ provider.providerInfo?.category || "Service Provider" }}
                  </p>
                  <div class="rating">
                    ⭐ {{ provider.providerInfo?.rating || "N/A" }} ({{
                      provider.providerInfo?.reviewCount || 0
                    }}
                    reviews)
                  </div>
                </div>
              </div>
            </section>

            <!-- Service Selection -->
            <section class="form-section">
              <h2>Select Service</h2>
              <div class="service-options">
                <label
                  v-for="service in provider.providerInfo?.services || []"
                  :key="service._id"
                  class="service-option"
                  :class="{ selected: selectedService?._id === service._id }"
                >
                  <input
                    type="radio"
                    :value="service"
                    v-model="selectedService"
                    required
                  />
                  <div class="service-info">
                    <strong>{{ service.name }}</strong>
                    <p>{{ service.description }}</p>
                    <span class="price">₱{{ service.price }}</span>
                  </div>
                </label>
              </div>
            </section>

            <!-- Date & Time -->
            <section class="form-section">
              <h2>Schedule</h2>
              <div class="schedule-grid">
                <div class="form-group">
                  <label for="date">Preferred Date</label>
                  <input
                    type="date"
                    id="date"
                    v-model="bookingData.scheduledDate"
                    :min="minDate"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="time">Preferred Time</label>
                  <select
                    id="time"
                    v-model="bookingData.scheduledTime"
                    required
                  >
                    <option value="">Select time</option>
                    <option value="08:00">8:00 AM</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                  </select>
                </div>
              </div>
            </section>

            <!-- Location -->
            <section class="form-section">
              <h2>Service Location</h2>
              <div class="form-group">
                <label for="address">Full Address</label>
                <textarea
                  id="address"
                  v-model="bookingData.address"
                  rows="3"
                  placeholder="Enter your complete address"
                  required
                ></textarea>
              </div>
              <div class="form-group">
                <label for="notes">Additional Notes (Optional)</label>
                <textarea
                  id="notes"
                  v-model="bookingData.notes"
                  rows="3"
                  placeholder="Any specific instructions or details..."
                ></textarea>
              </div>
            </section>

            <!-- Contact Info -->
            <section class="form-section">
              <h2>Contact Information</h2>
              <div class="form-grid">
                <div class="form-group">
                  <label for="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    v-model="bookingData.contactPhone"
                    placeholder="09XX XXX XXXX"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    v-model="bookingData.contactEmail"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
            </section>

            <!-- Terms -->
            <div class="form-section">
              <label class="checkbox-label">
                <input type="checkbox" v-model="agreedToTerms" required />
                <span>
                  I agree to the booking terms and cancellation policy
                </span>
              </label>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="btn btn-primary btn-large btn-full"
              :disabled="isSubmitting || !isFormValid"
            >
              {{ isSubmitting ? "Processing..." : "Proceed to Payment" }}
            </button>

            <div v-if="submitError" class="error-message">
              {{ submitError }}
            </div>
          </form>
        </main>

        <!-- Booking Summary Sidebar -->
        <aside class="booking-summary">
          <div class="summary-card">
            <h3>Booking Summary</h3>

            <div class="summary-item">
              <span>Service</span>
              <strong>{{ selectedServiceName }}</strong>
            </div>

            <div class="summary-item">
              <span>Date</span>
              <strong>{{ formattedDate }}</strong>
            </div>

            <div class="summary-item">
              <span>Time</span>
              <strong>{{ formattedTime }}</strong>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-item">
              <span>Service Fee</span>
              <strong>₱{{ selectedServicePrice }}</strong>
            </div>

            <div class="summary-item">
              <span>Platform Fee</span>
              <strong>₱{{ platformFee }}</strong>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-item total">
              <span>Total Amount</span>
              <strong>₱{{ totalAmount }}</strong>
            </div>

            <div class="payment-note">
              <small>
                Payment will be held securely and released to the provider only
                after service completion confirmation.
              </small>
            </div>
          </div>

          <div class="cancellation-policy">
            <h4>Cancellation Policy</h4>
            <ul>
              <li>Free cancellation up to 24 hours before service</li>
              <li>50% refund within 24 hours</li>
              <li>No refund for same-day cancellations</li>
            </ul>
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
import { providerAPI, bookingAPI } from "@/services/api";

export default {
  name: "BookingPage",
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      provider: null,
      selectedService: null,
      bookingData: {
        scheduledDate: "",
        scheduledTime: "",
        address: "",
        contactPhone: "",
        contactEmail: "",
        notes: "",
      },
      agreedToTerms: false,
      loading: true,
      error: null,
      isSubmitting: false,
      submitError: null,
    };
  },
  computed: {
    minDate() {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split("T")[0];
    },
    selectedServiceName() {
      return this.selectedService?.name || "Not selected";
    },
    selectedServicePrice() {
      return this.selectedService?.price || 0;
    },
    platformFee() {
      return this.selectedService
        ? Math.round(this.selectedService.price * 0.1)
        : 0;
    },
    totalAmount() {
      return this.selectedService
        ? this.selectedService.price + this.platformFee
        : 0;
    },
    formattedDate() {
      if (!this.bookingData.scheduledDate) return "Not selected";
      const date = new Date(this.bookingData.scheduledDate);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    formattedTime() {
      if (!this.bookingData.scheduledTime) return "Not selected";
      const time = this.bookingData.scheduledTime;
      const [hours] = time.split(":");
      const hour = parseInt(hours);
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}:00 ${period}`;
    },
    isFormValid() {
      return (
        this.selectedService &&
        this.bookingData.scheduledDate &&
        this.bookingData.scheduledTime &&
        this.bookingData.address &&
        this.bookingData.contactPhone &&
        this.bookingData.contactEmail &&
        this.agreedToTerms
      );
    },
  },
  methods: {
    async fetchProvider() {
      this.loading = true;
      this.error = null;

      try {
        const providerId = this.$route.params.providerId;

        if (!providerId) {
          throw new Error("Provider ID is missing");
        }

        const response = await providerAPI.getById(providerId);
        this.provider = response.data;

        // Pre-fill contact info from logged-in user
        const user = this.$store.getters.currentUser;
        if (user) {
          this.bookingData.contactPhone = user.phone || "";
          this.bookingData.contactEmail = user.email || "";
        }

        this.loading = false;
      } catch (error) {
        console.error("Error fetching provider:", error);
        this.error =
          error.response?.data?.message || "Failed to load provider details";
        this.loading = false;
      }
    },

    async handleBooking() {
      this.isSubmitting = true;
      this.submitError = null;

      try {
        const bookingPayload = {
          providerId: this.provider._id,
          service: {
            name: this.selectedService.name,
            price: this.selectedService.price,
            description: this.selectedService.description,
          },
          scheduledDate: this.bookingData.scheduledDate,
          scheduledTime: this.bookingData.scheduledTime,
          address: this.bookingData.address,
          contactPhone: this.bookingData.contactPhone,
          contactEmail: this.bookingData.contactEmail,
          notes: this.bookingData.notes,
        };

        const response = await bookingAPI.create(bookingPayload);

        // Redirect to payment page with booking ID
        this.$router.push(`/payment/${response.data._id}`);
      } catch (error) {
        console.error("Error creating booking:", error);
        this.submitError =
          error.response?.data?.message ||
          "Failed to create booking. Please try again.";
      } finally {
        this.isSubmitting = false;
      }
    },
  },
  mounted() {
    this.fetchProvider();
  },
};
</script>

<style scoped>
/* Loading and Error States */
.loading-container,
.error-container {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-container p {
  color: #718096;
  font-size: 1.1rem;
}

.error-container h2 {
  color: #e53e3e;
  margin-bottom: 1rem;
}

.booking-header {
  text-align: center;
  padding: 3rem 0 2rem;
}

.booking-header h1 {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.booking-header p {
  color: #718096;
  font-size: 1.1rem;
}

.booking-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  padding-bottom: 4rem;
}

/* Form Container */
.booking-form-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.booking-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  padding-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.form-section:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}

.form-section h2 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
}

/* Provider Summary */
.provider-summary {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 8px;
}

.provider-summary img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.provider-details h3 {
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.provider-details p {
  color: #667eea;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.rating {
  color: #718096;
  font-size: 0.9rem;
}

/* Service Options */
.service-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.service-option {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.service-option:hover {
  border-color: #667eea;
  background: #f7fafc;
}

.service-option.selected {
  border-color: #667eea;
  background: #eef2ff;
}

.service-option input[type="radio"] {
  margin-top: 0.25rem;
}

.service-info {
  flex: 1;
}

.service-info strong {
  display: block;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.service-info p {
  color: #718096;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.service-info .price {
  display: inline-block;
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.95rem;
}

/* Form Elements */
.schedule-grid,
.form-grid {
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

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: #4a5568;
}

.btn-full {
  width: 100%;
}

.btn-large {
  padding: 16px 32px;
  font-size: 1.1rem;
}

.error-message {
  background-color: #fed7d7;
  color: #c53030;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.95rem;
  text-align: center;
}

/* Booking Summary Sidebar */
.booking-summary {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.summary-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 1.5rem;
}

.summary-card h3 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
}

.summary-item span {
  color: #718096;
  font-size: 0.95rem;
}

.summary-item strong {
  color: #2d3748;
  font-size: 1rem;
}

.summary-item.total {
  font-size: 1.1rem;
}

.summary-item.total strong {
  color: #667eea;
  font-size: 1.5rem;
}

.summary-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 1rem 0;
}

.payment-note {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #eef2ff;
  border-radius: 8px;
}

.payment-note small {
  color: #4c51bf;
  line-height: 1.5;
  font-size: 0.85rem;
}

.cancellation-policy {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.cancellation-policy h4 {
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.cancellation-policy ul {
  list-style: none;
  padding: 0;
}

.cancellation-policy li {
  padding: 0.5rem 0;
  color: #718096;
  font-size: 0.9rem;
  padding-left: 1.5rem;
  position: relative;
}

.cancellation-policy li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #667eea;
  font-weight: bold;
}

@media (max-width: 1024px) {
  .booking-layout {
    grid-template-columns: 1fr;
  }

  .booking-summary {
    position: static;
  }

  .schedule-grid,
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
