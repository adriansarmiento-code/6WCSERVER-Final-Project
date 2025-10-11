<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <router-link to="/" class="logo">
          <img
            src="@/assets/images/logo.png"
            alt="Fixify Logo"
            class="logo-image"
          />
          <h1>Fixify</h1>
        </router-link>

        <!-- Hamburger Button (Mobile Only) -->
        <button
          class="hamburger"
          @click="toggleMenu"
          :class="{ active: isMenuOpen }"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <!-- Navigation Menu -->
        <nav class="nav" :class="{ open: isMenuOpen }">
          <router-link to="/" class="nav-link" @click="closeMenu"
            >Home</router-link
          >
          <router-link to="/services" class="nav-link" @click="closeMenu"
            >Services</router-link
          >
          <router-link to="/about" class="nav-link" @click="closeMenu"
            >About</router-link
          >

          <!-- Show different links based on auth status -->
          <template v-if="!isAuthenticated">
            <router-link
              to="/login"
              class="nav-link nav-link-login"
              @click="closeMenu"
              >Login</router-link
            >
            <router-link to="/signup" class="btn btn-header" @click="closeMenu"
              >Sign Up</router-link
            >
          </template>

          <template v-else>
            <router-link
              :to="
                currentUser?.role === 'provider'
                  ? '/provider-dashboard'
                  : '/dashboard'
              "
              class="nav-link"
            >
              Dashboard
            </router-link>

            <!-- Add Messages link -->
            <router-link
              :to="
                currentUser?.role === 'provider'
                  ? '/provider-messages'
                  : '/messages'
              "
              class="nav-link"
            >
              Messages
            </router-link>

            <button @click="handleLogout" class="btn btn-header btn-logout">
              Logout
            </button>
          </template>
        </nav>
      </div>
    </div>

    <!-- Mobile Overlay -->
    <div v-if="isMenuOpen" class="overlay" @click="closeMenu"></div>
  </header>
</template>

<script>
export default {
  name: "AppHeader",
  data() {
    return {
      isMenuOpen: false,
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    currentUser() {
      return this.$store.getters.currentUser;
    },
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      if (this.isMenuOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    },
    closeMenu() {
      this.isMenuOpen = false;
      document.body.style.overflow = "";
    },
    handleLogout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
  },
  beforeUnmount() {
    document.body.style.overflow = "";
  },
};
</script>

<style scoped>
.header {
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}
.btn-logout {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 10px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  background-color: #5a67d8;
  transform: translateY(-2px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  position: relative;
}

.logo {
  text-decoration: none;
  z-index: 1001;
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-image {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.logo h1 {
  margin: 0;
  font-size: 1.8rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Hamburger Menu Button */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 25px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.hamburger span {
  width: 100%;
  height: 3px;
  background: #2d3748;
  border-radius: 10px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.hamburger.active span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

/* Navigation */
.nav {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  color: #2d3748;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #667eea;
}

.nav-link-login {
  color: #667eea;
}

.btn-header {
  background-color: #667eea;
  color: white;
  padding: 10px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-header:hover {
  background-color: #5a67d8;
  transform: translateY(-2px);
}

/* Mobile Overlay */
.overlay {
  display: none;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  .logo-image {
    width: 35px;
    height: 35px;
  }

  .logo h1 {
    font-size: 1.5rem;
  }

  .nav {
    position: fixed;
    top: 0;
    right: -100%;
    height: 100vh;
    width: 280px;
    background: white;
    flex-direction: column;
    justify-content: flex-start;
    padding: 6rem 2rem 2rem;
    gap: 1.5rem;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    transition: right 0.3s ease;
    z-index: 1000;
  }

  .nav.open {
    right: 0;
  }

  .nav-link,
  .btn-header {
    width: 100%;
    text-align: center;
    padding: 12px 24px;
    font-size: 1.1rem;
  }

  .btn-header {
    margin-top: 1rem;
  }

  .overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}

/* Tablet Styles */
@media (max-width: 1024px) and (min-width: 769px) {
  .nav {
    gap: 1rem;
  }

  .nav-link {
    font-size: 0.95rem;
  }

  .btn-header {
    padding: 8px 18px;
    font-size: 0.95rem;
  }
}
</style>
