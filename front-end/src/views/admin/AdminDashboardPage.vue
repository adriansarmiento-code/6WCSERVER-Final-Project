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
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">👥</div>
              <div class="stat-info">
                <h3>Total Users</h3>
                <p class="stat-number">1,247</p>
                <span class="stat-change positive">+12% this month</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🔧</div>
              <div class="stat-info">
                <h3>Active Providers</h3>
                <p class="stat-number">342</p>
                <span class="stat-change positive">+8% this month</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📅</div>
              <div class="stat-info">
                <h3>Total Bookings</h3>
                <p class="stat-number">5,831</p>
                <span class="stat-change positive">+15% this month</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">💰</div>
              <div class="stat-info">
                <h3>Revenue</h3>
                <p class="stat-number">₱284,500</p>
                <span class="stat-change positive">+23% this month</span>
              </div>
            </div>
          </div>

          <div class="recent-activity">
            <h2>Recent Activity</h2>
            <div class="activity-list">
              <div class="activity-item">
                <span class="activity-icon">👤</span>
                <div class="activity-info">
                  <strong>New user registered</strong>
                  <p>Maria Santos joined as a customer</p>
                </div>
                <span class="activity-time">5 min ago</span>
              </div>
              <div class="activity-item">
                <span class="activity-icon">📅</span>
                <div class="activity-info">
                  <strong>Booking completed</strong>
                  <p>Plumbing service by Juan dela Cruz</p>
                </div>
                <span class="activity-time">12 min ago</span>
              </div>
              <div class="activity-item">
                <span class="activity-icon">⭐</span>
                <div class="activity-info">
                  <strong>New review posted</strong>
                  <p>5-star review for cleaning service</p>
                </div>
                <span class="activity-time">1 hour ago</span>
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
              placeholder="Search users..."
              class="search-input"
            />
            <select v-model="userFilter" class="filter-select">
              <option value="all">All Users</option>
              <option value="customers">Customers</option>
              <option value="providers">Providers</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div class="data-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span :class="['badge', user.type]">{{ user.type }}</span>
                  </td>
                  <td>
                    <span :class="['status-badge', user.status]">
                      {{ user.status }}
                    </span>
                  </td>
                  <td>{{ user.joined }}</td>
                  <td>
                    <button class="btn-action">View</button>
                    <button class="btn-action">Edit</button>
                  </td>
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
              placeholder="Search providers..."
              class="search-input"
            />
            <select v-model="providerFilter" class="filter-select">
              <option value="all">All Providers</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending Verification</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div class="data-table">
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
                <tr v-for="provider in providers" :key="provider.id">
                  <td>{{ provider.name }}</td>
                  <td>{{ provider.category }}</td>
                  <td>{{ provider.rating }} ⭐</td>
                  <td>{{ provider.jobs }}</td>
                  <td>
                    <span :class="['verified-badge', provider.verified]">
                      {{ provider.verified ? "Yes" : "No" }}
                    </span>
                  </td>
                  <td>
                    <button class="btn-action">View</button>
                    <button class="btn-action">Verify</button>
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
              placeholder="Search bookings..."
              class="search-input"
            />
            <select v-model="bookingFilter" class="filter-select">
              <option value="all">All Bookings</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div class="data-table">
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="booking in bookings" :key="booking.id">
                  <td>{{ booking.id }}</td>
                  <td>{{ booking.customer }}</td>
                  <td>{{ booking.provider }}</td>
                  <td>{{ booking.service }}</td>
                  <td>{{ booking.date }}</td>
                  <td>₱{{ booking.amount }}</td>
                  <td>
                    <span :class="['status-badge', booking.status]">
                      {{ booking.status }}
                    </span>
                  </td>
                  <td>
                    <button class="btn-action">Details</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Reviews Tab -->
        <div v-if="activeTab === 'reviews'" class="tab-content">
          <div class="table-controls">
            <select v-model="reviewFilter" class="filter-select">
              <option value="all">All Reviews</option>
              <option value="pending">Pending Moderation</option>
              <option value="approved">Approved</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>

          <div class="reviews-list">
            <div v-for="review in reviews" :key="review.id" class="review-card">
              <div class="review-header">
                <div class="review-user">
                  <strong>{{ review.userName }}</strong>
                  <span class="review-rating">{{
                    "⭐".repeat(review.rating)
                  }}</span>
                </div>
                <span class="review-date">{{ review.date }}</span>
              </div>
              <p class="review-text">{{ review.comment }}</p>
              <div class="review-meta">
                <span>Provider: {{ review.provider }}</span>
                <span :class="['review-status', review.status]">
                  {{ review.status }}
                </span>
              </div>
              <div class="review-actions">
                <button class="btn-action">Approve</button>
                <button class="btn-action danger">Remove</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Reports Tab -->
        <div v-if="activeTab === 'reports'" class="tab-content">
          <h2>System Reports</h2>
          <div class="reports-grid">
            <div class="report-card">
              <h3>User Growth Report</h3>
              <p>Monthly user registration trends</p>
              <button class="btn btn-primary">Generate Report</button>
            </div>
            <div class="report-card">
              <h3>Revenue Report</h3>
              <p>Platform earnings and transactions</p>
              <button class="btn btn-primary">Generate Report</button>
            </div>
            <div class="report-card">
              <h3>Provider Performance</h3>
              <p>Top providers by rating and bookings</p>
              <button class="btn btn-primary">Generate Report</button>
            </div>
            <div class="report-card">
              <h3>Service Analytics</h3>
              <p>Most requested services and trends</p>
              <button class="btn btn-primary">Generate Report</button>
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
export default {
  name: "AdminDashboardPage",
  data() {
    return {
      activeTab: "overview",
      userSearch: "",
      userFilter: "all",
      providerSearch: "",
      providerFilter: "all",
      bookingSearch: "",
      bookingFilter: "all",
      reviewFilter: "all",
      tabs: [
        { id: "overview", label: "Overview", icon: "📊" },
        { id: "users", label: "Users", icon: "👥" },
        { id: "providers", label: "Providers", icon: "🔧" },
        { id: "bookings", label: "Bookings", icon: "📅" },
        { id: "reviews", label: "Reviews", icon: "⭐" },
        { id: "reports", label: "Reports", icon: "📈" },
        { id: "settings", label: "Settings", icon: "⚙️" },
      ],
      users: [
        {
          id: 1,
          name: "Maria Santos",
          email: "maria@email.com",
          type: "customer",
          status: "active",
          joined: "Oct 1, 2025",
        },
        {
          id: 2,
          name: "Juan dela Cruz",
          email: "juan@email.com",
          type: "provider",
          status: "active",
          joined: "Sep 28, 2025",
        },
        {
          id: 3,
          name: "Pedro Reyes",
          email: "pedro@email.com",
          type: "provider",
          status: "inactive",
          joined: "Sep 25, 2025",
        },
      ],
      providers: [
        {
          id: 1,
          name: "Juan dela Cruz",
          category: "Plumbing",
          rating: 4.8,
          jobs: 342,
          verified: true,
        },
        {
          id: 2,
          name: "Maria Santos",
          category: "Cleaning",
          rating: 4.9,
          jobs: 289,
          verified: true,
        },
        {
          id: 3,
          name: "Pedro Reyes",
          category: "Electrical",
          rating: 4.7,
          jobs: 156,
          verified: false,
        },
      ],
      bookings: [
        {
          id: "BOOK-001",
          customer: "Ana Garcia",
          provider: "Juan dela Cruz",
          service: "Plumbing Repair",
          date: "Oct 15, 2025",
          amount: 800,
          status: "pending",
        },
        {
          id: "BOOK-002",
          customer: "Carlos Lopez",
          provider: "Maria Santos",
          service: "House Cleaning",
          date: "Oct 14, 2025",
          amount: 1200,
          status: "completed",
        },
        {
          id: "BOOK-003",
          customer: "Lisa Cruz",
          provider: "Pedro Reyes",
          service: "Electrical Wiring",
          date: "Oct 16, 2025",
          amount: 1500,
          status: "in-progress",
        },
      ],
      reviews: [
        {
          id: 1,
          userName: "Ana Garcia",
          rating: 5,
          comment: "Excellent service! Very professional and punctual.",
          provider: "Juan dela Cruz",
          date: "Oct 12, 2025",
          status: "approved",
        },
        {
          id: 2,
          userName: "Carlos Lopez",
          rating: 4,
          comment: "Good work, took a bit longer than expected.",
          provider: "Maria Santos",
          date: "Oct 11, 2025",
          status: "pending",
        },
        {
          id: 3,
          userName: "Lisa Cruz",
          rating: 5,
          comment: "Amazing quality! Will book again.",
          provider: "Pedro Reyes",
          date: "Oct 10, 2025",
          status: "flagged",
        },
      ],
    };
  },
  computed: {
    currentTabTitle() {
      const tab = this.tabs.find((t) => t.id === this.activeTab);
      return tab ? tab.label : "";
    },
  },
  methods: {
    handleLogout() {
      if (confirm("Are you sure you want to logout?")) {
        this.$store.dispatch("logout");
        this.$router.push("/admin/login");
      }
    },
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

.status-badge .pending {
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
.review-actions {
  display: flex;
  gap: 0.5rem;
}
/* Reports Grid */
.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}
.report-card {
  padding: 2rem;
  background: #f7fafc;
  border-radius: 12px;
  text-align: center;
}
.report-card h3 {
  font-size: 1.25rem;
  color: #1a202c;
  margin-bottom: 0.5rem;
}
.report-card p {
  color: #718096;
  margin-bottom: 1.5rem;
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
