<template>
  <div class="dashboard-container">

    <!-- Welcome Box -->
    <div class="welcome-box" :style="{ backgroundImage: `url(${gymBanner})` }">
      <div class="welcome-overlay">
        <div>
          <p class="welcome-text">Welcome back</p>
          <h2 class="welcome-name">{{ adminName }}</h2>
          <p class="welcome-date">{{ today }}</p>
        </div>
        <div class="welcome-badge">GYM ADMIN</div>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="stats-row">
      <div class="box" v-for="stat in stats" :key="stat.label" @click="openModal(stat)">
        <div class="box-icon">{{ stat.icon }}</div>
        <div>
          <p>{{ stat.label }}</p>
          <h3>{{ stat.value }}</h3>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <DashboardCharts />

    <!-- Bottom Row -->
    <div class="bottom-row">

      <!-- Recent Activity -->
      <div class="panel">
        <h4 class="panel-title">Recent Activity</h4>
        <ul class="activity-list">
          <li v-for="item in recentActivity" :key="item.id" class="activity-item">
            <span class="activity-dot" :class="item.type"></span>
            <div>
              <p class="activity-main">{{ item.message }}</p>
              <p class="activity-time">{{ item.time }}</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- Recent Members -->
      <div class="panel">
        <h4 class="panel-title">Recent Members</h4>
        <table class="member-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Expiry</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in recentMembers" :key="member.id">
              <td>
                <div class="member-cell">
                  <div class="avatar">
                   <img :src="`https://api.dicebear.com/7.x/initials/svg?seed=${member.name}&backgroundColor=481E14&fontFamily=Arial&fontSize=40`" :alt="member.name" />
                  </div>
                  {{ member.name }}
                </div>
              </td>
              <td>{{ member.plan }}</td>
              <td><span class="badge" :class="member.status">{{ member.status }}</span></td>
              <td>{{ member.expiry }}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <!-- Modal -->
    <div class="modal-overlay" v-if="activeModal" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <span class="modal-icon">{{ activeModal.icon }}</span>
          <h3>{{ activeModal.label }}</h3>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>
        <div class="modal-value">{{ activeModal.value }}</div>
        <p class="modal-subtitle">{{ activeModal.subtitle }}</p>
        <ul class="modal-breakdown">
          <li v-for="item in activeModal.breakdown" :key="item.label" class="breakdown-item">
            <span class="breakdown-label">{{ item.label }}</span>
            <div class="breakdown-bar-wrap">
              <div class="breakdown-bar" :style="{ width: item.percent + '%' }"></div>
            </div>
            <span class="breakdown-value">{{ item.value }}</span>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";
import DashboardCharts from "../components/DashboardCharts.vue";

const adminName = "Juan dela Cruz";
const today = new Date().toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" });



const gymBanner = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80";

const stats = [
  {
    label: "Active Members", value: 124, icon: "",
    subtitle: "Total members with active memberships right now.",
    breakdown: [
      { label: "Monthly",   value: 74, percent: 60 },
      { label: "Quarterly", value: 31, percent: 25 },
      { label: "Annual",    value: 19, percent: 15 },
    ]
  },
  {
    label: "New This Month", value: 15, icon: "",
    subtitle: "Members who joined in March 2026.",
    breakdown: [
      { label: "Week 1", value: 4, percent: 27 },
      { label: "Week 2", value: 6, percent: 40 },
      { label: "Week 3", value: 3, percent: 20 },
      { label: "Week 4", value: 2, percent: 13 },
    ]
  },
  {
    label: "Expiring Soon", value: 8, icon: "",
    subtitle: "Memberships expiring within the next 7 days.",
    breakdown: [
      { label: "In 1-2 days", value: 2, percent: 25 },
      { label: "In 3-4 days", value: 3, percent: 37 },
      { label: "In 5-7 days", value: 3, percent: 38 },
    ]
  },
  {
    label: "App Users", value: 200, icon: "",
    subtitle: "Total users registered on the mobile app.",
    breakdown: [
      { label: "Active (30d)",     value: 140, percent: 70 },
      { label: "Inactive",         value: 42,  percent: 21 },
      { label: "Never logged in",  value: 18,  percent: 9  },
    ]
  },
];

const recentActivity = [
  { id: 1, type: "join",    message: "Janine Somera joined as Monthly member",      time: "2 mins ago" },
  { id: 2, type: "payment", message: "Roven Santos renewed his Annual plan",          time: "18 mins ago" },
  { id: 3, type: "expire",  message: "Abegail Moyaen's membership is expiring in 3 days",  time: "1 hour ago" },
  { id: 4, type: "join",    message: "Kurt Morales joined as Quarterly member",   time: "3 hours ago" },
  { id: 5, type: "payment", message: "Jochelle Maltu completed payment ₱2,500",          time: "5 hours ago" },
];

