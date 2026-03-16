<template>
  <div class="notif-container">

    <!-- Header -->
    <div class="notif-header">
      <div>
        <h2 class="notif-title">Notifications</h2>
        <p class="notif-sub">Stay updated on member activity and alerts.</p>
      </div>
      <button class="btn-readall" @click="markAllRead">✅ Mark all as read</button>
    </div>

    <!-- Filter Tabs -->
    <div class="filter-tabs">
      <button
        v-for="tab in tabs" :key="tab.value"
        class="tab" :class="{ active: activeFilter === tab.value }"
        @click="activeFilter = tab.value"
      >
        {{ tab.label }}
        <span class="tab-count" v-if="tab.value === 'all'">{{ notifications.length }}</span>
        <span class="tab-count unread" v-if="tab.value === 'unread' && unreadCount > 0">{{ unreadCount }}</span>
      </button>
    </div>

    <!-- Notifications List -->
    <div class="panel">
      <div
        v-for="notif in filteredNotifs" :key="notif.id"
        class="notif-item" :class="{ unread: !notif.read }"
      >
        <div class="notif-dot" :class="notif.type"></div>
        <div class="notif-icon">{{ typeIcon(notif.type) }}</div>
        <div class="notif-body">
          <p class="notif-message">{{ notif.message }}</p>
          <p class="notif-time">{{ notif.time }}</p>
        </div>
        <div class="notif-actions">
          <button v-if="!notif.read" class="btn-action" @click="markAsRead(notif.id)" title="Mark as read">👁️</button>
          <button v-else class="btn-action" @click="markAsUnread(notif.id)" title="Mark as unread">🔵</button>
          <button class="btn-action delete" @click="deleteNotif(notif.id)" title="Delete">🗑️</button>
        </div>
      </div>

      <div v-if="filteredNotifs.length === 0" class="empty">
        No notifications here!
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useNotifications } from "../utils/useNotifications";

const { notifications, unreadCount, markAsRead, markAsUnread, markAllRead, deleteNotif } = useNotifications();

const activeFilter = ref("all");

const tabs = [
  { label: "All",      value: "all" },
  { label: "Unread",   value: "unread" },
  { label: "Expiring", value: "expire" },
  { label: "Payments", value: "payment" },
  { label: "New Join", value: "join" },
];

const filteredNotifs = computed(() => {
  if (activeFilter.value === "all")    return notifications.value;
  if (activeFilter.value === "unread") return notifications.value.filter(n => !n.read);
  return notifications.value.filter(n => n.type === activeFilter.value);
});

const typeIcon = (type) => {
  if (type === "expire")  return "⏰";
  if (type === "payment") return "💳";
  if (type === "join")    return "🏋️";
  return "🔔";
};
</script>

<style scoped>
.notif-container { width: 100%; }

/* Header */
.notif-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.notif-title { color: white; margin: 0 0 4px 0; font-size: 22px; font-weight: 700; }
.notif-sub { color: #777; margin: 0; font-size: 13px; }
.btn-readall { background: #2a2a2a; color: #aaa; border: none; padding: 10px 18px; border-radius: 10px; font-size: 13px; cursor: pointer; transition: 0.2s; }
.btn-readall:hover { background: #481E14; color: #e8531a; }

/* Tabs */
.filter-tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
.tab { background: #1a1a1a; color: #aaa; border: 1px solid #2a2a2a; padding: 8px 16px; border-radius: 20px; font-size: 13px; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 6px; }
.tab:hover { border-color: #e8531a; color: #e8531a; }
.tab.active { background: #481E14; color: #e8531a; border-color: #e8531a; font-weight: 600; }
.tab-count { background: #2a2a2a; color: #aaa; padding: 1px 7px; border-radius: 99px; font-size: 11px; }
.tab-count.unread { background: #e8531a; color: white; }

/* Panel */
.panel { background: #1a1a1a; border-radius: 16px; border: 1px solid #481E14; overflow: hidden; }

/* Notif Item */
.notif-item {
  display: flex; align-items: center; gap: 14px;
  padding: 16px 20px; border-bottom: 1px solid #1f1f1f;
  transition: 0.2s; position: relative;
}
.notif-item:last-child { border-bottom: none; }
.notif-item:hover { background: #1f1f1f; }
.notif-item.unread { background: #1d1510; }
.notif-item.unread:hover { background: #221810; }

.notif-dot {
  width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
}
.notif-dot.expire  { background: #facc15; }
.notif-dot.payment { background: #e8531a; }
.notif-dot.join    { background: #4ade80; }

.notif-icon { font-size: 22px; flex-shrink: 0; }

.notif-body { flex: 1; }
.notif-message { color: #ddd; margin: 0 0 4px 0; font-size: 14px; }
.notif-item.unread .notif-message { color: white; font-weight: 600; }
.notif-time { color: #666; margin: 0; font-size: 12px; }

.notif-actions { display: flex; gap: 6px; flex-shrink: 0; }
.btn-action { background: #2a2a2a; border: none; padding: 6px 10px; border-radius: 6px; font-size: 13px; cursor: pointer; transition: 0.2s; }
.btn-action:hover { background: #481E14; }
.btn-action.delete:hover { background: #3a1010; }

.empty { text-align: center; color: #555; padding: 40px; font-size: 14px; }
</style>