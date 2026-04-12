<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const activeTab = ref<'overview' | 'logbook' | 'appusers' | 'members' | 'attendance'>('overview')
const selectedBranch = ref<'all' | 'general-luna' | 'rimando'>('all')

const tabs = [
  { key: 'overview',   label: '📊 Overview' },
  { key: 'logbook',    label: '📓 Logbook' },
  { key: 'appusers',   label: '📱 App Users' },
  { key: 'members',    label: '👥 Members' },
  { key: 'attendance', label: '📅 Attendance' },
]

const branches = [
  { value: 'all',          label: '🏢 All Branches' },
  { value: 'general-luna', label: '📍 General Luna' },
  { value: 'rimando',      label: '📍 Rimando' },
]

const ACCENT = '#e8531a'
const MUTED  = '#2a2a2a'
const TEXT   = '#aaa'

// ── Chart data per branch ──────────────────────────────────────────────────
const allChartData = {
  all: {
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
  },
  'general-luna': {
    logbook: {
      daily:   { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], data: [95,120,140,104,158,185,52] },
      weekly:  { labels: ['W1','W2','W3','W4','W5'], data: [170,198,155,208,0] },
      monthly: { labels: ['Oct','Nov','Dec','Jan','Feb','Mar'], data: [560,610,490,645,680,731] },
    },
    users: {
      daily:   { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], data: [3,5,7,4,8,11,1] },
      weekly:  { labels: ['W1','W2','W3','W4'], data: [7,10,9,8] },
      monthly: { labels: ['Oct','Nov','Dec','Jan','Feb','Mar'], data: [16,19,11,24,28,34] },
    },
    members: {
      daily:   { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], data: [2,4,5,3,6,8,1] },
      weekly:  { labels: ['W1','W2','W3','W4'], data: [6,8,7,3] },
      monthly: { labels: ['Oct','Nov','Dec','Jan','Feb','Mar'], data: [13,15,9,20,21,24] },
    },
    attendance: {
      daily:   { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], data: [50,65,78,56,84,98,30] },
      weekly:  { labels: ['W1','W2','W3','W4'], data: [363,415,392,430] },
      monthly: { labels: ['Oct','Nov','Dec','Jan','Feb','Mar'], data: [1380,1610,1260,1780,1890,2030] },
    },
  },
  'rimando': {
    logbook: {
      daily:   { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], data: [73,90,105,84,114,125,39] },
      weekly:  { labels: ['W1','W2','W3','W4','W5'], data: [128,143,120,162,0] },
      monthly: { labels: ['Oct','Nov','Dec','Jan','Feb','Mar'], data: [420,440,380,475,500,553] },
    },
    users: {
      daily:   { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], data: [3,4,5,4,6,7,2] },
      weekly:  { labels: ['W1','W2','W3','W4'], data: [5,7,6,6] },
      monthly: { labels: ['Oct','Nov','Dec','Jan','Feb','Mar'], data: [12,14,8,17,20,24] },
    },
    members: {
      daily:   { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], data: [2,3,4,3,4,6,1] },
      weekly:  { labels: ['W1','W2','W3','W4'], data: [4,6,5,3] },
      monthly: { labels: ['Oct','Nov','Dec','Jan','Feb','Mar'], data: [9,12,6,15,15,18] },
    },
    attendance: {
      daily:   { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], data: [37,47,56,42,61,69,24] },
      weekly:  { labels: ['W1','W2','W3','W4'], data: [274,306,297,320] },
      monthly: { labels: ['Oct','Nov','Dec','Jan','Feb','Mar'], data: [1020,1190,940,1320,1410,1510] },
    },
  },
}

