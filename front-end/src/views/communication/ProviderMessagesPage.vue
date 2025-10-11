<template>
  <!-- Add v-if guard -->
  <div
    class="provider-messaging-page"
    v-if="currentUser && currentUser.role === 'provider'"
  >
    <!-- Provider Header (same as dashboard) -->
    <header class="provider-header">
      <div class="header-content">
        <div class="logo">Fixify Provider</div>
        <nav>
          <router-link to="/provider-dashboard" class="nav-link"
            >Dashboard</router-link
          >
          <router-link to="/provider-messages" class="nav-link active"
            >Messages</router-link
          >
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </nav>
      </div>
    </header>

    <div class="container">
      <div class="messaging-layout">
        <!-- Conversations List -->
        <aside class="conversations-sidebar">
          <div class="sidebar-header">
            <h2>Customer Messages</h2>
          </div>

          <div class="search-box">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search customers..."
            />
          </div>

          <div v-if="loading" class="loading">Loading...</div>

          <div v-else class="conversations-list">
            <div
              v-for="conversation in filteredConversations"
              :key="conversation.conversationId"
              :class="[
                'conversation-item',
                { active: selectedUserId === conversation.otherUser._id },
              ]"
              @click="selectConversation(conversation.otherUser._id)"
            >
              <img
                :src="getProfileImage(conversation.otherUser)"
                :alt="conversation.otherUser.name"
              />
              <div class="conversation-info">
                <div class="conversation-header">
                  <strong>{{ conversation.otherUser.name }}</strong>
                  <span class="time">{{
                    formatTime(conversation.lastMessageTime)
                  }}</span>
                </div>
                <p class="last-message">{{ conversation.lastMessage }}</p>
              </div>
              <span v-if="conversation.unreadCount > 0" class="unread-count">
                {{ conversation.unreadCount }}
              </span>
            </div>

            <div v-if="conversations.length === 0" class="empty-conversations">
              <p>No customer messages yet</p>
              <p class="hint">
                Customers will message you when they book your services
              </p>
            </div>
          </div>
        </aside>

        <!-- Chat Area -->
        <main class="chat-area">
          <div v-if="selectedUserId" class="chat-container">
            <div class="chat-header">
              <div class="chat-user-info">
                <img
                  :src="getProfileImage(selectedUser)"
                  :alt="selectedUser?.name"
                />
                <div>
                  <strong>{{ selectedUser?.name }}</strong>
                  <span class="status">Customer</span>
                </div>
              </div>
              <div class="chat-actions">
                <!-- Show customer's contact info instead of profile link -->
                <button
                  @click="showCustomerInfo"
                  class="btn btn-outline btn-small"
                >
                  Customer Info
                </button>
              </div>
            </div>

            <div class="messages-container" ref="messagesContainer">
              <div v-if="loadingMessages" class="loading">
                Loading messages...
              </div>

              <div
                v-for="msg in messages"
                :key="msg._id"
                :class="[
                  'message',
                  msg.sender._id === currentUser._id ? 'sent' : 'received',
                ]"
              >
                <div class="message-content">
                  <p>{{ msg.message }}</p>
                  <span class="message-time">{{
                    formatTime(msg.createdAt)
                  }}</span>
                </div>
              </div>
            </div>

            <div class="message-input-container">
              <form @submit.prevent="sendMessage" class="message-form">
                <input
                  type="text"
                  v-model="newMessage"
                  placeholder="Type your message to customer..."
                  class="message-input"
                />
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="!newMessage.trim() || sending"
                >
                  {{ sending ? "Sending..." : "Send" }}
                </button>
              </form>
            </div>
          </div>

          <div v-else class="empty-chat">
            <div class="empty-icon">💬</div>
            <h3>Select a customer</h3>
            <p>Choose a conversation to start messaging</p>
          </div>
        </main>
      </div>
    </div>

    <!-- Customer Info Modal -->
    <div
      v-if="showCustomerModal"
      class="modal-overlay"
      @click="showCustomerModal = false"
    >
      <div class="modal" @click.stop>
        <h3>Customer Information</h3>
        <div class="customer-info-content">
          <img
            :src="getProfileImage(selectedUser)"
            :alt="selectedUser?.name"
            class="customer-avatar"
          />
          <div class="info-item">
            <strong>Name:</strong>
            <span>{{ selectedUser?.name }}</span>
          </div>
          <div class="info-item">
            <strong>Email:</strong>
            <span>{{ selectedUser?.email || "Not provided" }}</span>
          </div>
          <div class="info-item">
            <strong>Phone:</strong>
            <span>{{ selectedUser?.phone || "Not provided" }}</span>
          </div>
        </div>
        <button @click="showCustomerModal = false" class="btn btn-primary">
          Close
        </button>
      </div>
    </div>
  </div>

  <div v-else class="loading-screen">
    <div class="loader">
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
import { messageAPI } from "@/services/api";

