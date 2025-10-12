<template>
  <div class="dashboard-page">
    <AppHeader />

    <div class="container">
      <div class="dashboard-header">
        <div>
          <h1>Welcome back, {{ currentUser ? currentUser.name : "Guest" }}!</h1>
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
                :key="booking._id"
                class="booking-card"
              >
                <div class="booking-header">
                  <div class="booking-info">
                    <h3>{{ booking.service.name }}</h3>
                    <p class="provider-name">{{ booking.provider.name }}</p>
                  </div>
                  <span :class="['status-badge', booking.status]">
                    {{ booking.status }}
                  </span>
                </div>

                <div class="booking-details">
                  <div class="detail">
                    <strong>Date:</strong>
                    {{ formatDate(booking.scheduledDate) }}
                  </div>
                  <div class="detail">
                    <strong>Time:</strong> {{ booking.scheduledTime }}
                  </div>
                  <div class="detail">
                    <strong>Location:</strong> {{ booking.address }}
                  </div>
                  <div class="detail">
                    <strong>Amount:</strong> ₱{{ booking.totalAmount }}
                  </div>
                </div>
                <div class="booking-actions">
                  <button
                    v-if="
                      booking.status === 'pending' &&
                      booking.paymentStatus === 'held-in-escrow'
                    "
                    class="btn btn-outline btn-small"
                    @click="cancelBooking(booking._id)"
                  >
                    Cancel
                  </button>

                  <button
                    v-if="
                      booking.status === 'in-progress' &&
                      booking.paymentStatus === 'held-in-escrow'
                    "
                    class="btn btn-primary btn-small"
                    @click="completeBooking(booking._id)"
                  >
                    Mark as Complete
                  </button>

                  <button
                    v-if="booking.status === 'completed' && !booking.hasReview"
                    class="btn btn-primary btn-small"
                    @click="reviewService(booking)"
                  >
                    Leave Review
                  </button>

                  <button
                    v-if="booking.status === 'completed' && booking.hasReview"
                    class="btn btn-outline btn-small"
                    disabled
                  >
                    ✓ Reviewed
                  </button>

                  <button
                    class="btn btn-outline btn-small"
                    @click="viewBookingDetails(booking._id)"
                  >
                    View Details
                  </button>
                </div>
              </div>

              <div v-if="filteredBookings.length === 0" class="empty-state">
                <div class="empty-icon">📅</div>
                <p>No {{ bookingFilter }} bookings found</p>
                <router-link to="/services" class="btn btn-primary">
                  Book a Service
                </router-link>
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
                  <tr v-for="payment in paymentsHistory" :key="payment._id">
                    <td>{{ formatDate(payment.scheduledDate) }}</td>
                    <td>{{ payment.service.name }}</td>
                    <td>{{ payment.provider.name }}</td>
                    <td>₱{{ payment.totalAmount }}</td>
                    <td>
                      <span :class="['payment-status', payment.paymentStatus]">
                        {{ payment.paymentStatus }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div v-if="paymentsHistory.length === 0" class="empty-state">
                <div class="empty-icon">💳</div>
                <p>No payment history yet</p>
              </div>
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
                  <input
                    type="text"
                    :value="currentUser ? currentUser.name : ''"
                  />
                </div>
                <div class="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    :value="currentUser ? currentUser.email : ''"
                  />
                </div>
                <div class="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    :value="currentUser ? currentUser.phone : ''"
                  />
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
import { bookingAPI, authAPI } from "@/services/api";

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
        { id: "payments", label: "Payments", icon: "💳" },
        { id: "settings", label: "Settings", icon: "⚙️" },
      ],
      bookingFilters: [
        "All",
        "Pending",
        "In Progress",
        "Completed",
        "Cancelled",
      ],
      bookings: [],
      loading: false,
      error: null,
    };
  },
  computed: {
    currentUser() {
      return this.$store.getters.currentUser;
    },

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
    paymentsHistory() {
      return this.bookings.filter(
        (b) =>
          b.paymentStatus &&
          (b.status === "completed" || b.status === "cancelled")
      );
    },
  },
  methods: {
    async fetchBookings() {
      this.loading = true;
      this.error = null;
      try {
        const role =
          this.currentUser?.role === "provider" ? "provider" : "customer";
        const response = await bookingAPI.getAll({ role });
        this.bookings = response.data.bookings;
      } catch (error) {
        console.error("Error fetching bookings:", error);
        this.error = "Failed to load bookings";
      } finally {
        this.loading = false;
      }
    },
    handleLogout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },

    async fetchFavorites() {
      this.favorites = [];
    },

    async updateBookingStatus(bookingId, status) {
      try {
        await bookingAPI.update(bookingId, { status });
        await this.fetchBookings();
      } catch (error) {
        console.error("Error updating booking:", error);
        alert(error.response?.data?.message || "Failed to update booking");
      }
    },

    async cancelBooking(bookingId) {
      if (!confirm("Are you sure you want to cancel this booking?")) return;
      try {
        await bookingAPI.cancel(bookingId);
        await this.fetchBookings();
      } catch (error) {
        console.error("Error canceling booking:", error);
        alert(error.response?.data?.message || "Failed to cancel booking");
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },

    viewBookingDetails(bookingId) {
      const booking = this.bookings.find((b) => b._id === bookingId);
      if (booking) {
        alert(`Booking Details:
Service: ${booking.service.name}
Provider: ${booking.provider.name}
Date: ${this.formatDate(booking.scheduledDate)}
Time: ${booking.scheduledTime}
Address: ${booking.address}
Amount: ₱${booking.totalAmount}
Status: ${booking.status}
Payment: ${booking.paymentStatus}`);
      }
    },

    async completeBooking(bookingId) {
      const booking = this.bookings.find((b) => b._id === bookingId);

      if (booking.paymentStatus === "pending") {
        alert("Please complete payment before marking as complete.");
        this.$router.push(`/payment/${bookingId}`);
        return;
      }

      if (booking.paymentStatus !== "held-in-escrow") {
        alert("Payment status is invalid. Please contact support.");
        return;
      }

      try {
        await bookingAPI.update(bookingId, {
          status: "completed",
          paymentStatus: "released",
        });
        alert(
          "Service marked as complete! Payment has been released to the provider."
        );
        await this.fetchBookings();
      } catch (error) {
        alert(error.response?.data?.message || "Failed to complete booking");
      }
    },

    reviewService(booking) {
      this.$router.push({
        name: "ReviewPage",
        params: { bookingId: booking._id },
      });
    },

    viewProvider(id) {
      this.$router.push(`/provider/${id}`);
    },

    bookProvider(id) {
      this.$router.push(`/booking/${id}`);
    },

    openMessage(id) {
      this.$router.push(`/messages/${id}`);
    },
  },

  async mounted() {
    const user = this.$store.getters.currentUser;

    if (!user) {
      const token = this.$store.getters.getToken;

      if (!token) {
        this.$router.push("/login");
        return;
      }

      try {
        const response = await authAPI.getMe();
        this.$store.dispatch("login", {
          user: response.data,
          token: token,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        this.$router.push("/login");
        return;
      }
    }

    this.fetchBookings();
    this.fetchFavorites();
  },
};
</script>

<style scoped>
.dashboard-page {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
}

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
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dashboard-header p {
  color: #718096;
  font-size: 1.05rem;
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
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 1rem;
  border: 1px solid #f1f5f9;
}

.nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: none;
  background: transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  color: #4a5568;
  text-align: left;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.nav-item:hover {
  background: linear-gradient(135deg, #f8fafc 0%, #f0f4ff 100%);
  transform: translateX(4px);
}

.nav-item:hover::before {
  transform: scaleY(1);
}

.nav-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.nav-item.active::before {
  display: none;
}

.nav-icon {
  font-size: 1.25rem;
  transition: transform 0.3s ease;
}

.nav-item:hover .nav-icon,
.nav-item.active .nav-icon {
  transform: scale(1.1);
}

/* Main Content */
.dashboard-main {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  border: 1px solid #f1f5f9;
  animation: fadeInUp 0.5s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tab-content h2 {
  font-size: 1.75rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
  font-weight: 700;
  position: relative;
  padding-bottom: 1rem;
}

.tab-content h2::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 60px;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

/* Bookings */
.bookings-filter {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 10px 20px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a5568;
  position: relative;
  overflow: hidden;
}

.filter-btn::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: translate(-50%, -50%);
  transition: width 0.4s ease, height 0.4s ease;
  z-index: 0;
}

.filter-btn:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.filter-btn span {
  position: relative;
  z-index: 1;
}

.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.booking-card {
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  background: white;
  position: relative;
  overflow: hidden;
}

.booking-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: height 0.3s ease;
}

.booking-card:hover {
  border-color: #667eea;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
  transform: translateY(-4px);
}

.booking-card:hover::before {
  height: 100%;
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
  font-weight: 700;
}

.provider-name {
  color: #667eea;
  font-weight: 600;
  font-size: 0.95rem;
}

.status-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: capitalize;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.status-badge.pending {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

.status-badge.in-progress {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
}

.status-badge.completed {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
}

.status-badge.cancelled {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
}

.booking-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.detail {
  font-size: 0.95rem;
  color: #4a5568;
  line-height: 1.6;
}

.detail strong {
  color: #2d3748;
  margin-right: 0.5rem;
  font-weight: 600;
}

.booking-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border: 2px solid;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  line-height: 1;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.btn:hover::before {
  width: 300px;
  height: 300px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-outline {
  background: transparent;
  border-color: #e2e8f0;
  color: #475569;
}

.btn-outline:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
  background: #f8fafc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.btn-outline:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-small {
  padding: 10px 18px;
  font-size: 0.9rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.6;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.empty-state p {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

/* Payments Table */
.payments-table {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

th {
  text-align: left;
  padding: 1.25rem 1rem;
  font-weight: 700;
  color: #2d3748;
  border-bottom: 2px solid #e2e8f0;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

td {
  padding: 1.25rem 1rem;
  color: #4a5568;
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s ease;
}

tbody tr {
  transition: all 0.3s ease;
}

tbody tr:hover {
  background: linear-gradient(135deg, #f8fafc 0%, #f0f4ff 100%);
  transform: scale(1.01);
}

.payment-status {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 700;
  display: inline-block;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.payment-status.completed {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
}

.payment-status.held-in-escrow {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

.payment-status.released {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
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
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  position: relative;
  overflow: hidden;
}

.message-preview::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: height 0.3s ease;
}

.message-preview:hover {
  border-color: #667eea;
  background: linear-gradient(135deg, #f8fafc 0%, #f0f4ff 100%);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.message-preview:hover::before {
  height: 100%;
}

.message-preview img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e2e8f0;
  transition: border-color 0.3s ease;
}

.message-preview:hover img {
  border-color: #667eea;
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
  font-weight: 600;
}

.time {
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 500;
}

.message-text {
  color: #64748b;
  font-size: 0.95rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.unread-badge {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 6px 12px;
  border-radius: 50%;
  font-size: 0.85rem;
  font-weight: 700;
  min-width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Settings */
.settings-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.settings-section {
  padding-bottom: 2rem;
  border-bottom: 2px solid #f1f5f9;
  animation: fadeInUp 0.5s ease;
}

.settings-section:last-child {
  border-bottom: none;
}

.settings-section h3 {
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
  font-weight: 700;
  position: relative;
  padding-left: 1rem;
}

.settings-section h3::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.form-group input {
  width: 100%;
  max-width: 400px;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.form-group input:hover {
  border-color: #cbd5e0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  cursor: pointer;
  color: #4a5568;
  padding: 0.75rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.checkbox-label:hover {
  background: linear-gradient(135deg, #f8fafc 0%, #f0f4ff 100%);
  transform: translateX(4px);
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #667eea;
}

.settings-section .btn {
  margin-right: 1rem;
  margin-bottom: 0.75rem;
}

/* Responsive Design */
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
    gap: 0.5rem;
    padding: 0.75rem;
  }

  .nav-item {
    white-space: nowrap;
    flex-shrink: 0;
  }

  .nav-item:hover {
    transform: translateX(0) translateY(-2px);
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .dashboard-header h1 {
    font-size: 1.5rem;
  }

  .dashboard-main {
    padding: 1.5rem;
  }

  .tab-content h2 {
    font-size: 1.5rem;
  }

  .bookings-filter {
    gap: 0.5rem;
  }

  .filter-btn {
    padding: 8px 14px;
    font-size: 0.85rem;
  }

  .booking-card {
    padding: 1.25rem;
  }

  .booking-details {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .booking-actions {
    flex-direction: column;
  }

  .booking-actions .btn {
    width: 100%;
  }

  .payments-table {
    font-size: 0.9rem;
  }

  th,
  td {
    padding: 0.75rem 0.5rem;
  }

  .message-preview {
    padding: 1rem;
  }

  .form-group input {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .dashboard-header h1 {
    font-size: 1.25rem;
  }

  .dashboard-header p {
    font-size: 0.95rem;
  }

  .dashboard-main {
    padding: 1rem;
    border-radius: 12px;
  }

  .tab-content h2 {
    font-size: 1.25rem;
  }

  .booking-info h3 {
    font-size: 1.1rem;
  }

  .status-badge {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .btn {
    padding: 10px 16px;
    font-size: 0.9rem;
  }

  .empty-icon {
    font-size: 3rem;
  }
}
</style>
