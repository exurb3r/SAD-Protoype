<template>
  <div class="users-container">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h2>App Users</h2>
        <p class="subtitle">Manage registered app users</p>
      </div>
      <div class="header-actions">
        <input v-model="search" class="search-input" type="text" placeholder="Search users..." />
        <select v-model="filterStatus" class="filter-select">
          <option value="">All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>
    </div>

    <!-- Toast -->
    <div class="toast" v-if="toast">{{ toast }}</div>

    <!-- Table -->
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Level</th>
            <th>Joined</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td class="user-info">
              <div class="avatar">{{ initials(user.username) }}</div>
              <span>{{ user.username }}</span>
            </td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="['level-badge', levelTier(user.joinDate).tier]">
                {{ levelTier(user.joinDate).icon }} Lv.{{ levelTier(user.joinDate).level }} {{ levelTier(user.joinDate).label }}
              </span>
            </td>
            <td>{{ formatDate(user.joinDate) }}</td>
            <td>
              <span :class="['status', user.status.toLowerCase()]">{{ user.status }}</span>
            </td>
            <td class="actions">
              <button class="btn view"     @click="viewUser(user)">View</button>
              <button class="btn edit"     @click="editUser(user)">Edit</button>
              <button
                :class="['btn', user.status === 'Active' ? 'deactivate' : 'activate']"
                @click="toggleStatus(user)"
              >
                {{ user.status === 'Active' ? 'Deactivate' : 'Activate' }}
              </button>
              <button class="btn delete" @click="deletingUser = user">Delete</button>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="6" class="no-results">No users found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- View Modal -->
    <div class="modal-overlay" v-if="selectedUser" @click.self="selectedUser = null">
      <div class="modal">
        <div :class="['modal-avatar', levelTier(selectedUser.joinDate).tier]">
          {{ initials(selectedUser.username) }}
        </div>
        <h3>{{ selectedUser.username }}</h3>
        <div class="level-display">
          <span :class="['level-badge', levelTier(selectedUser.joinDate).tier]">
            {{ levelTier(selectedUser.joinDate).icon }}
            Lv.{{ levelTier(selectedUser.joinDate).level }}
            {{ levelTier(selectedUser.joinDate).label }}
          </span>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Email</span>
            <span class="info-value">{{ selectedUser.email }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Joined</span>
            <span class="info-value">{{ formatDate(selectedUser.joinDate) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Membership</span>
            <span class="info-value" v-if="selectedUser.membershipStatus && selectedUser.membershipStatus.length">
              {{ selectedUser.membershipStatus[0].category }} — {{ selectedUser.membershipStatus[0].branch }}
            </span>
            <span class="info-value muted" v-else>No active membership</span>
          </div>
          <div class="info-item">
            <span class="info-label">Status</span>
            <span :class="['status', selectedUser.status.toLowerCase()]">{{ selectedUser.status }}</span>
          </div>
        </div>
        <button class="btn-recovery" @click="sendRecovery(selectedUser)">
          📧 Send Account Recovery Email
        </button>
        <button class="btn-reset full" @click="selectedUser = null">Close</button>
      </div>
    </div>

    <!-- Edit Modal -->
    <div class="modal-overlay" v-if="editingUser" @click.self="editingUser = null">
      <div class="modal">
        <h3>Edit User</h3>

        <div class="section-label">Account Info</div>

        <label>Username</label>
        <input v-model="editingUser.username" class="modal-input" />
        <span class="error" v-if="errors.username">{{ errors.username }}</span>

        <div class="section-label" style="margin-top:16px;">Change Email</div>
        <label>New Email</label>
        <input v-model="editingUser.newEmail" class="modal-input" placeholder="Leave blank to keep current" />
        <span class="error" v-if="errors.newEmail">{{ errors.newEmail }}</span>

        <div class="section-label" style="margin-top:16px;">Change Password</div>
        <label>New Password</label>
        <input v-model="editingUser.newPassword" type="password" class="modal-input" placeholder="Leave blank to keep current" />
        <label style="margin-top:8px;">Confirm Password</label>
        <input v-model="editingUser.confirmPassword" type="password" class="modal-input" placeholder="Confirm new password" />
        <span class="error" v-if="errors.newPassword">{{ errors.newPassword }}</span>

        <div class="modal-actions">
          <button class="btn-submit" @click="saveEdit">Save Changes</button>
          <button class="btn-reset" @click="editingUser = null">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal-overlay" v-if="deletingUser" @click.self="deletingUser = null">
      <div class="modal">
        <h3>Delete User?</h3>
        <p class="delete-msg">Are you sure you want to delete <span>{{ deletingUser.username }}</span>? This cannot be undone.</p>
        <div class="modal-actions">
          <button class="btn delete" @click="confirmDelete">Yes, Delete</button>
          <button class="btn-reset" @click="deletingUser = null">Cancel</button>
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
      filterStatus: '',
      selectedUser: null,
      editingUser: null,
      deletingUser: null,
      errors: {},
      toast: null,
      users: [
        {
          id: 1, username: 'janine_s', email: 'janine@gym.com',
          password: 'hashed', membershipStatus: [{ category: 'Premium', branch: 'Makati' }],
          role: 420, joinDate: new Date('2023-01-01'), status: 'Active'
        },
        {
          id: 2, username: 'abiabi', email: 'abiabi@email.com',
          password: 'hashed', membershipStatus: [],
          role: 420, joinDate: new Date('2024-02-03'), status: 'Active'
        },
        {
          id: 3, username: 'roven_s', email: 'robin@email.com',
          password: 'hashed', membershipStatus: [],
          role: 420, joinDate: new Date('2024-03-10'), status: 'Inactive'
        },
        {
          id: 4, username: 'carlo_r', email: 'carlo@email.com',
          password: 'hashed', membershipStatus: [{ category: 'Basic', branch: 'BGC' }],
          role: 420, joinDate: new Date('2024-04-05'), status: 'Active'
        },
        {
          id: 5, username: 'jochelle_m', email: 'jochelle@email.com',
          password: 'hashed', membershipStatus: [],
          role: 420, joinDate: new Date('2024-05-18'), status: 'Inactive'
        },
        {
          id: 6, username: 'kurt_mor', email: 'kurtmor@email.com',
          password: 'hashed', membershipStatus: [],
          role: 420, joinDate: new Date('2024-06-22'), status: 'Inactive'
        },
      ]
    }
  },
  computed: {
    filteredUsers() {
      return this.users.filter(u => {
        const q = this.search.toLowerCase()
        const matchSearch = u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
        const matchStatus = this.filterStatus === '' || u.status === this.filterStatus
        return matchSearch && matchStatus
      })
    }
  },
  methods: {
    initials(name) {
      return name.split(/[_\s]/).map(n => n[0]).join('').toUpperCase().slice(0, 2)
    },
    formatDate(date) {
      if (!date) return '—'
      return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
    levelTier(joinDate) {
      if (!joinDate) return { level: 1, label: 'Rookie', icon: '🌱', tier: 'rookie' }
      const months = (new Date() - new Date(joinDate)) / (1000 * 60 * 60 * 24 * 30)
      const level = Math.max(1, Math.floor(months * 1.5))
      if (level >= 30) return { level, label: 'Legend',  icon: '🔥', tier: 'legend'  }
      if (level >= 15) return { level, label: 'Veteran', icon: '💪', tier: 'veteran' }
      if (level >= 6)  return { level, label: 'Warrior', icon: '⚔️', tier: 'warrior' }
      return              { level, label: 'Rookie',  icon: '🌱', tier: 'rookie'  }
    },
    viewUser(user) {
      this.selectedUser = { ...user }
    },
    editUser(user) {
      this.editingUser = { ...user, newEmail: '', newPassword: '', confirmPassword: '' }
      this.errors = {}
    },
    validate() {
      const errors = {}
      if (!this.editingUser.username.trim()) errors.username = 'Username is required.'
      if (this.editingUser.newEmail && !/\S+@\S+\.\S+/.test(this.editingUser.newEmail))
        errors.newEmail = 'Enter a valid email address.'
      if (this.editingUser.newPassword || this.editingUser.confirmPassword) {
        if (this.editingUser.newPassword.length < 6)
          errors.newPassword = 'Password must be at least 6 characters.'
        else if (this.editingUser.newPassword !== this.editingUser.confirmPassword)
          errors.newPassword = 'Passwords do not match.'
      }
      return errors
    },
    saveEdit() {
      this.errors = this.validate()
      if (Object.keys(this.errors).length > 0) return
      const index = this.users.findIndex(u => u.id === this.editingUser.id)
      if (index !== -1) {
        const updated = { ...this.users[index], username: this.editingUser.username }
        if (this.editingUser.newEmail)    updated.email    = this.editingUser.newEmail
        if (this.editingUser.newPassword) updated.password = this.editingUser.newPassword // hash in real app
        this.users[index] = updated
      }
      this.editingUser = null
      this.showToast('User updated successfully.')
    },
    toggleStatus(user) {
      const index = this.users.findIndex(u => u.id === user.id)
      if (index !== -1) {
        this.users[index].status = this.users[index].status === 'Active' ? 'Inactive' : 'Active'
      }
    },
    confirmDelete() {
      this.users = this.users.filter(u => u.id !== this.deletingUser.id)
      this.deletingUser = null
      this.showToast('User deleted.')
    },
    sendRecovery(user) {
      this.showToast(`Recovery email sent to ${user.email}`)
    },
    showToast(msg) {
      this.toast = msg
      setTimeout(() => { this.toast = null }, 3000)
    }
  }
}
</script>

<style scoped>
.users-container { width: 100%; position: relative; }

.subtitle { color: #777; font-size: 13px; margin: 4px 0 0; }

/* Toast */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #F2613F;
  color: white;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 14px;
  z-index: 999;
  box-shadow: 0 4px 20px rgba(242,97,63,0.4);
  animation: fadeIn .2s ease;
}
@keyframes fadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }

