<template>
  <div class="topbar">
    <h2 class="page-title">{{ $route.name }}</h2>
    <div class="admin-info">
      <span class="admin-name">{{ adminName }}</span>
      <div class="avatar">
        <img v-if="adminPhoto" :src="adminPhoto" alt="Admin" />
        <span v-else>{{ adminLetter }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
  const adminName = localStorage.getItem("adminCredentials")
    ? JSON.parse(localStorage.getItem("adminCredentials")).username
    : "Admin";
  
  const adminLetter = adminName.charAt(0).toUpperCase();
const adminPhoto = null;
</script>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 30px;
  background-color: #0C0C0C;
  border-bottom: 1px solid #481E14;
}

.page-title {
  color: white;
  margin: 0;
  font-size: 20px;
}

.admin-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-name {
  color: white;
  font-size: 15px;
}

.avatar {
  width: 38px;
  height: 38px;
  background-color: #F2613F;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>