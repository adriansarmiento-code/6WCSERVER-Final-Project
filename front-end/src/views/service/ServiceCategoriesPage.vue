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
          <div class="category-icon">{{ category.icon }}</div>
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
          icon: "🔧",
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
          icon: "⚡",
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
          icon: "🧹",
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
            category: category.id, // ✅ Now matches backend string format
          });
          // ✅ Use the count from backend response
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
        query: { category: category.id }, // ✅ Use category.id (the string)
      });
    },
  },

  mounted() {
    this.fetchProviderCounts(); // ✅ Fetch counts on mount
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
  color: #f7f7f7;
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

.provider-count {
  display: inline-block;
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 0.5rem;
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
