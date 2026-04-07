<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'overview' | 'revenue' | 'members' | 'attendance'>('overview')
const activePeriod = ref<'7d' | '30d' | '90d' | '1y'>('30d')

const tabs = [
  { key: 'overview', label: '📊 Overview' },
  { key: 'revenue', label: '💰 Revenue' },
  { key: 'members', label: '👥 Members' },
  { key: 'attendance', label: '📅 Attendance' },
]
const periods = ['7d', '30d', '90d', '1y']

const stats = ref([
  {
    label: 'Total Revenue', value: '₱124,500', icon: '💰', change: '+12.4%', up: true,
    subtitle: 'Total revenue collected this month.',
    breakdown: [
      { label: 'Annual',    value: '₱68,160', percent: 55 },
      { label: 'Monthly',   value: '₱33,500', percent: 27 },
      { label: 'Quarterly', value: '₱23,040', percent: 18 },
    ]
  },
  {
    label: 'Active Members', value: '348', icon: '🏋️', change: '+8.2%', up: true,
    subtitle: 'Members with currently active memberships.',
    breakdown: [
      { label: 'Monthly',   value: 134, percent: 38 },
      { label: 'Annual',    value: 142, percent: 41 },
      { label: 'Quarterly', value: 72,  percent: 21 },
    ]
  },
  {
    label: 'New This Month', value: '42', icon: '✨', change: '+18.7%', up: true,
    subtitle: 'New sign-ups in March 2026.',
    breakdown: [
      { label: 'Week 1', value: 10, percent: 24 },
      { label: 'Week 2', value: 14, percent: 33 },
      { label: 'Week 3', value: 12, percent: 29 },
      { label: 'Week 4', value: 6,  percent: 14 },
    ]
  },
  {
    label: 'Avg. Attendance', value: '67%', icon: '📅', change: '-2.1%', up: false,
    subtitle: 'Average daily attendance rate this month.',
    breakdown: [
      { label: 'Weekdays', value: '71%', percent: 71 },
      { label: 'Weekends', value: '58%', percent: 58 },
      { label: 'Holidays', value: '40%', percent: 40 },
    ]
  },
])

const revenueData = ref([
  { month: 'Oct', value: 82000 },
  { month: 'Nov', value: 91000 },
  { month: 'Dec', value: 78000 },
  { month: 'Jan', value: 95000 },
  { month: 'Feb', value: 108000 },
  { month: 'Mar', value: 124500 },
])

const topPlans = ref([
  { name: 'Annual',    members: 142, revenue: 68160, pct: 55 },
  { name: 'Monthly',   members: 134, revenue: 33500, pct: 27 },
  { name: 'Quarterly', members: 72,  revenue: 23040, pct: 18 },
])

const recentActivity = ref([
  { id: 1, type: 'join',    message: 'Janine Somera joined as Monthly member',           time: '2 mins ago' },
  { id: 2, type: 'payment', message: 'Roven Santos renewed his Annual plan',             time: '18 mins ago' },
  { id: 3, type: 'expire',  message: "Abegail Moyaen's membership is expiring in 3 days", time: '1 hour ago' },
  { id: 4, type: 'join',    message: 'Kurt Morales joined as Quarterly member',          time: '3 hours ago' },
  { id: 5, type: 'payment', message: 'Jochelle Maltu completed payment ₱2,500',          time: '5 hours ago' },
])

const attendanceWeek = ref([
  { day: 'Mon', count: 87 },
  { day: 'Tue', count: 112 },
  { day: 'Wed', count: 134 },
  { day: 'Thu', count: 98 },
  { day: 'Fri', count: 145 },
  { day: 'Sat', count: 167 },
  { day: 'Sun', count: 54 },
])

