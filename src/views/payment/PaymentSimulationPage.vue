<template>
  <div class="payment-page">
    <AppHeader />

    <div class="container">
      <div class="payment-layout">
        <main class="payment-main">
          <div class="payment-header">
            <h1>Payment</h1>
            <p>Secure payment simulation for booking #{{ bookingId }}</p>
          </div>

          <div class="payment-card">
            <div class="security-badge">
              <span>🔒</span>
              <div>
                <strong>Secure Payment</strong>
                <p>Your payment is protected and held in escrow</p>
              </div>
            </div>

            <form @submit.prevent="processPayment" class="payment-form">
              <section class="form-section">
                <h2>Payment Method</h2>
                <div class="payment-methods">
                  <label
                    v-for="method in paymentMethods"
                    :key="method.id"
                    class="payment-method"
                    :class="{ selected: selectedMethod === method.id }"
                  >
                    <input
                      type="radio"
                      :value="method.id"
                      v-model="selectedMethod"
                      required
                    />
                    <div class="method-info">
                      <span class="method-icon">{{ method.icon }}</span>
                      <div>
                        <strong>{{ method.name }}</strong>
                        <p>{{ method.description }}</p>
                      </div>
                    </div>
                  </label>
                </div>
              </section>

              <!-- Card Details (if card selected) -->
              <section v-if="selectedMethod === 'card'" class="form-section">
                <h2>Card Details</h2>
                <div class="form-group">
                  <label for="cardNumber">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    v-model="cardDetails.number"
                    placeholder="1234 5678 9012 3456"
                    maxlength="19"
                    required
                  />
                </div>
                <div class="form-grid">
                  <div class="form-group">
                    <label for="expiry">Expiry Date</label>
                    <input
                      type="text"
                      id="expiry"
                      v-model="cardDetails.expiry"
                      placeholder="MM/YY"
                      maxlength="5"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label for="cvv">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      v-model="cardDetails.cvv"
                      placeholder="123"
                      maxlength="3"
                      required
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label for="cardName">Cardholder Name</label>
                  <input
                    type="text"
                    id="cardName"
                    v-model="cardDetails.name"
                    placeholder="Name on card"
                    required
                  />
                </div>
              </section>

              <!-- E-Wallet (if e-wallet selected) -->
              <section v-if="selectedMethod === 'ewallet'" class="form-section">
                <h2>E-Wallet Details</h2>
                <div class="form-group">
                  <label for="ewalletPhone">Phone Number</label>
                  <input
                    type="tel"
                    id="ewalletPhone"
                    v-model="ewalletPhone"
                    placeholder="09XX XXX XXXX"
                    required
                  />
                </div>
                <p class="info-text">
                  You will receive a notification on your mobile device to
                  confirm payment
                </p>
              </section>

              <!-- Terms -->
              <div class="form-section">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="agreedToTerms" required />
                  <span>
                    I understand this is a simulated payment and no actual
                    charge will be made
                  </span>
                </label>
              </div>

              <button
                type="submit"
                class="btn btn-primary btn-large btn-full"
                :disabled="isProcessing || !agreedToTerms"
              >
                {{ isProcessing ? "Processing..." : `Pay ₱${totalAmount}` }}
              </button>

              <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
              </div>
            </form>
          </div>
        </main>

        <!-- Order Summary Sidebar -->
        <aside class="payment-summary">
          <div class="summary-card">
            <h3>Order Summary</h3>

            <div class="booking-details">
              <div class="detail-row">
                <span>Service</span>
                <strong>Emergency Leak Repair</strong>
              </div>
              <div class="detail-row">
                <span>Provider</span>
                <strong>Juan dela Cruz</strong>
              </div>
              <div class="detail-row">
                <span>Date</span>
                <strong>Oct 15, 2025</strong>
              </div>
              <div class="detail-row">
                <span>Time</span>
                <strong>2:00 PM</strong>
              </div>
            </div>

            <div class="summary-divider"></div>

            <div class="price-breakdown">
              <div class="price-row">
                <span>Service Fee</span>
                <span>₱800</span>
              </div>
              <div class="price-row">
                <span>Platform Fee</span>
                <span>₱80</span>
              </div>
              <div class="summary-divider"></div>
              <div class="price-row total">
                <strong>Total</strong>
                <strong>₱{{ totalAmount }}</strong>
              </div>
            </div>

            <div class="escrow-notice">
              <div class="notice-icon">🔒</div>
              <div class="notice-text">
                <strong>Payment Protection</strong>
                <p>
                  Funds will be held securely and only released to the provider
                  after you confirm service completion.
                </p>
              </div>
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
  name: "PaymentSimulationPage",
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      bookingId: "",
      selectedMethod: "card",
      cardDetails: {
        number: "",
        expiry: "",
        cvv: "",
        name: "",
      },
      ewalletPhone: "",
      agreedToTerms: false,
      isProcessing: false,
      errorMessage: "",
      totalAmount: 880,
      paymentMethods: [
        {
          id: "card",
          name: "Credit/Debit Card",
          icon: "💳",
          description: "Visa, Mastercard, or other cards",
        },
        {
          id: "ewallet",
          name: "E-Wallet",
          icon: "📱",
          description: "GCash, PayMaya, or other e-wallets",
        },
        {
          id: "bank",
          name: "Online Banking",
          icon: "🏦",
          description: "Direct bank transfer",
        },
      ],
    };
  },
  methods: {
    async processPayment() {
      this.errorMessage = "";
      this.isProcessing = true;

      try {
        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Redirect to success page
        this.$router.push({
          name: "PaymentSuccess",
          params: { bookingId: this.bookingId },
        });
      } catch (error) {
        this.errorMessage = "Payment failed. Please try again.";
      } finally {
        this.isProcessing = false;
      }
    },
  },
  mounted() {
    this.bookingId = this.$route.params.bookingId || "BOOK-12345";
  },
};
</script>

