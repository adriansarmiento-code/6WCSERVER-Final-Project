<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Fixify</h3>
          <p>Connecting you with trusted local service providers</p>
        </div>
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><router-link to="/services">Services</router-link></li>
            <li><router-link to="/about">About Us</router-link></li>
            <li><router-link to="/contact">Contact</router-link></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>For Providers</h4>
          <ul>
            <li>
              <router-link to="/signup?type=provider"
                >Become a Provider</router-link
              >
            </li>
            <li>
              <router-link to="/provider-guidelines">Guidelines</router-link>
            </li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Legal</h4>
          <ul>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 Fixify. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "AppFooter",
};
</script>

<style scoped>
.footer {
  background-color: #2d3748;
  color: white;
  padding: 3rem 0 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.footer-section h4 {
  margin-bottom: 1rem;
  font-size: 1.125rem;
}

.footer-section p {
  color: #a0aec0;
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: #a0aec0;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: white;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #4a5568;
}

.footer-bottom p {
  color: #a0aec0;
  margin: 0;
}
</style>
