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
  LogOut,
  Shield
} from "lucide-vue-next"

const router = useRouter()
const handleLogout = () => {
  localStorage.removeItem("superadminToken")
  localStorage.removeItem("superadminCredentials")
  router.replace("/login")
}
</script>

<template>
  <aside class="sidebar">

    <!-- TOP ACCENT BAR -->
    <div class="top-bar" />

    <!-- LOGO -->
    <div class="logo">
      <div class="logo-box">A</div>
      <div>
        <p class="brand">Armztrong</p>
        <span class="sub">Management System</span>
      </div>
    </div>

    <!-- SUPERADMIN ROLE BADGE -->
    <div class="role-badge">
      <div class="shield-wrap">
        <Shield class="shield-icon" />
      </div>
      <div class="role-info">
        <p class="role-name">Super Admin</p>
        <p class="role-desc">Full system access</p>
      </div>
      <span class="tier-pill">TIER 1</span>
    </div>

    <nav class="nav">

      <p class="section">MAIN</p>

      <router-link to="/dashboard" class="link">
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

      <router-link to="/edit-admins" class="link">
        <LayoutDashboard class="icon" />
        <span>Manage Admins</span>
        <span class="sa-badge">SA</span>
      </router-link>

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

    <!-- FOOTER -->
    <div class="footer">
      <div class="user-row">
        <div class="avatar">SA</div>
        <div>
          <p class="user-name">Super Admin</p>
          <p class="user-status"><span class="dot" />Active session</p>
        </div>
      </div>
      <button class="logout" @click="handleLogout">
        <LogOut class="icon" />
        Logout
      </button>
    </div>

  </aside>
</template>

<style scoped>
/* BASE */
.sidebar {
  width: 250px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0a0a0a;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

/* TOP ACCENT BAR */
.top-bar {
  height: 3px;
  flex-shrink: 0;
  background: linear-gradient(90deg, #F2613F, #c73a15);
}

/* LOGO */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 16px 10px;
}

.logo-box {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #1a1a1a;
  border: 1px solid rgba(242, 97, 63, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #F2613F;
  flex-shrink: 0;
}

.brand {
  color: white;
  font-weight: 500;
  font-size: 14px;
  margin: 0;
}

.sub {
  font-size: 10px;
  color: #555;
}

/* ROLE BADGE */
.role-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 12px 12px;
  padding: 8px 10px;
  background: rgba(242, 97, 63, 0.07);
  border: 1px solid rgba(242, 97, 63, 0.18);
  border-radius: 10px;
}

.shield-wrap {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: rgba(242, 97, 63, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.shield-icon {
  width: 14px;
  height: 14px;
  color: #F2613F;
}

.role-info {
  flex: 1;
}

.role-name {
  font-size: 12px;
  font-weight: 500;
  color: #F2613F;
  margin: 0;
}

.role-desc {
  font-size: 10px;
  color: #555;
  margin: 0;
}

.tier-pill {
  font-size: 9px;
  font-weight: 600;
  background: #F2613F;
  color: #fff;
  padding: 2px 7px;
  border-radius: 20px;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

/* NAV */
.nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
  padding: 0 10px;
}

.nav::-webkit-scrollbar {
  width: 3px;
}

.nav::-webkit-scrollbar-track {
  background: transparent;
}

.nav::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 10px;
}

.nav:hover::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
}

.nav {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

.nav:hover {
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
}

/* SECTION */
.section {
  font-size: 9px;
  color: #444;
  margin-top: 12px;
  margin-bottom: 2px;
  letter-spacing: 1.5px;
  padding-left: 2px;
}

/* LINK */
.link {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 7px 10px;
  border-radius: 9px;
  color: #666;
  text-decoration: none;
  font-size: 13px;
  position: relative;
  transition: all 0.15s ease;
  border: 1px solid transparent;
}

.icon {
  width: 15px;
  height: 15px;
  opacity: 0.6;
  flex-shrink: 0;
}

.link:hover {
  background: rgba(255, 255, 255, 0.04);
  color: #bbb;
  border-color: rgba(255, 255, 255, 0.05);
}

.link.router-link-exact-active {
  background: rgba(242, 97, 63, 0.1);
  color: #F2613F;
  font-weight: 500;
  border-color: rgba(242, 97, 63, 0.18);
}

.link.router-link-exact-active::before {
  content: "";
  position: absolute;
  left: -10px;
  height: 50%;
  width: 3px;
  background: #F2613F;
  border-radius: 0 4px 4px 0;
}

.link.router-link-exact-active .icon {
  opacity: 1;
}

/* SA BADGE */
.sa-badge {
  margin-left: auto;
  font-size: 9px;
  font-weight: 600;
  background: rgba(242, 97, 63, 0.15);
  color: #F2613F;
  padding: 2px 6px;
  border-radius: 20px;
  letter-spacing: 0.3px;
}

/* FOOTER */
.footer {
  padding: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
}

.user-row {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 6px 8px 10px;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(242, 97, 63, 0.12);
  border: 1px solid rgba(242, 97, 63, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: #F2613F;
  flex-shrink: 0;
}

.user-name {
  font-size: 12px;
  color: #bbb;
  font-weight: 500;
  margin: 0;
}

.user-status {
  font-size: 10px;
  color: #444;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #22c55e;
  flex-shrink: 0;
}

/* LOGOUT */
.logout {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px;
  border-radius: 9px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: transparent;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
}

.logout:hover {
  background: rgba(242, 97, 63, 0.08);
  color: #F2613F;
  border-color: rgba(242, 97, 63, 0.3);
}
</style>