<template>
  <div class="members-container">

    <div class="members-header">
      <h2>Members</h2>
      <div class="header-right">
        <input v-model="search" class="search-input" type="text" placeholder="Search members..." />
      </div>
    </div>

    <!-- BRANCH TABS -->
    <div class="branch-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        :class="['tab-btn', { active: activeTab === tab.value }]"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
        <span class="tab-count">{{ tabCount(tab.value) }}</span>
      </button>
    </div>

    <div v-if="loading" class="loading">Loading members...</div>
    <div v-if="error" class="error-msg">{{ error }}</div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Member</th>
            <th>Memberships</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="member in filteredMembers" :key="member._id">
            <td class="member-info">
              <div class="avatar">{{ initials(member.firstname, member.lastname) }}</div>
              <span>{{ member.firstname }} {{ member.lastname }}</span>
            </td>

            <td>
              <div class="membership-badges">
                <span
                  v-for="(ms, i) in member.membershipStatus"
                  :key="i"
                  :class="['badge', ms.isActive ? 'active' : 'inactive']"
                >
                  {{ ms.category }} — {{ ms.branch }}
                </span>
              </div>
            </td>

            <td>{{ member.contactNum }}</td>

            <td class="actions">
              <button class="btn view" @click="viewMember(member)">View</button>
              <button class="btn edit" @click="editMember(member)">Edit</button>
              <button class="btn delete" @click="deletingMember = member">Delete</button>
            </td>
          </tr>

          <tr v-if="filteredMembers.length === 0 && !loading">
            <td colspan="4" class="no-results">No members found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- VIEW MODAL -->
    <div class="modal-overlay" v-if="selectedMember" @click.self="selectedMember = null">
      <div class="modal">
        <div class="modal-avatar">
          {{ initials(selectedMember.firstname, selectedMember.lastname) }}
        </div>

        <h3>{{ selectedMember.firstname }} {{ selectedMember.lastname }}</h3>

        <p><span>Contact:</span> {{ selectedMember.contactNum }}</p>
        <p><span>Contact Person:</span> {{ selectedMember.contactPerson }}</p>
        <p><span>Contact Person Number:</span> {{ selectedMember.contactPersonNum }}</p>
        <p><span>Address:</span> {{ selectedMember.address }}</p>

        <div class="section-label">Memberships</div>
        <div
          v-for="(ms, i) in selectedMember.membershipStatus"
          :key="i"
          class="membership-card"
          :class="ms.isActive ? 'ms-active' : 'ms-inactive'"
        >
          <div class="ms-row">
            <span class="ms-category">{{ ms.category }}</span>
            <span :class="['ms-status', ms.isActive ? 'active' : 'inactive']">
              {{ ms.isActive ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <div class="ms-row">
            <span class="ms-meta">Branch: {{ ms.branch }}</span>
            <span class="ms-meta">Expires: {{ formatDate(ms.expiryDate) }}</span>
          </div>
        </div>

        <button class="btn delete" style="margin-top:8px" @click="selectedMember = null">Close</button>
      </div>
    </div>

    <!-- EDIT MODAL -->
    <div class="modal-overlay" v-if="editingMember" @click.self="editingMember = null">
      <div class="modal">
        <h3>Edit Member</h3>

        <label>First Name</label>
        <input v-model="editingMember.firstname" class="modal-input" />

        <label>Last Name</label>
        <input v-model="editingMember.lastname" class="modal-input" />

        <label>Email</label>
        <input v-model="editingMember.email" class="modal-input" />

        <label>Contact</label>
        <input v-model="editingMember.contactNum" class="modal-input" />

        <label>Contact Person</label>
        <input v-model="editingMember.contactPerson" class="modal-input" />

        <label>Contact Person Number</label>
        <input v-model="editingMember.contactPersonNum" class="modal-input" />

        <label>Address</label>
        <input v-model="editingMember.address" class="modal-input" />

        <label>Gym ID</label>
        <input v-model="editingMember.gymId" class="modal-input" />

        <label>RFID</label>
        <input v-model="editingMember.rfid" class="modal-input" />

        <label>Assigned Trainer</label>
        <input v-model="editingMember.assignedTrainer" class="modal-input" />

        <div class="section-label">
          Memberships
          <button class="btn-add-ms" @click="addMembershipSlot">+ Add</button>
        </div>

        <div
          v-for="(ms, i) in editingMember.membershipStatus"
          :key="i"
          class="membership-edit-block"
        >
          <div class="ms-edit-header">
            <span>Membership {{ i + 1 }}</span>
            <button class="btn-remove-ms" @click="removeMembershipSlot(i)">✕</button>
          </div>

          <label>Category</label>
          <select v-model="ms.category" class="modal-input">
            <option>Non-Member</option>
            <option>Standard</option>
            <option>Standard Renewal</option>
            <option>New Member / Early Renew</option>
            <option>Classic (Student)</option>
            <option>Classic (Regular)</option>
            <option>Premium (Student)</option>
            <option>Premium (Regular)</option>
            <option>VIP (Student)</option>
            <option>VIP (Regular)</option>
          </select>

          <label>Branch</label>
          <select v-model="ms.branch" class="modal-input">
            <option>General Luna</option>
            <option>Rimando Road</option>
            <option>Walk-in</option>
          </select>

          <label>Start Date</label>
          <input v-model="ms.startDate" type="date" class="modal-input" />

          <label>Expiry Date</label>
          <input v-model="ms.expiryDate" type="date" class="modal-input" />

          <label>Active</label>
          <select v-model="ms.isActive" class="modal-input">
            <option :value="true">Yes</option>
            <option :value="false">No</option>
          </select>
        </div>

        <div v-if="editError" class="error-msg">{{ editError }}</div>

        <div class="modal-actions">
          <button class="btn edit" @click="saveEdit" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
          <button class="btn delete" @click="editingMember = null">Cancel</button>
        </div>
      </div>
    </div>

    <!-- DELETE MODAL -->
    <div class="modal-overlay" v-if="deletingMember" @click.self="deletingMember = null">
      <div class="modal">
        <h3>Delete Member?</h3>
        <p class="delete-msg">
          Are you sure you want to delete
          <span>{{ deletingMember.firstname }} {{ deletingMember.lastname }}</span>?
        </p>
        <div v-if="deleteError" class="error-msg">{{ deleteError }}</div>
        <div class="modal-actions">
          <button class="btn delete" @click="confirmDelete" :disabled="deleting">
            {{ deleting ? 'Deleting...' : 'Yes, Delete' }}
          </button>
          <button class="btn edit" @click="deletingMember = null">Cancel</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
const BASE_URL = 'http://localhost:3500/superadmin/members'

export default {
  data() {
    return {
      search: '',
      activeTab: 'all',
      tabs: [
        { label: 'All',          value: 'all' },
        { label: 'General Luna', value: 'General Luna' },
        { label: 'Rimando Road', value: 'Rimando Road' },
        { label: 'Walk-in',     value: 'Walk-in' },
      ],
      members: [],
      selectedMember: null,
      editingMember: null,
      deletingMember: null,
      loading: false,
      saving: false,
      deleting: false,
      error: null,
      editError: null,
      deleteError: null,
    }
  },

  computed: {
    tabFilteredMembers() {
      if (this.activeTab === 'all') return this.members

      if (this.activeTab === 'visiting') {
        // Visiting = members whose ONLY active memberships are Walk-in
        return this.members.filter(m =>
          m.membershipStatus.every(ms => ms.branch === 'Walk-in')
        )
      }

      // General Luna or Rimando Road — has at least one active membership at that branch
      return this.members.filter(m =>
        m.membershipStatus.some(ms =>
          ms.branch === this.activeTab && ms.isActive
        )
      )
    },

    filteredMembers() {
      const s = this.search.toLowerCase()
      if (!s) return this.tabFilteredMembers
      return this.tabFilteredMembers.filter(m =>
        (m.firstname + ' ' + m.lastname).toLowerCase().includes(s) ||
        m.membershipStatus.some(ms =>
          ms.category.toLowerCase().includes(s) ||
          ms.branch.toLowerCase().includes(s)
        ) ||
        m.contactNum.includes(s)
      )
    }
  },

  methods: {
    getToken() { return localStorage.getItem('superadminToken') },
    authHeaders() {
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      }
    },
    initials(first, last) {
      return ((first?.[0] || '') + (last?.[0] || '')).toUpperCase()
    },
    formatDate(date) {
      if (!date) return '—'
      return new Date(date).toLocaleDateString()
    },
    tabCount(tab) {
      if (tab === 'all') return this.members.length
      if (tab === 'visiting') {
        return this.members.filter(m =>
          m.membershipStatus.every(ms => ms.branch === 'Walk-in')
        ).length
      }
      return this.members.filter(m =>
        m.membershipStatus.some(ms => ms.branch === tab && ms.isActive)
      ).length
    },
    viewMember(member) {
      this.selectedMember = { ...member }
    },
    editMember(member) {
      this.editingMember = JSON.parse(JSON.stringify(member))
      this.editingMember.membershipStatus = this.editingMember.membershipStatus.map(ms => ({
        ...ms,
        startDate:  ms.startDate  ? ms.startDate.split('T')[0]  : '',
        expiryDate: ms.expiryDate ? ms.expiryDate.split('T')[0] : ''
      }))
      this.editError = null
    },
    addMembershipSlot() {
      this.editingMember.membershipStatus.push({
        category: 'Standard',
        branch: 'General Luna',
        startDate: '',
        expiryDate: '',
        isActive: true,
        remainingDays: 0
      })
    },
    removeMembershipSlot(index) {
      this.editingMember.membershipStatus.splice(index, 1)
    },

    async fetchMembers() {
      this.loading = true
      this.error = null
      try {
        const res = await fetch(BASE_URL, { headers: this.authHeaders() })
        const data = await res.json()
        if (!res.ok) { this.error = data.message || 'Failed to fetch.'; return }
        this.members = data.members
      } catch {
        this.error = 'Network error.'
      } finally {
        this.loading = false
      }
    },

    async saveEdit() {
      this.saving = true
      this.editError = null
      try {
        const res = await fetch(`${BASE_URL}/${this.editingMember._id}`, {
          method: 'PUT',
          headers: this.authHeaders(),
          body: JSON.stringify(this.editingMember)
        })
        const data = await res.json()
        if (!res.ok) { this.editError = data.message || 'Failed to update.'; return }
        const index = this.members.findIndex(m => m._id === data.member._id)
        if (index !== -1) this.members.splice(index, 1, data.member)
        this.editingMember = null
      } catch {
        this.editError = 'Network error.'
      } finally {
        this.saving = false
      }
    },

    async confirmDelete() {
      this.deleting = true
      this.deleteError = null
      try {
        const res = await fetch(`${BASE_URL}/${this.deletingMember._id}`, {
          method: 'DELETE',
          headers: this.authHeaders()
        })
        const data = await res.json()
        if (!res.ok) { this.deleteError = data.message || 'Failed to delete.'; return }
        this.members = this.members.filter(m => m._id !== this.deletingMember._id)
        this.deletingMember = null
      } catch {
        this.deleteError = 'Network error.'
      } finally {
        this.deleting = false
      }
    }
  },

  mounted() { this.fetchMembers() }
}
</script>

<style scoped>
.members-container { width: 100%; }

.members-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.members-header h2 { color: white; margin: 0; }

.header-right { display: flex; gap: 12px; align-items: center; }

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
.search-input:focus { border-color: #F2613F; }

/* BRANCH TABS */
.branch-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid #2a2a2a;
  background: transparent;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  transition: 0.15s;
}
.tab-btn:hover {
  border-color: #444;
  color: #aaa;
}
.tab-btn.active {
  background: rgba(242, 97, 63, 0.1);
  border-color: rgba(242, 97, 63, 0.35);
  color: #F2613F;
}

.tab-count {
  font-size: 11px;
  padding: 1px 7px;
  border-radius: 20px;
  background: rgba(255,255,255,0.06);
  color: inherit;
}
.tab-btn.active .tab-count {
  background: rgba(242, 97, 63, 0.2);
}

.table-wrapper {
  background: #1a1a1a;
  border-radius: 16px;
  border: 1px solid #481E14;
  overflow: hidden;
}

table { width: 100%; border-collapse: collapse; }
thead { background-color: #0C0C0C; }
th {
  padding: 14px 20px;
  text-align: left;
  color: #aaa;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #481E14;
}
td {
  padding: 14px 20px;
  color: white;
  font-size: 14px;
  border-bottom: 1px solid #2a2a2a;
}
tr:last-child td { border-bottom: none; }
tr:hover td { background-color: #1f1210; }

.member-info { display: flex; align-items: center; gap: 12px; }
.avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  background-color: #9B3922;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: bold; color: white;
  flex-shrink: 0;
}

.membership-badges { display: flex; flex-wrap: wrap; gap: 6px; }
.badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; }
.badge.active   { background: #1a2a1a; color: #4caf82; }
.badge.inactive { background: #2a2a2a; color: #aaa; }

.actions { display: flex; gap: 8px; }
.btn {
  padding: 6px 14px;
  border-radius: 8px;
  border: none;
  font-size: 13px;
  cursor: pointer;
  transition: 0.15s;
}
.btn.view   { background-color: #481E14; color: #F2613F; }
.btn.edit   { background: #F2613F; color: white; }
.btn.edit:hover { background: #ff7b5a; }
.btn.delete { background: transparent; border: 1px solid #444; color: #aaa; }
.btn.delete:hover { background: #1f1f1f; border-color: #666; }

.no-results { text-align: center; color: #555; padding: 40px; }
.loading    { color: #aaa; padding: 20px; }
.error-msg  { color: #c0392b; font-size: 13px; padding: 8px 0; }

/* MODAL */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}
.modal {
  background: #121212;
  border: 1px solid #2b2b2b;
  border-radius: 18px;
  padding: 28px;
  width: 460px;
  max-height: 85vh;
  display: flex; flex-direction: column; gap: 10px;
  overflow-y: auto;
  animation: modalPop 0.18s ease;
}
.modal h3 { margin: 0 0 6px; color: white; font-size: 20px; }
.modal label { font-size: 12px; color: #888; }
.modal p { margin: 2px 0; font-size: 14px; color: #ddd; }
.modal p span { color: #888; margin-right: 6px; }

.modal-avatar {
  width: 70px; height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg,#9B3922,#F2613F);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; font-weight: bold; color: white;
  margin: 0 auto 10px;
}

.modal-input {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #2a2a2a;
  background: #0C0C0C;
  color: white;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  transition: 0.15s;
}
.modal-input:focus { outline: none; border-color: #F2613F; }

.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }

.section-label {
  font-size: 12px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.membership-card {
  border-radius: 10px;
  padding: 10px 14px;
  display: flex; flex-direction: column; gap: 4px;
}
.ms-active   { background: #0e1f0e; border: 1px solid #2a4a2a; }
.ms-inactive { background: #1a1a1a; border: 1px solid #2a2a2a; }

.ms-row { display: flex; justify-content: space-between; align-items: center; }
.ms-category { font-size: 14px; font-weight: bold; color: white; }
.ms-status { font-size: 11px; font-weight: bold; padding: 2px 8px; border-radius: 20px; }
.ms-status.active   { background: #1a3a1a; color: #4caf82; }
.ms-status.inactive { background: #2a2a2a; color: #aaa; }
.ms-meta { font-size: 12px; color: #888; }

.membership-edit-block {
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  padding: 12px;
  display: flex; flex-direction: column; gap: 6px;
  background: #0c0c0c;
}
.ms-edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #aaa;
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 4px;
}
.btn-add-ms {
  background: transparent;
  border: 1px solid #F2613F;
  color: #F2613F;
  border-radius: 6px;
  padding: 2px 10px;
  font-size: 12px;
  cursor: pointer;
}
.btn-remove-ms {
  background: transparent;
  border: none;
  color: #c0392b;
  cursor: pointer;
  font-size: 14px;
  padding: 0 4px;
}

.delete-msg { color: #bbb; font-size: 14px; }
.delete-msg span { color: #F2613F; font-weight: 600; }

.modal::-webkit-scrollbar { width: 6px; }
.modal::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }

@keyframes modalPop {
  from { transform: scale(0.92); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
</style>