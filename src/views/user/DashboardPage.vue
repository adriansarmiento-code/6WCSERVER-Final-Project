<template>
  <div class="dashboard-page">
    <AppHeader />

    <div class="container">
      <div class="dashboard-header">
        <div>
          <h1>Welcome back, {{ user.name }}!</h1>
          <p>Manage your bookings and account</p>
        </div>
        <router-link to="/services" class="btn btn-primary">
          Book a Service
        </router-link>
      </div>

      <div class="dashboard-layout">
        <!-- Sidebar Navigation -->
        <aside class="dashboard-sidebar">
          <nav class="sidebar-nav">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :class="['nav-item', { active: activeTab === tab.id }]"
              @click="activeTab = tab.id"
            >
              <span class="nav-icon">{{ tab.icon }}</span>
              <span>{{ tab.label }}</span>
            </button>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="dashboard-main">
          <!-- Active Bookings -->
          <div v-if="activeTab === 'bookings'" class="tab-content">
            <h2>My Bookings</h2>

            <div class="bookings-filter">
              <button
                v-for="filter in bookingFilters"
                :key="filter"
                :class="['filter-btn', { active: bookingFilter === filter }]"
                @click="bookingFilter = filter"
              >
                {{ filter }}
              </button>
            </div>

            <div class="bookings-list">
              <div
                v-for="booking in filteredBookings"
                :key="booking.id"
                class="booking-card"
              >
                <div class="booking-header">
                  <div class="booking-info">
                    <h3>{{ booking.serviceName }}</h3>
                    <p class="provider-name">{{ booking.providerName }}</p>
                  </div>
                  <span :class="['status-badge', booking.status]">
                    {{ booking.status }}
                  </span>
                </div>

                <div class="booking-details">
                  <div class="detail">
                    <strong>Date:</strong> {{ booking.date }}
                  </div>
                  <div class="detail">
                    <strong>Time:</strong> {{ booking.time }}
                  </div>
                  <div class="detail">
                    <strong>Location:</strong> {{ booking.location }}
                  </div>
                  <div class="detail">
                    <strong>Amount:</strong> ₱{{ booking.amount }}
                  </div>
                </div>

                <div class="booking-actions">
                  <button
                    v-if="booking.status === 'pending'"
                    class="btn btn-outline btn-small"
                    @click="cancelBooking(booking.id)"
                  >
                    Cancel
                  </button>
                  <button
                    v-if="booking.status === 'in-progress'"
                    class="btn btn-primary btn-small"
                    @click="completeBooking(booking.id)"
                  >
                    Mark as Complete
                  </button>
                  <button
                    v-if="booking.status === 'completed'"
                    class="btn btn-primary btn-small"
                    @click="reviewService(booking)"
                  >
                    Leave Review
                  </button>
                  <button
                    class="btn btn-outline btn-small"
                    @click="viewBookingDetails(booking.id)"
                  >
                    View Details
                  </button>
                </div>
              </div>

              <div v-if="filteredBookings.length === 0" class="empty-state">
                <p>No {{ bookingFilter }} bookings found</p>
                <router-link to="/services" class="btn btn-primary">
                  Book a Service
                </router-link>
              </div>
            </div>
          </div>

          <!-- Favorite Providers -->
          <div v-if="activeTab === 'favorites'" class="tab-content">
            <h2>Favorite Providers</h2>
            <div class="favorites-grid">
              <div
                v-for="provider in favoriteProviders"
                :key="provider.id"
                class="provider-card-small"
              >
                <img :src="provider.image" :alt="provider.name" />
                <div class="provider-info">
                  <h3>{{ provider.name }}</h3>
                  <p>{{ provider.category }}</p>
                  <div class="rating">
                    ⭐ {{ provider.rating }} ({{ provider.reviews }})
                  </div>
                  <div class="provider-actions">
                    <button
                      class="btn btn-outline btn-small"
                      @click="viewProvider(provider.id)"
                    >
                      View Profile
                    </button>
                    <button
                      class="btn btn-primary btn-small"
                      @click="bookProvider(provider.id)"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment History -->
          <div v-if="activeTab === 'payments'" class="tab-content">
            <h2>Payment History</h2>
            <div class="payments-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Service</th>
                    <th>Provider</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="payment in payments" :key="payment.id">
                    <td>{{ payment.date }}</td>
                    <td>{{ payment.service }}</td>
                    <td>{{ payment.provider }}</td>
                    <td>₱{{ payment.amount }}</td>
                    <td>
                      <span :class="['payment-status', payment.status]">
                        {{ payment.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Messages -->
          <div v-if="activeTab === 'messages'" class="tab-content">
            <h2>Messages</h2>
            <div class="messages-list">
              <div
                v-for="message in messages"
                :key="message.id"
                class="message-preview"
                @click="openMessage(message.id)"
              >
                <img :src="message.avatar" :alt="message.name" />
                <div class="message-content">
                  <div class="message-header">
                    <strong>{{ message.name }}</strong>
                    <span class="time">{{ message.time }}</span>
                  </div>
                  <p class="message-text">{{ message.lastMessage }}</p>
                </div>
                <span v-if="message.unread" class="unread-badge">
                  {{ message.unread }}
                </span>
              </div>
            </div>
          </div>

          <!-- Settings -->
          <div v-if="activeTab === 'settings'" class="tab-content">
            <h2>Account Settings</h2>
            <div class="settings-sections">
              <section class="settings-section">
                <h3>Personal Information</h3>
                <div class="form-group">
                  <label>Full Name</label>
                  <input type="text" :value="user.name" />
                </div>
                <div class="form-group">
                  <label>Email</label>
                  <input type="email" :value="user.email" />
                </div>
                <div class="form-group">
                  <label>Phone</label>
                  <input type="tel" :value="user.phone" />
                </div>
                <button class="btn btn-primary">Save Changes</button>
              </section>

              <section class="settings-section">
                <h3>Notification Preferences</h3>
                <label class="checkbox-label">
                  <input type="checkbox" checked />
                  <span>Email notifications for bookings</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" checked />
                  <span>SMS notifications</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" />
                  <span>Promotional offers</span>
                </label>
              </section>

              <section class="settings-section">
                <h3>Security</h3>
                <button class="btn btn-outline">Change Password</button>
                <button class="btn btn-outline">
                  Two-Factor Authentication
                </button>
              </section>
            </div>
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

export default {
  name: "DashboardPage",
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      activeTab: "bookings",
      bookingFilter: "All",
      tabs: [
        { id: "bookings", label: "My Bookings", icon: "📅" },
        { id: "favorites", label: "Favorites", icon: "⭐" },
        { id: "payments", label: "Payments", icon: "💳" },
        { id: "messages", label: "Messages", icon: "💬" },
        { id: "settings", label: "Settings", icon: "⚙️" },
      ],
      bookingFilters: [
        "All",
        "Pending",
        "In Progress",
        "Completed",
        "Cancelled",
      ],
      user: {
        name: "Test User",
        email: "test@example.com",
        phone: "0912 345 6789",
      },
      bookings: [
        {
          id: 1,
          serviceName: "Emergency Leak Repair",
          providerName: "Juan dela Cruz",
          date: "Oct 15, 2025",
          time: "2:00 PM",
          location: "123 Main St, Manila",
          amount: 800,
          status: "pending",
        },
        {
          id: 2,
          serviceName: "House Cleaning",
          providerName: "Maria Santos",
          date: "Oct 12, 2025",
          time: "10:00 AM",
          location: "456 Oak Ave, Quezon City",
          amount: 1200,
          status: "completed",
        },
        {
          id: 3,
          serviceName: "Electrical Wiring",
          providerName: "Pedro Reyes",
          date: "Oct 14, 2025",
          time: "1:00 PM",
          location: "789 Pine Rd, Makati",
          amount: 1500,
          status: "in-progress",
        },
      ],
      favoriteProviders: [
        {
          id: 1,
          name: "Juan dela Cruz",
          category: "Plumbing",
          rating: 4.8,
          reviews: 127,
          image: "https://via.placeholder.com/100x100?text=Provider",
        },
        {
          id: 2,
          name: "Maria Santos",
          category: "Cleaning",
          rating: 4.9,
          reviews: 89,
          image: "https://via.placeholder.com/100x100?text=Provider",
        },
      ],
      payments: [
        {
          id: 1,
          date: "Oct 12, 2025",
          service: "House Cleaning",
          provider: "Maria Santos",
          amount: 1200,
          status: "completed",
        },
        {
          id: 2,
          date: "Oct 8, 2025",
          service: "Plumbing Repair",
          provider: "Juan dela Cruz",
          amount: 800,
          status: "completed",
        },
      ],
      messages: [
        {
          id: 1,
          name: "Juan dela Cruz",
          avatar: "https://via.placeholder.com/50x50?text=JD",
          lastMessage: "I'll arrive at 2 PM as scheduled",
          time: "10 mins ago",
          unread: 1,
        },
        {
          id: 2,
          name: "Maria Santos",
          avatar: "https://via.placeholder.com/50x50?text=MS",
          lastMessage: "Thank you for the booking!",
          time: "2 hours ago",
          unread: 0,
        },
      ],
    };
  },
  computed: {
    filteredBookings() {
      if (this.bookingFilter === "All") {
        return this.bookings;
      }
      return this.bookings.filter(
        (b) =>
          b.status.toLowerCase() ===
          this.bookingFilter.toLowerCase().replace(" ", "-")
      );
    },
  },
  methods: {
    cancelBooking(id) {
      if (confirm("Are you sure you want to cancel this booking?")) {
        console.log("Cancelling booking:", id);
      }
    },
    completeBooking(id) {
      console.log("Completing booking:", id);
    },
    reviewService(booking) {
      this.$router.push({
        name: "ReviewPage",
        params: { bookingId: booking.id },
      });
    },
    viewBookingDetails(id) {
      console.log("Viewing booking:", id);
    },
    viewProvider(id) {
      this.$router.push({ name: "ProviderProfile", params: { id } });
    },
    bookProvider(id) {
      this.$router.push({ name: "Booking", params: { providerId: id } });
    },
    openMessage(id) {
      this.$router.push({ name: "Messages", params: { conversationId: id } });
    },
  },
};
</script>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 0;
}

