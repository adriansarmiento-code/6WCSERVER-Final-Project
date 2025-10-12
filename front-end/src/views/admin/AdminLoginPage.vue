<template>
  <div class="admin-login-page">
    <div class="admin-login-container">
      <div class="admin-login-card">
        <div class="admin-header">
          <div class="admin-icon">⚙️</div>
          <h1>Admin Portal</h1>
          <p>Fixify Administration</p>
        </div>

        <form @submit.prevent="handleAdminLogin" class="admin-login-form">
          <div class="form-group">
            <label for="adminEmail">Admin Email</label>
            <input
              type="email"
              id="adminEmail"
              v-model="credentials.email"
              placeholder="admin@fixify.com"
              required
            />
          </div>

          <div class="form-group">
            <label for="adminPassword">Password</label>
            <input
              type="password"
              id="adminPassword"
              v-model="credentials.password"
              placeholder="Enter admin password"
              required
            />
          </div>

          <button
            type="submit"
            class="btn btn-admin btn-full"
            :disabled="isLoading"
          >
            {{ isLoading ? "Logging in..." : "Admin Login" }}
          </button>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </form>

        <div class="demo-credentials">
          <strong>Demo Credentials:</strong>
          <p>Email: admin@fixify.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authAPI } from "@/services/api";

export default {
  name: "AdminLoginPage",
  data() {
    return {
      credentials: {
        email: "",
        password: "",
      },
      isLoading: false,
      errorMessage: "",
    };
  },
  methods: {
    async handleAdminLogin() {
      this.errorMessage = "";
      this.isLoading = true;

      try {
        // Real API call
        const response = await authAPI.login({
          email: this.credentials.email,
          password: this.credentials.password,
        });

        // Check if user is admin
        if (response.data.role !== "admin") {
          this.errorMessage = "Access denied. Admin only.";
          return;
        }

        // Store admin session
        this.$store.dispatch("adminLogin", {
          user: response.data,
          token: response.data.token,
        });

        // Redirect to admin dashboard
        this.$router.push("/admin/dashboard");
      } catch (error) {
        this.errorMessage =
          error.response?.data?.message || "Invalid admin credentials";
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.admin-login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.admin-login-container {
  width: 100%;
  max-width: 450px;
}

.admin-login-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 3rem;
}

.admin-header {
  text-align: center;
  margin-bottom: 2rem;
}

.admin-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.admin-header h1 {
  font-size: 2rem;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.admin-header p {
  color: #718096;
}

.admin-login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;
}

.form-group input {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #1a202c;
}

.btn-admin {
  background-color: #1a202c;
  color: white;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-admin:hover {
  background-color: #2d3748;
}

.btn-admin:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-full {
  width: 100%;
}

.error-message {
  background-color: #fed7d7;
  color: #c53030;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.95rem;
  text-align: center;
}

.demo-credentials {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 8px;
  text-align: center;
}

.demo-credentials strong {
  display: block;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.demo-credentials p {
  color: #4a5568;
  font-size: 0.9rem;
  margin: 0.25rem 0;
}
</style>
