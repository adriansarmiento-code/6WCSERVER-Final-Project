<template>
  <div class="admin-dashboard">
    <div class="admin-layout">
      <!-- Admin Sidebar -->
      <aside class="admin-sidebar">
        <div class="admin-brand">
          <h2>Fixify Admin</h2>
        </div>
        <nav class="admin-nav">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="['admin-nav-item', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            <span class="nav-icon">{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>
          </button>
        </nav>
        <button class="btn-logout" @click="handleLogout">Logout</button>
      </aside>

      <!-- Main Content -->
      <main class="admin-main">
        <div class="admin-header">
          <h1>{{ currentTabTitle }}</h1>
        </div>

        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="tab-content">
          <div v-if="loading" class="loading">Loading statistics...</div>

          <div v-else>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon">👥</div>
                <div class="stat-info">
                  <h3>Total Users</h3>
                  <p class="stat-number">{{ stats.totalUsers }}</p>
                  <span class="stat-change positive"
                    >+{{ stats.growth.users }}% this month</span
                  >
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">🔧</div>
                <div class="stat-info">
                  <h3>Active Providers</h3>
                  <p class="stat-number">{{ stats.activeProviders }}</p>
                  <span class="stat-change positive"
                    >+{{ stats.growth.providers }}% this month</span
                  >
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">📅</div>
                <div class="stat-info">
                  <h3>Total Bookings</h3>
                  <p class="stat-number">{{ stats.totalBookings }}</p>
                  <span class="stat-change positive"
                    >+{{ stats.growth.bookings }}% this month</span
                  >
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">💰</div>
                <div class="stat-info">
                  <h3>Revenue</h3>
                  <p class="stat-number">
                    ₱{{ stats.totalRevenue.toLocaleString() }}
                  </p>
                  <span class="stat-change positive"
                    >+{{ stats.growth.revenue }}% this month</span
                  >
                </div>
              </div>
            </div>

            <div class="recent-activity">
              <h2>Recent Activity</h2>
              <div v-if="loadingActivity" class="loading">
                Loading activity...
              </div>
              <div v-else class="activity-list">
                <div
                  v-for="activity in activities"
                  :key="activity.time"
                  class="activity-item"
                >
                  <span class="activity-icon">{{ activity.icon }}</span>
                  <div class="activity-info">
                    <strong>{{ activity.title }}</strong>
                    <p>{{ activity.description }}</p>
                  </div>
                  <span class="activity-time">{{
                    formatTime(activity.time)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Users Tab -->
        <div v-if="activeTab === 'users'" class="tab-content">
          <div class="table-controls">
            <input
              type="text"
              v-model="userSearch"
              @input="fetchUsers"
              placeholder="Search users..."
              class="search-input"
            />
            <select
              v-model="userFilter"
              @change="fetchUsers"
              class="filter-select"
            >
              <option value="all">All Users</option>
              <option value="customers">Customers</option>
              <option value="providers">Providers</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div v-if="loadingUsers" class="loading">Loading users...</div>

          <div v-else class="data-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user._id">
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span :class="['badge', user.role]">{{ user.role }}</span>
                  </td>
                  <td>
                    <span
                      :class="[
                        'status-badge',
                        user.isActive ? 'active' : 'inactive',
                      ]"
                    >
                      {{ user.isActive ? "Active" : "Inactive" }}
                    </span>
                  </td>
                  <td>{{ formatDate(user.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Providers Tab -->
        <div v-if="activeTab === 'providers'" class="tab-content">
          <div class="table-controls">
            <input
              type="text"
              v-model="providerSearch"
              @input="fetchProviders"
              placeholder="Search providers..."
              class="search-input"
            />
            <select
              v-model="providerFilter"
              @change="fetchProviders"
              class="filter-select"
            >
              <option value="all">All Providers</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending Verification</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div v-if="loadingProviders" class="loading">
            Loading providers...
          </div>

          <div v-else class="data-table">
            <table>
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Category</th>
                  <th>Rating</th>
                  <th>Jobs</th>
                  <th>Verified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="provider in providers" :key="provider._id">
                  <td>{{ provider.name }}</td>
                  <td>{{ provider.providerInfo?.category || "N/A" }}</td>
                  <td>
                    {{ provider.providerInfo?.rating?.toFixed(1) || 0 }} ⭐
                  </td>
                  <td>{{ provider.providerInfo?.completedJobs || 0 }}</td>
                  <td>
                    <span
                      :class="[
                        'verified-badge',
                        provider.providerInfo?.verified,
                      ]"
                    >
                      {{ provider.providerInfo?.verified ? "Yes" : "No" }}
                    </span>
                  </td>
                  <td>
                    <button
                      v-if="!provider.providerInfo?.verified"
                      @click="verifyProvider(provider._id)"
                      class="btn-action"
                    >
                      Verify
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Bookings Tab -->
        <div v-if="activeTab === 'bookings'" class="tab-content">
          <div class="table-controls">
            <input
              type="text"
              v-model="bookingSearch"
              @input="fetchBookings"
              placeholder="Search bookings..."
              class="search-input"
            />
            <select
              v-model="bookingFilter"
              @change="fetchBookings"
              class="filter-select"
            >
              <option value="all">All Bookings</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div v-if="loadingBookings" class="loading">Loading bookings...</div>

          <div v-else class="data-table">
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Provider</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="booking in bookings" :key="booking._id">
                  <td>{{ booking._id.slice(-6).toUpperCase() }}</td>
                  <td>{{ booking.customer.name }}</td>
                  <td>{{ booking.provider.name }}</td>
                  <td>{{ booking.service.name }}</td>
                  <td>{{ formatDate(booking.scheduledDate) }}</td>
                  <td>₱{{ booking.totalAmount }}</td>
                  <td>
                    <span :class="['status-badge', booking.status]">
                      {{ booking.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Reviews Tab -->
        <div v-if="activeTab === 'reviews'" class="tab-content">
          <div class="table-controls">
            <select
              v-model="reviewFilter"
              @change="fetchReviews"
              class="filter-select"
            >
              <option value="all">All Reviews</option>
              <option value="pending">Pending Moderation</option>
              <option value="approved">Approved</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>

          <div v-if="loadingReviews" class="loading">Loading reviews...</div>

          <div v-else class="reviews-list">
            <div
              v-for="review in reviews"
              :key="review._id"
              class="review-card"
            >
              <div class="review-header">
                <div class="review-user">
                  <strong>{{ review.customer.name }}</strong>
                  <span class="review-rating">{{
                    "⭐".repeat(review.rating)
                  }}</span>
                </div>
                <span class="review-date">{{
                  formatDate(review.createdAt)
                }}</span>
              </div>
              <p class="review-text">{{ review.comment }}</p>
              <div class="review-meta">
                <span>Provider: {{ review.provider.name }}</span>
                <span :class="['review-status', review.status]">
                  {{ review.status }}
                </span>
              </div>
              <div class="review-actions">
                <button
                  v-if="review.status !== 'approved'"
                  @click="updateReviewStatus(review._id, 'approved')"
                  class="btn-action"
                >
                  Approve
                </button>
                <button
                  v-if="review.status !== 'removed'"
                  @click="updateReviewStatus(review._id, 'removed')"
                  class="btn-action danger"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Settings Tab -->
        <div v-if="activeTab === 'settings'" class="tab-content">
          <div class="settings-sections">
            <section class="settings-section">
              <h3>Platform Settings</h3>
              <div class="form-group">
                <label>Platform Fee (%)</label>
                <input type="number" value="10" />
              </div>
              <div class="form-group">
                <label>Minimum Service Price (₱)</label>
                <input type="number" value="100" />
              </div>
              <button class="btn btn-primary">Save Changes</button>
            </section>

            <section class="settings-section">
              <h3>Email Notifications</h3>
              <label class="checkbox-label">
                <input type="checkbox" checked />
                <span>Send booking confirmations</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" checked />
                <span>Send payment notifications</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" />
                <span>Send promotional emails</span>
              </label>
            </section>

            <section class="settings-section">
              <h3>Maintenance Mode</h3>
              <label class="checkbox-label">
                <input type="checkbox" />
                <span>Enable maintenance mode</span>
              </label>
              <p class="help-text">
                When enabled, only admins can access the platform
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { adminAPI } from "@/services/api";

export default {
  name: "AdminDashboardPage",
  data() {
    return {
      activeTab: "overview",
      loading: false,
      loadingActivity: false,
      loadingUsers: false,
      loadingProviders: false,
      loadingBookings: false,
      loadingReviews: false,

      // Stats
      stats: {
        totalUsers: 0,
        activeProviders: 0,
        totalBookings: 0,
        totalRevenue: 0,
        growth: {
          users: 0,
          providers: 0,
          bookings: 0,
          revenue: 0,
        },
      },

      // Activity
      activities: [],

      // Users
      users: [],
      userSearch: "",
      userFilter: "all",

      // Providers
      providers: [],
      providerSearch: "",
      providerFilter: "all",

      // Bookings
      bookings: [],
      bookingSearch: "",
      bookingFilter: "all",

      // Reviews
      reviews: [],
      reviewFilter: "all",

      tabs: [
        { id: "overview", label: "Overview", icon: "📊" },
        { id: "users", label: "Users", icon: "👥" },
        { id: "providers", label: "Providers", icon: "🔧" },
        { id: "bookings", label: "Bookings", icon: "📅" },
        { id: "reviews", label: "Reviews", icon: "⭐" },
        { id: "settings", label: "Settings", icon: "⚙️" },
      ],
    };
  },

  computed: {
    currentTabTitle() {
      const tab = this.tabs.find((t) => t.id === this.activeTab);
      return tab ? tab.label : "";
    },
  },

  watch: {
    activeTab(newTab) {
      if (newTab === "users" && this.users.length === 0) {
        this.fetchUsers();
      } else if (newTab === "providers" && this.providers.length === 0) {
        this.fetchProviders();
      } else if (newTab === "bookings" && this.bookings.length === 0) {
        this.fetchBookings();
      } else if (newTab === "reviews" && this.reviews.length === 0) {
        this.fetchReviews();
      }
    },
  },

  methods: {
    async fetchStats() {
      this.loading = true;
      try {
        const response = await adminAPI.getStats();
        this.stats = response.data;
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchActivity() {
      this.loadingActivity = true;
      try {
        const response = await adminAPI.getActivity();
        this.activities = response.data.activities;
      } catch (error) {
        console.error("Error fetching activity:", error);
      } finally {
        this.loadingActivity = false;
      }
    },

    async fetchUsers() {
      this.loadingUsers = true;
      try {
        const response = await adminAPI.getAllUsers({
          search: this.userSearch,
          filter: this.userFilter,
        });
        this.users = response.data.users;
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        this.loadingUsers = false;
      }
    },

    async fetchProviders() {
      this.loadingProviders = true;
      try {
        const response = await adminAPI.getAllProviders({
          search: this.providerSearch,
          filter: this.providerFilter,
        });
        this.providers = response.data.providers;
      } catch (error) {
        console.error("Error fetching providers:", error);
      } finally {
        this.loadingProviders = false;
      }
    },

    async verifyProvider(providerId) {
      if (!confirm("Verify this provider?")) return;

      try {
        await adminAPI.verifyProvider(providerId);
        alert("Provider verified successfully!");
        await this.fetchProviders();
      } catch (error) {
        console.error("Error verifying provider:", error);
        alert("Failed to verify provider");
      }
    },

    async fetchBookings() {
      this.loadingBookings = true;
      try {
        const response = await adminAPI.getAllBookings({
          search: this.bookingSearch,
          filter: this.bookingFilter,
        });
        this.bookings = response.data.bookings;
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        this.loadingBookings = false;
      }
    },

    async fetchReviews() {
      this.loadingReviews = true;
      try {
        const response = await adminAPI.getAllReviews({
          filter: this.reviewFilter,
        });
        this.reviews = response.data.reviews;
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        this.loadingReviews = false;
      }
    },

    async updateReviewStatus(reviewId, status) {
      const action = status === "approved" ? "approve" : "remove";
      if (!confirm(`${action} this review?`)) return;

      try {
        await adminAPI.updateReviewStatus(reviewId, status);
        alert(`Review ${action}d successfully!`);
        await this.fetchReviews();
      } catch (error) {
        console.error("Error updating review:", error);
        alert("Failed to update review");
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },

    formatTime(date) {
      const now = new Date();
      const activityDate = new Date(date);
      const diffMs = now - activityDate;
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;

      const diffDays = Math.floor(diffMins / 1440);
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;

      return this.formatDate(date);
    },

    handleLogout() {
      if (confirm("Are you sure you want to logout?")) {
        this.$store.dispatch("logout");
        this.$router.push("/admin/login");
      }
    },
  },

  async mounted() {
    // Check if user is admin
    if (!this.$store.getters.isAdmin) {
      this.$router.push("/admin/login");
      return;
    }

    // Fetch initial data
    await this.fetchStats();
    await this.fetchActivity();
  },
};
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: #f7fafc;
}

.admin-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
}

.admin-sidebar {
  background: #1a202c;
  color: white;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
}

.admin-brand {
  padding: 0 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
}

.admin-brand h2 {
  margin: 0;
  font-size: 1.5rem;
}

.admin-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 1rem;
}

.admin-nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  font-size: 1rem;
}

.admin-nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.admin-nav-item.active {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.nav-icon {
  font-size: 1.25rem;
}

.btn-logout {
  margin: 2rem 1rem 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.2);
}

.admin-main {
  padding: 2rem;
  overflow-y: auto;
}

.admin-header {
  margin-bottom: 2rem;
}

.admin-header h1 {
  font-size: 2rem;
  color: #1a202c;
}

.tab-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #718096;
  font-size: 1.1rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 12px;
  align-items: center;
}

.stat-icon {
  font-size: 3rem;
}

.stat-info h3 {
  font-size: 0.9rem;
  color: #718096;
  margin-bottom: 0.5rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #1a202c;
  margin: 0.5rem 0;
}

.stat-change {
  font-size: 0.85rem;
  font-weight: 600;
}

.stat-change.positive {
  color: #28a745;
}

/* Recent Activity */
.recent-activity {
  margin-top: 2rem;
}

.recent-activity h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #1a202c;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  align-items: center;
}

.activity-icon {
  font-size: 1.5rem;
}

.activity-info {
  flex: 1;
}

.activity-info strong {
  display: block;
  color: #1a202c;
  margin-bottom: 0.25rem;
}

.activity-info p {
  color: #718096;
  font-size: 0.9rem;
  margin: 0;
}

.activity-time {
  color: #a0aec0;
  font-size: 0.85rem;
}

/* Table Controls */
.table-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-input {
  flex: 1;
  padding: 10px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
}

.search-input:focus {
  outline: none;
  border-color: #1a202c;
}

.filter-select {
  padding: 10px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
}

/* Data Table */
.data-table {
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
  color: #1a202c;
  border-bottom: 2px solid #e2e8f0;
}

td {
  padding: 1rem;
  color: #4a5568;
  border-bottom: 1px solid #e2e8f0;
}

.badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
}

.badge.customer {
  background: #dbeafe;
  color: #1e40af;
}

.badge.provider {
  background: #d1fae5;
  color: #065f46;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.inactive {
  background: #e2e8f0;
  color: #4a5568;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.confirmed {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.in-progress {
  background: #e0e7ff;
  color: #3730a3;
}

.status-badge.completed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.verified-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.verified-badge.true {
  background: #d1fae5;
  color: #065f46;
}

.verified-badge.false {
  background: #fee2e2;
  color: #991b1b;
}

.btn-action {
  padding: 6px 12px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  margin-right: 0.5rem;
}

.btn-action:hover {
  background: #f7fafc;
  border-color: #1a202c;
}

.btn-action.danger {
  color: #c53030;
  border-color: #feb2b2;
}

.btn-action.danger:hover {
  background: #fff5f5;
}

/* Reviews List */
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-card {
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 12px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.review-user strong {
  display: block;
  color: #1a202c;
  margin-bottom: 0.25rem;
}

.review-rating {
  font-size: 0.9rem;
}

.review-date {
  color: #a0aec0;
  font-size: 0.85rem;
}

.review-text {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.review-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #718096;
}

.review-status {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
}

.review-status.approved {
  background: #d1fae5;
  color: #065f46;
}

.review-status.pending {
  background: #fef3c7;
  color: #92400e;
}

.review-status.flagged {
  background: #fee2e2;
  color: #991b1b;
}

.review-status.removed {
  background: #e2e8f0;
  color: #4a5568;
}

.review-actions {
  display: flex;
  gap: 0.5rem;
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
  color: #1a202c;
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
  max-width: 300px;
  padding: 10px 16px;
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

.help-text {
  color: #718096;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.btn-primary {
  background: #1a202c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;
}

.btn-primary:hover {
  background: #2d3748;
}

@media (max-width: 1024px) {
  .admin-layout {
    grid-template-columns: 1fr;
  }

  .admin-sidebar {
    display: none;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .table-controls {
    flex-direction: column;
  }
}
</style>
