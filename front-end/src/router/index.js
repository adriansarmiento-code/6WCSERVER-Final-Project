import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "@/views/LandingPage.vue";
import LoginPage from "@/views/auth/LoginPage.vue";
import SignUpPage from "@/views/auth/SignUpPage.vue";
import ServiceCategoriesPage from "@/views/service/ServiceCategoriesPage.vue";
import SearchResultsPage from "@/views/service/SearchResultsPage.vue";
import ProviderProfilePage from "@/views/service/ProviderProfilePage.vue";
import BookingPage from "@/views/booking/BookingPage.vue";
import DashboardPage from "@/views/user/DashboardPage.vue";
import PaymentSimulationPage from "@/views/payment/PaymentSimulationPage.vue";
import MessagingPage from "@/views/communication/MessagingPage.vue";
import AboutPage from "@/views/AboutPage.vue";
import AdminLoginPage from "@/views/admin/AdminLoginPage.vue";
import AdminDashboardPage from "@/views/admin/AdminDashboardPage.vue";
import store from "@/store";
import ContactPage from "@/views/ContactPage.vue";

const routes = [
  {
    path: "/",
    name: "LandingPage",
    component: LandingPage,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUpPage,
  },
  {
    path: "/services",
    name: "Services",
    component: ServiceCategoriesPage,
  },
  {
    path: "/search",
    name: "SearchResults",
    component: SearchResultsPage,
  },
  {
    path: "/provider/:id",
    name: "ProviderProfile",
    component: ProviderProfilePage,
  },
  {
    path: "/booking/:providerId",
    name: "Booking",
    component: BookingPage,
  },
  {
    path: "/provider-dashboard",
    name: "ProviderDashboard",
    component: () => import("@/views/user/ProviderDashboard.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/payment/:bookingId",
    name: "PaymentSimulation",
    component: PaymentSimulationPage,
  },
  {
    path: "/messages/:conversationId?",
    name: "Messages",
    component: MessagingPage,
  },
  {
    path: "/about",
    name: "About",
    component: AboutPage,
  },
  // Admin Routes
  {
    path: "/admin/login",
    name: "AdminLogin",
    component: AdminLoginPage,
  },
  {
    path: "/contact",
    name: "Contact",
    component: ContactPage,
  },
  {
    path: "/admin/dashboard",
    name: "AdminDashboard",
    component: AdminDashboardPage,
    beforeEnter: (to, from, next) => {
      // Simple auth check - in production, verify with backend
      if (store.getters.isAdmin) {
        next();
      } else {
        next("/admin/login");
      }
    },
  },

  {
    path: "/review/:bookingId",
    name: "ReviewPage",
    component: () => import("@/views/review/ReviewPage.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  // Add this scrollBehavior function
  scrollBehavior(to, from, savedPosition) {
    // If there's a saved position (browser back/forward), use it
    if (savedPosition) {
      return savedPosition;
    }
    // If navigating to a hash/anchor (e.g., #section), scroll to it
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    }
    // Otherwise, always scroll to top
    return { top: 0, behavior: "smooth" };
  },
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = store.getters.isAuthenticated;

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login if trying to access protected route
    next("/login");
  } else {
    next();
  }
});

export default router;
