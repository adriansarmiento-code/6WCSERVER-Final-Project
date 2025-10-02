<template>
  <div class="messaging-page">
    <AppHeader />

    <div class="container">
      <div class="messaging-layout">
        <!-- Conversations List -->
        <aside class="conversations-sidebar">
          <div class="sidebar-header">
            <h2>Messages</h2>
            <button class="btn btn-primary btn-small">New Message</button>
          </div>

          <div class="search-box">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search conversations..."
            />
          </div>

          <div class="conversations-list">
            <div
              v-for="conversation in filteredConversations"
              :key="conversation.id"
              :class="[
                'conversation-item',
                { active: selectedConversation === conversation.id },
              ]"
              @click="selectConversation(conversation.id)"
            >
              <img :src="conversation.avatar" :alt="conversation.name" />
              <div class="conversation-info">
                <div class="conversation-header">
                  <strong>{{ conversation.name }}</strong>
                  <span class="time">{{ conversation.lastMessageTime }}</span>
                </div>
                <p class="last-message">{{ conversation.lastMessage }}</p>
              </div>
              <span v-if="conversation.unread" class="unread-count">
                {{ conversation.unread }}
              </span>
            </div>
          </div>
        </aside>

        <!-- Chat Area -->
        <main class="chat-area">
          <div v-if="selectedConversation" class="chat-container">
            <div class="chat-header">
              <div class="chat-user-info">
                <img :src="currentChat.avatar" :alt="currentChat.name" />
                <div>
                  <strong>{{ currentChat.name }}</strong>
                  <span class="status">{{ currentChat.status }}</span>
                </div>
              </div>
              <div class="chat-actions">
                <button class="btn btn-outline btn-small">View Profile</button>
              </div>
            </div>

            <div class="messages-container" ref="messagesContainer">
              <div
                v-for="message in currentChat.messages"
                :key="message.id"
                :class="[
                  'message',
                  message.sender === 'me' ? 'sent' : 'received',
                ]"
              >
                <div class="message-content">
                  <p>{{ message.text }}</p>
                  <span class="message-time">{{ message.time }}</span>
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
                  :disabled="!newMessage.trim()"
                >
                  Send
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
</template>

<script>
import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";

export default {
  name: "MessagingPage",
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      searchQuery: "",
      selectedConversation: null,
      newMessage: "",
      conversations: [
        {
          id: 1,
          name: "Juan dela Cruz",
          avatar: "https://via.placeholder.com/50x50?text=JD",
          lastMessage: "I'll arrive at 2 PM as scheduled",
          lastMessageTime: "10m ago",
          unread: 2,
          status: "Active now",
          messages: [
            {
              id: 1,
              sender: "them",
              text: "Hello! I received your booking request.",
              time: "2:30 PM",
            },
            {
              id: 2,
              sender: "me",
              text: "Great! Can you confirm the scheduled time?",
              time: "2:32 PM",
            },
            {
              id: 3,
              sender: "them",
              text: "I'll arrive at 2 PM as scheduled",
              time: "2:35 PM",
            },
          ],
        },
        {
          id: 2,
          name: "Maria Santos",
          avatar: "https://via.placeholder.com/50x50?text=MS",
          lastMessage: "Thank you for the booking!",
          lastMessageTime: "2h ago",
          unread: 0,
          status: "Last seen 1h ago",
          messages: [
            {
              id: 1,
              sender: "them",
              text: "Thank you for the booking!",
              time: "12:00 PM",
            },
            {
              id: 2,
              sender: "me",
              text: "You're welcome! Looking forward to the service.",
              time: "12:05 PM",
            },
          ],
        },
      ],
    };
  },
  computed: {
    filteredConversations() {
      if (!this.searchQuery) return this.conversations;
      return this.conversations.filter((c) =>
        c.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    currentChat() {
      return this.conversations.find((c) => c.id === this.selectedConversation);
    },
  },
  methods: {
    selectConversation(id) {
      this.selectedConversation = id;
      // Mark as read
      const conversation = this.conversations.find((c) => c.id === id);
      if (conversation) {
        conversation.unread = 0;
      }
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    sendMessage() {
      if (!this.newMessage.trim()) return;

      const conversation = this.conversations.find(
        (c) => c.id === this.selectedConversation
      );
      if (conversation) {
        const now = new Date();
        const time = now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        });

        conversation.messages.push({
          id: Date.now(),
          sender: "me",
          text: this.newMessage,
          time: time,
        });

        conversation.lastMessage = this.newMessage;
        conversation.lastMessageTime = "Just now";

        this.newMessage = "";
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
  },
  mounted() {
    const conversationId = this.$route.params.conversationId;
    if (conversationId) {
      this.selectConversation(parseInt(conversationId));
    }
  },
};
</script>

<style scoped>
.messaging-layout {
  display: grid;
  grid-template-columns: 350px 1fr;
  height: calc(100vh - 200px);
  min-height: 600px;
  gap: 0;
  margin: 2rem 0;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.empty-chat p {
  font-size: 1rem;
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
