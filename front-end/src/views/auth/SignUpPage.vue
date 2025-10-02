<template>
  <div class="auth-page">
    <AppHeader />
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Create Your Account</h1>
          <p>Join Fixify and connect with trusted service providers</p>
        </div>

        <div class="role-selector">
          <button
            type="button"
            :class="['role-btn', { active: userType === 'customer' }]"
            @click="userType = 'customer'"
          >
            I need services
          </button>
          <button
            type="button"
            :class="['role-btn', { active: userType === 'provider' }]"
            @click="userType = 'provider'"
          >
            I'm a service provider
          </button>
        </div>

        <form @submit.prevent="handleSignUp" class="auth-form">
          <div class="form-group">
            <label for="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              v-model="formData.fullName"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              v-model="formData.phone"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              v-model="formData.password"
              placeholder="Create a password"
              required
              minlength="8"
            />
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="formData.confirmPassword"
              placeholder="Confirm your password"
              required
            />
          </div>

          <div v-if="userType === 'provider'" class="provider-fields">
            <div class="form-group">
              <label for="category">Service Category</label>
              <select id="category" v-model="formData.category" required>
                <option value="">Select a category</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="cleaning">Cleaning</option>
                <option value="carpentry">Carpentry</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="form-group">
              <label for="experience">Years of Experience</label>
              <input
                type="number"
                id="experience"
                v-model="formData.experience"
                placeholder="Years of experience"
                min="0"
                required
              />
            </div>
          </div>

          <label class="checkbox-label">
            <input type="checkbox" v-model="agreedToTerms" required />
            <span>
              I agree to the
              <router-link to="/terms">Terms of Service</router-link> and
              <router-link to="/privacy">Privacy Policy</router-link>
            </span>
          </label>

          <button
            type="submit"
            class="btn btn-primary btn-full"
            :disabled="isLoading"
          >
            {{ isLoading ? "Creating Account..." : "Create Account" }}
          </button>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </form>

        <div class="auth-footer">
          <p>
            Already have an account?
            <router-link to="/login">Log in</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from "@/components/layout/AppHeader.vue";

export default {
  name: "SignUpPage",
  components: {
    AppHeader,
  },
  data() {
    return {
      userType: "customer",
      formData: {
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        category: "",
        experience: "",
      },
      agreedToTerms: false,
      isLoading: false,
      errorMessage: "",
    };
  },
  methods: {
    async handleSignUp() {
      this.errorMessage = "";

      // Validate passwords match
      if (this.formData.password !== this.formData.confirmPassword) {
        this.errorMessage = "Passwords do not match";
        return;
      }

      // Validate password strength
      if (this.formData.password.length < 8) {
        this.errorMessage = "Password must be at least 8 characters";
        return;
      }

      this.isLoading = true;

      try {
        // Simulate API call (replace with actual registration later)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Store user in Vuex
        this.$store.dispatch("login", {
          email: this.formData.email,
          name: this.formData.fullName,
          userType: this.userType,
        });

        // Redirect based on user type
        if (this.userType === "provider") {
          this.$router.push("/provider-profile-setup");
        } else {
          this.$router.push("/dashboard");
        }
      } catch (error) {
        this.errorMessage = "An error occurred. Please try again.";
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  min-height: calc(100vh - 80px);
}

.auth-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  padding: 3rem;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h1 {
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: #718096;
  font-size: 1rem;
}

.role-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.role-btn {
  padding: 12px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  color: #4a5568;
  transition: all 0.3s ease;
}

.role-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.role-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.auth-form {
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

.form-group input,
.form-group select {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.provider-fields {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 8px;
  margin: -0.5rem 0;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: #4a5568;
  line-height: 1.5;
}

.checkbox-label a {
  color: #667eea;
  text-decoration: none;
}

.checkbox-label a:hover {
  text-decoration: underline;
}

.btn-full {
  width: 100%;
  padding: 14px;
  font-size: 1.05rem;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background-color: #fed7d7;
  color: #c53030;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
}

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.auth-footer p {
  color: #718096;
  font-size: 0.95rem;
}

.auth-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.auth-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 2rem 1.5rem;
  }

  .auth-header h1 {
    font-size: 1.75rem;
  }

  .role-selector {
    grid-template-columns: 1fr;
  }
}
</style>