// ── Stats per branch ───────────────────────────────────────────────────────
const branchStats = {
  all: {
    overview: [
      { label: 'Logbook Entries', value: '1,284', icon: '📓', change: '+9.3%',  up: true  },
      { label: 'New App Users',   value: '58',    icon: '📱', change: '+21.5%', up: true  },
      { label: 'New Members',     value: '42',    icon: '🏋️', change: '+18.7%', up: true  },
      { label: 'Avg. Attendance', value: '67%',   icon: '📅', change: '-2.1%',  up: false },
    ],
    logbook:    { total: '1,284', peak: 'Saturday', avgPerUser: '3.7', totalChange: '+9.3%', avgChange: '+1.2%' },
    appusers:   { total: '412',   newMonth: '58',   dailyActive: '189', totalChange: '+21.5%', newChange: '+14.2%', dailyChange: '+5.8%' },
    members:    { total: '348',   newMonth: '42',   churned: '11',  retention: '96.8%', totalChange: '+8.2%', newChange: '+18.7%', churnChange: '+1.4%', retentionChange: '+2.3%' },
    attendance: { avgDaily: '113', peak: 'Saturday', utilization: '67%', avgChange: '+4.2%', utilChange: '-2.1%' },
  },
  'general-luna': {
    overview: [
      { label: 'Logbook Entries', value: '731',  icon: '📓', change: '+8.1%',  up: true  },
      { label: 'New App Users',   value: '34',   icon: '📱', change: '+19.2%', up: true  },
      { label: 'New Members',     value: '24',   icon: '🏋️', change: '+16.4%', up: true  },
      { label: 'Avg. Attendance', value: '71%',  icon: '📅', change: '+1.4%',  up: true  },
    ],
    logbook:    { total: '731',  peak: 'Saturday', avgPerUser: '4.1', totalChange: '+8.1%', avgChange: '+2.0%' },
    appusers:   { total: '238',  newMonth: '34',   dailyActive: '109', totalChange: '+19.2%', newChange: '+12.1%', dailyChange: '+6.3%' },
    members:    { total: '201',  newMonth: '24',   churned: '6',  retention: '97.3%', totalChange: '+7.5%', newChange: '+16.4%', churnChange: '+0.8%', retentionChange: '+2.8%' },
    attendance: { avgDaily: '65', peak: 'Saturday', utilization: '71%', avgChange: '+5.1%', utilChange: '+1.4%' },
  },
  'rimando': {
    overview: [
      { label: 'Logbook Entries', value: '553',  icon: '📓', change: '+10.8%', up: true  },
      { label: 'New App Users',   value: '24',   icon: '📱', change: '+24.1%', up: true  },
      { label: 'New Members',     value: '18',   icon: '🏋️', change: '+21.4%', up: true  },
      { label: 'Avg. Attendance', value: '61%',  icon: '📅', change: '-6.2%',  up: false },
    ],
    logbook:    { total: '553',  peak: 'Saturday', avgPerUser: '3.1', totalChange: '+10.8%', avgChange: '+0.4%' },
    appusers:   { total: '174',  newMonth: '24',   dailyActive: '80', totalChange: '+24.1%', newChange: '+16.7%', dailyChange: '+5.0%' },
    members:    { total: '147',  newMonth: '18',   churned: '5',  retention: '96.1%', totalChange: '+9.2%', newChange: '+21.4%', churnChange: '+2.1%', retentionChange: '+1.7%' },
    attendance: { avgDaily: '48', peak: 'Saturday', utilization: '61%', avgChange: '+3.1%', utilChange: '-6.2%' },
  },
}

// ── Activity per branch ───────────────────────────────────────────────────
const allActivity = [
  { id: 1, type: 'join',    message: 'Janine Somera joined as Monthly member',         time: '2 mins ago',   branch: 'general-luna' },
  { id: 2, type: 'payment', message: 'Roven Santos renewed his Annual plan',           time: '18 mins ago',  branch: 'rimando'      },
  { id: 3, type: 'expire',  message: "Abegail Moyaen's membership expiring in 3 days", time: '1 hour ago',   branch: 'general-luna' },
  { id: 4, type: 'join',    message: 'Kurt Morales joined as Quarterly member',        time: '3 hours ago',  branch: 'rimando'      },
  { id: 5, type: 'join',    message: 'Jochelle Maltu signed up on the app',            time: '5 hours ago',  branch: 'general-luna' },
]

// ── Members per branch ────────────────────────────────────────────────────
const allMembers = [
  { id: 1, name: 'Roven Santos',   plan: 'Monthly',   status: 'active',   expiry: 'Apr 15, 2026', branch: 'rimando'      },
  { id: 2, name: 'Abegail Moyaen', plan: 'Annual',    status: 'active',   expiry: 'Mar 10, 2027', branch: 'general-luna' },
  { id: 3, name: 'Jochelle Maltu', plan: 'Monthly',   status: 'expiring', expiry: 'Mar 18, 2026', branch: 'general-luna' },
  { id: 4, name: 'Janina Somera',  plan: 'Quarterly', status: 'active',   expiry: 'Jun 1, 2026',  branch: 'rimando'      },
  { id: 5, name: 'Kurt Morales',   plan: 'Monthly',   status: 'active',   expiry: 'Apr 20, 2026', branch: 'rimando'      },
  { id: 6, name: 'Mae Dela Cruz',  plan: 'Annual',    status: 'active',   expiry: 'Dec 5, 2026',  branch: 'general-luna' },
  { id: 7, name: 'Paolo Reyes',    plan: 'Monthly',   status: 'expiring', expiry: 'Apr 5, 2026',  branch: 'rimando'      },
]

