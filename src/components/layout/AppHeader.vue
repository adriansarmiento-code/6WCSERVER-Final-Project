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
        <nav class="nav">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/services" class="nav-link">Services</router-link>
          <router-link to="/about" class="nav-link">About</router-link>
          <router-link to="/login" class="nav-link nav-link-login"
            >Login</router-link
          >
          <router-link to="/signup" class="btn btn-header">Sign Up</router-link>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "AppHeader",
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
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.02);
}

.logo-image {
  width: 45px;
  height: 45px;
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

@media (max-width: 768px) {
  .logo-image {
    width: 40px;
    height: 40px;
  }

  .logo h1 {
    font-size: 1.5rem;
  }

  .nav {
    display: none;
  }
}
</style>
