<template>
  <div class="services-page">
    <AppHeader />

    <div class="page-header">
      <div class="container">
        <h1>Find the Right Service</h1>
        <p>Browse by category to find verified local providers</p>
      </div>
    </div>

    <div class="container">
      <!-- Just the search bar, no other filters -->
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
      </div>

      <!-- Search Results Message -->
      <div v-if="searchQuery" class="search-results-message">
        <p>
          Showing results for "<strong>{{ searchQuery }}</strong
          >"
          <button @click="clearSearch" class="clear-search">Clear</button>
        </p>
      </div>

      <!-- Categories Grid -->
      <div class="categories-grid">
        <div
          v-for="category in filteredCategories"
          :key="category.id"
          class="category-card"
          @click="selectCategory(category)"
        >
          <div class="category-image">
            <img :src="category.image" :alt="category.name" />
          </div>
          <h3>{{ category.name }}</h3>
          <p>{{ category.description }}</p>
          <div class="category-stats">
            <span class="provider-count"
              >{{ category.providerCount }} providers</span
            >
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
      categories: [
        {
          id: "plumbing",
          name: "Plumbing",
          image: require("@/assets/images/plumber.jpg"),
          description: "Pipes, leaks, installations, and repairs",
          providerCount: 0,
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
          id: "electrical",
          name: "Electrical",
          image: require("@/assets/images/electrical.jpg"),
          description: "Wiring, fixtures, and electrical repairs",
          providerCount: 0,
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
          id: "cleaning",
          name: "Cleaning",
          image: require("@/assets/images/cleaning.jpg"),
          description: "Home, office, and general cleaning services",
          providerCount: 0,
          keywords: [
            "cleaning",
            "cleaner",
            "housekeeping",
            "janitor",
            "vacuum",
            "mop",
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
    async fetchProviderCounts() {
      try {
        for (const category of this.categories) {
          const response = await providerAPI.getAll({
            category: category.id,
          });
          category.providerCount =
            response.data.count || response.data.providers?.length || 0;
        }
      } catch (error) {
        console.error("Error fetching provider counts:", error);
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

    selectCategory(category) {
      this.$router.push({
        path: "/search",
        query: { category: category.id },
      });
    },
  },

  mounted() {
    this.fetchProviderCounts();
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
  font-weight: 700;
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
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-bar input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-bar button {
  padding: 14px 32px;
  white-space: nowrap;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
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
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  border: 2px solid #c7d2fe;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-results-message p {
  margin: 0;
  color: #4c51bf;
  font-size: 1rem;
  font-weight: 500;
}

.search-results-message strong {
  color: #667eea;
  font-weight: 700;
}

.clear-search {
  margin-left: 1rem;
  padding: 8px 18px;
  background: white;
  border: 2px solid #667eea;
  color: #667eea;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.clear-search:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2.5rem;
  padding: 2rem 0 4rem;
}

.category-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.4s ease;
  border: 2px solid #f1f5f9;
  overflow: hidden;
  position: relative;
}

.category-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

.category-card:hover::before {
  transform: scaleX(1);
}

.category-image {
  width: 100%;
  height: 220px;
  overflow: hidden;
  position: relative;
}

.category-image::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.1) 100%
  );
  transition: opacity 0.4s ease;
}

.category-card:hover .category-image::after {
  opacity: 0;
}

.category-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.category-card:hover .category-image img {
  transform: scale(1.1);
}

.category-card h3 {
  font-size: 1.5rem;
  margin: 1.5rem 1.5rem 0.75rem;
  color: #2d3748;
  font-weight: 700;
}

.category-card p {
  color: #718096;
  margin: 0 1.5rem 1.5rem;
  line-height: 1.6;
  font-size: 0.95rem;
}

.category-stats {
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: center;
}

.provider-count {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.category-card:hover .provider-count {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid #f1f5f9;
}

.no-results h3 {
  font-size: 1.75rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.no-results p {
  color: #718096;
  margin-bottom: 1.5rem;
  font-size: 1.05rem;
}

.search-controls {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.area-select {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 250px;
}

.area-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.area-select:hover {
  border-color: #667eea;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .page-header p {
    font-size: 1.05rem;
  }

  .search-bar {
    flex-direction: column;
  }

  .search-bar button {
    width: 100%;
  }

  .categories-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .category-image {
    height: 180px;
  }

  .search-results-message {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .clear-search {
    margin-left: 0;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 40px 0;
  }

  .page-header h1 {
    font-size: 1.75rem;
  }

  .search-section {
    padding: 2rem 0;
  }

  .category-card h3 {
    font-size: 1.25rem;
  }

  .category-image {
    height: 160px;
  }
}
</style>
