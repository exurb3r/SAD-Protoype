<template>
  <div class="users-container">

    <!-- Header -->
    <div class="page-header">
      <h2>App Users</h2>
      <div class="header-actions">
        <input v-model="search" class="search-input" type="text" placeholder="Search users..." />
        <select v-model="filterRole" class="filter-select">
          <option value="">All Roles</option>
          <option>Admin</option>
          <option>Staff</option>
          <option>Member</option>
        </select>
        <select v-model="filterStatus" class="filter-select">
          <option value="">All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Date Joined</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td class="user-info">
              <div class="avatar">{{ initials(user.name) }}</div>
              <span>{{ user.name }}</span>
            </td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="['badge', user.role.toLowerCase()]">{{ user.role }}</span>
            </td>
            <td>{{ user.dateJoined }}</td>
            <td>
              <span :class="['status', user.status.toLowerCase()]">{{ user.status }}</span>
            </td>
            <td class="actions">
              <button class="btn view"   @click="viewUser(user)">View</button>
              <button class="btn edit"   @click="editUser(user)">Edit</button>
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
        <div class="modal-avatar">{{ initials(selectedUser.name) }}</div>
        <h3>{{ selectedUser.name }}</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Email</span>
            <span class="info-value">{{ selectedUser.email }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Role</span>
            <span :class="['badge', selectedUser.role.toLowerCase()]">{{ selectedUser.role }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Date Joined</span>
            <span class="info-value">{{ selectedUser.dateJoined }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Status</span>
            <span :class="['status', selectedUser.status.toLowerCase()]">{{ selectedUser.status }}</span>
          </div>
        </div>
        <button class="btn-reset full" @click="selectedUser = null">Close</button>
      </div>
    </div>

    <!-- Edit Modal -->
    <div class="modal-overlay" v-if="editingUser" @click.self="editingUser = null">
      <div class="modal">
        <h3>Edit User</h3>

        <label>Name</label>
        <input v-model="editingUser.name" class="modal-input" />
        <span class="error" v-if="errors.name">{{ errors.name }}</span>

        <label>Email</label>
        <input v-model="editingUser.email" class="modal-input" />
        <span class="error" v-if="errors.email">{{ errors.email }}</span>

        <label>Role</label>
        <select v-model="editingUser.role" class="modal-input">
          <option>Admin</option>
          <option>Staff</option>
          <option>Member</option>
        </select>

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
        <p class="delete-msg">Are you sure you want to delete <span>{{ deletingUser.name }}</span>? This cannot be undone.</p>
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
      filterRole: '',
      filterStatus: '',
      selectedUser: null,
      editingUser: null,
      deletingUser: null,
      errors: {},
      users: [
        { id: 1, name: 'Admin User',     email: 'admin@gym.com',   role: 'Admin',  dateJoined: 'Jan 1, 2024',  status: 'Active'   },
        { id: 2, name: 'Juan Dela Cruz', email: 'juan@email.com',  role: 'Member', dateJoined: 'Feb 3, 2024',  status: 'Active'   },
        { id: 3, name: 'Maria Santos',   email: 'maria@email.com', role: 'Member', dateJoined: 'Mar 10, 2024', status: 'Active'   },
        { id: 4, name: 'Carlo Reyes',    email: 'carlo@email.com', role: 'Staff',  dateJoined: 'Apr 5, 2024',  status: 'Active'   },
        { id: 5, name: 'Anna Lim',       email: 'anna@email.com',  role: 'Member', dateJoined: 'May 18, 2024', status: 'Inactive' },
        { id: 6, name: 'Jose Garcia',    email: 'jose@email.com',  role: 'Member', dateJoined: 'Jun 22, 2024', status: 'Inactive' },
      ]
    }
  },
  computed: {
    filteredUsers() {
      return this.users.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(this.search.toLowerCase()) ||
                            u.email.toLowerCase().includes(this.search.toLowerCase())
        const matchRole   = this.filterRole   === '' || u.role   === this.filterRole
        const matchStatus = this.filterStatus === '' || u.status === this.filterStatus
        return matchSearch && matchRole && matchStatus
      })
    }
  },
  methods: {
    initials(name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    },
    viewUser(user) {
      this.selectedUser = { ...user }
    },
    editUser(user) {
      this.editingUser = { ...user }
      this.errors = {}
    },
    validate() {
      const errors = {}
      if (!this.editingUser.name.trim())  errors.name  = 'Name is required.'
      if (!this.editingUser.email.trim()) errors.email = 'Email is required.'
      return errors
    },
    saveEdit() {
      this.errors = this.validate()
      if (Object.keys(this.errors).length > 0) return
      const index = this.users.findIndex(u => u.id === this.editingUser.id)
      if (index !== -1) this.users[index] = { ...this.editingUser }
      this.editingUser = null
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
    }
  }
}
</script>

<style scoped>
.users-container {
  width: 100%;
}

/* Header */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.page-header h2 {
  color: white;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 10px;
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

.filter-select {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #481E14;
  background: #1a1a1a;
  color: white;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  transition: 0.2s;
}

.filter-select:focus {
  border-color: #F2613F;
}

/* Table */
.table-wrapper {
  background: #1a1a1a;
  border-radius: 16px;
  border: 1px solid #481E14;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #0C0C0C;
}

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

tr:last-child td {
  border-bottom: none;
}

tr:hover td {
  background-color: #1f1210;
}

/* User info */
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #9B3922;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: bold;
  color: white;
  flex-shrink: 0;
}

/* Badges */
.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.badge.admin  { background: #481E14; color: #F2613F; }
.badge.staff  { background: #1a2a3a; color: #4a9eff; }
.badge.member { background: #2a2a2a; color: #aaa; }

/* Status */
.status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.status.active   { background: #1a2e1a; color: #4caf50; }
.status.inactive { background: #2a2a2a; color: #777; }

/* Actions */
.actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.btn {
  padding: 6px 12px;
  border-radius: 8px;
  border: none;
  font-size: 12px;
  cursor: pointer;
  transition: 0.2s;
}

.btn.view       { background: #481E14; color: #F2613F; }
.btn.view:hover { background: #9B3922; color: white; }

.btn.edit       { background: #2a2a2a; color: #aaa; }
.btn.edit:hover { background: #444; color: white; }

.btn.activate       { background: #1a2e1a; color: #4caf50; border: 1px solid #4caf50; }
.btn.activate:hover { background: #4caf50; color: white; }

.btn.deactivate       { background: #2a2a2a; color: #777; border: 1px solid #555; }
.btn.deactivate:hover { background: #555; color: white; }

.btn.delete       { background: #1a1a1a; color: #c0392b; border: 1px solid #c0392b; }
.btn.delete:hover { background: #c0392b; color: white; }

.no-results {
  text-align: center;
  color: #555;
  padding: 40px;
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
  width: 380px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #9B3922;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin: 0 auto 8px;
}

.modal h3 {
  color: white;
  margin: 0;
  text-align: center;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #2a2a2a;
}

.info-label {
  color: #aaa;
  font-size: 13px;
}

.info-value {
  color: white;
  font-size: 14px;
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
  flex: 1;
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
  flex: 1;
}

.btn-reset:hover {
  background: #481E14;
  color: white;
}

.btn-reset.full {
  width: 100%;
  text-align: center;
}
</style>