<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Smartphone,
  Calendar,
  Megaphone,
  Gift,
  BookOpen,
  Bell,
  BarChart3,
  Settings,
  LogOut
} from "lucide-vue-next"

const router = useRouter()

const handleLogout = () => {
  localStorage.removeItem("isAdmin")
  router.replace("/login")
}
</script>

<template>
  <aside class="sidebar">

    <!-- LOGO -->
    <div class="logo">
      <div class="logo-box">A</div>
      <div>
        <p class="brand">Armztrong</p>
        <span class="sub">Admin Panel</span>
      </div>
    </div>

    <!-- NAV -->
    <nav class="nav">

      <p class="section">MAIN</p>

      <router-link to="/" class="link">
        <LayoutDashboard class="icon" />
        <span>Dashboard</span>
      </router-link>

      <router-link to="/members" class="link">
        <Users class="icon" />
        <span>Members</span>
      </router-link>

      <router-link to="/add-membership" class="link">
        <UserPlus class="icon" />
        <span>Whitelist</span>
      </router-link>

      <router-link to="/users" class="link">
        <Smartphone class="icon" />
        <span>App Users</span>
      </router-link>

      <p class="section">MANAGEMENT</p>

      <router-link to="/calendar" class="link">
        <Calendar class="icon" />
        <span>Calendar</span>
      </router-link>

      <router-link to="/community-posts" class="link">
        <Megaphone class="icon" />
        <span>Posts</span>
      </router-link>

      <router-link to="/reward-users" class="link">
        <Gift class="icon" />
        <span>Rewards</span>
      </router-link>

      <router-link to="/logbook" class="link">
        <BookOpen class="icon" />
        <span>Logbook</span>
      </router-link>

      <router-link to="/notifications" class="link">
        <Bell class="icon" />
        <span>Notifications</span>
      </router-link>

      <p class="section">OTHER</p>

      <router-link to="/reports" class="link">
        <BarChart3 class="icon" />
        <span>Reports</span>
      </router-link>

      <router-link to="/settings" class="link">
        <Settings class="icon" />
        <span>Settings</span>
      </router-link>

    </nav>

    <!-- LOGOUT -->
    <button class="logout" @click="handleLogout">
      <LogOut class="icon" />
      Logout
    </button>

  </aside>
</template>

<style scoped>
.sidebar {
  width: 250px; /* slightly slimmer */
  height: 100vh;
  padding: 18px;
  display: flex;
  flex-direction: column;

  background: linear-gradient(180deg, #0c0c0c, #111);
  border-right: 1px solid rgba(255,255,255,0.04);
}

/* LOGO */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}

.logo-box {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #F2613F, #9B3922);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: white;
}

.brand {
  color: white;
  font-weight: 600;
  font-size: 14px;
  margin: 0;
}

.sub {
  font-size: 10px;
  color: #666;
}

/* NAV */
.nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  padding-right: 4px;
}

/* 🔥 CUSTOM SCROLLBAR */
.nav::-webkit-scrollbar {
  width: 4px;
}

.nav::-webkit-scrollbar-track {
  background: transparent;
}

.nav::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 10px;
}

/* show only on hover */
.nav:hover::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.15);
}

/* Firefox */
.nav {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}
.nav:hover {
  scrollbar-color: rgba(255,255,255,0.15) transparent;
}

/* SECTION */
.section {
  font-size: 9px;
  color: #555;
  margin-top: 14px;
  margin-bottom: 4px;
  letter-spacing: 1px;
}

/* LINK */
.link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  color: #999;
  text-decoration: none;
  font-size: 13px;
  position: relative;
  transition: all 0.2s ease;
}

/* ICON */
.icon {
  width: 16px;
  height: 16px;
  opacity: 0.75;
}

/* HOVER */
.link:hover {
  background: rgba(255,255,255,0.04);
  color: #fff;
}

/* ACTIVE */
.link.router-link-exact-active {
  background: rgba(242, 97, 63, 0.12);
  color: #F2613F;
  font-weight: 500;
}

/* LEFT INDICATOR */
.link.router-link-exact-active::before {
  content: "";
  position: absolute;
  left: -10px;
  height: 50%;
  width: 3px;
  background: #F2613F;
  border-radius: 4px;
}

/* LOGOUT */
.logout {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 10px;
  border-radius: 10px;

  border: 1px solid rgba(255,255,255,0.06);
  background: transparent;
  color: #888;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
}

.logout:hover {
  background: rgba(242, 97, 63, 0.08);
  color: #F2613F;
  border-color: #F2613F;
}
</style>