<template>
  <div class="audit-container">

    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <div class="shield-icon">
          <span class="icon">🛡</span>
        </div>
        <h2>Audit Trail</h2>
      </div>
      <div class="header-actions">
        <input v-model="search" class="search-input" type="text" placeholder="Search user or action..." />
        <select v-model="statusFilter" class="search-input select-input">
          <option value="All">All Statuses</option>
          <option value="OK">OK</option>
          <option value="Failed">Failed</option>
        </select>
      </div>
    </div>

    <!-- Category Filters -->
    <div class="filter-row">
      <button
        v-for="cat in categories"
        :key="cat"
        :class="['filter-btn', { active: activeFilter === cat }]"
        @click="activeFilter = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Table -->
    <div class="table-wrapper" v-if="filteredLogs.length > 0">
      <table class="audit-table">
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Admin / User</th>
            <th>Action</th>
            <th>Category</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="log in filteredLogs"
            :key="log.id"
            class="table-row"
            @click="selectedLog = log"
          >
            <td class="td-datetime">
              <span class="log-date">{{ log.date }}</span>
              <span class="log-time">{{ log.time }}</span>
            </td>
            <td class="td-user">
              <div class="user-cell">
                <div class="avatar">{{ log.user.charAt(0).toUpperCase() }}</div>
                <span>{{ log.user }}</span>
              </div>
            </td>
            <td class="td-action">{{ log.action }}</td>
            <td>
              <span class="badge cat-badge">{{ log.category }}</span>
            </td>
            <td>
              <span :class="['badge', log.status === 'OK' ? 'badge-ok' : 'badge-failed']">
                {{ log.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="no-results" v-else>
      No audit records found.
    </div>

    <!-- Detail Modal -->
    <div class="modal-overlay" v-if="selectedLog" @click.self="selectedLog = null">
      <div class="modal">

        <div class="modal-header">
          <h3>Activity Detail</h3>
          <button class="close-btn" @click="selectedLog = null">&times;</button>
        </div>

        <hr class="divider" />

        <div class="modal-action-row">
          <div class="action-icon-circle">
            <span>{{ categoryIcon(selectedLog.category) }}</span>
          </div>
          <div>
            <div class="action-name">{{ selectedLog.action }}</div>
            <div class="action-cat">{{ selectedLog.category }}</div>
          </div>
        </div>

        <hr class="divider" />

        <div class="detail-grid">
          <div class="detail-row">
            <span class="det-label">👤 Admin</span>
            <span class="det-val">{{ selectedLog.user }}</span>
          </div>
          <div class="detail-row">
            <span class="det-label">📅 Date</span>
            <span class="det-val">{{ selectedLog.date }}</span>
          </div>
          <div class="detail-row">
            <span class="det-label">🕐 Time</span>
            <span class="det-val">{{ selectedLog.time }}</span>
          </div>
          <div class="detail-row">
            <span class="det-label">📋 Status</span>
            <span class="det-val">
              <span :class="['badge', selectedLog.status === 'OK' ? 'badge-ok' : 'badge-failed']">
                {{ selectedLog.status }}
              </span>
            </span>
          </div>
        </div>

        <hr class="divider" />

        <div class="detail-row">
          <span class="det-label">📝 Notes</span>
          <span class="det-val notes-val">{{ selectedLog.notes }}</span>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
const CATEGORY_ICONS = {
  Authentication: '🔒',
  Archives: '📦',
  Members: '👥',
  Membership: '🪪',
  Events: '📅',
  Community: '💬',
  Rewards: '🏆',
}

const ACTION_NOTES = {
  'Login':            ['Admin authenticated successfully.', 'Login attempt failed — wrong password.', 'Session started from new IP address.'],
  'Logout':           ['Session ended normally.', 'Auto-logout due to inactivity.'],
  'Add Member':       ['New member profile created.', 'Member creation failed — duplicate email.', 'Member added with basic plan.'],
  'Delete Member':    ['Member record permanently removed.', 'Deletion failed — active subscription exists.'],
  'Update Member':    ['Profile details updated successfully.', 'Contact info revised.', 'Emergency contact updated.'],
  'Add Membership':   ['New membership plan assigned.', 'Membership creation failed — invalid tier.'],
  'Edit Membership':  ['Plan tier changed successfully.', 'Membership details updated.', 'Membership expiration extended.'],
  'Remove Membership':['Membership cancelled and removed.'],
  'Add Archive':      ['New archive created.', 'Archive creation failed — invalid name.', 'Archive added with default settings.'],
  'Delete Archive':   ['Archive record permanently removed.', 'Deletion failed — archive is not empty.'],
  'Update Archive':   ['Archive details updated successfully.', 'Contact info revised.', 'Emergency contact updated.'],
  'Add Gym Event':    ['Event added to gym calendar.', 'Event creation failed — conflicting schedule.'],
  'Community Post':   ['Announcement posted to community board.', 'Post failed — content policy violation.'],
  'Provide Reward':   ['EXP and achievement badge granted to user.', 'Reward failed — user not found.'],
  'Delete App User':  ['App user account permanently deleted.', 'Deletion failed — insufficient permissions.'],
  'Edit App User':    ['Recovery email updated.', 'Password reset link issued.', 'App user credentials changed.'],
}

const ACTIONS_BY_CATEGORY = {
  Authentication: ['Login', 'Logout'],
  Archives: ['Add Archive', 'Delete Archive', 'Update Archive'],
  Members: ['Add Member', 'Delete Member', 'Update Member', 'Delete App User', 'Edit App User'],
  Membership: ['Add Membership', 'Edit Membership', 'Remove Membership'],
  Events: ['Add Gym Event'],
  Community: ['Community Post'],
  Rewards: ['Provide Reward'],
}

const ALL_ACTIONS = Object.values(ACTIONS_BY_CATEGORY).flat()
const ADMINS = ['admin@gmail.com', 'renzoadmin@gmail.com', 'coach_mika@gmail.com', 'sys_admin@gmail.com', 'jay.trainer@gmail.com']

function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function pad(n) { return String(n).padStart(2, '0') }
function catOf(action) {
  return Object.keys(ACTIONS_BY_CATEGORY).find(c => ACTIONS_BY_CATEGORY[c].includes(action)) || 'Other'
}

function generateLogs() {
  const logs = []
  const now = new Date()
  for (let i = 0; i < 42; i++) {
    const d = new Date(now - i * Math.floor(Math.random() * 5 + 1) * 3600000 - Math.random() * 3600000)
    const action = rnd(ALL_ACTIONS)
    const status = Math.random() > 0.15 ? 'OK' : 'Failed'
    const noteArr = ACTION_NOTES[action] || ['Action performed.']
    const filtered = status === 'Failed'
      ? noteArr.filter(n => n.toLowerCase().includes('fail'))
      : noteArr.filter(n => !n.toLowerCase().includes('fail'))
    logs.push({
      id: i + 1,
      date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
      time: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
      user: rnd(ADMINS),
      action,
      category: catOf(action),
      status,
      notes: filtered.length ? rnd(filtered) : rnd(noteArr),
    })
  }
  return logs.sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))
}

