<template>
  <div class="provider-profile-page">
    <AppHeader />

    <!-- Add loading/error states -->
    <div v-if="loading" class="loading-container">
      <p>Loading provider details...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <router-link to="/services" class="btn btn-primary"
        >Back to Services</router-link
      >
    </div>

    <!-- Only render if provider exists -->
    <div v-else-if="provider" class="container">
      <!-- Provider Header -->
      <div class="provider-header">
        <div class="provider-image">
          <img :src="getProfileImage(provider)" :alt="provider.name" />
        </div>

        <div class="provider-info">
          <h1>{{ provider.name }}</h1>
          <p class="category">{{ provider.providerInfo?.category }}</p>

          <div class="rating">
            <span class="stars">{{
              "⭐".repeat(Math.floor(provider.providerInfo?.rating || 0))
            }}</span>
            <span class="rating-text">
              {{ provider.providerInfo?.rating?.toFixed(1) || "New" }}
              ({{ provider.providerInfo?.reviewCount || 0 }} reviews)
            </span>
          </div>

          <div class="provider-stats">
            <div class="stat">
              <strong>Experience:</strong>
              {{ provider.providerInfo?.yearsExperience || 0 }} years
            </div>
            <div class="stat">
              <strong>Rate:</strong> ₱{{
                provider.providerInfo?.hourlyRate || "N/A"
              }}/hr
            </div>
            <div class="stat">
              <strong>Completed Jobs:</strong>
              {{ provider.providerInfo?.completedJobs || 0 }}
            </div>
          </div>

          <div class="action-buttons">
            <button @click="handleBookNow" class="btn btn-primary">
              Book Now
            </button>
            <button @click="handleContact" class="btn btn-secondary">
              Contact
            </button>
          </div>
        </div>
      </div>

      <!-- About Section -->
      <div class="section">
        <h2>About</h2>
        <p>{{ provider.providerInfo?.bio || "No bio available" }}</p>
      </div>

      <!-- Services Section -->
      <div class="section">
        <h2>Services Offered</h2>
        <div
          v-if="provider.providerInfo?.services?.length"
          class="services-grid"
        >
          <div
            v-for="service in provider.providerInfo.services"
            :key="service._id || service.name"
            class="service-card"
          >
            <h3>{{ service.name }}</h3>
            <p>{{ service.description }}</p>
            <p class="price">₱{{ service.price }}</p>
          </div>
        </div>
        <p v-else class="no-data">No services listed</p>
      </div>

      <!-- Reviews Section -->
      <div class="section">
        <h2>Customer Reviews</h2>
        <div v-if="reviews.length" class="reviews-list">
          <div v-for="review in reviews" :key="review._id" class="review-card">
            <div class="review-header">
              <strong>{{ review.customer.name }}</strong>
              <span class="review-rating">{{
                "⭐".repeat(review.rating)
              }}</span>
            </div>
            <p>{{ review.comment }}</p>
            <p class="review-date">{{ formatDate(review.createdAt) }}</p>
          </div>
        </div>
        <p v-else class="no-data">No reviews yet</p>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script>
import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import { providerAPI, reviewAPI } from "@/services/api";

export default {
  name: "ProviderProfilePage",
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      provider: null,
      reviews: [],
      loading: true,
      error: null,
    };
  },
  methods: {
    getProfileImage(provider) {
      if (provider?.profileImage) {
        return provider.profileImage;
      }
      return require("@/assets/images/icons/defaulticon.png");
    },
    async fetchProviderData() {
      try {
        const providerId = this.$route.params.id;

        if (!providerId) {
          this.error = "Provider ID is missing";
          this.loading = false;
          return;
        }

        // Fetch provider details
        const providerResponse = await providerAPI.getById(providerId);
        this.provider = providerResponse.data;

        // Fetch provider reviews
        const reviewsResponse = await reviewAPI.getProviderReviews(providerId);
        this.reviews = reviewsResponse.data.reviews;

        this.loading = false;
      } catch (error) {
        console.error("Error fetching provider:", error);
        this.error =
          error.response?.data?.message || "Failed to load provider details";
        this.loading = false;
      }
    },

    handleBookNow() {
      if (!this.$store.getters.isAuthenticated) {
        alert("Please login to book this service");
        this.$router.push(`/login?redirect=/booking/${this.provider._id}`);
        return;
      }
      this.$router.push(`/booking/${this.provider._id}`);
    },

    handleContact() {
      if (!this.$store.getters.isAuthenticated) {
        alert("Please login to contact this provider");
        this.$router.push("/login");
        return;
      }
      this.$router.push(`/messages/${this.provider._id}`);
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
    this.fetchProviderData();
  },
};
</script>

<style scoped>
.profile-layout {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 2rem;
  padding: 2rem 0 4rem;
}

/* Sidebar */
.profile-sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.profile-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
}

.profile-image {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.verified-badge {
  position: absolute;
  bottom: 15px;
  left: 15px;
  background: #28a745;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.profile-info {
  padding: 1.5rem;
}

.profile-info h1 {
  font-size: 1.75rem;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.profile-category {
  color: #667eea;
  font-weight: 600;
  margin-bottom: 1rem;
}

.profile-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.rating-text {
  color: #718096;
  font-size: 0.95rem;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.stat-item {
  text-align: center;
}

.stat-item strong {
  display: block;
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.stat-item span {
  font-size: 0.85rem;
  color: #718096;
}

.profile-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.price-label {
  font-weight: 600;
  color: #2d3748;
}

.price-amount {
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
}

.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.availability-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.availability-card h3 {
  margin-bottom: 1rem;
  color: #2d3748;
}

.availability-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.availability-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.availability-item:last-child {
  border-bottom: none;
}

.day {
  font-weight: 600;
  color: #2d3748;
}

.hours {
  color: #718096;
}

/* Main Content */
.section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.section h2 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.about-text {
  color: #4a5568;
  line-height: 1.8;
  font-size: 1.05rem;
}

.services-list {
  display: grid;
  gap: 1.5rem;
}

.service-item {
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.service-item h4 {
  font-size: 1.1rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.service-item p {
  color: #718096;
  margin-bottom: 0.75rem;
}

.service-price {
  display: inline-block;
  font-weight: 600;
  color: #667eea;
  font-size: 1.1rem;
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.skill-badge {
  background: #667eea;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filter-select {
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-item {
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 8px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.reviewer-info strong {
  display: block;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.review-rating {
  font-size: 0.9rem;
}

.review-date {
  color: #718096;
  font-size: 0.9rem;
}

.review-text {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.provider-response {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid #667eea;
}

.provider-response strong {
  display: block;
  color: #667eea;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.provider-response p {
  color: #4a5568;
  margin: 0;
}

@media (max-width: 1024px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }

  .profile-sidebar {
    position: static;
  }
}
</style>
