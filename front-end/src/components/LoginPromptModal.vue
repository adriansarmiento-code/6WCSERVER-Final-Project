<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <h2>Login Required</h2>
      <p>You need to be logged in to book services.</p>
      <div class="modal-actions">
        <router-link to="/login" class="btn btn-primary"> Login </router-link>
        <router-link to="/signup" class="btn btn-secondary">
          Sign Up
        </router-link>
        <button @click="$emit('close')" class="btn btn-outline">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginPromptModal",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["close"],
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.modal-content h2 {
  color: #2d3748;
  margin-bottom: 1rem;
}

.modal-content p {
  color: #718096;
  margin-bottom: 2rem;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-outline {
  background: transparent;
  color: #718096;
  border: 2px solid #e2e8f0;
}
</style>