// ── Computed filtered data ─────────────────────────────────────────────────
const currentStats    = computed(() => branchStats[selectedBranch.value])
const filteredActivity = computed(() =>
  selectedBranch.value === 'all'
    ? allActivity
    : allActivity.filter(a => a.branch === selectedBranch.value)
)
const filteredMembers = computed(() =>
  selectedBranch.value === 'all'
    ? allMembers
    : allMembers.filter(m => m.branch === selectedBranch.value)
)
const branchLabel = computed(() =>
  branches.find(b => b.value === selectedBranch.value)?.label ?? ''
)
const currentChartData = computed(() => allChartData[selectedBranch.value])

// ── Chart setup ───────────────────────────────────────────────────────────
type DataKey = 'logbook' | 'users' | 'members' | 'attendance'
type Period   = 'daily' | 'weekly' | 'monthly'

const periods = ref<Record<string, Period>>({
  'ov-logbook': 'weekly', 'ov-users': 'weekly', 'ov-members': 'weekly',
  logbook: 'weekly', users: 'weekly', members: 'weekly', attendance: 'weekly',
})

const chartInstances = ref<Record<string, Chart>>({})

function highlightColors(data: number[]) {
  const max = Math.max(...data)
  return data.map(v => v === max ? ACCENT : MUTED)
}

const chartDefs: { id: string; key: DataKey; periodKey: string }[] = [
  { id: 'ov-logbook-chart', key: 'logbook',    periodKey: 'ov-logbook' },
  { id: 'ov-users-chart',   key: 'users',      periodKey: 'ov-users'   },
  { id: 'ov-members-chart', key: 'members',    periodKey: 'ov-members' },
  { id: 'lb-chart',         key: 'logbook',    periodKey: 'logbook'    },
  { id: 'au-chart',         key: 'users',      periodKey: 'users'      },
  { id: 'mb-chart',         key: 'members',    periodKey: 'members'    },
  { id: 'at-chart',         key: 'attendance', periodKey: 'attendance' },
]

