<template>
  <div class="services-page">
    <AppHeader />

    <div class="page-header">
      <div class="container">
        <h1>Browse Services</h1>
        <p>Find the perfect service provider for your needs</p>
      </div>
    </div>

    <div class="container">
      <div class="search-section">
        <div class="search-bar">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search for services..."
            @keyup.enter="handleSearch"
          />
          <button class="btn btn-primary" @click="handleSearch">Search</button>
        </div>

        <div class="filters">
          <select v-model="sortBy" class="filter-select" @change="applySorting">
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="experience">Most Experienced</option>
          </select>

          <select v-model="radiusFilter" class="filter-select">
            <option value="5">Within 5 km</option>
            <option value="10">Within 10 km</option>
            <option value="20">Within 20 km</option>
            <option value="50">Within 50 km</option>
          </select>
        </div>
      </div>

      <!-- Search Results Message -->
      <div v-if="searchQuery" class="search-results-message">
        <p>
          Showing results for "<strong>{{ searchQuery }}</strong
          >"
          <button @click="clearSearch" class="clear-search">Clear</button>
        </p>
      </div>

      <div class="categories-grid">
        <div
          v-for="category in filteredCategories"
          :key="category.id"
          class="category-card"
          @click="selectCategory(category)"
        >
          <div class="category-icon">{{ category.icon }}</div>
          <h3>{{ category.name }}</h3>
          <p>{{ category.description }}</p>
          <div class="category-stats">
            <span>{{ category.providerCount }} providers</span>
          </div>
        </div>
      </div>

      <!-- No Results Message -->
      <div v-if="filteredCategories.length === 0" class="no-results">
        <h3>No services found</h3>
        <p>Try searching with different keywords</p>
        <button @click="clearSearch" class="btn btn-primary">
          View All Services
        </button>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script>
import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import { providerAPI } from "@/services/api";

export default {
  name: "ServiceCategoriesPage",
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      searchQuery: "",
      sortBy: "rating",
      radiusFilter: "10",
      providers: [], // ✅ fetched from API
      categories: [
        {
          id: 1,
          name: "Plumbing",
          icon: "🔧",
          description: "Pipes, leaks, installations, and repairs",
          providers: 0, // ✅ start with 0
          keywords: [
            "plumber",
            "pipe",
            "leak",
            "drain",
            "faucet",
            "water",
            "sink",
          ],
        },
        {
          id: 2,
          name: "Electrical",
          icon: "⚡",
          description: "Wiring, fixtures, and electrical repairs",
          providers: 0,
          keywords: [
            "electrician",
            "wire",
            "wiring",
            "light",
            "power",
            "outlet",
            "electric",
          ],
        },
        {
          id: 3,
          name: "Cleaning",
          icon: "🧹",
          description: "Home, office, and general cleaning services",
          providers: 0,
          keywords: [
            "cleaning",
            "cleaner",
            "housekeeping",
            "janitor",
            "vacuum",
            "mop",
            "sanitize",
            "disinfect",
            "dust",
          ],
        },
      ],
    };
  },
  computed: {
    filteredCategories() {
      if (!this.searchQuery.trim()) return this.categories;

      const query = this.searchQuery.toLowerCase().trim();
      return this.categories.filter((category) => {
        return (
          category.name.toLowerCase().includes(query) ||
          category.description.toLowerCase().includes(query) ||
          category.keywords.some((keyword) => keyword.includes(query))
        );
      });
    },
  },
  methods: {
    async fetchProviders() {
      try {
        const response = await providerAPI.getAll();
        this.providers = response.data.providers;

        // ✅ update categories with real counts
        this.categories.forEach((category) => {
          const categoryKey = category.id;
          const count = this.providers.filter(
            (p) => p.providerInfo?.category === categoryKey
          ).length;
          category.providers = count;
        });
      } catch (error) {
        console.error("Error fetching providers:", error);
      }
    },

    handleSearch() {
      console.log("Searching for:", this.searchQuery);
      window.scrollTo({ top: 400, behavior: "smooth" });
    },
    clearSearch() {
      this.searchQuery = "";
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    applySorting() {
      let sorted = [...this.categories];
      switch (this.sortBy) {
        case "rating":
        case "price-high":
        case "experience":
          sorted.sort((a, b) => b.providers - a.providers);
          break;
        case "price-low":
          sorted.sort((a, b) => a.providers - b.providers);
          break;
      }
      this.categories = sorted;
    },
    selectCategory(category) {
      this.$router.push({
        name: "SearchResults",
        query: { category: category.name.toLowerCase() },
      });
    },
  },
  mounted() {
    this.fetchProviders(); // ✅ load providers on mount
  },
};
</script>

<style scoped>
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 0;
  text-align: center;
}

.page-header h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.page-header p {
  font-size: 1.25rem;
  opacity: 0.95;
}

.search-section {
  padding: 3rem 0;
}

.search-bar {
  display: flex;
  gap: 1rem;
  max-width: 700px;
  margin: 0 auto 2rem;
}

.search-bar input {
  flex: 1;
  padding: 14px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
}

.search-bar input:focus {
  outline: none;
  border-color: #667eea;
}

.search-bar button {
  padding: 14px 32px;
  white-space: nowrap;
}

.filters {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.filter-select {
  padding: 10px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

.search-results-message {
  background: #eef2ff;
  border: 2px solid #c7d2fe;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-results-message p {
  margin: 0;
  color: #4c51bf;
  font-size: 1rem;
}

.search-results-message strong {
  color: #667eea;
}

.clear-search {
  margin-left: 1rem;
  padding: 6px 16px;
  background: white;
  border: 1px solid #667eea;
  color: #667eea;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.clear-search:hover {
  background: #667eea;
  color: white;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding: 2rem 0 4rem;
}

.category-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.category-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.category-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: #2d3748;
}

.category-card p {
  color: #718096;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.category-stats {
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.category-stats span {
  color: #667eea;
  font-weight: 600;
  font-size: 0.9rem;
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.no-results h3 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.no-results p {
  color: #718096;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .search-bar {
    flex-direction: column;
  }

  .search-bar button {
    width: 100%;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }

  .search-results-message {
    flex-direction: column;
    gap: 1rem;
  }

  .clear-search {
    margin-left: 0;
  }
}
</style>
