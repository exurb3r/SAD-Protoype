<template>
  <div class="calendar-container">

    <!-- Header -->
    <div class="page-header">
      <h2>Calendar</h2>
      <div class="header-actions">
        <div class="view-toggle">
          <button :class="['toggle-btn', { active: view === 'month' }]" @click="view = 'month'">Month</button>
          <button :class="['toggle-btn', { active: view === 'week' }]" @click="view = 'week'">Week</button>
        </div>
        <button class="btn-add" @click="openCreate">+ Add Event</button>
      </div>
    </div>

    <!-- Navigation -->
    <div class="cal-nav">
      <button class="nav-btn" @click="prev">&#8592;</button>
      <div class="nav-center">
        <select v-model="currentMonth" class="nav-select">
          <option v-for="(month, index) in monthNames" :key="index" :value="index">{{ month }}</option>
        </select>
        <select v-model="currentYear" class="nav-select">
          <option v-for="year in yearRange" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
      <button class="nav-btn" @click="next">&#8594;</button>
    </div>

    <!-- Legend -->
    <div class="legend">
      <span class="legend-item event">● Event</span>
    </div>

    <!-- Loading State -->
    <div class="loading-state" v-if="loading">Loading events...</div>

    <!-- Monthly View -->
    <div class="month-grid" v-if="view === 'month' && !loading">
      <div class="day-label" v-for="d in dayLabels" :key="d">{{ d }}</div>
      <div
        v-for="(day, index) in monthDays"
        :key="index"
        :class="['day-cell', { empty: !day, today: isToday(day), 'has-events': day && getEvents(day).length > 0 }]"
        @click="day && openDay(day)"
      >
        <span class="day-number" v-if="day">{{ day }}</span>
        <div class="event-dots" v-if="day">
          <span v-for="(ev, i) in getEvents(day).slice(0, 3)" :key="i" class="dot event"></span>
        </div>
      </div>
    </div>

    <!-- Weekly View -->
    <div class="week-view" v-if="view === 'week' && !loading">
      <div
        v-for="(day, index) in weekDays"
        :key="index"
        :class="['week-day', { today: isToday(day.date) }]"
        @click="openDay(day.date)"
      >
        <div class="week-day-label">{{ day.label }}</div>
        <div class="week-day-number">{{ day.date }}</div>
        <div class="week-events">
          <div v-for="(ev, i) in getEvents(day.date)" :key="i" class="week-event event">
            <span class="week-event-time" v-if="ev.time">{{ formatTime(ev.time) }}</span>
            {{ ev.title }}
          </div>
        </div>
      </div>
    </div>

    <!-- Day Detail Modal -->
    <div class="modal-overlay" v-if="selectedDay" @click.self="selectedDay = null">
      <div class="modal">
        <h3>{{ formatSelectedDay }}</h3>
        <div v-if="getEvents(selectedDay).length > 0">
          <div v-for="(ev, i) in getEvents(selectedDay)" :key="i" class="event-item event">
            <span class="event-badge event">Event</span>
            <div class="event-info">
              <span class="event-title">{{ ev.title }}</span>
              <span class="event-time" v-if="ev.time">{{ formatTime(ev.time) }}</span>
              <span class="event-description" v-if="ev.description">{{ ev.description }}</span>
            </div>
            <div class="event-actions">
              <button class="btn-icon edit" @click.stop="openEdit(ev)">✏️</button>
              <button class="btn-icon delete" @click.stop="confirmDelete(ev)">🗑️</button>
            </div>
          </div>
        </div>
        <p class="no-events" v-else>No events on this day.</p>
        <button class="btn-submit" @click="selectedDay = null">Close</button>
      </div>
    </div>

    <!-- Add / Edit Event Modal -->
    <div class="modal-overlay" v-if="showForm" @click.self="showForm = false">
      <div class="modal">
        <h3>{{ editingEvent ? 'Edit Event' : 'Add New Event' }}</h3>

        <label>Event Title</label>
        <input v-model="formData.title" class="modal-input" placeholder="e.g. Sparring Day" />
        <span class="error" v-if="errors.title">{{ errors.title }}</span>

        <label>Date</label>
        <input v-model="formData.date" type="date" class="modal-input" />
        <span class="error" v-if="errors.date">{{ errors.date }}</span>

        <label>Time</label>
        <input v-model="formData.time" type="time" class="modal-input" />
        <span class="error" v-if="errors.time">{{ errors.time }}</span>

        <label>Description</label>
        <textarea v-model="formData.description" class="modal-input modal-textarea" placeholder="e.g. Sparring session for all members..."></textarea>
        <span class="error" v-if="errors.description">{{ errors.description }}</span>

        <div class="modal-actions">
          <button class="btn-submit" @click="saveEvent" :disabled="saving">
            {{ saving ? 'Saving...' : (editingEvent ? 'Update Event' : 'Add Event') }}
          </button>
          <button class="btn-reset" @click="showForm = false">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <div class="modal-overlay" v-if="deletingEvent" @click.self="deletingEvent = null">
      <div class="modal modal-sm">
        <h3>Delete Event</h3>
        <p class="confirm-text">Are you sure you want to delete <strong>{{ deletingEvent.title }}</strong>?</p>
        <div class="modal-actions">
          <button class="btn-danger" @click="deleteEvent" :disabled="saving">
            {{ saving ? 'Deleting...' : 'Delete' }}
          </button>
          <button class="btn-reset" @click="deletingEvent = null">Cancel</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