const recentMembers = [
  { id: 1, name: "Roven Santos",   plan: "Monthly",   status: "active",   expiry: "Apr 15, 2026" },
  { id: 2, name: "Abegail Moyaen",     plan: "Annual",    status: "active",   expiry: "Mar 10, 2027" },
  { id: 3, name: "Jochelle Maltu",        plan: "Monthly",   status: "expiring", expiry: "Mar 18, 2026" },
  { id: 4, name: "Janina Somera", plan: "Quarterly", status: "active",   expiry: "Jun 1, 2026" },
  { id: 5, name: "Kurt Morales",      plan: "Monthly",   status: "active",   expiry: "Apr 20, 2026" },
];

const activeModal = ref(null);
const openModal  = (stat) => { activeModal.value = stat; };
const closeModal = () => { activeModal.value = null; };
</script>

<style scoped>
.dashboard-container { width: 100%; }

/* Welcome */
.welcome-box {
  border-radius: 16px;
  margin-bottom: 25px;
  border: 1px solid #481E14;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  min-height: 130px;
}
.welcome-overlay {
  background: linear-gradient(90deg, rgba(0,0,0,0.82) 40%, rgba(0,0,0,0.3) 100%);
  padding: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 130px;
}
.welcome-text { color: #ccc; margin: 0 0 4px 0; }
.welcome-name { color: white; margin: 0 0 6px 0; font-size: 24px; font-weight: 700; }
.welcome-date { color: #aaa; margin: 0; font-size: 13px; }
.welcome-badge {
  background: #e8531a; color: white;
  padding: 8px 16px; border-radius: 20px;
  font-size: 12px; font-weight: 700; letter-spacing: 1px;
}

/* Stats */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 25px;
}
.box {
  background: #1a1a1a; padding: 20px;
  border-radius: 16px; border: 1px solid #481E14;
  transition: 0.2s ease; display: flex;
  align-items: center; gap: 16px; cursor: pointer;
}
.box:hover { transform: translateY(-4px); border-color: #e8531a; background: #1f1210; }
.box-icon { font-size: 28px; }
.box p { color: #aaa; margin: 0 0 6px 0; font-size: 13px; }
.box h3 { color: white; margin: 0; font-size: 26px; font-weight: 700; }

/* Bottom Row */
.bottom-row {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  margin-top: 25px;
}
.panel {
  background: #1a1a1a; border-radius: 16px;
  border: 1px solid #481E14; padding: 20px;
}
.panel-title { color: white; margin: 0 0 16px 0; font-size: 15px; font-weight: 600; }

/* Activity */
.activity-list { list-style: none; padding: 0; margin: 0; }
.activity-item { display: flex; align-items: flex-start; gap: 12px; padding: 10px 0; border-bottom: 1px solid #2a2a2a; }
.activity-item:last-child { border-bottom: none; }
.activity-dot { width: 10px; height: 10px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
.activity-dot.join    { background: #4ade80; }
.activity-dot.payment { background: #e8531a; }
.activity-dot.expire  { background: #facc15; }
.activity-main { color: #ddd; margin: 0 0 3px 0; font-size: 13px; }
.activity-time { color: #666; margin: 0; font-size: 11px; }

/* Table */
.member-table { width: 100%; border-collapse: collapse; }
.member-table th { color: #777; font-size: 12px; text-align: left; padding: 8px 10px; border-bottom: 1px solid #2a2a2a; }
.member-table td { color: #ddd; font-size: 13px; padding: 10px; border-bottom: 1px solid #1f1f1f; }
.member-table tr:last-child td { border-bottom: none; }
.member-cell { display: flex; align-items: center; gap: 10px; }
.avatar {
  width: 32px; height: 32px; border-radius: 50%;
  overflow: hidden; background: #2a2a2a; flex-shrink: 0;
}
.avatar img { width: 100%; height: 100%; object-fit: cover; }
.badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: capitalize; }
.badge.active   { background: #14532d; color: #4ade80; }
.badge.expiring { background: #451a03; color: #facc15; }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex; align-items: center; justify-content: center; z-index: 999;
}
.modal {
  background: #1a1a1a; border: 1px solid #481E14;
  border-radius: 20px; padding: 32px;
  width: 420px; max-width: 90vw;
}
.modal-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.modal-icon { font-size: 28px; }
.modal-header h3 { color: white; margin: 0; flex: 1; font-size: 18px; }
.modal-close { background: none; border: none; color: #aaa; font-size: 18px; cursor: pointer; padding: 4px 8px; }
.modal-close:hover { color: white; }
.modal-value { color: #e8531a; font-size: 48px; font-weight: 700; margin-bottom: 4px; }
.modal-subtitle { color: #777; font-size: 13px; margin: 0 0 24px 0; }
.modal-breakdown { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px; }
.breakdown-item { display: flex; align-items: center; gap: 12px; }
.breakdown-label { color: #aaa; font-size: 13px; width: 110px; flex-shrink: 0; }
.breakdown-bar-wrap { flex: 1; background: #2a2a2a; border-radius: 99px; height: 8px; overflow: hidden; }
.breakdown-bar { height: 100%; background: #e8531a; border-radius: 99px; transition: width 0.4s ease; }
.breakdown-value { color: white; font-size: 13px; font-weight: 600; width: 30px; text-align: right; }
</style>