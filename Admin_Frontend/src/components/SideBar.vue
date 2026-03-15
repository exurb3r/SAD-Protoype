<template>
  <div class="sidebar">
    <h2 class="logo">ARMZTRONG GYM</h2>

    <nav class="nav-links">
      <p class="nav-section">Main</p>
      <router-link to="/"><span class="icon">📊</span> Dashboard</router-link>
      <router-link to="/members"><span class="icon">🏋️</span> Active Members</router-link>
      <router-link to="/add-membership"><span class="icon">➕</span> Add Membership</router-link>
      <router-link to="/users"><span class="icon">📱</span> App Users</router-link>

      <p class="nav-section">Management</p>
      <router-link to="/staff"><span class="icon">👥</span> Staff Management</router-link>
      <router-link to="/payments"><span class="icon">💳</span> Payment & Billing</router-link>
      <router-link to="/notifications"><span class="icon">🔔</span> Notifications</router-link>
      <router-link to="/announcements"><span class="icon">📢</span> Announcements</router-link>
      <router-link to="/calendar"><span class="icon">📅</span> Calendar</router-link>

      <p class="nav-section">Other</p>
      <router-link to="/reports"><span class="icon">📈</span> Reports & Analytics</router-link>
      <router-link to="/settings"><span class="icon">⚙️</span> Settings</router-link>
    </nav>

    <div class="logout">
      <router-link to="/logout"><span class="icon">🚪</span> Logout</router-link>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #0C0C0C;
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
  border-right: 1px solid #481E14;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
}

.logo {
  color: #F2613F;
  margin-bottom: 28px;
  font-size: 18px;
  letter-spacing: 1px;
  flex-shrink: 0;
}

.nav-section {
  color: #555;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin: 16px 0 6px 12px;
  padding: 0;
}

.nav-links {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.icon {
  font-size: 15px;
  width: 22px;
  display: inline-block;
}

.sidebar a {
  color: #aaa;
  text-decoration: none;
  margin: 2px 0;
  font-size: 14px;
  padding: 9px 12px;
  border-radius: 8px;
  transition: 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar a:hover {
  background-color: #481E14;
  color: #F2613F;
}

.sidebar a.router-link-exact-active {
  color: #F2613F;
  font-weight: bold;
  background-color: #481E14;
}

.logout {
  border-top: 1px solid #2a2a2a;
  padding-top: 12px;
  margin-top: 8px;
  flex-shrink: 0;
}

.logout a {
  color: #aaa;
  text-decoration: none;
  font-size: 14px;
  padding: 9px 12px;
  border-radius: 8px;
  transition: 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.logout a:hover {
  background-color: #481E14;
  color: #F2613F;
}

.sidebar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}
</style>