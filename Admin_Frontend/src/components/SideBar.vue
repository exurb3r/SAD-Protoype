<template>
  <div class="sidebar">
    <h2 class="logo">GYM ADMIN</h2>

    <nav class="nav-links">
      <router-link to="/">Dashboard</router-link>
      <router-link to="/members">Active Members</router-link>
      <router-link to="/add-membership">Add Membership</router-link>
      <router-link to="/users">App Users</router-link>
      <router-link to="/announcements">Announcements</router-link>
      <router-link to="/calendar">Calendar</router-link>
    </nav>

    <div class="logout">
      <a href="#">Logout</a>
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
}

.logo {
  color: #F2613F;
  margin-bottom: 40px;
  font-size: 20px;
  letter-spacing: 1px;
}

.nav-links {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.sidebar a {
  color: #aaa;
  text-decoration: none;
  margin: 10px 0;
  font-size: 15px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: 0.2s ease;
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

.logout a {
  color: #aaa;
  text-decoration: none;
  font-size: 15px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: 0.2s ease;
}

.logout a:hover {
  background-color: #481E14;
  color: #F2613F;
}
</style>