<style scoped>
.payment-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  padding: 2rem 0 4rem;
}

.payment-header {
  text-align: center;
  margin-bottom: 2rem;
}

.payment-header h1 {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.payment-header p {
  color: #718096;
}

.payment-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.security-badge {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: #eef2ff;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.security-badge span {
  font-size: 2rem;
}

.security-badge strong {
  display: block;
  color: #4c51bf;
  margin-bottom: 0.25rem;
}

.security-badge p {
  color: #667eea;
  font-size: 0.9rem;
  margin: 0;
}

.payment-form {
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
}

.form-section h2 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.payment-method {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.payment-method:hover {
  border-color: #667eea;
  background: #f7fafc;
}

.payment-method.selected {
  border-color: #667eea;
  background: #eef2ff;
}

.method-info {
  display: flex;
  gap: 1rem;
  flex: 1;
}

.method-icon {
  font-size: 2rem;
}

.method-info strong {
  display: block;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.method-info p {
  color: #718096;
  font-size: 0.9rem;
  margin: 0;
}

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

.form-group input {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.info-text {
  color: #718096;
  font-size: 0.9rem;
  line-height: 1.5;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
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

.payment-summary {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.summary-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.summary-card h3 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.booking-details {
  margin-bottom: 1.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
}

.detail-row span {
  color: #718096;
  font-size: 0.95rem;
}

.detail-row strong {
  color: #2d3748;
}

.summary-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 1rem 0;
}

.price-breakdown {
  margin-bottom: 1.5rem;
}

.price-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  color: #4a5568;
}

.price-row.total {
  font-size: 1.25rem;
  padding-top: 1rem;
}

.price-row.total strong {
  color: #667eea;
}

.escrow-notice {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: #eef2ff;
  border-radius: 8px;
}

.notice-icon {
  font-size: 1.5rem;
}

.notice-text strong {
  display: block;
  color: #4c51bf;
  margin-bottom: 0.5rem;
}

.notice-text p {
  color: #667eea;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 1024px) {
  .payment-layout {
    grid-template-columns: 1fr;
  }

  .payment-summary {
    position: static;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
