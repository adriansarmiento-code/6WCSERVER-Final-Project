<template>
  <div class="provider-dashboard">
    <!-- Provider-specific header (no footer clutter) -->
    <header class="provider-header">
      <div class="header-content">
        <div class="logo">Fixify Provider</div>
        <nav>
          <router-link to="/provider-messages" class="nav-link"
            >Messages</router-link
          >
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </nav>
      </div>
    </header>

    <div class="dashboard-container" v-if="currentUser">
      <!-- Profile Section -->
      <div class="profile-section">
        <div class="profile-image-container">
          <img
            :src="getProfileImage(currentUser)"
            alt="Profile"
            class="profile-image"
          />
          <button
            @click="$refs.imageInput.click()"
            class="btn-change-photo"
            :disabled="uploadingImage"
          >
            {{ uploadingImage ? "⏳ Uploading..." : "📷 Change Photo" }}
          </button>
          <input
            ref="imageInput"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            @change="handleImageUpload"
            style="display: none"
          />
        </div>
        <div class="profile-info">
          <h2>{{ currentUser.name }}</h2>
          <p>{{ currentUser.email }}</p>
          <p class="role-badge">Provider</p>
        </div>
      </div>
      <!-- Provider Stats Overview -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ stats.totalBookings }}</div>
          <div class="stat-label">Total Jobs</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.completedJobs }}</div>
          <div class="stat-label">Completed</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">
            ₱{{ stats.totalEarnings.toLocaleString() }}
          </div>
          <div class="stat-label">Total Earnings</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">
            {{ currentUser.providerInfo?.rating?.toFixed(1) || 0 }}
          </div>
          <div class="stat-label">Rating</div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="{ active: activeTab === tab.id }"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Incoming Bookings Tab -->
        <div v-if="activeTab === 'bookings'" class="bookings-section">
          <h2>Incoming Jobs</h2>

          <div class="filter-bar">
            <select v-model="bookingFilter" @change="fetchBookings">
              <option value="all">All Bookings</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div v-if="loading" class="loading">Loading bookings...</div>

          <div v-else-if="bookings.length === 0" class="empty-state">
            <p>No bookings yet</p>
          </div>

          <div v-else class="bookings-list">
            <div
              v-for="booking in bookings"
              :key="booking._id"
              class="booking-card"
            >
              <div class="booking-header">
                <h3>{{ booking.service.name }}</h3>
                <span :class="'status-badge ' + booking.status">{{
                  booking.status
                }}</span>
              </div>

              <div class="booking-details">
                <p><strong>Customer:</strong> {{ booking.customer.name }}</p>
                <p>
                  <strong>Date:</strong> {{ formatDate(booking.scheduledDate) }}
                </p>
                <p><strong>Time:</strong> {{ booking.scheduledTime }}</p>
                <p><strong>Address:</strong> {{ booking.address }}</p>
                <p><strong>Amount:</strong> ₱{{ booking.service.price }}</p>
                <p v-if="booking.notes">
                  <strong>Notes:</strong> {{ booking.notes }}
                </p>
              </div>

              <div class="booking-actions">
                <button
                  v-if="booking.status === 'pending'"
                  @click="confirmBooking(booking._id)"
                  class="btn-confirm"
                >
                  Accept Job
                </button>
                <button
                  v-if="booking.status === 'confirmed'"
                  @click="startJob(booking._id)"
                  class="btn-start"
                >
                  Start Job
                </button>
                <button
                  @click="openChat(booking.customer._id)"
                  class="btn-message"
                >
                  Message Customer
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Earnings Tab -->
        <div v-if="activeTab === 'earnings'" class="earnings-section">
          <h2>Earnings</h2>

          <div class="earnings-summary">
            <div class="earning-card">
              <h3>This Month</h3>
              <p class="amount">₱{{ monthlyEarnings.toLocaleString() }}</p>
            </div>
            <div class="earning-card">
              <h3>Total Earnings</h3>
              <p class="amount">₱{{ stats.totalEarnings.toLocaleString() }}</p>
            </div>
            <div class="earning-card">
              <h3>Pending Payout</h3>
              <p class="amount">₱{{ pendingPayout.toLocaleString() }}</p>
            </div>
          </div>

          <h3>Transaction History</h3>
          <table class="earnings-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Service</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in completedBookings" :key="booking._id">
                <td>{{ formatDate(booking.scheduledDate) }}</td>
                <td>{{ booking.service.name }}</td>
                <td>{{ booking.customer.name }}</td>
                <td>₱{{ booking.service.price }}</td>
                <td>{{ booking.paymentStatus }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Reviews Tab -->
        <div v-if="activeTab === 'reviews'" class="reviews-section">
          <h2>Customer Reviews</h2>

          <div class="reviews-summary">
            <div class="rating-overview">
              <div class="big-rating">
                {{ currentUser.providerInfo?.rating?.toFixed(1) || 0 }}
              </div>
              <div class="stars">⭐⭐⭐⭐⭐</div>
              <div class="review-count">{{ reviews.length }} reviews</div>
            </div>
          </div>

          <div class="reviews-list">
            <div
              v-for="review in reviews"
              :key="review._id"
              class="review-card"
            >
              <div class="review-header">
                <strong>{{ review.customer.name }}</strong>
                <span class="review-rating">{{
                  "⭐".repeat(review.rating)
                }}</span>
              </div>
              <p class="review-comment">{{ review.comment }}</p>
              <p class="review-date">{{ formatDate(review.createdAt) }}</p>

              <div v-if="review.response" class="provider-response">
                <strong>Your Response:</strong>
                <p>{{ review.response.text }}</p>
              </div>

              <button
                v-else
                @click="openResponseModal(review)"
                class="btn-respond"
              >
                Respond
              </button>
            </div>
          </div>
        </div>

        <!-- Services Management Tab -->
        <div v-if="activeTab === 'services'" class="services-section">
          <h2>My Services</h2>

          <!-- Display existing services -->
          <div
            v-if="currentUser.providerInfo?.services?.length"
            class="services-list"
          >
            <div
              v-for="(service, index) in currentUser.providerInfo.services"
              :key="index"
              class="service-item"
            >
              <h3>{{ service.name }}</h3>
              <p>{{ service.description }}</p>
              <p class="price">₱{{ service.price }}</p>
              <button @click="editService(index)" class="btn-edit">Edit</button>
              <button @click="deleteService(index)" class="btn-delete">
                Delete
              </button>
            </div>
          </div>

          <button @click="showAddServiceModal = true" class="btn-add">
            + Add Service
          </button>

          <!-- Add/Edit Service Modal -->
          <div
            v-if="showAddServiceModal"
            class="modal-overlay"
            @click="showAddServiceModal = false"
          >
            <div class="modal" @click.stop>
              <h3>{{ editingService ? "Edit Service" : "Add New Service" }}</h3>
              <form @submit.prevent="saveService">
                <div class="form-group">
                  <label>Service Name</label>
                  <input v-model="serviceForm.name" required />
                </div>
                <div class="form-group">
                  <label>Description</label>
                  <textarea
                    v-model="serviceForm.description"
                    required
                  ></textarea>
                </div>
                <div class="form-group">
                  <label>Price (₱)</label>
                  <input
                    v-model.number="serviceForm.price"
                    type="number"
                    required
                  />
                </div>
                <div class="modal-actions">
                  <button type="submit" class="btn-submit">Save</button>
                  <button
                    type="button"
                    @click="showAddServiceModal = false"
                    class="btn-cancel"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Settings Tab -->
        <div v-if="activeTab === 'settings'" class="settings-section">
          <h2>Account Settings</h2>

          <form @submit.prevent="updateProfile" class="settings-form">
            <div class="form-group">
              <label>Name</label>
              <input v-model="profileForm.name" type="text" />
            </div>

            <div class="form-group">
              <label>Phone</label>
              <input v-model="profileForm.phone" type="text" />
            </div>

            <!-- ADD THIS SERVICE AREA FIELD -->
            <div class="form-group">
              <label>Service Area</label>
              <select v-model="profileForm.serviceArea">
                <option value="Angeles City Center">Angeles City Center</option>
                <option value="Balibago">Balibago</option>
                <option value="Nepo Mall Area">Nepo Mall Area</option>
                <option value="Marquee Mall Area">Marquee Mall Area</option>
                <option value="Clark">Clark</option>
              </select>
            </div>

            <div class="form-group">
              <label>Bio</label>
              <textarea v-model="profileForm.bio" rows="4"></textarea>
            </div>

            <div class="form-group">
              <label>Hourly Rate (₱)</label>
              <input v-model.number="profileForm.hourlyRate" type="number" />
            </div>

            <div class="form-group">
              <label>Skills (comma-separated)</label>
              <input
                v-model="profileForm.skills"
                type="text"
                placeholder="e.g. pipe repair, drain cleaning"
              />
            </div>

            <button type="submit" class="btn-save">Save Changes</button>
          </form>
        </div>
      </div>
    </div>

    <!-- Response Modal -->
    <div
      v-if="showResponseModal"
      class="modal-overlay"
      @click="showResponseModal = false"
    >
      <div class="modal" @click.stop>
        <h3>Respond to Review</h3>
        <textarea
          v-model="responseText"
          rows="4"
          placeholder="Write your response..."
        ></textarea>
        <div class="modal-actions">
          <button @click="submitResponse" class="btn-submit">Submit</button>
          <button @click="showResponseModal = false" class="btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { bookingAPI, reviewAPI, authAPI, providerAPI } from "@/services/api";

export default {
  name: "ProviderDashboard",
  data() {
    return {
      showAddServiceModal: false,
      editingService: null,
      serviceForm: {
        name: "",
        description: "",
        price: 0,
      },
      activeTab: "bookings",
      bookingFilter: "all",
      uploadingImage: false,

      tabs: [
        { id: "bookings", label: "Jobs", icon: "📋" },
        { id: "earnings", label: "Earnings", icon: "💰" },
        { id: "reviews", label: "Reviews", icon: "⭐" },
        { id: "services", label: "Services", icon: "🔧" },
        { id: "settings", label: "Settings", icon: "⚙️" },
      ],
      bookings: [],
      reviews: [],
      loading: false,
      stats: {
        totalBookings: 0,
        completedJobs: 0,
        totalEarnings: 0,
      },
      monthlyEarnings: 0,
      pendingPayout: 0,
      showResponseModal: false,
      selectedReview: null,
      responseText: "",
      profileForm: {
        name: "",
        phone: "",
        serviceArea: "",
        bio: "",
        hourlyRate: 0,
        skills: "",
      },
    };
  },

  computed: {
    currentUser() {
      return this.$store.getters.currentUser;
    },

    completedBookings() {
      return this.bookings.filter((b) => b.status === "completed");
    },
  },

  methods: {
    editService(index) {
      const service = this.currentUser.providerInfo.services[index];
      this.serviceForm = { ...service };
      this.editingService = index;
      this.showAddServiceModal = true;
    },

    async deleteService(index) {
      if (!confirm("Delete this service?")) return;

      const services = [...this.currentUser.providerInfo.services];
      services.splice(index, 1);

      await this.updateServices(services);
    },

    async saveService() {
      const services = this.currentUser.providerInfo.services || [];

      if (this.editingService !== null) {
        services[this.editingService] = this.serviceForm;
      } else {
        services.push(this.serviceForm);
      }

      await this.updateServices(services);
      this.showAddServiceModal = false;
      this.editingService = null;
      this.serviceForm = { name: "", description: "", price: 0 };
    },

    async updateServices(services) {
      try {
        await providerAPI.update(this.currentUser._id, {
          providerInfo: { services },
        });

        const response = await authAPI.getMe();
        this.$store.dispatch("login", {
          user: response.data,
          token: this.$store.getters.getToken,
        });

        alert("Services updated!");
      } catch (error) {
        alert("Failed to update services");
      }
    },
    getProfileImage(user) {
      if (user?.profileImage) {
        return user.profileImage; // Base64 string
      }
      return require("@/assets/images/icons/defaulticon.png");
    },

    async handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file (JPEG, PNG, GIF)");
        return;
      }

      this.uploadingImage = true;

      try {
        const response = await authAPI.uploadProfileImage(file);

        // Update store with new user data
        this.$store.dispatch("login", {
          user: response.data.user,
          token: this.$store.getters.getToken,
        });

        alert("Profile picture updated successfully!");
      } catch (error) {
        console.error("Upload error:", error);
        alert(error.response?.data?.message || "Failed to upload image");
      } finally {
        this.uploadingImage = false;
        event.target.value = "";
      }
    },
    async fetchBookings() {
      this.loading = true;
      try {
        const params = { role: "provider" };
        if (this.bookingFilter !== "all") {
          params.status = this.bookingFilter;
        }

        const response = await bookingAPI.getAll(params);
        this.bookings = response.data.bookings;

        // Calculate stats
        this.calculateStats();
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchReviews() {
      try {
        const response = await reviewAPI.getProviderReviews(
          this.currentUser._id
        );
        this.reviews = response.data.reviews;
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    },

    calculateStats() {
      this.stats.totalBookings = this.bookings.length;
      this.stats.completedJobs = this.completedBookings.length;
      this.stats.totalEarnings = this.completedBookings.reduce(
        (sum, b) => sum + b.service.price,
        0
      );

      // Calculate monthly earnings (current month)
      const now = new Date();
      this.monthlyEarnings = this.completedBookings
        .filter((b) => {
          const bookingDate = new Date(b.scheduledDate);
          return (
            bookingDate.getMonth() === now.getMonth() &&
            bookingDate.getFullYear() === now.getFullYear()
          );
        })
        .reduce((sum, b) => sum + b.service.price, 0);

      // Pending payout (held in escrow)
      this.pendingPayout = this.bookings
        .filter((b) => b.paymentStatus === "held-in-escrow")
        .reduce((sum, b) => sum + b.service.price, 0);
    },

    async confirmBooking(bookingId) {
      try {
        await bookingAPI.update(bookingId, { status: "confirmed" });
        await this.fetchBookings();
      } catch (error) {
        alert(error.response?.data?.message || "Failed to confirm booking");
      }
    },

    async startJob(bookingId) {
      try {
        await bookingAPI.update(bookingId, {
          status: "in-progress",
          paymentStatus: "held-in-escrow",
        });
        await this.fetchBookings();
      } catch (error) {
        alert(error.response?.data?.message || "Failed to start job");
      }
    },

    openChat(customerId) {
      this.$router.push(`/provider-messages/${customerId}`);
    },

    openResponseModal(review) {
      this.selectedReview = review;
      this.responseText = "";
      this.showResponseModal = true;
    },

    async submitResponse() {
      try {
        await reviewAPI.addResponse(this.selectedReview._id, {
          response: this.responseText,
        });
        this.showResponseModal = false;
        await this.fetchReviews();
      } catch (error) {
        alert("Failed to submit response");
      }
    },

    async updateProfile() {
      try {
        const skills = this.profileForm.skills.split(",").map((s) => s.trim());

        await providerAPI.update(this.currentUser._id, {
          name: this.profileForm.name,
          phone: this.profileForm.phone,
          providerInfo: {
            serviceArea: this.profileForm.serviceArea,
            bio: this.profileForm.bio,
            hourlyRate: this.profileForm.hourlyRate,
            skills: skills,
          },
        });

        alert("Profile updated successfully");

        // Refresh user data
        const response = await authAPI.getMe();
        this.$store.dispatch("login", {
          user: response.data,
          token: this.$store.getters.getToken,
        });
      } catch (error) {
        alert("Failed to update profile");
      }
    },

    handleLogout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },

  mounted() {
    if (!this.currentUser || this.currentUser.role !== "provider") {
      this.$router.push("/login");
      return;
    }

    // Pre-fill profile form
    this.profileForm.name = this.currentUser.name;
    this.profileForm.phone = this.currentUser.phone;
    this.profileForm.serviceArea =
      this.currentUser.providerInfo?.serviceArea || "Angeles City Center";
    this.profileForm.bio = this.currentUser.providerInfo?.bio || "";
    this.profileForm.hourlyRate =
      this.currentUser.providerInfo?.hourlyRate || 0;
    this.profileForm.skills =
      this.currentUser.providerInfo?.skills?.join(", ") || "";

    this.fetchBookings();
    this.fetchReviews();
  },
};
</script>

<style scoped>
.profile-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #667eea;
  background: #f7fafc;
}

.btn-change-photo {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.btn-change-photo:hover:not(:disabled) {
  background: #5a67d8;
}

.btn-change-photo:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.profile-info h2 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
}

.profile-info p {
  margin: 0.25rem 0;
  color: #718096;
}

.role-badge {
  display: inline-block;
  background: #a8a7a7;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 0.5rem;
}
.provider-dashboard {
  min-height: 100vh;
  background: #f5f5f5;
}

.provider-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e0e0e0;
  overflow-x: auto;
}