const recentMembers = ref([
  { id: 1, name: 'Roven Santos',   plan: 'Monthly',   status: 'active',   expiry: 'Apr 15, 2026' },
  { id: 2, name: 'Abegail Moyaen', plan: 'Annual',    status: 'active',   expiry: 'Mar 10, 2027' },
  { id: 3, name: 'Jochelle Maltu', plan: 'Monthly',   status: 'expiring', expiry: 'Mar 18, 2026' },
  { id: 4, name: 'Janina Somera',  plan: 'Quarterly', status: 'active',   expiry: 'Jun 1, 2026' },
  { id: 5, name: 'Kurt Morales',   plan: 'Monthly',   status: 'active',   expiry: 'Apr 20, 2026' },
])

const maxRevenue = computed(() => Math.max(...revenueData.value.map(d => d.value)))
const maxAttendance = computed(() => Math.max(...attendanceWeek.value.map(d => d.count)))

function barHeight(val: number, max: number) {
  return Math.max(4, Math.round((val / max) * 100))
}
function formatPeso(val: number) {
  return '₱' + val.toLocaleString()
}

const activeModal = ref<any>(null)
const openModal = (stat: any) => { activeModal.value = stat }
const closeModal = () => { activeModal.value = null }
</script>

<template>
  <div class="reports-container">

    <!-- Header Banner -->
    <div class="welcome-box">
      <div class="welcome-overlay">
        <div>
          <p class="welcome-text">Reports & Analytics</p>
          <h2 class="welcome-name">Armstrong Gym</h2>
          <p class="welcome-date">Performance overview · March 2026</p>
        </div>
        <div class="welcome-badge">REPORTS</div>
      </div>
    </div>

    <!-- Period + Export Controls -->
    <div class="controls-row">
      <div class="nav-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="nav-tab"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key as any"
        >{{ tab.label }}</button>
      </div>
      <div class="right-controls">
        <div class="period-group">
          <button
            v-for="p in periods"
            :key="p"
            class="period-btn"
            :class="{ active: activePeriod === p }"
            @click="activePeriod = p"
          >{{ p }}</button>
        </div>
        <button class="export-btn">📤 Export</button>
      </div>
    </div>

    <!-- OVERVIEW TAB -->
    <div v-if="activeTab === 'overview'">
      <!-- Stat Cards -->
      <div class="stats-row">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="box"
          @click="openModal(stat)"
        >
          <div class="box-icon">{{ stat.icon }}</div>
          <div class="box-body">
            <p>{{ stat.label }}</p>
            <h3>{{ stat.value }}</h3>
          </div>
          <span class="box-change" :class="stat.up ? 'up' : 'down'">{{ stat.change }}</span>
        </div>
      </div>

      <!-- Revenue Chart + Activity -->
      <div class="bottom-row">
        <div class="panel">
          <h4 class="panel-title">📈 Monthly Revenue</h4>
          <div class="bar-chart">
            <div v-for="d in revenueData" :key="d.month" class="bar-col">
              <div class="bar-label-top">{{ formatPeso(d.value) }}</div>
              <div class="bar-wrap">
                <div
                  class="bar"
                  :class="{ highlight: d.month === 'Mar' }"
                  :style="{ height: barHeight(d.value, maxRevenue) + '%' }"
                ></div>
              </div>
              <div class="bar-label">{{ d.month }}</div>
            </div>
          </div>
        </div>

        <div class="panel">
          <h4 class="panel-title">⚡ Recent Activity</h4>
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
      </div>

      <!-- Plan Distribution -->
      <div class="panel" style="margin-top: 20px;">
        <h4 class="panel-title">💳 Plan Distribution</h4>
        <div class="plans-grid">
          <div v-for="plan in topPlans" :key="plan.name" class="plan-row">
            <div class="plan-info">
              <span class="plan-name">{{ plan.name }}</span>
              <span class="plan-members">{{ plan.members }} members</span>
            </div>
            <div class="breakdown-bar-wrap">
              <div class="breakdown-bar" :style="{ width: plan.pct + '%' }"></div>
            </div>
            <span class="plan-revenue">{{ formatPeso(plan.revenue) }}</span>
            <span class="plan-pct">{{ plan.pct }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- REVENUE TAB -->
    <div v-if="activeTab === 'revenue'">
      <div class="stats-row" style="grid-template-columns: repeat(3,1fr)">
        <div class="box" style="cursor:default">
          <div class="box-icon">💰</div>
          <div class="box-body"><p>Total Revenue</p><h3>₱124,500</h3></div>
          <span class="box-change up">+12.4%</span>
        </div>
        <div class="box" style="cursor:default">
          <div class="box-icon">📆</div>
          <div class="box-body"><p>Avg. Monthly</p><h3>₱96,416</h3></div>
          <span class="box-change up">+5.1%</span>
        </div>
        <div class="box" style="cursor:default">
          <div class="box-icon">⚠️</div>
          <div class="box-body"><p>Outstanding</p><h3>₱8,200</h3></div>
          <span class="box-change down">-3.2%</span>
        </div>
      </div>
      <div class="panel">
        <h4 class="panel-title">📈 Revenue Over Time</h4>
        <div class="bar-chart large">
          <div v-for="d in revenueData" :key="d.month" class="bar-col">
            <div class="bar-label-top">{{ formatPeso(d.value) }}</div>
            <div class="bar-wrap">
              <div class="bar" :class="{ highlight: d.month === 'Mar' }" :style="{ height: barHeight(d.value, maxRevenue) + '%' }"></div>
            </div>
            <div class="bar-label">{{ d.month }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- MEMBERS TAB -->
    <div v-if="activeTab === 'members'">
      <div class="stats-row">
        <div class="box" style="cursor:default">
          <div class="box-icon">🏋️</div>
          <div class="box-body"><p>Total Members</p><h3>348</h3></div>
          <span class="box-change up">+8.2%</span>
        </div>
        <div class="box" style="cursor:default">
          <div class="box-icon">✨</div>
          <div class="box-body"><p>New This Month</p><h3>42</h3></div>
          <span class="box-change up">+18.7%</span>
        </div>
        <div class="box" style="cursor:default">
          <div class="box-icon">👋</div>
          <div class="box-body"><p>Churned</p><h3>11</h3></div>
          <span class="box-change down">+1.4%</span>
        </div>
        <div class="box" style="cursor:default">
          <div class="box-icon">🔄</div>
          <div class="box-body"><p>Retention Rate</p><h3>96.8%</h3></div>
          <span class="box-change up">+2.3%</span>
        </div>
      </div>
      <div class="panel">
        <h4 class="panel-title">👥 Recent Members</h4>
        <table class="member-table">
          <thead>
            <tr>
              <th>Member</th><th>Plan</th><th>Status</th><th>Expiry</th>
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
      <div class="panel" style="margin-top:20px">
        <h4 class="panel-title">💳 Plan Distribution</h4>
        <div class="plans-grid">
          <div v-for="plan in topPlans" :key="plan.name" class="plan-row">
            <div class="plan-info">
              <span class="plan-name">{{ plan.name }}</span>
              <span class="plan-members">{{ plan.members }} members</span>
            </div>
            <div class="breakdown-bar-wrap">
              <div class="breakdown-bar" :style="{ width: plan.pct + '%' }"></div>
            </div>
            <span class="plan-revenue">{{ formatPeso(plan.revenue) }}</span>
            <span class="plan-pct">{{ plan.pct }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ATTENDANCE TAB -->
    <div v-if="activeTab === 'attendance'">
      <div class="stats-row" style="grid-template-columns: repeat(3,1fr)">
        <div class="box" style="cursor:default">
          <div class="box-icon">📅</div>
          <div class="box-body"><p>Avg. Daily</p><h3>113</h3></div>
          <span class="box-change up">+4.2%</span>
        </div>
        <div class="box" style="cursor:default">
          <div class="box-icon">🔥</div>
          <div class="box-body"><p>Peak Day</p><h3>Saturday</h3></div>
        </div>
        <div class="box" style="cursor:default">
          <div class="box-icon">📊</div>
          <div class="box-body"><p>Utilization</p><h3>67%</h3></div>
          <span class="box-change down">-2.1%</span>
        </div>
      </div>
      <div class="panel">
        <h4 class="panel-title">📅 Weekly Attendance</h4>
        <div class="bar-chart large">
          <div v-for="d in attendanceWeek" :key="d.day" class="bar-col">
            <div class="bar-label-top">{{ d.count }}</div>
            <div class="bar-wrap">
              <div class="bar" :class="{ highlight: d.day === 'Sat' }" :style="{ height: barHeight(d.count, maxAttendance) + '%' }"></div>
            </div>
            <div class="bar-label">{{ d.day }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal (same pattern as Dashboard) -->
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

<style scoped>
.reports-container { width: 100%; }

/* Welcome Banner — reused from Dashboard */
.welcome-box {
  border-radius: 16px;
  margin-bottom: 20px;
  border: 1px solid #481E14;
  background: #1a1a1a;
  overflow: hidden;
  min-height: 110px;
}
.welcome-overlay {
  background: linear-gradient(90deg, rgba(0,0,0,0.88) 40%, rgba(232,83,26,0.15) 100%);
  padding: 24px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 110px;
}
.welcome-text { color: #ccc; margin: 0 0 4px 0; font-size: 13px; }
.welcome-name { color: white; margin: 0 0 6px 0; font-size: 22px; font-weight: 700; }
.welcome-date { color: #aaa; margin: 0; font-size: 13px; }
.welcome-badge {
  background: #e8531a; color: white;
  padding: 8px 16px; border-radius: 20px;
  font-size: 12px; font-weight: 700; letter-spacing: 1px;
}

/* Controls Row */
.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 12px;
  flex-wrap: wrap;
}
.nav-tabs { display: flex; gap: 4px; }
.nav-tab {
  background: #1a1a1a;
  border: 1px solid #481E14;
  color: #aaa;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s;
}
.nav-tab:hover { border-color: #e8531a; color: #fff; }
.nav-tab.active { background: #e8531a; border-color: #e8531a; color: white; }

.right-controls { display: flex; align-items: center; gap: 10px; }
.period-group { display: flex; background: #1a1a1a; border: 1px solid #481E14; border-radius: 20px; padding: 3px; gap: 2px; }
.period-btn {
  background: none; border: none; color: #777;
  padding: 5px 13px; border-radius: 16px; font-size: 12px;
  font-weight: 500; cursor: pointer; transition: 0.2s;
}
.period-btn.active { background: #e8531a; color: white; }
.period-btn:not(.active):hover { color: #fff; }

.export-btn {
  background: #1a1a1a; border: 1px solid #481E14;
  color: #aaa; padding: 8px 16px; border-radius: 20px;
  font-size: 13px; font-weight: 500; cursor: pointer; transition: 0.2s;
}
.export-btn:hover { border-color: #e8531a; color: #e8531a; }

/* Stats Row — reused from Dashboard */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}
.box {
  background: #1a1a1a; padding: 18px 20px;
  border-radius: 16px; border: 1px solid #481E14;
  display: flex; align-items: center; gap: 14px;
  cursor: pointer; transition: 0.2s ease;
  position: relative;
}
.box:hover { transform: translateY(-3px); border-color: #e8531a; background: #1f1210; }
.box-icon { font-size: 26px; flex-shrink: 0; }
.box-body { flex: 1; min-width: 0; }
.box-body p { color: #aaa; margin: 0 0 4px 0; font-size: 12px; }
.box-body h3 { color: white; margin: 0; font-size: 22px; font-weight: 700; }
.box-change { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 10px; white-space: nowrap; flex-shrink: 0; }
.box-change.up { background: #14532d; color: #4ade80; }
.box-change.down { background: #451a03; color: #facc15; }

/* Panels — reused from Dashboard */
.bottom-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.panel {
  background: #1a1a1a; border-radius: 16px;
  border: 1px solid #481E14; padding: 20px;
}
.panel-title { color: white; margin: 0 0 18px 0; font-size: 15px; font-weight: 600; }

/* Bar Chart */
.bar-chart {
  display: flex; align-items: flex-end;
  gap: 8px; height: 160px;
}
.bar-chart.large { height: 220px; }
.bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; }
.bar-label-top { font-size: 9px; color: #555; margin-bottom: 5px; white-space: nowrap; overflow: hidden; max-width: 56px; text-overflow: ellipsis; }
.bar-wrap { flex: 1; width: 100%; display: flex; align-items: flex-end; }
.bar {
  width: 100%;
  background: #2a2a2a;
  border-radius: 5px 5px 2px 2px;
  min-height: 4px;
  transition: height 0.4s ease;
  border: 1px solid #481E14;
}
.bar.highlight { background: #e8531a; border-color: #e8531a; }
.bar-col:hover .bar { background: #333; }
.bar-col:hover .bar.highlight { background: #ff6a30; }
.bar-label { font-size: 12px; color: #666; margin-top: 7px; }

/* Activity — reused from Dashboard */
.activity-list { list-style: none; padding: 0; margin: 0; }
.activity-item { display: flex; align-items: flex-start; gap: 12px; padding: 10px 0; border-bottom: 1px solid #2a2a2a; }
.activity-item:last-child { border-bottom: none; }
.activity-dot { width: 10px; height: 10px; border-radius: 50%; margin-top: 4px; flex-shrink: 0; }
.activity-dot.join    { background: #4ade80; }
.activity-dot.payment { background: #e8531a; }
.activity-dot.expire  { background: #facc15; }
.activity-main { color: #ddd; margin: 0 0 3px 0; font-size: 13px; }
.activity-time { color: #666; margin: 0; font-size: 11px; }

/* Member Table — reused from Dashboard */
.member-table { width: 100%; border-collapse: collapse; }
.member-table th { color: #777; font-size: 12px; text-align: left; padding: 8px 10px; border-bottom: 1px solid #2a2a2a; }
.member-table td { color: #ddd; font-size: 13px; padding: 10px; border-bottom: 1px solid #1f1f1f; }
.member-table tr:last-child td { border-bottom: none; }
.member-cell { display: flex; align-items: center; gap: 10px; }
.avatar { width: 32px; height: 32px; border-radius: 50%; overflow: hidden; background: #2a2a2a; flex-shrink: 0; }
.avatar img { width: 100%; height: 100%; object-fit: cover; }
.badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: capitalize; }
.badge.active   { background: #14532d; color: #4ade80; }
.badge.expiring { background: #451a03; color: #facc15; }

/* Plan Distribution */
.plans-grid { display: flex; flex-direction: column; gap: 16px; }
.plan-row { display: grid; grid-template-columns: 160px 1fr 110px 48px; align-items: center; gap: 14px; }
.plan-info { display: flex; flex-direction: column; gap: 2px; }
.plan-name { font-size: 14px; font-weight: 600; color: #ddd; }
.plan-members { font-size: 12px; color: #666; }
.plan-revenue { font-size: 13px; color: #aaa; text-align: right; }
.plan-pct { font-size: 13px; font-weight: 700; color: #e8531a; text-align: right; }

/* Breakdown bars (shared with modal) */
.breakdown-bar-wrap { flex: 1; background: #2a2a2a; border-radius: 99px; height: 8px; overflow: hidden; }
.breakdown-bar { height: 100%; background: #e8531a; border-radius: 99px; transition: width 0.4s ease; }

/* Modal — reused from Dashboard */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.75);
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
.breakdown-value { color: white; font-size: 13px; font-weight: 600; width: 60px; text-align: right; }

/* Responsive */
@media (max-width: 900px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .bottom-row { grid-template-columns: 1fr; }
  .plan-row { grid-template-columns: 120px 1fr 90px 40px; }
  .controls-row { flex-direction: column; align-items: flex-start; }
}
@media (max-width: 600px) {
  .reports-container { padding: 0; }
  .stats-row { grid-template-columns: 1fr 1fr; }
  .nav-tabs { flex-wrap: wrap; }
  .plan-row { grid-template-columns: 1fr 1fr; gap: 8px; }
}
</style>