const API_BASE = 'http://localhost:3500/admins/events'

export default {
  data() {
    return {
      view: 'month',
      today: new Date(),
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      currentWeekStart: null,
      selectedDay: null,
      showForm: false,
      editingEvent: null,
      deletingEvent: null,
      loading: false,
      saving: false,
      errors: {},
      formData: { title: '', date: '', time: '', description: '' },
      dayLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      monthNames: ['January','February','March','April','May','June','July','August','September','October','November','December'],
      gymEvents: []
    }
  },

  computed: {
    yearRange() {
      const current = new Date().getFullYear()
      const years = []
      for (let y = current - 5; y <= current + 5; y++) years.push(y)
      return years
    },
    monthDays() {
      const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay()
      const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate()
      const days = []
      for (let i = 0; i < firstDay; i++) days.push(null)
      for (let d = 1; d <= daysInMonth; d++) days.push(d)
      return days
    },
    weekDays() {
      const days = []
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const start = this.currentWeekStart || this.getWeekStart(new Date())
      for (let i = 0; i < 7; i++) {
        const d = new Date(start)
        d.setDate(start.getDate() + i)
        days.push({ label: dayNames[d.getDay()], date: d.getDate(), fullDate: d })
      }
      return days
    },
    formatSelectedDay() {
      if (!this.selectedDay) return ''
      return `${this.monthNames[this.currentMonth]} ${this.selectedDay}, ${this.currentYear}`
    }
  },

  methods: {
    getToken() {
      return localStorage.getItem('adminToken')
    },
    authHeaders() {
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      }
    },
    getWeekStart(date) {
      const d = new Date(date)
      d.setDate(d.getDate() - d.getDay())
      return d
    },
    dbEventToLocal(ev) {
      const d = new Date(ev.date)
      return {
        _id:         ev._id,
        day:         d.getUTCDate(),
        month:       d.getUTCMonth(),
        year:        d.getUTCFullYear(),
        title:       ev.title,
        time:        ev.time,
        description: ev.description
      }
    },
    getEvents(day) {
      return this.gymEvents.filter(e =>
        e.day === day &&
        e.month === this.currentMonth &&
        e.year === this.currentYear
      )
    },
    isToday(day) {
      return day === this.today.getDate() &&
        this.currentMonth === this.today.getMonth() &&
        this.currentYear === this.today.getFullYear()
    },
    formatTime(time) {
      if (!time) return ''
      const [h, m] = time.split(':')
      const hour = parseInt(h)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const h12 = hour % 12 || 12
      return `${h12}:${m} ${ampm}`
    },
    toInputDate(date) {
      return new Date(date).toISOString().split('T')[0]
    },

    prev() {
      if (this.view === 'month') {
        if (this.currentMonth === 0) { this.currentMonth = 11; this.currentYear-- }
        else this.currentMonth--
      } else {
        const start = this.currentWeekStart || this.getWeekStart(new Date())
        start.setDate(start.getDate() - 7)
        this.currentWeekStart = new Date(start)
        this.currentMonth = this.currentWeekStart.getMonth()
        this.currentYear = this.currentWeekStart.getFullYear()
      }
    },
    next() {
      if (this.view === 'month') {
        if (this.currentMonth === 11) { this.currentMonth = 0; this.currentYear++ }
        else this.currentMonth++
      } else {
        const start = this.currentWeekStart || this.getWeekStart(new Date())
        start.setDate(start.getDate() + 7)
        this.currentWeekStart = new Date(start)
        this.currentMonth = this.currentWeekStart.getMonth()
        this.currentYear = this.currentWeekStart.getFullYear()
      }
    },
    openDay(day) {
      this.selectedDay = day
    },

    async fetchEvents() {
      this.loading = true
      try {
        const res = await fetch(API_BASE, { headers: this.authHeaders() })
        if (!res.ok) throw new Error('Failed to fetch events')
        const data = await res.json()
        this.gymEvents = data.map(ev => this.dbEventToLocal(ev))
      } catch (err) {
        console.error('fetchEvents:', err)
      } finally {
        this.loading = false
      }
    },

    openCreate() {
      this.editingEvent = null
      this.formData = { title: '', date: '', time: '', description: '' }
      this.errors = {}
      this.showForm = true
    },

    openEdit(ev) {
      this.editingEvent = ev
      this.formData = {
        title:       ev.title,
        date:        this.toInputDate(new Date(ev.year, ev.month, ev.day)),
        time:        ev.time,
        description: ev.description
      }
      this.errors = {}
      this.showForm = true
    },

    validate() {
      const errors = {}
      if (!this.formData.title.trim())       errors.title       = 'Title is required.'
      if (!this.formData.date)               errors.date        = 'Date is required.'
      if (!this.formData.time)               errors.time        = 'Time is required.'
      if (!this.formData.description.trim()) errors.description = 'Description is required.'
      return errors
    },

    async saveEvent() {
      this.errors = this.validate()
      if (Object.keys(this.errors).length > 0) return

      this.saving = true
      const payload = {
        title:       this.formData.title,
        date:        this.formData.date,
        time:        this.formData.time,
        description: this.formData.description
      }

      try {
        if (this.editingEvent) {
          const res = await fetch(`${API_BASE}/${this.editingEvent._id}`, {
            method: 'PUT',
            headers: this.authHeaders(),
            body: JSON.stringify(payload)
          })
          if (!res.ok) throw new Error('Failed to update event')

          const idx = this.gymEvents.findIndex(e => e._id === this.editingEvent._id)
          if (idx !== -1) {
            const d = new Date(this.formData.date)
            this.gymEvents.splice(idx, 1, {
              ...this.gymEvents[idx],
              day:         d.getUTCDate(),
              month:       d.getUTCMonth(),
              year:        d.getUTCFullYear(),
              title:       payload.title,
              time:        payload.time,
              description: payload.description
            })
          }
        } else {
          const res = await fetch(API_BASE, {
            method: 'POST',
            headers: this.authHeaders(),
            body: JSON.stringify(payload)
          })
          if (!res.ok) throw new Error('Failed to create event')
          const savedEvents = await res.json()
          this.gymEvents = savedEvents.map(ev => this.dbEventToLocal(ev))
        }

        this.showForm = false
        this.editingEvent = null
      } catch (err) {
        console.error('saveEvent:', err)
        alert('Could not save event. Please try again.')
      } finally {
        this.saving = false
      }
    },

    confirmDelete(ev) {
      this.deletingEvent = ev
    },

    async deleteEvent() {
      if (!this.deletingEvent) return
      this.saving = true
      try {
        const res = await fetch(`${API_BASE}/${this.deletingEvent._id}`, {
          method: 'DELETE',
          headers: this.authHeaders()
        })
        if (!res.ok) throw new Error('Failed to delete event')

        this.gymEvents = this.gymEvents.filter(e => e._id !== this.deletingEvent._id)
        this.deletingEvent = null

        if (this.selectedDay && this.getEvents(this.selectedDay).length === 0) {
          this.selectedDay = null
        }
      } catch (err) {
        console.error('deleteEvent:', err)
        alert('Could not delete event. Please try again.')
      } finally {
        this.saving = false
      }
    }
  },

  mounted() {
    this.currentWeekStart = this.getWeekStart(new Date())
    this.fetchEvents()
  }
}
</script>