.tabs button {
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  cursor: pointer;
  color: #666;
  font-size: 1rem;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
  white-space: nowrap;
}

.tabs button.active {
  color: #667eea;
  border-bottom-color: #667eea;
  font-weight: 600;
}

.tab-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.booking-card {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border-left: 4px solid #667eea;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.confirmed {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.in-progress {
  background: #d4edda;
  color: #155724;
}

.status-badge.completed {
  background: #d4edda;
  color: #155724;
}

.booking-details p {
  margin: 0.5rem 0;
  color: #555;
}

.booking-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.booking-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-confirm {
  background: #28a745;
  color: white;
}

.btn-start {
  background: #007bff;
  color: white;
}

.btn-message {
  background: #6c757d;
  color: white;
}

.earnings-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.earning-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
}

.earning-card .amount {
  font-size: 2rem;
  font-weight: bold;
  margin-top: 0.5rem;
}

.earnings-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.earnings-table th,
.earnings-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.earnings-table th {
  background: #f5f5f5;
  font-weight: 600;
}

.review-card {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.provider-response {
  background: #e3f2fd;
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
}

.settings-form {
  max-width: 600px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.btn-save {
  background: #667eea;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
}

.modal textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin: 1rem 0;
}

.modal-actions {
  display: flex;
  gap: 1rem;
}

.modal-actions button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.btn-submit {
  background: #667eea;
  color: white;
}

.btn-cancel {
  background: #e0e0e0;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #999;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.filter-bar {
  margin-bottom: 1.5rem;
}

.filter-bar select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.note {
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 2rem;
}
</style>
