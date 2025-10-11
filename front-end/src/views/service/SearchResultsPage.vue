<template>
  <div class="search-results-page">
    <AppHeader />
    <LoginPromptModal :show="showLoginModal" @close="showLoginModal = false" />
    <div class="page-header">
      <div class="container">
        <h1>{{ categoryName }} Services</h1>
        <p>{{ filteredProviders.length }} providers found in your area</p>
      </div>
    </div>

    <div class="container">
      <div class="results-layout">
        <!-- Filters Sidebar -->
        <aside class="filters-sidebar">
          <div class="filter-section">
            <h3>Filters</h3>

            <div class="filter-group">
              <label>Service Area</label>
              <select v-model="filters.area">
                <option value="">All Areas</option>
                <option value="Angeles City Center">Angeles City Center</option>
                <option value="Balibago">Balibago</option>
                <option value="Nepo Mall Area">Nepo Mall Area</option>
                <option value="Marquee Mall Area">Marquee Mall Area</option>
                <option value="Clark">Clark</option>
              </select>
            </div>

            <div class="filter-group">
              <label>Price Range</label>
              <div class="price-inputs">
                <input
                  type="number"
                  v-model="filters.minPrice"
                  placeholder="Min"
                />
                <span>-</span>
                <input
                  type="number"
                  v-model="filters.maxPrice"
                  placeholder="Max"
                />
              </div>
            </div>

            <div class="filter-group">
              <label>Minimum Rating</label>
              <select v-model="filters.minRating">
                <option value="0">Any rating</option>
                <option value="3">3+ stars</option>
                <option value="4">4+ stars</option>
                <option value="4.5">4.5+ stars</option>
              </select>
            </div>

            <div class="filter-group">
              <label>Verification Status</label>
              <label class="checkbox-label">
                <input type="checkbox" v-model="filters.verifiedOnly" />
                <span>Verified providers only</span>
              </label>
            </div>

            <button class="btn btn-primary btn-full" @click="applyFilters">
              Apply Filters
            </button>
          </div>
        </aside>

        <!-- Results Grid -->
        <main class="results-main">
          <div class="results-header">
            <div class="sort-controls">
              <label>Sort by:</label>
              <select v-model="sortBy" @change="sortProviders">
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="experience">Most Experienced</option>
                <option value="reviews">Most Reviews</option>
              </select>
            </div>
          </div>

          <div class="providers-grid">
            <div
              v-for="provider in filteredProviders"
              :key="provider._id"
              class="provider-card"
              @click="viewProvider(provider._id)"
            >
              <div class="provider-image">
                <img :src="getProfileImage(provider)" :alt="provider.name" />
                <span
                  v-if="provider.providerInfo?.verified"
                  class="verified-badge"
                >
                  ✓ Verified
                </span>
              </div>

              <div class="provider-info">
                <div class="provider-header">
                  <h3>{{ provider.name }}</h3>
                  <div class="provider-rating">
                    <span class="stars">{{
                      "⭐".repeat(
                        Math.floor(provider.providerInfo?.rating || 0)
                      )
                    }}</span>
                    <span class="rating-text">
                      {{ provider.providerInfo?.rating?.toFixed(1) || "New" }}
                      ({{ provider.providerInfo?.reviewCount || 0 }})
                    </span>
                  </div>
                </div>

                <p class="provider-category">
                  {{ provider.providerInfo?.category }}
                </p>
                <p class="provider-description">
                  {{ provider.providerInfo?.bio || "No description available" }}
                </p>

                <div class="provider-details">
                  <span class="detail-item">
                    <strong>Rate:</strong> ₱{{
                      provider.providerInfo?.hourlyRate || "N/A"
                    }}/hr
                  </span>
                  <span class="detail-item">
                    <strong>Experience:</strong>
                    {{ provider.providerInfo?.yearsExperience || 0 }} years
                  </span>
                  <span class="detail-item">
                    <strong>Area:</strong>
                    {{ provider.providerInfo?.serviceArea || "Angeles City" }}
                  </span>
                </div>

                <div class="provider-footer">
                  <button
                    class="btn btn-outline"
                    @click.stop="contactProvider(provider._id)"
                  >
                    Contact
                  </button>
                  <button
                    class="btn btn-primary"
                    @click.stop="bookProvider(provider._id)"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="filteredProviders.length === 0" class="no-results">
            <h3>No providers found</h3>
            <p>Try adjusting your filters or search in a different area</p>
          </div>
        </main>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script>
import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import { providerAPI } from "@/services/api";
import LoginPromptModal from "@/components/LoginPromptModal.vue";

