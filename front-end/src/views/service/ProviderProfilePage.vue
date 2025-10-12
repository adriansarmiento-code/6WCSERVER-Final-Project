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
      <button @click="goBackToSearch" class="btn btn-back">
        ← Back to Search Results
      </button>
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
    goBackToSearch() {
      // Go back to search results with the same category
      if (this.provider?.providerInfo?.category) {
        this.$router.push({
          path: "/search",
          query: { category: this.provider.providerInfo.category },
        });
      } else {
        // Fallback to services page if no category
        this.$router.push("/services");
      }
    },
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
.btn-back {
  background: #667eea;
  color: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  font-weight: 500;
}

.btn-back:hover {
  background: rgb(162, 188, 214);
  border-color: #cbd5e0;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.provider-profile-page {
  min-height: 100vh;
  background-color: #f8fafc;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.error-container {
  color: #e53e3e;
}

.loading-container p,
.error-container p {
  font-size: 1.125rem;
  margin-bottom: 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Provider Header */
.provider-header {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2.5rem;
  align-items: start;
}

.provider-image {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.provider-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.provider-info h1 {
  font-size: 2.25rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.category {
  font-size: 1.125rem;
  color: #667eea;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.stars {
  font-size: 1.25rem;
}

.rating-text {
  color: #718096;
  font-size: 1rem;
  font-weight: 500;
}

.provider-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 12px;
}

.stat {
  text-align: center;
}

.stat strong {
  display: block;
  color: #2d3748;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat span {
  font-size: 1.25rem;
  font-weight: 700;
  color: #667eea;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  min-width: 140px;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-secondary:hover {
  background: #f7fafc;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.2);
}

/* Sections */
.section {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2.5rem;
}

.section h2 {
  font-size: 1.75rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f7fafc;
  font-weight: 600;
}

.section p {
  color: #4a5568;
  line-height: 1.7;
  font-size: 1.05rem;
}

/* Services Grid */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.service-card {
  padding: 1.75rem;
  background: #f7fafc;
  border-radius: 12px;
  border-left: 4px solid #667eea;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.service-card h3 {
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.service-card p {
  color: #718096;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.service-card .price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #667eea;
  margin: 0;
}

/* Reviews */
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.review-card {
  padding: 1.75rem;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.review-header strong {
  color: #2d3748;
  font-size: 1.1rem;
}

.review-rating {
  font-size: 1rem;
}

.review-date {
  color: #718096;
  font-size: 0.9rem;
  margin-top: 0.75rem;
}

.no-data {
  text-align: center;
  color: #a0aec0;
  font-style: italic;
  padding: 2rem;
  background: #f7fafc;
  border-radius: 8px;
  margin: 1rem 0;
}

/* Responsive Design */
@media (max-width: 968px) {
  .provider-header {
    grid-template-columns: 250px 1fr;
    gap: 2rem;
    padding: 2rem;
  }

  .provider-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  .btn-back {
    margin-bottom: 1.5rem;
    padding: 0.625rem 1.25rem;
    font-size: 0.9rem;
  }

  .provider-header {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1.5rem;
  }

  .provider-image {
    max-width: 280px;
    margin: 0 auto;
  }

  .provider-info h1 {
    font-size: 1.875rem;
  }

  .provider-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .rating {
    justify-content: center;
  }

  .action-buttons {
    justify-content: center;
  }

  .section {
    padding: 1.75rem;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .provider-header {
    padding: 1.5rem;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    max-width: 280px;
  }
}
</style>
