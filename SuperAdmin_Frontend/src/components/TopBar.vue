<template>
  <div class="topbar">

    <!-- LEFT: Page title + breadcrumb -->
    <div class="topbar-left">
      <div class="page-eyebrow">Super Admin</div>
      <h2 class="page-title">{{ $route.name }}</h2>
    </div>

    <!-- RIGHT: Actions + Admin info -->
    <div class="topbar-right">

      <!-- Live clock -->
      <div class="clock">{{ time }}</div>

      <!-- Divider -->
      <div class="divider" />

      <!-- Admin chip -->
      <div class="admin-chip">
        <div class="admin-text">
          <span class="admin-name">{{ adminName }}</span>
          <span class="admin-role">Super Admin</span>
        </div>
        <div class="avatar">
          <img v-if="adminPhoto" :src="adminPhoto" alt="Admin" />
          <span v-else>{{ adminLetter }}</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const adminName = localStorage.getItem("superadminCredentials")
  ? JSON.parse(localStorage.getItem("superadminCredentials")).username
  : "Super Admin";

const adminLetter = adminName.charAt(0).toUpperCase();
const adminPhoto = null;

// Live clock
const time = ref("");
let clockInterval = null;

const updateTime = () => {
  time.value = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

onMounted(() => {
  updateTime();
  clockInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  clearInterval(clockInterval);
});
</script>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  height: 62px;
  background-color: #0C0C0C;
  border-bottom: 1px solid #1e1e1e;
  flex-shrink: 0;
}

/* LEFT */
.topbar-left {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.page-eyebrow {
  font-size: 10px;
  color: #F2613F;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  font-weight: 500;
}

.page-title {
  color: white;
  margin: 0;
  font-size: 17px;
  font-weight: 600;
}

/* RIGHT */
.topbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* CLOCK */
.clock {
  font-size: 13px;
  color: #555;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.5px;
}

/* DIVIDER */
.divider {
  width: 1px;
  height: 24px;
  background: #222;
}

/* ADMIN CHIP */
.admin-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 5px 5px 12px;
  border-radius: 40px;
  border: 1px solid #1e1e1e;
  background: #111;
  transition: 0.15s;
  cursor: default;
}

.admin-chip:hover {
  border-color: rgba(242, 97, 63, 0.25);
  background: #141414;
}

.admin-text {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;
}

.admin-name {
  color: #ddd;
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
}

.admin-role {
  font-size: 10px;
  color: #F2613F;
  letter-spacing: 0.3px;
  line-height: 1;
}

/* AVATAR */
.avatar {
  width: 32px;
  height: 32px;
  background: rgba(242, 97, 63, 0.15);
  border: 1px solid rgba(242, 97, 63, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F2613F;
  font-weight: 700;
  font-size: 13px;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>