export default {
  name: 'AuditTrail',
  data() {
    return {
      search: '',
      activeFilter: 'All',
      statusFilter: 'All',
      selectedLog: null,
      categories: ['All', 'Authentication', 'Archives', 'Members', 'Membership', 'Events', 'Community', 'Rewards'],
      logs: generateLogs(),
    }
  },
  computed: {
    filteredLogs() {
      const q = this.search.toLowerCase()
      return this.logs.filter(l => {
        const matchSearch = !q || l.user.includes(q) || l.action.toLowerCase().includes(q) || l.category.toLowerCase().includes(q)
        const matchStatus = this.statusFilter === 'All' || l.status === this.statusFilter
        const matchCat = this.activeFilter === 'All' || l.category === this.activeFilter
        return matchSearch && matchStatus && matchCat
      })
    }
  },
  methods: {
    categoryIcon(cat) {
      return CATEGORY_ICONS[cat] || '⚙️'
    }
  }
}
</script>

<style scoped>
.audit-container {
  width: 100%;
}

/* Header */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.shield-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #481E14;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.page-header h2 {
  color: white;
  margin: 0;
  font-size: 20px;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid #481E14;
  background: #1a1a1a;
  color: white;
  font-size: 14px;
  width: 220px;
  outline: none;
  transition: 0.2s;
}

.search-input:focus {
  border-color: #F2613F;
}

.select-input {
  width: 160px;
  cursor: pointer;
}

/* Filter Row */
.filter-row {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid #481E14;
  background: transparent;
  color: #aaa;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
}

.filter-btn:hover {
  border-color: #F2613F;
  color: #F2613F;
}

.filter-btn.active {
  background: #481E14;
  color: #F2613F;
  border-color: #481E14;
  font-weight: bold;
}

/* Table */
.table-wrapper {
  background: #111;
  border: 1px solid #481E14;
  border-radius: 14px;
  overflow: hidden;
}

.audit-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.audit-table thead th {
  background: #1a1a1a;
  color: #aaa;
  font-weight: 500;
  padding: 12px 16px;
  border-bottom: 1px solid #481E14;
  text-align: left;
}

.table-row {
  border-bottom: 0.5px solid #2a1a14;
  cursor: pointer;
  transition: background 0.15s;
}

.table-row:hover {
  background: #1f1010;
}

.table-row:last-child {
  border-bottom: none;
}

.audit-table td {
  padding: 12px 16px;
  color: #ccc;
  vertical-align: middle;
}

.td-datetime .log-date {
  display: block;
  color: #888;
}

.td-datetime .log-time {
  display: block;
  font-size: 11px;
  color: #555;
  margin-top: 2px;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #481E14;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #F2613F;
  flex-shrink: 0;
}

.td-action {
  color: white;
  font-weight: 500;
}

/* Badges */
.badge {
  display: inline-block;
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}

.cat-badge {
  background: #1f1217;
  color: #c77ddb;
  border: 1px solid #3d1f4a;
}

.badge-ok {
  background: #0d2b1d;
  color: #3ddc84;
}

.badge-failed {
  background: #2b0d0d;
  color: #e25c5c;
}

/* No results */
.no-results {
  text-align: center;
  color: #555;
  padding: 60px;
  background: #1a1a1a;
  border-radius: 16px;
  border: 1px solid #481E14;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: #1a1a1a;
  border: 1px solid #481E14;
  border-radius: 16px;
  padding: 28px;
  width: 440px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  color: white;
  margin: 0;
  font-size: 16px;
}

.close-btn {
  background: none;
  border: none;
  color: #aaa;
  font-size: 22px;
  cursor: pointer;
  line-height: 1;
  padding: 0;
}

.close-btn:hover {
  color: #F2613F;
}

.divider {
  border: none;
  border-top: 1px solid #2a1a14;
  margin: 0;
}

.modal-action-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.action-icon-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #481E14;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.action-name {
  color: white;
  font-size: 15px;
  font-weight: 600;
}

.action-cat {
  color: #aaa;
  font-size: 12px;
  margin-top: 3px;
}

.detail-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.det-label {
  color: #666;
  font-size: 13px;
  min-width: 90px;
  flex-shrink: 0;
}

.det-val {
  color: #ddd;
  font-size: 13px;
  flex: 1;
}

.notes-val {
  color: #aaa;
  line-height: 1.6;
}
</style>
