<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const activeTab = ref<'overview' | 'logbook' | 'appusers' | 'members' | 'attendance'>('overview')

const tabs = [
  { key: 'overview',    label: '📊 Overview' },
  { key: 'logbook',     label: '📓 Logbook' },
  { key: 'appusers',    label: '📱 App Users' },
  { key: 'members',     label: '👥 Members' },
  { key: 'attendance',  label: '📅 Attendance' },
]

const ACCENT = '#e8531a'
const MUTED  = '#2a2a2a'
const TEXT   = '#aaa'

const chartData = {
  logbook: {
    daily:   { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], data: [168,210,245,188,272,310,91] },
    weekly:  { labels: ['W1','W2','W3','W4','W5'], data: [298,341,275,370,0] },
    monthly: { labels: ['Oct','Nov','Dec','Jan','Feb','Mar'], data: [980,1050,870,1120,1180,1284] },
  },
  users: {
    daily:   { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], data: [6,9,12,8,14,18,3] },
    weekly:  { labels: ['W1','W2','W3','W4'], data: [12,17,15,14] },
    monthly: { labels: ['Oct','Nov','Dec','Jan','Feb','Mar'], data: [28,33,19,41,48,58] },
  },
  members: {
    daily:   { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], data: [4,7,9,6,10,14,2] },
    weekly:  { labels: ['W1','W2','W3','W4'], data: [10,14,12,6] },
    monthly: { labels: ['Oct','Nov','Dec','Jan','Feb','Mar'], data: [22,27,15,35,36,42] },
  },
  attendance: {
    daily:   { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], data: [87,112,134,98,145,167,54] },
    weekly:  { labels: ['W1','W2','W3','W4'], data: [637,721,689,750] },
    monthly: { labels: ['Oct','Nov','Dec','Jan','Feb','Mar'], data: [2400,2800,2200,3100,3300,3540] },
  },
}

type DataKey = keyof typeof chartData
type Period = 'daily' | 'weekly' | 'monthly'

const periods = ref<Record<string, Period>>({
  'ov-logbook': 'weekly', 'ov-users': 'weekly', 'ov-members': 'weekly',
  logbook: 'weekly', users: 'weekly', members: 'weekly', attendance: 'weekly',
})

const chartInstances = ref<Record<string, Chart>>({})

function highlightColors(data: number[]) {
  const max = Math.max(...data)
  return data.map(v => v === max ? ACCENT : MUTED)
}

function buildChart(canvasId: string, dataKey: DataKey, periodKey: string) {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement
  if (!canvas) return
  const p = periods.value[periodKey]
  const d = chartData[dataKey][p]
  const colors = highlightColors(d.data)

  if (chartInstances.value[canvasId]) {
    chartInstances.value[canvasId].destroy()
  }

  chartInstances.value[canvasId] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: d.labels,
      datasets: [{
        data: d.data,
        backgroundColor: colors,
        borderColor: colors,
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ' ' + (ctx.raw as number).toLocaleString() } }
      },
      scales: {
        x: { ticks: { color: TEXT, font: { size: 12 } }, grid: { color: '#1f1f1f' }, border: { color: '#333' } },
        y: {
          ticks: { color: TEXT, font: { size: 11 }, callback: v => Number(v) >= 1000 ? (Number(v)/1000).toFixed(1)+'k' : v },
          grid: { color: '#1f1f1f' }, border: { color: '#333' }
        }
      }
    }
  })
}

const chartDefs: { id: string; key: DataKey; periodKey: string }[] = [
  { id: 'ov-logbook-chart', key: 'logbook',    periodKey: 'ov-logbook' },
  { id: 'ov-users-chart',   key: 'users',      periodKey: 'ov-users' },
  { id: 'ov-members-chart', key: 'members',    periodKey: 'ov-members' },
  { id: 'lb-chart',         key: 'logbook',    periodKey: 'logbook' },
  { id: 'au-chart',         key: 'users',      periodKey: 'users' },
  { id: 'mb-chart',         key: 'members',    periodKey: 'members' },
  { id: 'at-chart',         key: 'attendance', periodKey: 'attendance' },
]

function initCharts() {
  chartDefs.forEach(def => buildChart(def.id, def.key, def.periodKey))
}

function setPeriod(periodKey: string, p: Period) {
  periods.value[periodKey] = p
  const def = chartDefs.find(d => d.periodKey === periodKey)
  if (!def) return
  const c = chartInstances.value[def.id]
  if (!c) return
  const d = chartData[def.key][p]
  const colors = highlightColors(d.data)
  c.data.labels = d.labels
  c.data.datasets[0].data = d.data
  ;(c.data.datasets[0] as any).backgroundColor = colors
  ;(c.data.datasets[0] as any).borderColor = colors
  c.update()
}

onMounted(() => { setTimeout(initCharts, 100) })
watch(activeTab, () => { setTimeout(initCharts, 100) })

