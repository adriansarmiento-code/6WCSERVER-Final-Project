// src/router/index.js
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
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardPage,
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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