export default {
  name: "ProviderMessagesPage",
  data() {
    return {
      searchQuery: "",
      selectedUserId: null,
      newMessage: "",
      conversations: [],
      messages: [],
      loading: false,
      loadingMessages: false,
      sending: false,
      showCustomerModal: false,
    };
  },
  computed: {
    currentUser() {
      return this.$store.getters.currentUser;
    },

    filteredConversations() {
      if (!this.searchQuery) return this.conversations;
      return this.conversations.filter((c) =>
        c.otherUser.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },

    selectedUser() {
      const conversation = this.conversations.find(
        (c) => c.otherUser._id === this.selectedUserId
      );
      return conversation?.otherUser;
    },
  },
  methods: {
    async fetchConversations() {
      this.loading = true;
      try {
        const response = await messageAPI.getConversations();
        this.conversations = response.data.conversations;
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        this.loading = false;
      }
    },

    async selectConversation(userId) {
      this.selectedUserId = userId;
      await this.fetchMessages(userId);
    },

    async fetchMessages(userId) {
      this.loadingMessages = true;
      try {
        const response = await messageAPI.getMessages(userId);
        this.messages = response.data.messages;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        this.loadingMessages = false;
      }
    },

    async sendMessage() {
      if (!this.newMessage.trim()) return;

      this.sending = true;
      try {
        const response = await messageAPI.sendMessage(
          this.selectedUserId,
          this.newMessage
        );
        this.messages.push(response.data.message);
        this.newMessage = "";

        await this.fetchConversations();

        this.$nextTick(() => {
          this.scrollToBottom();
        });
      } catch (error) {
        console.error("Error sending message:", error);
        alert("Failed to send message");
      } finally {
        this.sending = false;
      }
    },

    showCustomerInfo() {
      this.showCustomerModal = true;
    },

    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },

    getProfileImage(user) {
      if (user?.profileImage) {
        return user.profileImage;
      }
      return require("@/assets/images/icons/defaulticon.png");
    },

    formatTime(date) {
      const now = new Date();
      const msgDate = new Date(date);
      const diffMs = now - msgDate;
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
      return msgDate.toLocaleDateString();
    },

    handleLogout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
  },

  beforeMount() {
    // Check if user is provider BEFORE mounting
    if (!this.currentUser || this.currentUser.role !== "provider") {
      this.$router.push("/login");
    }
  },

  async mounted() {
    // Check if user is provider
    if (!this.currentUser || this.currentUser.role !== "provider") {
      this.$router.push("/login");
      return;
    }

    await this.fetchConversations();

    const userId = this.$route.params.customerId;
    if (userId) {
      this.selectConversation(userId);
    }
  },
};
</script>

<style scoped>
/* Loading Screen */
.loading-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.loader {
  text-align: center;
  color: #667eea;
  font-size: 1.2rem;
}

.loader p {
  margin-top: 1rem;
}
.provider-messaging-page {
  min-height: 100vh;
  background: #f5f5f5;
}

/* Provider Header (same as dashboard) */
.provider-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.provider-header nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
}

.nav-link:hover,
.nav-link.active {
  color: white;
  text-decoration: underline;
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

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.messaging-layout {
  display: grid;
  grid-template-columns: 350px 1fr;
  height: calc(100vh - 250px);
  min-height: 600px;
  gap: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.conversations-sidebar {
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #2d3748;
}

.search-box {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.search-box input {
  width: 100%;
  padding: 10px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
}

.search-box input:focus {
  outline: none;
  border-color: #667eea;
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: background 0.2s ease;
  border-bottom: 1px solid #f7fafc;
  position: relative;
}

.conversation-item:hover {
  background: #f7fafc;
}

.conversation-item.active {
  background: #eef2ff;
  border-left: 3px solid #667eea;
}

.conversation-item img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.conversation-info {
  flex: 1;
  min-width: 0;
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.conversation-header strong {
  color: #2d3748;
  font-size: 1rem;
}

.time {
  color: #718096;
  font-size: 0.85rem;
}

.last-message {
  color: #718096;
  font-size: 0.9rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unread-count {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: #667eea;
  color: white;
  padding: 4px 10px;
  border-radius: 50%;
  font-size: 0.85rem;
  font-weight: 600;
  min-width: 24px;
  text-align: center;
}

.empty-conversations {
  text-align: center;
  padding: 3rem 2rem;
  color: #718096;
}

.empty-conversations .hint {
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.chat-area {
  display: flex;
  flex-direction: column;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-user-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.chat-user-info img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.chat-user-info strong {
  display: block;
  color: #2d3748;
  font-size: 1.1rem;
}

.status {
  color: #718096;
  font-size: 0.85rem;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  margin-bottom: 0.5rem;
}

.message.sent {
  justify-content: flex-end;
}

.message.received {
  justify-content: flex-start;
}

.message-content {
  max-width: 60%;
  padding: 12px 16px;
  border-radius: 12px;
  position: relative;
}

.message.sent .message-content {
  background: #667eea;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.received .message-content {
  background: #f7fafc;
  color: #2d3748;
  border-bottom-left-radius: 4px;
}

.message-content p {
  margin: 0 0 0.25rem 0;
  line-height: 1.5;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
}

.message-input-container {
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.message-form {
  display: flex;
  gap: 1rem;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
}

.message-input:focus {
  outline: none;
  border-color: #667eea;
}

.empty-chat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #718096;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-chat h3 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #718096;
}

/* Customer Info Modal */
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
  max-width: 400px;
  width: 90%;
}

.modal h3 {
  margin-top: 0;
  color: #2d3748;
}

.customer-info-content {
  margin: 1.5rem 0;
}

.customer-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: block;
  margin: 0 auto 1.5rem;
  object-fit: cover;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.info-item strong {
  color: #2d3748;
}

.info-item span {
  color: #718096;
}

@media (max-width: 1024px) {
  .messaging-layout {
    grid-template-columns: 1fr;
  }

  .conversations-sidebar {
    display: none;
  }
}
</style>