const stats = ref([
  { label: 'Logbook Entries', value: '1,284', icon: '📓', change: '+9.3%',  up: true  },
  { label: 'New App Users',   value: '58',    icon: '📱', change: '+21.5%', up: true  },
  { label: 'New Members',     value: '42',    icon: '🏋️', change: '+18.7%', up: true  },
  { label: 'Avg. Attendance', value: '67%',   icon: '📅', change: '-2.1%',  up: false },
])

const recentActivity = ref([
  { id: 1, type: 'join',    message: 'Janine Somera joined as Monthly member',            time: '2 mins ago' },
  { id: 2, type: 'payment', message: 'Roven Santos renewed his Annual plan',              time: '18 mins ago' },
  { id: 3, type: 'expire',  message: "Abegail Moyaen's membership expiring in 3 days",    time: '1 hour ago' },
  { id: 4, type: 'join',    message: 'Kurt Morales joined as Quarterly member',           time: '3 hours ago' },
  { id: 5, type: 'join',    message: 'Jochelle Maltu signed up on the app',               time: '5 hours ago' },
])

const recentMembers = ref([
  { id: 1, name: 'Roven Santos',   plan: 'Monthly',   status: 'active',   expiry: 'Apr 15, 2026' },
  { id: 2, name: 'Abegail Moyaen', plan: 'Annual',    status: 'active',   expiry: 'Mar 10, 2027' },
  { id: 3, name: 'Jochelle Maltu', plan: 'Monthly',   status: 'expiring', expiry: 'Mar 18, 2026' },
  { id: 4, name: 'Janina Somera',  plan: 'Quarterly', status: 'active',   expiry: 'Jun 1, 2026'  },
  { id: 5, name: 'Kurt Morales',   plan: 'Monthly',   status: 'active',   expiry: 'Apr 20, 2026' },
])
</script>