function buildChart(canvasId: string, dataKey: DataKey, periodKey: string) {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement
  if (!canvas) return
  const p = periods.value[periodKey]
  const d = currentChartData.value[dataKey][p]
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

function initCharts() {
  chartDefs.forEach(def => buildChart(def.id, def.key, def.periodKey))
}

function setPeriod(periodKey: string, p: Period) {
  periods.value[periodKey] = p
  const def = chartDefs.find(d => d.periodKey === periodKey)
  if (!def) return
  const c = chartInstances.value[def.id]
  if (!c) return
  const d = currentChartData.value[def.key][p]
  const colors = highlightColors(d.data)
  c.data.labels = d.labels
  c.data.datasets[0].data = d.data
  ;(c.data.datasets[0] as any).backgroundColor = colors
  ;(c.data.datasets[0] as any).borderColor = colors
  c.update()
}

function refreshAllCharts() {
  chartDefs.forEach(def => {
    const c = chartInstances.value[def.id]
    if (!c) return
    const d = currentChartData.value[def.key][periods.value[def.periodKey]]
    const colors = highlightColors(d.data)
    c.data.labels = d.labels
    c.data.datasets[0].data = d.data
    ;(c.data.datasets[0] as any).backgroundColor = colors
    ;(c.data.datasets[0] as any).borderColor = colors
    c.update()
  })
}

onMounted(() => { setTimeout(initCharts, 100) })
watch(activeTab, () => { setTimeout(initCharts, 100) })
watch(selectedBranch, () => { setTimeout(refreshAllCharts, 50) })
</script>

<template>
  <div class="reports-container">

    <!-- Banner -->
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

    <!-- Controls -->
    <div class="controls-row">
      <div class="nav-tabs">
        <button v-for="tab in tabs" :key="tab.key"
          class="nav-tab" :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key as any">{{ tab.label }}</button>
      </div>

      <!-- Branch Selector -->
      <div class="branch-selector">
        <span class="branch-label">Branch</span>
        <div class="branch-btns">
          <button
            v-for="b in branches" :key="b.value"
            class="branch-btn" :class="{ active: selectedBranch === b.value }"
            @click="selectedBranch = b.value as any">
            {{ b.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Active branch pill -->
    <div v-if="selectedBranch !== 'all'" class="branch-pill-row">
      <span class="branch-active-pill">
        Showing data for: <strong>{{ branchLabel }}</strong>
        <button class="pill-clear" @click="selectedBranch = 'all'">✕ Clear</button>
      </span>
    </div>

    <!-- ── OVERVIEW ─────────────────────────────────────────── -->
    <div v-if="activeTab === 'overview'">
      <div class="stats-row">
        <div v-for="s in currentStats.overview" :key="s.label" class="box">
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
            <li v-for="item in filteredActivity" :key="item.id" class="activity-item">
              <span class="activity-dot" :class="item.type"></span>
              <div>
                <p class="activity-main">{{ item.message }}</p>
                <p class="activity-time">
                  {{ item.time }}
                  <span class="activity-branch">· {{ item.branch === 'general-luna' ? 'General Luna' : 'Rimando' }}</span>
                </p>
              </div>
            </li>
            <li v-if="filteredActivity.length === 0" class="activity-empty">No activity for this branch.</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- ── LOGBOOK ─────────────────────────────────────────── -->
    <div v-if="activeTab === 'logbook'">
      <div class="stats-row" style="grid-template-columns: repeat(3,1fr)">
        <div class="box">
          <div class="box-icon">📓</div>
          <div class="box-body"><p>Total Entries</p><h3>{{ currentStats.logbook.total }}</h3></div>
          <span class="box-change up">{{ currentStats.logbook.totalChange }}</span>
        </div>
        <div class="box">
          <div class="box-icon">🔥</div>
          <div class="box-body"><p>Peak Day</p><h3>{{ currentStats.logbook.peak }}</h3></div>
        </div>
        <div class="box">
          <div class="box-icon">👤</div>
          <div class="box-body"><p>Avg. per User</p><h3>{{ currentStats.logbook.avgPerUser }}</h3></div>
          <span class="box-change up">{{ currentStats.logbook.avgChange }}</span>
        </div>
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

    <!-- ── APP USERS ─────────────────────────────────────────── -->
    <div v-if="activeTab === 'appusers'">
      <div class="stats-row" style="grid-template-columns: repeat(3,1fr)">
        <div class="box">
          <div class="box-icon">📱</div>
          <div class="box-body"><p>Total App Users</p><h3>{{ currentStats.appusers.total }}</h3></div>
          <span class="box-change up">{{ currentStats.appusers.totalChange }}</span>
        </div>
        <div class="box">
          <div class="box-icon">✨</div>
          <div class="box-body"><p>New This Month</p><h3>{{ currentStats.appusers.newMonth }}</h3></div>
          <span class="box-change up">{{ currentStats.appusers.newChange }}</span>
        </div>
        <div class="box">
          <div class="box-icon">📲</div>
          <div class="box-body"><p>Daily Active</p><h3>{{ currentStats.appusers.dailyActive }}</h3></div>
          <span class="box-change up">{{ currentStats.appusers.dailyChange }}</span>
        </div>
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

    <!-- ── MEMBERS ─────────────────────────────────────────── -->
    <div v-if="activeTab === 'members'">
      <div class="stats-row">
        <div class="box">
          <div class="box-icon">🏋️</div>
          <div class="box-body"><p>Total Members</p><h3>{{ currentStats.members.total }}</h3></div>
          <span class="box-change up">{{ currentStats.members.totalChange }}</span>
        </div>
        <div class="box">
          <div class="box-icon">✨</div>
          <div class="box-body"><p>New This Month</p><h3>{{ currentStats.members.newMonth }}</h3></div>
          <span class="box-change up">{{ currentStats.members.newChange }}</span>
        </div>
        <div class="box">
          <div class="box-icon">👋</div>
          <div class="box-body"><p>Churned</p><h3>{{ currentStats.members.churned }}</h3></div>
          <span class="box-change down">{{ currentStats.members.churnChange }}</span>
        </div>
        <div class="box">
          <div class="box-icon">🔄</div>
          <div class="box-body"><p>Retention Rate</p><h3>{{ currentStats.members.retention }}</h3></div>
          <span class="box-change up">{{ currentStats.members.retentionChange }}</span>
        </div>
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
          <thead>
            <tr><th>Member</th><th>Plan</th><th>Status</th><th>Branch</th><th>Expiry</th></tr>
          </thead>
          <tbody>
            <tr v-for="member in filteredMembers" :key="member.id">
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
              <td>
                <span class="branch-tag">
                  {{ member.branch === 'general-luna' ? 'General Luna' : 'Rimando' }}
                </span>
              </td>
              <td>{{ member.expiry }}</td>
            </tr>
            <tr v-if="filteredMembers.length === 0">
              <td colspan="5" style="text-align:center; color:#555; padding: 20px;">No members for this branch.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── ATTENDANCE ─────────────────────────────────────────── -->
    <div v-if="activeTab === 'attendance'">
      <div class="stats-row" style="grid-template-columns: repeat(3,1fr)">
        <div class="box">
          <div class="box-icon">📅</div>
          <div class="box-body"><p>Avg. Daily</p><h3>{{ currentStats.attendance.avgDaily }}</h3></div>
          <span class="box-change up">{{ currentStats.attendance.avgChange }}</span>
        </div>
        <div class="box">
          <div class="box-icon">🔥</div>
          <div class="box-body"><p>Peak Day</p><h3>{{ currentStats.attendance.peak }}</h3></div>
        </div>
        <div class="box">
          <div class="box-icon">📊</div>
          <div class="box-body"><p>Utilization</p><h3>{{ currentStats.attendance.utilization }}</h3></div>
          <span class="box-change" :class="currentStats.attendance.utilChange.startsWith('-') ? 'down' : 'up'">
            {{ currentStats.attendance.utilChange }}
          </span>
        </div>
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

/* Welcome Banner */
.welcome-box {
  border-radius: 16px; margin-bottom: 20px;
  border: 1px solid #481E14; background: #1a1a1a;
  overflow: hidden; min-height: 110px;
}
.welcome-overlay {
  background: linear-gradient(90deg, rgba(0,0,0,0.88) 40%, rgba(232,83,26,0.15) 100%);
  padding: 24px 28px; display: flex;
  justify-content: space-between; align-items: center; min-height: 110px;
}
.welcome-text { color: #ccc; margin: 0 0 4px 0; font-size: 13px; }
.welcome-name { color: white; margin: 0 0 6px 0; font-size: 22px; font-weight: 700; }
.welcome-date { color: #aaa; margin: 0; font-size: 13px; }
.welcome-badge {
  background: #e8531a; color: white; padding: 8px 16px;
  border-radius: 20px; font-size: 12px; font-weight: 700; letter-spacing: 1px;
}

/* Controls Row */
.controls-row {
  display: flex; justify-content: space-between;
  align-items: center; margin-bottom: 12px;
  gap: 12px; flex-wrap: wrap;
}
.nav-tabs { display: flex; gap: 4px; flex-wrap: wrap; }
.nav-tab {
  background: #1a1a1a; border: 1px solid #481E14;
  color: #aaa; padding: 8px 16px; border-radius: 20px;
  font-size: 13px; font-weight: 500; cursor: pointer; transition: 0.2s;
}
.nav-tab:hover { border-color: #e8531a; color: #fff; }
.nav-tab.active { background: #e8531a; border-color: #e8531a; color: white; }

/* Branch Selector */
.branch-selector {
  display: flex; align-items: center; gap: 10px;
}
.branch-label {
  color: #777; font-size: 12px; font-weight: 500;
  white-space: nowrap;
}
.branch-btns { display: flex; gap: 4px; }
.branch-btn {
  background: #1a1a1a; border: 1px solid #481E14;
  color: #aaa; padding: 7px 14px; border-radius: 20px;
  font-size: 12px; font-weight: 500; cursor: pointer; transition: 0.2s;
  white-space: nowrap;
}
.branch-btn:hover { border-color: #e8531a; color: #fff; }
.branch-btn.active { background: #481E14; border-color: #e8531a; color: #e8531a; }

/* Active branch pill */
.branch-pill-row { margin-bottom: 16px; }
.branch-active-pill {
  display: inline-flex; align-items: center; gap: 10px;
  background: #1f1210; border: 1px solid #e8531a;
  color: #e8531a; padding: 6px 14px; border-radius: 20px;
  font-size: 12px;
}
.branch-active-pill strong { color: #ff7a47; }
.pill-clear {
  background: none; border: none; color: #e8531a;
  cursor: pointer; font-size: 11px; padding: 0; opacity: 0.7;
}
.pill-clear:hover { opacity: 1; }

/* Stats Row */
.stats-row {
  display: grid; grid-template-columns: repeat(4,1fr);
  gap: 16px; margin-bottom: 20px;
}
.box {
  background: #1a1a1a; padding: 18px 20px; border-radius: 16px;
  border: 1px solid #481E14; display: flex; align-items: center;
  gap: 14px; cursor: pointer; transition: 0.2s ease; position: relative;
}
.box:hover { transform: translateY(-3px); border-color: #e8531a; background: #1f1210; }
.box-icon { font-size: 26px; flex-shrink: 0; }
.box-body { flex: 1; min-width: 0; }
.box-body p { color: #aaa; margin: 0 0 4px 0; font-size: 12px; }
.box-body h3 { color: white; margin: 0; font-size: 22px; font-weight: 700; }
.box-change { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 10px; white-space: nowrap; flex-shrink: 0; }
.box-change.up   { background: #14532d; color: #4ade80; }
.box-change.down { background: #451a03; color: #facc15; }

/* Panel */
.panel {
  background: #1a1a1a; border-radius: 16px;
  border: 1px solid #481E14; padding: 20px;
}
.panel-header {
  display: flex; align-items: center;
  justify-content: space-between; margin-bottom: 18px;
  flex-wrap: wrap; gap: 10px;
}
.panel-title { color: white; margin: 0 0 18px 0; font-size: 15px; font-weight: 600; }
.panel-header .panel-title { margin-bottom: 0; }

/* Period buttons */
.period-group {
  display: flex; background: #0c0c0c;
  border: 1px solid #481E14; border-radius: 20px;
  padding: 3px; gap: 2px;
}
.period-btn {
  background: none; border: none; color: #777;
  padding: 5px 13px; border-radius: 16px; font-size: 12px;
  cursor: pointer; transition: 0.2s;
}
.period-btn.active { background: #e8531a; color: white; }
.period-btn:not(.active):hover { color: #fff; }

/* Charts */
.chart-wrap { position: relative; width: 100%; height: 220px; }
.chart-wrap.large { height: 280px; }

/* Activity */
.activity-list { list-style: none; padding: 0; margin: 0; }
.activity-item {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 10px 0; border-bottom: 1px solid #2a2a2a;
}
.activity-item:last-child { border-bottom: none; }
.activity-dot { width: 10px; height: 10px; border-radius: 50%; margin-top: 4px; flex-shrink: 0; }
.activity-dot.join    { background: #4ade80; }
.activity-dot.payment { background: #e8531a; }
.activity-dot.expire  { background: #facc15; }
.activity-main { color: #ddd; margin: 0 0 3px 0; font-size: 13px; }
.activity-time { color: #666; margin: 0; font-size: 11px; }
.activity-branch { color: #e8531a; font-size: 10px; }
.activity-empty { color: #555; font-size: 13px; padding: 16px 0; }

/* Member Table */
.member-table { width: 100%; border-collapse: collapse; }
.member-table th {
  color: #777; font-size: 12px; text-align: left;
  padding: 8px 10px; border-bottom: 1px solid #2a2a2a;
}
.member-table td {
  color: #ddd; font-size: 13px;
  padding: 10px; border-bottom: 1px solid #1f1f1f;
}
.member-table tr:last-child td { border-bottom: none; }
.member-cell { display: flex; align-items: center; gap: 10px; }
.avatar { width: 32px; height: 32px; border-radius: 50%; overflow: hidden; background: #2a2a2a; flex-shrink: 0; }
.avatar img { width: 100%; height: 100%; object-fit: cover; }
.badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: capitalize; }
.badge.active   { background: #14532d; color: #4ade80; }
.badge.expiring { background: #451a03; color: #facc15; }
.branch-tag {
  background: #1f1210; border: 1px solid #481E14;
  color: #e8531a; padding: 2px 10px;
  border-radius: 20px; font-size: 11px; white-space: nowrap;
}

/* Two-col */
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

/* Responsive */
@media (max-width: 1100px) {
  .controls-row { flex-direction: column; align-items: flex-start; }
  .branch-btns { flex-wrap: wrap; }
}
@media (max-width: 900px) {
  .stats-row { grid-template-columns: repeat(2,1fr); }
  .two-col   { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .stats-row { grid-template-columns: 1fr 1fr; }
  .nav-tabs  { flex-wrap: wrap; }
}
</style>