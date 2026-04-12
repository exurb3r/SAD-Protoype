<template>
  <div class="announcements-container">

    <!-- Header -->
    <div class="page-header">
      <h2></h2>
      <div class="header-actions">
        <input v-model="search" class="search-input" type="text" placeholder="Search announcements..." />
        <button class="btn-add" @click="openCreate">+ New Announcement</button>
      </div>
    </div>

    <!-- Filter by Audience -->
    <div class="filter-row">
      <button
        v-for="tag in audiences"
        :key="tag"
        :class="['filter-btn', { active: activeFilter === tag }]"
        @click="activeFilter = tag"
      >
        {{ tag }}
      </button>
    </div>

    <!-- Cards Grid -->
    <div class="cards-grid" v-if="filteredAnnouncements.length > 0">
      <div class="card" v-for="announcement in filteredAnnouncements" :key="announcement.id">
        <div class="card-top">
          <span :class="['audience-badge', announcement.audience.toLowerCase().replace(' ', '-')]">
            {{ announcement.audience }}
          </span>
          <span class="date">{{ announcement.date }}</span>
        </div>
        <h3 class="card-title">{{ announcement.title }}</h3>
        <p class="card-body">{{ announcement.message }}</p>
        <div class="card-actions">
          <button class="btn edit" @click="openEdit(announcement)">Edit</button>
          <button class="btn delete" @click="deletingAnnouncement = announcement">Delete</button>
        </div>
      </div>
    </div>

    <div class="no-results" v-else>
      No announcements found.
    </div>

    <!-- Create / Edit Modal -->
    <div class="modal-overlay" v-if="showForm" @click.self="showForm = false">
      <div class="modal">
        <h3>{{ isEditing ? 'Edit Announcement' : 'New Announcement' }}</h3>

        <label>Title</label>
        <input v-model="formData.title" class="modal-input" placeholder="e.g. Gym Closure Notice" />
        <span class="error" v-if="errors.title">{{ errors.title }}</span>

        <label>Message</label>
        <textarea v-model="formData.message" class="modal-input textarea" placeholder="Write your announcement here..."></textarea>
        <span class="error" v-if="errors.message">{{ errors.message }}</span>

        <label>Target Audience</label>
        <select v-model="formData.audience" class="modal-input">
          <option value="" disabled>Select audience</option>
          <option>All Members</option>
          <option>Premium</option>
          <option>Standard</option>
          <option>Basic</option>
        </select>
        <span class="error" v-if="errors.audience">{{ errors.audience }}</span>

        <div class="modal-actions">
          <button class="btn-submit" @click="saveAnnouncement">{{ isEditing ? 'Save Changes' : 'Post' }}</button>
          <button class="btn-reset" @click="showForm = false">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal-overlay" v-if="deletingAnnouncement" @click.self="deletingAnnouncement = null">
      <div class="modal">
        <h3>Delete Announcement?</h3>
        <p class="delete-msg">Are you sure you want to delete <span>{{ deletingAnnouncement.title }}</span>? This cannot be undone.</p>
        <div class="modal-actions">
          <button class="btn delete" @click="confirmDelete">Yes, Delete</button>
          <button class="btn-reset" @click="deletingAnnouncement = null">Cancel</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      activeFilter: 'All',
      showForm: false,
      isEditing: false,
      deletingAnnouncement: null,
      errors: {},
      formData: { title: '', message: '', audience: '' },
      audiences: ['All', 'All Members', 'Premium', 'Standard', 'Basic'],
      announcements: [
        { id: 1, title: 'Gym Closed on Holidays', message: 'Gym is closed due to the opening of the Panagbenga Festival. ', audience: 'All Members', date: 'Feb 1, 2026' },
        { id: 2, title: 'New Premium Perks', message: 'Premium members now get access to Abie relapse music playlist and free towel service every visit.', audience: 'Premium', date: 'Feb 25, 2026' },
        { id: 3, title: 'Schedule Change', message: 'New schedule!', audience: 'Standard', date: 'Feb 20, 2026' },
        { id: 4, title: 'Membership Renewal Reminder', message: 'Get membership or renew now!', audience: 'Basic', date: 'Feb 15, 2026' },
        { id: 5, title: 'New Equipment Arrived', message: 'Must-try: Threadmill with advanced tracking and income tax return.', audience: 'All Members', date: 'Feb 10, 2026' },
      ]
    }
  },
  computed: {
    filteredAnnouncements() {
      return this.announcements.filter(a => {
        const matchSearch = a.title.toLowerCase().includes(this.search.toLowerCase()) ||
                            a.message.toLowerCase().includes(this.search.toLowerCase())
        const matchFilter = this.activeFilter === 'All' || a.audience === this.activeFilter
        return matchSearch && matchFilter
      })
    }
  },
  methods: {
    openCreate() {
      this.isEditing = false
      this.formData = { title: '', message: '', audience: '' }
      this.errors = {}
      this.showForm = true
    },
    openEdit(announcement) {
      this.isEditing = true
      this.formData = { ...announcement }
      this.errors = {}
      this.showForm = true
    },
    validate() {
      const errors = {}
      if (!this.formData.title.trim())   errors.title    = 'Title is required.'
      if (!this.formData.message.trim()) errors.message  = 'Message is required.'
      if (!this.formData.audience)       errors.audience = 'Please select a target audience.'
      return errors
    },
    saveAnnouncement() {
      this.errors = this.validate()
      if (Object.keys(this.errors).length > 0) return

      if (this.isEditing) {
        const index = this.announcements.findIndex(a => a.id === this.formData.id)
        if (index !== -1) this.announcements[index] = { ...this.formData }
      } else {
        this.announcements.unshift({
          id: Date.now(),
          title: this.formData.title,
          message: this.formData.message,
          audience: this.formData.audience,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        })
      }
      this.showForm = false
    },
    confirmDelete() {
      this.announcements = this.announcements.filter(a => a.id !== this.deletingAnnouncement.id)
      this.deletingAnnouncement = null
    }
  }
}
</script>

<style scoped>
.announcements-container {
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

.page-header h2 {
  color: white;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
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
  white-space: nowrap;
}

.btn-add:hover {
  background: #9B3922;
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

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.card {
  background: #1a1a1a;
  border: 1px solid #481E14;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: 0.2s;
}

.card:hover {
  border-color: #9B3922;
  transform: translateY(-3px);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.audience-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: bold;
  background: #481E14;
  color: #F2613F;
}

.date {
  color: #555;
  font-size: 12px;
}

.card-title {
  color: white;
  margin: 0;
  font-size: 16px;
}

.card-body {
  color: #aaa;
  font-size: 13px;
  margin: 0;
  line-height: 1.6;
  flex: 1;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

/* Buttons */
.btn {
  padding: 6px 14px;
  border-radius: 8px;
  border: none;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
}

.btn.edit {
  background-color: #2a2a2a;
  color: #aaa;
}

.btn.edit:hover {
  background-color: #444;
  color: white;
}

.btn.delete {
  background-color: #1a1a1a;
  color: #c0392b;
  border: 1px solid #c0392b;
}

.btn.delete:hover {
  background-color: #c0392b;
  color: white;
}

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
  gap: 10px;
}

.modal h3 {
  color: white;
  margin: 0 0 4px 0;
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

.textarea {
  height: 120px;
  resize: vertical;
}

.error {
  color: #c0392b;
  font-size: 12px;
}

.delete-msg {
  color: #aaa;
  font-size: 14px;
  text-align: center;
}

.delete-msg span {
  color: #F2613F;
  font-weight: bold;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
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

.btn-submit:hover {
  background: #9B3922;
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