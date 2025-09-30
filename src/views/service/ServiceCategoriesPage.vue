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
            @input="handleSearch"
          />
          <button class="btn btn-primary">Search</button>
        </div>

        <div class="filters">
          <select v-model="sortBy" class="filter-select">
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

      <div class="categories-grid">
        <div
          v-for="category in categories"
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
    </div>

    <AppFooter />
  </div>
</template>

<script>
import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";

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
      categories: [
        {
          id: 1,
          name: "Plumbing",
          icon: "🔧",
          description: "Pipes, leaks, installations, and repairs",
          providerCount: 45,
        },
        {
          id: 2,
          name: "Electrical",
          icon: "⚡",
          description: "Wiring, fixtures, and electrical repairs",
          providerCount: 38,
        },
        {
          id: 3,
          name: "Cleaning",
          icon: "🧹",
          description: "Home, office, and deep cleaning services",
          providerCount: 62,
        },
        {
          id: 4,
          name: "Carpentry",
          icon: "🔨",
          description: "Furniture, installations, and repairs",
          providerCount: 31,
        },
        {
          id: 5,
          name: "Painting",
          icon: "🎨",
          description: "Interior and exterior painting services",
          providerCount: 28,
        },
        {
          id: 6,
          name: "HVAC",
          icon: "❄️",
          description: "Heating, cooling, and ventilation",
          providerCount: 22,
        },
        {
          id: 7,
          name: "Landscaping",
          icon: "🌱",
          description: "Garden design and maintenance",
          providerCount: 19,
        },
        {
          id: 8,
          name: "Appliance Repair",
          icon: "🔌",
          description: "Fix washing machines, refrigerators, and more",
          providerCount: 27,
        },
      ],
    };
  },
  methods: {
    handleSearch() {
      // Search functionality will be implemented later
      console.log("Searching for:", this.searchQuery);
    },
    selectCategory(category) {
      this.$router.push({
        name: "SearchResults",
        query: { category: category.name.toLowerCase() },
      });
    },
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

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .search-bar {
    flex-direction: column;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