export default {
  name: "SearchResultsPage",
  components: {
    AppHeader,
    AppFooter,
    LoginPromptModal, // Add this
  },
  data() {
    return {
      showLoginModal: false,
      categoryName: "Plumbing", // will be replaced by query param
      sortBy: "rating",
      filters: {
        radius: "10",
        minPrice: null,
        maxPrice: null,
        minRating: "0",
        verifiedOnly: false,
      },
      providers: [], // ✅ now starts empty, filled from API
    };
  },
  computed: {
    filteredProviders() {
      let results = [...this.providers];

      // ✅ Filter by verified status
      if (this.filters.verifiedOnly) {
        results = results.filter((p) => p.providerInfo?.verified === true);
      }

      // ✅ Filter by minimum rating
      if (this.filters.minRating && parseFloat(this.filters.minRating) > 0) {
        results = results.filter(
          (p) =>
            (p.providerInfo?.rating || 0) >= parseFloat(this.filters.minRating)
        );
      }

      // ✅ Filter by minimum price (hourly rate)
      if (this.filters.minPrice) {
        results = results.filter(
          (p) =>
            (p.providerInfo?.hourlyRate || 0) >=
            parseFloat(this.filters.minPrice)
        );
      }

      // ✅ Filter by maximum price (hourly rate)
      if (this.filters.maxPrice) {
        results = results.filter(
          (p) =>
            (p.providerInfo?.hourlyRate || 0) <=
            parseFloat(this.filters.maxPrice)
        );
      }

      return results;
    },
  },
  methods: {
    getProfileImage(provider) {
      if (provider?.profileImage) {
        return provider.profileImage;
      }
      return require("@/assets/images/icons/defaulticon.png");
    },
    async fetchProviders() {
      try {
        const params = {
          category: this.$route.query.category,
          serviceArea: this.filters.area || undefined,
          minRating: this.filters.minRating || undefined,
          verified: this.filters.verifiedOnly ? "true" : undefined,
          sort: this.sortBy,
        };

        const response = await providerAPI.getAll(params);
        this.providers = response.data.providers;
        if (this.sortBy === "reviews") {
          this.providers.sort(
            (a, b) =>
              (b.providerInfo?.reviewCount || 0) -
              (a.providerInfo?.reviewCount || 0)
          );
        }
      } catch (error) {
        console.error("Error fetching providers:", error);
      }
    },

    applyFilters() {
      // Re-fetch with new filters
      this.fetchProviders();
    },

    sortProviders() {
      this.fetchProviders();
    },

    viewProvider(providerId) {
      // ✅ Fixed: use _id consistently
      this.$router.push(`/provider/${providerId}`);
    },

    contactProvider(providerId) {
      if (!this.$store.getters.isAuthenticated) {
        this.showLoginModal = true;
        return;
      }
      this.$router.push(`/messages/${providerId}`);
    },

    bookProvider(providerId) {
      // ✅ Check if user is logged in
      if (!this.$store.getters.isAuthenticated) {
        this.showLoginModal = true;
        return;
      }

      this.$router.push(`/booking/${providerId}`);
    },
  },
  mounted() {
    // ✅ set category name from query params
    const category = this.$route.query.category;
    if (category) {
      this.categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    }

    this.fetchProviders(); // ✅ load providers on mount
  },
};
</script>

<style scoped>
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 0;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.results-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  padding: 2rem 0 4rem;
}

/* Filters Sidebar */
.filters-sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.filter-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-section h3 {
  margin-bottom: 1.5rem;
  color: #2d3748;
}

.filter-group {
  margin-bottom: 1.5rem;
}

.filter-group label {
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.filter-group select,
.filter-group input[type="number"] {
  width: 100%;
  padding: 10px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-inputs input {
  flex: 1;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: normal;
}

/* Results Main */
.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sort-controls label {
  font-weight: 600;
  color: #2d3748;
}

.sort-controls select {
  padding: 10px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
}

/* Provider Cards */
.providers-grid {
  display: grid;
  gap: 2rem;
}

.provider-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  display: grid;
  grid-template-columns: 300px 1fr;
}

.provider-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.provider-image {
  position: relative;
  height: 100%;
  min-height: 200px;
}

.provider-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.verified-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #28a745;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.provider-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.provider-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.provider-header h3 {
  font-size: 1.5rem;
  color: #2d3748;
  margin: 0;
}

.provider-rating {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.stars {
  font-size: 1rem;
  line-height: 1;
}

.rating-text {
  font-size: 0.9rem;
  color: #718096;
  margin-top: 0.25rem;
}

.provider-category {
  color: #667eea;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.provider-description {
  color: #718096;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.provider-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 1rem 0;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1rem;
}

.detail-item {
  font-size: 0.9rem;
  color: #4a5568;
}

.detail-item strong {
  color: #2d3748;
}

.provider-footer {
  display: flex;
  gap: 1rem;
  margin-top: auto;
}

.provider-footer .btn {
  flex: 1;
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
}

.no-results h3 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.no-results p {
  color: #718096;
}

@media (max-width: 1024px) {
  .results-layout {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .provider-card {
    grid-template-columns: 1fr;
  }

  .provider-image {
    min-height: 200px;
  }
}
</style>
