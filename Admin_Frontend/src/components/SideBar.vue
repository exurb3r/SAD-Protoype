<template>
  <div class="sidebar">
    <h2 class="logo">GYM ADMIN</h2>

    <router-link to="/">Dashboard</router-link>
    <router-link to="/members">Active Members</router-link>
    <router-link to="/add-membership">Add Membership</router-link>
    <router-link to="/users">App Users</router-link>
    <router-link to="/announcements">Announcements</router-link>
    <router-link to="/calendar">Calendar</router-link>
  </div>
</template>

<style>
.sidebar {
  width: 250px;
  background-color: #0b0b0b;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100vh;   /* IMPORTANT */
}

.logo {
  margin-bottom: 30px;
}

.sidebar a {
  color: #ccc;
  text-decoration: none;
  margin: 10px 0;
}

.sidebar a.router-link-exact-active {
  color: orange;
  font-weight: bold;
}
</style>