/* Header */
.page-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 24px; flex-wrap: wrap; gap: 12px;
}
.page-header h2 { color: white; margin: 0; }
.header-actions { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }

.search-input {
  padding: 10px 16px; border-radius: 10px; border: 1px solid #481E14;
  background: #1a1a1a; color: white; font-size: 14px; width: 220px;
  outline: none; transition: 0.2s;
}
.search-input:focus { border-color: #F2613F; }

.filter-select {
  padding: 10px 14px; border-radius: 10px; border: 1px solid #481E14;
  background: #1a1a1a; color: white; font-size: 14px;
  outline: none; cursor: pointer; transition: 0.2s;
}
.filter-select:focus { border-color: #F2613F; }

/* Table */
.table-wrapper {
  background: #1a1a1a; border-radius: 16px;
  border: 1px solid #481E14; overflow: hidden;
}
table { width: 100%; border-collapse: collapse; }
thead { background-color: #0C0C0C; }
th {
  padding: 14px 20px; text-align: left; color: #aaa;
  font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;
  border-bottom: 1px solid #481E14;
}
td { padding: 14px 20px; color: white; font-size: 14px; border-bottom: 1px solid #2a2a2a; }
tr:last-child td { border-bottom: none; }
tr:hover td { background-color: #1f1210; }

.user-info { display: flex; align-items: center; gap: 12px; }
.avatar {
  width: 36px; height: 36px; border-radius: 50%; background-color: #9B3922;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: bold; color: white; flex-shrink: 0;
}

/* Level badges */
.level-badge {
  padding: 4px 10px; border-radius: 20px; font-size: 12px;
  font-weight: bold; white-space: nowrap;
}
.level-badge.rookie  { background: #222; color: #777; border: 1px solid #333; }
.level-badge.warrior { background: #1a2a1a; color: #4caf50; border: 1px solid #4caf5040; }
.level-badge.veteran { background: #1a2a3a; color: #4a9eff; border: 1px solid #4a9eff40; }
.level-badge.legend  { background: #2a1400; color: #F2613F; border: 1px solid #F2613F40; }

/* Status */
.status { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
.status.active   { background: #1a2e1a; color: #4caf50; }
.status.inactive { background: #2a2a2a; color: #777; }

/* Actions */
.actions { display: flex; gap: 6px; flex-wrap: wrap; }
.btn { padding: 6px 12px; border-radius: 8px; border: none; font-size: 12px; cursor: pointer; transition: 0.2s; }
.btn.view         { background: #481E14; color: #F2613F; }
.btn.view:hover   { background: #9B3922; color: white; }
.btn.edit         { background: #2a2a2a; color: #aaa; }
.btn.edit:hover   { background: #444; color: white; }
.btn.activate       { background: #1a2e1a; color: #4caf50; border: 1px solid #4caf50; }
.btn.activate:hover { background: #4caf50; color: white; }
.btn.deactivate       { background: #2a2a2a; color: #777; border: 1px solid #555; }
.btn.deactivate:hover { background: #555; color: white; }
.btn.delete       { background: #1a1a1a; color: #c0392b; border: 1px solid #c0392b; }
.btn.delete:hover { background: #c0392b; color: white; }
.no-results { text-align: center; color: #555; padding: 40px; }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.7);
  display: flex; align-items: center; justify-content: center; z-index: 100;
}
.modal {
  background: #1a1a1a; border: 1px solid #481E14; border-radius: 16px;
  padding: 32px; width: 400px; display: flex; flex-direction: column; gap: 10px;
  max-height: 90vh; overflow-y: auto;
}
.modal-avatar {
  width: 60px; height: 60px; border-radius: 50%; background-color: #9B3922;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; font-weight: bold; color: white; margin: 0 auto 4px;
}
.modal-avatar.legend  { background: linear-gradient(135deg, #4a1a00, #9B3922); box-shadow: 0 0 20px #F2613F60; }
.modal-avatar.veteran { background: linear-gradient(135deg, #0a1a3a, #1a3a6a); box-shadow: 0 0 20px #4a9eff40; }
.modal-avatar.warrior { background: linear-gradient(135deg, #0a2a0a, #1a5a1a); box-shadow: 0 0 20px #4caf5040; }

.modal h3 { color: white; margin: 0; text-align: center; }
.level-display { text-align: center; }

.section-label {
  font-size: 11px; text-transform: uppercase; letter-spacing: 1px;
  color: #F2613F; font-weight: bold; margin-top: 4px;
}

.info-grid { display: flex; flex-direction: column; gap: 10px; }
.info-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 0; border-bottom: 1px solid #2a2a2a;
}
.info-label { color: #aaa; font-size: 13px; }
.info-value { color: white; font-size: 14px; }
.info-value.muted { color: #555; }

.modal label { color: #aaa; font-size: 13px; }
.modal-input {
  padding: 10px; border-radius: 8px; border: 1px solid #481E14;
  background: #0C0C0C; color: white; font-size: 14px; outline: none;
  width: 100%; box-sizing: border-box; transition: 0.2s;
}
.modal-input:focus { border-color: #F2613F; }
.error { color: #c0392b; font-size: 12px; }
.delete-msg { color: #aaa; font-size: 14px; text-align: center; }
.delete-msg span { color: #F2613F; font-weight: bold; }

.modal-actions { display: flex; gap: 10px; margin-top: 8px; }

.btn-recovery {
  padding: 10px; border-radius: 10px; border: 1px solid #481E14;
  background: transparent; color: #F2613F; font-size: 13px;
  cursor: pointer; transition: 0.2s; width: 100%; text-align: center;
}
.btn-recovery:hover { background: #481E14; }

.btn-submit {
  padding: 10px 24px; border-radius: 10px; border: none;
  background: #F2613F; color: white; font-size: 14px; font-weight: bold;
  cursor: pointer; transition: 0.2s; flex: 1;
}
.btn-submit:hover { background: #9B3922; }

.btn-reset {
  padding: 10px 24px; border-radius: 10px; border: 1px solid #481E14;
  background: transparent; color: #aaa; font-size: 14px;
  cursor: pointer; transition: 0.2s; flex: 1;
}
.btn-reset:hover { background: #481E14; color: white; }
.btn-reset.full { width: 100%; text-align: center; flex: unset; }
</style>