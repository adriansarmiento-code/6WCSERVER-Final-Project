<template>
  <div class="notification-bell" @click.stop>
    <button @click.stop="toggleDropdown" class="bell-button" type="button">
      🔔
      <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
    </button>

    <teleport to="body">
      <div v-if="showDropdown" class="notification-dropdown" @click.stop>
        <div class="dropdown-header">
          <h3>Notifications</h3>
          <button
            v-if="notifications.length > 0"
            @click="markAllRead"
            class="mark-all-read"
            type="button"
          >
            Mark all as read
          </button>
        </div>

        <div class="notifications-list">
          <div
            v-for="notification in notifications"
            :key="notification._id"
            :class="['notification-item', { unread: !notification.read }]"
            @click="handleNotificationClick(notification)"
          >
            <div class="notification-icon">
              {{ getNotificationIcon(notification.type) }}
            </div>
            <div class="notification-content">
              <div class="notification-title">{{ notification.title }}</div>
              <div class="notification-message">{{ notification.message }}</div>
              <div class="notification-time">
                {{ formatTime(notification.createdAt) }}
              </div>
            </div>
            <button
              @click.stop="deleteNotification(notification._id)"
              class="delete-btn"
              type="button"
            >
              ×
            </button>
          </div>

          <div v-if="notifications.length === 0" class="empty-state">
            <p>No notifications yet</p>
          </div>
        </div>

        <div v-if="notifications.length > 0" class="dropdown-footer">
          <router-link to="/notifications" @click="closeDropdown"></router-link>
        </div>
      </div>

      <!-- Backdrop overlay -->
      <div
        v-if="showDropdown"
        class="notification-backdrop"
        @click="closeDropdown"
      ></div>
    </teleport>
  </div>
</template>

<script>
import { notificationAPI } from "@/services/api";

export default {
  name: "NotificationBell",
  data() {
    return {
      showDropdown: false,
      notifications: [],
      unreadCount: 0,
      loading: false,
    };
  },
  methods: {
    async fetchNotifications() {
      console.log("📥 Fetching notifications...");
      this.loading = true;
      try {
        const response = await notificationAPI.getAll({ limit: 10 });
        console.log("✅ Notifications received:", response.data);
        this.notifications = response.data.notifications;
        this.unreadCount = response.data.unreadCount;
      } catch (error) {
        console.error("❌ Error fetching notifications:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchUnreadCount() {
      try {
        const response = await notificationAPI.getUnreadCount();
        console.log("Unread count:", response.data.unreadCount);
        this.unreadCount = response.data.unreadCount;
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    },

    toggleDropdown(event) {
      console.log("🔔 Bell button clicked!", event);
      console.log("Current showDropdown:", this.showDropdown);

      event.preventDefault();
      event.stopPropagation();

      this.showDropdown = !this.showDropdown;

      console.log("New showDropdown:", this.showDropdown);

      if (this.showDropdown) {
        this.fetchNotifications();
      }
    },

    closeDropdown() {
      console.log("Closing dropdown");
      this.showDropdown = false;
    },

    async handleNotificationClick(notification) {
      if (!notification.read) {
        await this.markAsRead(notification._id);
      }

      if (notification.link) {
        this.$router.push(notification.link);
        this.closeDropdown();
      }
    },

    async markAsRead(id) {
      try {
        await notificationAPI.markAsRead(id);
        await this.fetchNotifications();
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    },

    async markAllRead() {
      try {
        await notificationAPI.markAllAsRead();
        await this.fetchNotifications();
      } catch (error) {
        console.error("Error marking all as read:", error);
      }
    },

    async deleteNotification(id) {
      try {
        await notificationAPI.delete(id);
        await this.fetchNotifications();
      } catch (error) {
        console.error("Error deleting notification:", error);
      }
    },

    getNotificationIcon(type) {
      const icons = {
        booking: "📅",
        message: "💬",
        review: "⭐",
        payment: "💰",
        system: "🔔",
      };
      return icons[type] || "🔔";
    },

    formatTime(date) {
      const now = new Date();
      const notifDate = new Date(date);
      const diffMs = now - notifDate;
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;

      const diffDays = Math.floor(diffMins / 1440);
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;

      return notifDate.toLocaleDateString();
    },
  },

  mounted() {
    console.log("🔔 NotificationBell mounted!");
    console.log("Is authenticated:", this.$store.getters.isAuthenticated);

    if (this.$store.getters.isAuthenticated) {
      this.fetchUnreadCount();

      this.pollInterval = setInterval(() => {
        this.fetchUnreadCount();
      }, 30000);
    }
  },

  beforeUnmount() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  },
};
</script>

<style scoped>
.notification-bell {
  position: relative;
  display: inline-block;
}

.bell-button {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  position: relative;
  padding: 0.5rem;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  z-index: 10001;
}

.bell-button:hover {
  transform: scale(1.1);
}

.badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #ef4444;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

/* Notification dropdown - using fixed positioning */
.notification-dropdown {
  position: fixed;
  top: 70px;
  right: 20px;
  width: 400px;
  max-height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 10002;
  overflow: hidden;
}

.notification-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  z-index: 10001;
}

/* Rest of your existing styles */
.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.dropdown-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #2d3748;
}

.mark-all-read {
  background: none;
  border: none;
  color: #667eea;
  font-size: 0.85rem;
  cursor: pointer;
  font-weight: 600;
}

.mark-all-read:hover {
  text-decoration: underline;
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f7fafc;
  cursor: pointer;
  transition: background 0.2s;
  position: relative;
}

.notification-item:hover {
  background: #f7fafc;
}

.notification-item.unread {
  background: #eef2ff;
}

.notification-item.unread::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #667eea;
}

.notification-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.notification-message {
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.notification-time {
  color: #94a3b8;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.delete-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  line-height: 1;
  transition: color 0.2s;
}

.delete-btn:hover {
  color: #ef4444;
}

.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  color: #94a3b8;
}

.dropdown-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  text-align: center;
}

.dropdown-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}

.dropdown-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .notification-dropdown {
    left: 10px;
    right: 10px;
    width: auto;
    top: 60px;
  }
}
</style>
