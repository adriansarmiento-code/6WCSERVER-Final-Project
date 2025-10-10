<template>
  <div class="review-page">
    <AppHeader />

    <div class="container">
      <div class="review-container">
        <h1>Leave a Review</h1>
        <p>Share your experience with {{ booking?.provider?.name }}</p>

        <div v-if="loading" class="loading">Loading...</div>

        <form v-else @submit.prevent="submitReview" class="review-form">
          <div class="form-section">
            <h2>Service Details</h2>
            <p><strong>Service:</strong> {{ booking?.service?.name }}</p>
            <p>
              <strong>Date:</strong> {{ formatDate(booking?.scheduledDate) }}
            </p>
          </div>

          <div class="form-section">
            <h2>Your Rating</h2>
            <div class="star-rating">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                @click="rating = star"
                :class="{ active: star <= rating }"
                class="star-btn"
              >
                ⭐
              </button>
            </div>
            <p class="rating-text">{{ ratingText }}</p>
          </div>

          <div class="form-section">
            <h2>Your Review</h2>
            <textarea
              v-model="comment"
              rows="6"
              placeholder="Tell us about your experience..."
              required
              maxlength="1000"
            ></textarea>
            <p class="char-count">{{ comment.length }}/1000</p>
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-large"
            :disabled="isSubmitting || !rating || !comment"
          >
            {{ isSubmitting ? "Submitting..." : "Submit Review" }}
          </button>

          <div v-if="error" class="error-message">{{ error }}</div>
        </form>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script>
import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import { bookingAPI, reviewAPI } from "@/services/api";

export default {
  name: "ReviewPage",
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      booking: null,
      rating: 0,
      comment: "",
      loading: true,
      isSubmitting: false,
      error: null,
    };
  },
  computed: {
    ratingText() {
      const texts = {
        1: "Poor",
        2: "Fair",
        3: "Good",
        4: "Very Good",
        5: "Excellent",
      };
      return this.rating ? texts[this.rating] : "Select a rating";
    },
  },
  methods: {
    async fetchBooking() {
      try {
        const response = await bookingAPI.getById(this.$route.params.bookingId);
        this.booking = response.data;
        this.loading = false;
      } catch (error) {
        console.error("Error fetching booking:", error);
        this.error = "Failed to load booking details";
        this.loading = false;
      }
    },

    async submitReview() {
      this.isSubmitting = true;
      this.error = null;

      try {
        await reviewAPI.create({
          bookingId: this.$route.params.bookingId,
          rating: this.rating,
          comment: this.comment,
        });

        alert("Thank you for your review!");
        this.$router.push("/dashboard");
      } catch (error) {
        console.error("Error submitting review:", error);
        this.error = error.response?.data?.message || "Failed to submit review";
      } finally {
        this.isSubmitting = false;
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
  mounted() {
    this.fetchBooking();
  },
};
</script>

<style scoped>
.review-container {
  max-width: 800px;
  margin: 3rem auto;
  padding: 0 2rem 4rem;
}

.review-container h1 {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.review-container > p {
  color: #718096;
  margin-bottom: 2rem;
}

.review-form {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.form-section:last-of-type {
  border-bottom: none;
}

.form-section h2 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1rem;
}

.star-rating {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.star-btn {
  background: none;
  border: none;
  font-size: 2.5rem;
  cursor: pointer;
  filter: grayscale(100%);
  transition: all 0.3s;
}

.star-btn.active {
  filter: grayscale(0%);
  transform: scale(1.1);
}

.rating-text {
  color: #667eea;
  font-weight: 600;
  font-size: 1.1rem;
}

textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
}

textarea:focus {
  outline: none;
  border-color: #667eea;
}

.char-count {
  text-align: right;
  color: #718096;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.btn-large {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
}

.error-message {
  background: #fed7d7;
  color: #c53030;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #718096;
}
</style>
