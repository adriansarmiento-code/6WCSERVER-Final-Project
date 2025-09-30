<template>
  <div class="provider-profile-page">
    <AppHeader />

    <div class="container">
      <div class="profile-layout">
        <!-- Left Column - Provider Info -->
        <aside class="profile-sidebar">
          <div class="profile-card">
            <div class="profile-image">
              <img :src="provider.image" :alt="provider.name" />
              <span v-if="provider.verified" class="verified-badge">
                ✓ Verified Provider
              </span>
            </div>

            <div class="profile-info">
              <h1>{{ provider.name }}</h1>
              <p class="profile-category">{{ provider.category }}</p>

              <div class="profile-rating">
                <span class="stars">{{
                  "⭐".repeat(Math.floor(provider.rating))
                }}</span>
                <span class="rating-text">
                  {{ provider.rating }} ({{ provider.reviewCount }} reviews)
                </span>
              </div>

              <div class="profile-stats">
                <div class="stat-item">
                  <strong>{{ provider.completedJobs }}</strong>
                  <span>Jobs Completed</span>
                </div>
                <div class="stat-item">
                  <strong>{{ provider.yearsExperience }}</strong>
                  <span>Years Experience</span>
                </div>
                <div class="stat-item">
                  <strong>{{ provider.responseTime }}</strong>
                  <span>Response Time</span>
                </div>
              </div>

              <div class="profile-price">
                <span class="price-label">Hourly Rate</span>
                <span class="price-amount">₱{{ provider.hourlyRate }}/hr</span>
              </div>

              <div class="profile-actions">
                <button class="btn btn-primary btn-full" @click="bookNow">
                  Book Now
                </button>
                <button class="btn btn-outline btn-full" @click="sendMessage">
                  Send Message
                </button>
              </div>
            </div>
          </div>

          <div class="availability-card">
            <h3>Availability</h3>
            <div class="availability-list">
              <div
                v-for="day in provider.availability"
                :key="day.day"
                class="availability-item"
              >
                <span class="day">{{ day.day }}</span>
                <span class="hours">{{ day.hours }}</span>
              </div>
            </div>
          </div>
        </aside>

        <!-- Right Column - Details and Reviews -->
        <main class="profile-main">
          <section class="section">
            <h2>About</h2>
            <p class="about-text">{{ provider.about }}</p>
          </section>

          <section class="section">
            <h2>Services Offered</h2>
            <div class="services-list">
              <div
                v-for="service in provider.services"
                :key="service.id"
                class="service-item"
              >
                <h4>{{ service.name }}</h4>
                <p>{{ service.description }}</p>
                <span class="service-price">₱{{ service.price }}</span>
              </div>
            </div>
          </section>

          <section class="section">
            <h2>Skills & Certifications</h2>
            <div class="skills-grid">
              <span
                v-for="skill in provider.skills"
                :key="skill"
                class="skill-badge"
              >
                {{ skill }}
              </span>
            </div>
          </section>

          <section class="section">
            <div class="section-header">
              <h2>Reviews ({{ provider.reviewCount }})</h2>
              <select v-model="reviewFilter" class="filter-select">
                <option value="all">All Reviews</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
              </select>
            </div>

            <div class="reviews-list">
              <div
                v-for="review in provider.reviews"
                :key="review.id"
                class="review-item"
              >
                <div class="review-header">
                  <div class="reviewer-info">
                    <strong>{{ review.userName }}</strong>
                    <div class="review-rating">
                      {{ "⭐".repeat(review.rating) }}
                    </div>
                  </div>
                  <span class="review-date">{{ review.date }}</span>
                </div>
                <p class="review-text">{{ review.comment }}</p>
                <div v-if="review.response" class="provider-response">
                  <strong>Provider Response:</strong>
                  <p>{{ review.response }}</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script>
import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";

export default {
  name: "ProviderProfilePage",
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      reviewFilter: "all",
      provider: {
        id: 1,
        name: "Juan dela Cruz",
        category: "Plumbing Services",
        image: "https://via.placeholder.com/400x400?text=Provider+Photo",
        rating: 4.8,
        reviewCount: 127,
        completedJobs: 342,
        yearsExperience: 10,
        responseTime: "< 1 hour",
        hourlyRate: 500,
        verified: true,
        about:
          "With over 10 years of experience in residential and commercial plumbing, I specialize in fixing leaks, installing fixtures, and maintaining plumbing systems. I pride myself on punctuality, cleanliness, and quality workmanship. Licensed and insured professional ready to help with all your plumbing needs.",
        services: [
          {
            id: 1,
            name: "Emergency Leak Repair",
            description: "Fast response for urgent plumbing leaks",
            price: 800,
          },
          {
            id: 2,
            name: "Fixture Installation",
            description: "Install sinks, faucets, toilets, and showers",
            price: 1200,
          },
          {
            id: 3,
            name: "Drain Cleaning",
            description: "Clear clogged drains and pipes",
            price: 600,
          },
          {
            id: 4,
            name: "Water Heater Service",
            description: "Installation and repair of water heaters",
            price: 1500,
          },
        ],
        skills: [
          "Pipe Repair",
          "Fixture Installation",
          "Drain Cleaning",
          "Water Heater Expert",
          "Emergency Service",
          "Licensed Plumber",
          "Residential",
          "Commercial",
        ],
        availability: [
          { day: "Monday", hours: "8:00 AM - 6:00 PM" },
          { day: "Tuesday", hours: "8:00 AM - 6:00 PM" },
          { day: "Wednesday", hours: "8:00 AM - 6:00 PM" },
          { day: "Thursday", hours: "8:00 AM - 6:00 PM" },
          { day: "Friday", hours: "8:00 AM - 6:00 PM" },
          { day: "Saturday", hours: "9:00 AM - 4:00 PM" },
          { day: "Sunday", hours: "Closed" },
        ],
        reviews: [
          {
            id: 1,
            userName: "Maria Santos",
            rating: 5,
            date: "2 weeks ago",
            comment:
              "Excellent service! Fixed my kitchen sink leak quickly and professionally. Very clean work and reasonable prices. Highly recommend!",
            response: "Thank you for your kind words! Happy to help anytime.",
          },
          {
            id: 2,
            userName: "Pedro Garcia",
            rating: 5,
            date: "1 month ago",
            comment:
              "Very professional and punctual. Installed our new bathroom fixtures perfectly. Will definitely use his services again.",
            response: null,
          },
          {
            id: 3,
            userName: "Ana Reyes",
            rating: 4,
            date: "2 months ago",
            comment:
              "Good work overall. Took a bit longer than expected but the result was great. Fair pricing.",
            response:
              "Thank you for the feedback. I apologize for the delay - the pipes required extra work. Glad you're satisfied with the result!",
          },
        ],
      },
    };
  },
  methods: {
    bookNow() {
      this.$router.push({
        name: "Booking",
        params: { providerId: this.provider.id },
      });
    },
    sendMessage() {
      this.$router.push({
        name: "Messages",
        query: { provider: this.provider.id },
      });
    },
  },
  mounted() {
    // In real app, fetch provider data based on route params
    const providerId = this.$route.params.id;
    console.log("Loading provider:", providerId);
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