.dashboard-header h1 {
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.dashboard-header p {
  color: #718096;
}

.dashboard-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  padding-bottom: 4rem;
}

/* Sidebar */
.dashboard-sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.sidebar-nav {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  color: #4a5568;
  text-align: left;
}

.nav-item:hover {
  background: #f7fafc;
}

.nav-item.active {
  background: #667eea;
  color: white;
}

.nav-icon {
  font-size: 1.25rem;
}

/* Main Content */
.dashboard-main {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.tab-content h2 {
  font-size: 1.75rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
}

/* Bookings */
.bookings-filter {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 16px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
  color: #4a5568;
}

.filter-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.booking-card {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.booking-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.booking-info h3 {
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.provider-name {
  color: #667eea;
  font-weight: 600;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.in-progress {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.completed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.booking-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
}

.detail {
  font-size: 0.95rem;
  color: #4a5568;
}

.detail strong {
  color: #2d3748;
  margin-right: 0.5rem;
}

.booking-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-small {
  padding: 8px 16px;
  font-size: 0.9rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #718096;
}

/* Favorites */
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.provider-card-small {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.provider-card-small:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.provider-card-small img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.provider-card-small .provider-info {
  padding: 1.5rem;
}

.provider-card-small h3 {
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.provider-card-small p {
  color: #667eea;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.rating {
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.provider-actions {
  display: flex;
  gap: 0.75rem;
}

.provider-actions .btn {
  flex: 1;
}

/* Payments Table */
.payments-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f7fafc;
}

th {
  text-align: left;
  padding: 1rem;
  font-weight: 600;
  color: #2d3748;
  border-bottom: 2px solid #e2e8f0;
}

td {
  padding: 1rem;
  color: #4a5568;
  border-bottom: 1px solid #e2e8f0;
}

.payment-status {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.payment-status.completed {
  background: #d1fae5;
  color: #065f46;
}

/* Messages */
.messages-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message-preview {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.message-preview:hover {
  border-color: #667eea;
  background: #f7fafc;
}

.message-preview img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.message-content {
  flex: 1;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.message-header strong {
  color: #2d3748;
}

.time {
  color: #718096;
  font-size: 0.85rem;
}

.message-text {
  color: #4a5568;
  font-size: 0.95rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.unread-badge {
  background: #667eea;
  color: white;
  padding: 4px 10px;
  border-radius: 50%;
  font-size: 0.85rem;
  font-weight: 600;
  min-width: 24px;
  text-align: center;
}

/* Settings */
.settings-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.settings-section {
  padding-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.settings-section:last-child {
  border-bottom: none;
}

.settings-section h3 {
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  max-width: 400px;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  cursor: pointer;
  color: #4a5568;
}

@media (max-width: 1024px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
  }

  .dashboard-sidebar {
    position: static;
  }

  .sidebar-nav {
    display: flex;
    overflow-x: auto;
  }

  .nav-item {
    white-space: nowrap;
  }
}
</style>