<template>
  <div class="reports-container">

    <div class="welcome-box">
      <div class="welcome-overlay">
        <div>
          <p class="welcome-text">Reports & Analytics</p>
          <h2 class="welcome-name">Armstrong Gym</h2>
          <p class="welcome-date">Activity overview · April 2026</p>
        </div>
        <div class="welcome-badge">REPORTS</div>
      </div>
    </div>

    <div class="controls-row">
      <div class="nav-tabs">
        <button v-for="tab in tabs" :key="tab.key"
          class="nav-tab" :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key as any">{{ tab.label }}</button>
      </div>
    </div>

    <!-- OVERVIEW -->
    <div v-if="activeTab === 'overview'">
      <div class="stats-row">
        <div v-for="s in stats" :key="s.label" class="box">
          <div class="box-icon">{{ s.icon }}</div>
          <div class="box-body"><p>{{ s.label }}</p><h3>{{ s.value }}</h3></div>
          <span class="box-change" :class="s.up ? 'up' : 'down'">{{ s.change }}</span>
        </div>
      </div>

      <div class="two-col">
        <div class="panel">
          <div class="panel-header">
            <h4 class="panel-title">📓 Logbook entries</h4>
            <div class="period-group">
              <button v-for="p in ['daily','weekly','monthly']" :key="p"
                class="period-btn" :class="{ active: periods['ov-logbook'] === p }"
                @click="setPeriod('ov-logbook', p as Period)">{{ p }}</button>
            </div>
          </div>
          <div class="chart-wrap"><canvas id="ov-logbook-chart"></canvas></div>
        </div>
        <div class="panel">
          <div class="panel-header">
            <h4 class="panel-title">📱 New app users</h4>
            <div class="period-group">
              <button v-for="p in ['daily','weekly','monthly']" :key="p"
                class="period-btn" :class="{ active: periods['ov-users'] === p }"
                @click="setPeriod('ov-users', p as Period)">{{ p }}</button>
            </div>
          </div>
          <div class="chart-wrap"><canvas id="ov-users-chart"></canvas></div>
        </div>
      </div>

      <div class="two-col" style="margin-top: 20px;">
        <div class="panel">
          <div class="panel-header">
            <h4 class="panel-title">🏋️ New members</h4>
            <div class="period-group">
              <button v-for="p in ['daily','weekly','monthly']" :key="p"
                class="period-btn" :class="{ active: periods['ov-members'] === p }"
                @click="setPeriod('ov-members', p as Period)">{{ p }}</button>
            </div>
          </div>
          <div class="chart-wrap"><canvas id="ov-members-chart"></canvas></div>
        </div>
        <div class="panel">
          <h4 class="panel-title">⚡ Recent activity</h4>
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
    </div>

    <!-- LOGBOOK -->
    <div v-if="activeTab === 'logbook'">
      <div class="stats-row" style="grid-template-columns: repeat(3,1fr)">
        <div class="box"><div class="box-icon">📓</div><div class="box-body"><p>Total Entries</p><h3>1,284</h3></div><span class="box-change up">+9.3%</span></div>
        <div class="box"><div class="box-icon">🔥</div><div class="box-body"><p>Peak Day</p><h3>Saturday</h3></div></div>
        <div class="box"><div class="box-icon">👤</div><div class="box-body"><p>Avg. per User</p><h3>3.7</h3></div><span class="box-change up">+1.2%</span></div>
      </div>
      <div class="panel">
        <div class="panel-header">
          <h4 class="panel-title">📓 Logbook activity</h4>
          <div class="period-group">
            <button v-for="p in ['daily','weekly','monthly']" :key="p"
              class="period-btn" :class="{ active: periods['logbook'] === p }"
              @click="setPeriod('logbook', p as Period)">{{ p }}</button>
          </div>
        </div>
        <div class="chart-wrap large"><canvas id="lb-chart"></canvas></div>
      </div>
    </div>

    <!-- APP USERS -->
    <div v-if="activeTab === 'appusers'">
      <div class="stats-row" style="grid-template-columns: repeat(3,1fr)">
        <div class="box"><div class="box-icon">📱</div><div class="box-body"><p>Total App Users</p><h3>412</h3></div><span class="box-change up">+21.5%</span></div>
        <div class="box"><div class="box-icon">✨</div><div class="box-body"><p>New This Month</p><h3>58</h3></div><span class="box-change up">+14.2%</span></div>
        <div class="box"><div class="box-icon">📲</div><div class="box-body"><p>Daily Active</p><h3>189</h3></div><span class="box-change up">+5.8%</span></div>
      </div>
      <div class="panel">
        <div class="panel-header">
          <h4 class="panel-title">📱 New app users</h4>
          <div class="period-group">
            <button v-for="p in ['daily','weekly','monthly']" :key="p"
              class="period-btn" :class="{ active: periods['users'] === p }"
              @click="setPeriod('users', p as Period)">{{ p }}</button>
          </div>
        </div>
        <div class="chart-wrap large"><canvas id="au-chart"></canvas></div>
      </div>
    </div>

    <!-- MEMBERS -->
    <div v-if="activeTab === 'members'">
      <div class="stats-row">
        <div class="box"><div class="box-icon">🏋️</div><div class="box-body"><p>Total Members</p><h3>348</h3></div><span class="box-change up">+8.2%</span></div>
        <div class="box"><div class="box-icon">✨</div><div class="box-body"><p>New This Month</p><h3>42</h3></div><span class="box-change up">+18.7%</span></div>
        <div class="box"><div class="box-icon">👋</div><div class="box-body"><p>Churned</p><h3>11</h3></div><span class="box-change down">+1.4%</span></div>
        <div class="box"><div class="box-icon">🔄</div><div class="box-body"><p>Retention Rate</p><h3>96.8%</h3></div><span class="box-change up">+2.3%</span></div>
      </div>
      <div class="panel">
        <div class="panel-header">
          <h4 class="panel-title">🏋️ New members</h4>
          <div class="period-group">
            <button v-for="p in ['daily','weekly','monthly']" :key="p"
              class="period-btn" :class="{ active: periods['members'] === p }"
              @click="setPeriod('members', p as Period)">{{ p }}</button>
          </div>
        </div>
        <div class="chart-wrap large"><canvas id="mb-chart"></canvas></div>
      </div>
      <div class="panel" style="margin-top: 20px;">
        <h4 class="panel-title">👥 Recent members</h4>
        <table class="member-table">
          <thead><tr><th>Member</th><th>Plan</th><th>Status</th><th>Expiry</th></tr></thead>
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

    <!-- ATTENDANCE -->
    <div v-if="activeTab === 'attendance'">
      <div class="stats-row" style="grid-template-columns: repeat(3,1fr)">
        <div class="box"><div class="box-icon">📅</div><div class="box-body"><p>Avg. Daily</p><h3>113</h3></div><span class="box-change up">+4.2%</span></div>
        <div class="box"><div class="box-icon">🔥</div><div class="box-body"><p>Peak Day</p><h3>Saturday</h3></div></div>
        <div class="box"><div class="box-icon">📊</div><div class="box-body"><p>Utilization</p><h3>67%</h3></div><span class="box-change down">-2.1%</span></div>
      </div>
      <div class="panel">
        <div class="panel-header">
          <h4 class="panel-title">📅 Attendance</h4>
          <div class="period-group">
            <button v-for="p in ['daily','weekly','monthly']" :key="p"
              class="period-btn" :class="{ active: periods['attendance'] === p }"
              @click="setPeriod('attendance', p as Period)">{{ p }}</button>
          </div>
        </div>
        <div class="chart-wrap large"><canvas id="at-chart"></canvas></div>
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
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.chart-wrap { position: relative; width: 100%; height: 220px; }
.chart-wrap.large { height: 280px; }

.period-group { display: flex; background: #0c0c0c; border: 1px solid #481E14; border-radius: 20px; padding: 3px; gap: 2px; }
.period-btn { background: none; border: none; color: #777; padding: 5px 13px; border-radius: 16px; font-size: 12px; cursor: pointer; transition: 0.2s; }
.period-btn.active { background: #e8531a; color: white; }
.period-btn:not(.active):hover { color: #fff; }

.panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; flex-wrap: wrap; gap: 10px; }

@media (max-width: 900px) {
  .two-col { grid-template-columns: 1fr; }
}
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