<style scoped>
.calendar-container {
  width: 100%;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.page-header h2 {
  color: white;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.view-toggle {
  display: flex;
  border: 1px solid #481E14;
  border-radius: 10px;
  overflow: hidden;
}

.toggle-btn {
  padding: 8px 20px;
  background: transparent;
  border: none;
  color: #aaa;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
}

.toggle-btn.active {
  background: #481E14;
  color: #F2613F;
  font-weight: bold;
}

.btn-add {
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  background: #F2613F;
  color: white;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

.btn-add:hover {
  background: #9B3922;
}

.loading-state {
  text-align: center;
  color: #aaa;
  padding: 40px 0;
  font-size: 14px;
}

/* Navigation */
.cal-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}

.nav-btn {
  background: #1a1a1a;
  border: 1px solid #481E14;
  color: #F2613F;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: 0.2s;
}

.nav-btn:hover {
  background: #481E14;
}

.nav-center {
  display: flex;
  gap: 10px;
  align-items: center;
}

.nav-select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #481E14;
  background: #1a1a1a;
  color: white;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  transition: 0.2s;
}

.nav-select:focus {
  border-color: #F2613F;
}

/* Legend */
.legend {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.legend-item {
  font-size: 13px;
  font-weight: bold;
}

.legend-item.expiry       { color: #F2613F; }
.legend-item.announcement { color: #948979; }
.legend-item.event        { color: #4a9eff; }

/* Month Grid */
.month-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.day-label {
  text-align: center;
  color: #aaa;
  font-size: 13px;
  padding: 8px 0;
  font-weight: bold;
}

.day-cell {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  min-height: 80px;
  padding: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.day-cell.empty {
  background: transparent;
  border-color: transparent;
  cursor: default;
}

.day-cell:not(.empty):hover {
  border-color: #481E14;
  background: #1f1210;
}

.day-cell.today {
  border-color: #F2613F;
}

.day-number {
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.day-cell.today .day-number {
  color: #F2613F;
}

.event-dots {
  display: flex;
  gap: 4px;
  margin-top: 6px;
  flex-wrap: wrap;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot.expiry       { background: #F2613F; }
.dot.announcement { background: #948979; }
.dot.event        { background: #4a9eff; }

/* Weekly View */
.week-view {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.week-day {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 12px 8px;
  min-height: 200px;
  cursor: pointer;
  transition: 0.2s;
}

.week-day:hover {
  border-color: #481E14;
}

.week-day.today {
  border-color: #F2613F;
}

.week-day-label {
  color: #aaa;
  font-size: 12px;
  text-align: center;
  margin-bottom: 4px;
}

.week-day-number {
  color: white;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

.week-day.today .week-day-number {
  color: #F2613F;
}

.week-events {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.week-event {
  font-size: 11px;
  padding: 4px 6px;
  border-radius: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.week-event-time {
  font-size: 10px;
  opacity: 0.75;
  font-weight: bold;
}

.week-event.expiry       { background: #481E14; color: #F2613F; }
.week-event.announcement { background: #2a2520; color: #948979; }
.week-event.event        { background: #1a2a3a; color: #4a9eff; }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: #1a1a1a;
  border: 1px solid #481E14;
  border-radius: 16px;
  padding: 32px;
  width: 420px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-sm {
  width: 340px;
}

.modal h3 {
  color: white;
  margin: 0;
}

.modal label {
  color: #aaa;
  font-size: 13px;
}

.modal-input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #481E14;
  background: #0C0C0C;
  color: white;
  font-size: 14px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  transition: 0.2s;
}

.modal-input:focus {
  border-color: #F2613F;
}

.modal-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.error {
  color: #c0392b;
  font-size: 12px;
}

/* Day Detail Event Items */
.event-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 6px;
}

.event-item.expiry       { background: #1f1210; }
.event-item.announcement { background: #1e1c1a; }
.event-item.event        { background: #141e2a; }

.event-badge {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: bold;
  white-space: nowrap;
  margin-top: 2px;
}

.event-badge.expiry       { background: #481E14; color: #F2613F; }
.event-badge.announcement { background: #2a2520; color: #948979; }
.event-badge.event        { background: #1a2a3a; color: #4a9eff; }

.event-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
}

.event-title {
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.event-time {
  color: #aaa;
  font-size: 12px;
}

.event-description {
  color: #888;
  font-size: 12px;
  font-style: italic;
}

.event-actions {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-left: auto;
}

.btn-icon {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 15px;
  padding: 4px;
  border-radius: 6px;
  transition: 0.2s;
  line-height: 1;
}

.btn-icon.edit:hover  { background: #1a2a3a; }
.btn-icon.delete:hover { background: #2a1010; }

.no-events {
  color: #555;
  text-align: center;
  padding: 20px 0;
}

.confirm-text {
  color: #ccc;
  font-size: 14px;
  margin: 0;
}

.confirm-text strong {
  color: white;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}

.btn-submit {
  padding: 10px 24px;
  border-radius: 10px;
  border: none;
  background: #F2613F;
  color: white;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background: #9B3922;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-danger {
  padding: 10px 24px;
  border-radius: 10px;
  border: none;
  background: #7f1d1d;
  color: #fca5a5;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

.btn-danger:hover:not(:disabled) {
  background: #991b1b;
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-reset {
  padding: 10px 24px;
  border-radius: 10px;
  border: 1px solid #481E14;
  background: transparent;
  color: #aaa;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-reset:hover {
  background: #481E14;
  color: white;
}
</style>