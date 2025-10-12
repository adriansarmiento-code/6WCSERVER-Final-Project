<template>
  <div class="messaging-page" v-if="currentUser">
    <AppHeader />

    <div class="container">
      <div class="messaging-layout">
        <!-- Conversations List -->
        <aside class="conversations-sidebar">
          <div class="sidebar-header">
            <h2>Messages</h2>
          </div>

          <div class="search-box">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search conversations..."
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
              <p>No conversations yet</p>
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
                  <span class="status">Active</span>
                </div>
              </div>
              <div class="chat-actions">
                <router-link
                  :to="`/provider/${selectedUserId}`"
                  class="btn btn-outline btn-small"
                >
                  View Profile
                </router-link>
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
                  placeholder="Type your message..."
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
            <h3>Select a conversation</h3>
            <p>Choose a conversation from the list to start messaging</p>
          </div>
        </main>
      </div>
    </div>

    <AppFooter />
  </div>

  <div v-else class="loading-screen">
    <div class="loader">
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import { messageAPI } from "@/services/api";

export default {
  name: "MessagingPage",
  components: {
    AppHeader,
    AppFooter,
  },
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

        // Update conversation list
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
  },
  beforeMount() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
  },

  async mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
      return;
    }
    await this.fetchConversations();

    // If coming from a link with userId param
    const userId = this.$route.params.conversationId;
    if (userId) {
      this.selectConversation(userId);
    }
  },
};
</script>

<style scoped>
.loading-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
}

.loader {
  text-align: center;
  color: #667eea;
  font-size: 1.2rem;
}

.loader p {
  margin-top: 1rem;
}

.messaging-layout {
  display: grid;
  grid-template-columns: 380px 1fr;
  height: calc(100vh - 140px);
  min-height: 700px;
  max-height: 800px;
  gap: 0;
  margin: 1.5rem 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #f1f5f9;
}

.conversations-sidebar {
  border-right: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  background: #fafbfc;
  overflow: hidden;
}

.sidebar-header {
  padding: 1.75rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  flex-shrink: 0;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #2d3748;
  font-weight: 600;
}

.search-box {
  padding: 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  background: white;
  flex-shrink: 0;
}

.search-box input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: #f8fafc;
}

.search-box input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: white;
}

/* Custom scrollbar for conversations */
.conversations-list::-webkit-scrollbar {
  width: 6px;
}

.conversations-list::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.conversations-list::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.conversations-list::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

.conversation-item {
  display: flex;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid #f8fafc;
  position: relative;
  background: white;
}

.conversation-item:hover {
  background: #f8fafc;
  transform: translateX(2px);
}

.conversation-item.active {
  background: linear-gradient(135deg, #f0f4ff, #e6f0ff);
  border-left: 4px solid #667eea;
}

.conversation-item img {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e2e8f0;
  transition: border-color 0.3s ease;
  flex-shrink: 0;
}

.conversation-item.active img,
.conversation-item:hover img {
  border-color: #667eea;
}

.conversation-info {
  flex: 1;
  min-width: 0;
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.conversation-header strong {
  color: #2d3748;
  font-size: 1.05rem;
  font-weight: 600;
}

.time {
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
}

.last-message {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.unread-count {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 0.4rem 0.75rem;
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: 700;
  min-width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
}

.empty-conversations {
  text-align: center;
  padding: 3rem 2rem;
  color: #94a3b8;
}

.chat-area {
  display: flex;
  flex-direction: column;
  background: white;
  overflow: hidden;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.chat-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  flex-shrink: 0;
}

.chat-user-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.chat-user-info img {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e2e8f0;
}

.chat-user-info strong {
  display: block;
  color: #2d3748;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.status {
  color: #10b981;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status::before {
  content: "";
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  display: inline-block;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

/* Custom scrollbar for messages */
.messages-container::-webkit-scrollbar {
  width: 8px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

.message {
  display: flex;
  margin-bottom: 0.5rem;
  animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.sent {
  justify-content: flex-end;
}

.message.received {
  justify-content: flex-start;
}

.message-content {
  max-width: 70%;
  padding: 1rem 1.25rem;
  border-radius: 18px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  line-height: 1.4;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.message.sent .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 6px;
}

.message.received .message-content {
  background: white;
  color: #2d3748;
  border: 1px solid #f1f5f9;
  border-bottom-left-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.message-content p {
  margin: 0 0 0.5rem 0;
  word-wrap: break-word;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.8;
  display: block;
  text-align: right;
}

.message.received .message-time {
  text-align: left;
  color: #94a3b8;
}

.message-input-container {
  padding: 1.5rem 2rem;
  border-top: 1px solid #f1f5f9;
  background: white;
  flex-shrink: 0;
}

.message-form {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.message-input {
  flex: 1;
  padding: 1rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  resize: none;
  min-height: 52px;
  max-height: 120px;
  transition: all 0.3s ease;
  background: #f8fafc;
  line-height: 1.4;
}

.message-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.message-input::placeholder {
  color: #94a3b8;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1.75rem;
  border: 2px solid;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  line-height: 1;
  white-space: nowrap;
}

.btn-primary {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5a67d8;
  border-color: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
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

.btn-outline:hover {
  border-color: #667eea;
  color: #667eea;
  background: #f8fafc;
  transform: translateY(-2px);
}

.btn-small {
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
}

.empty-chat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94a3b8;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.6;
}

.empty-chat h3 {
  font-size: 1.5rem;
  color: #475569;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.empty-chat p {
  font-size: 1rem;
  text-align: center;
  max-width: 300px;
  line-height: 1.5;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-size: 1rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .messaging-layout {
    grid-template-columns: 1fr;
    height: calc(100vh - 120px);
  }

  .conversations-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .messaging-layout {
    margin: 1rem 0;
    border-radius: 12px;
    height: calc(100vh - 100px);
  }

  .chat-header {
    padding: 1.25rem;
  }

  .messages-container {
    padding: 1.5rem;
  }

  .message-input-container {
    padding: 1.25rem;
  }

  .message-form {
    gap: 0.75rem;
  }

  .message-content {
    max-width: 85%;
  }

  .btn {
    padding: 0.75rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 0.75rem;
  }

  .messaging-layout {
    margin: 0.5rem 0;
    border-radius: 8px;
  }

  .chat-header {
    padding: 1rem;
  }

  .messages-container {
    padding: 1rem;
  }

  .message-input-container {
    padding: 1rem;
  }

  .message-form {
    flex-direction: column;
    gap: 0.75rem;
  }

  .message-input {
    min-height: 48px;
  }

  .btn {
    width: 100%;
  }
}
</style>
