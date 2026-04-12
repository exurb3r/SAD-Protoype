<template>
  <div class="admins-page">

    <!-- Header -->
    <div class="admins-header">
      <div class="admins-header-left">
        <h1 class="admins-title">Admins</h1>
        <span class="admins-count">{{ filteredAdmins.length }} total</span>
      </div>
      <div class="admins-header-right">
        <div class="search-wrap">
          <span class="search-icon">⌕</span>
          <input v-model="search" class="search-input" type="text" placeholder="Search admins..." />
        </div>
        <button class="btn-add" @click="openAdd">+ Add Admin</button>
      </div>
    </div>

    <!-- State -->
    <div v-if="loading" class="state-msg">Loading admins...</div>
    <div v-if="error" class="error-banner">{{ error }}</div>

    <!-- Table -->
    <div class="table-wrap" v-if="!loading">
      <table>
        <thead>
          <tr>
            <th>Admin</th>
            <th>Username</th>
            <th>Branch</th>
            <th>Contact</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="admin in filteredAdmins" :key="admin._id">
            <td class="admin-info">
              <div class="avatar">{{ initials(admin.firstname, admin.lastname) }}</div>
              <div class="admin-name-col">
                <span class="admin-name">{{ admin.firstname }} {{ admin.lastname }}</span>
                <span class="admin-email">{{ admin.email }}</span>
              </div>
            </td>
            <td class="mono">{{ admin.username }}</td>
            <td>
              <span class="branch-badge">{{ admin.branch }}</span>
            </td>
            <td class="muted">{{ admin.contactNum }}</td>
            <td>
              <span class="role-badge" :class="admin.role === 999 ? 'role-super' : 'role-admin'">
                {{ admin.role === 999 ? 'Super Admin' : 'Admin' }}
              </span>
            </td>
            <td class="actions">
              <button class="btn-action view" @click="viewAdmin(admin)">View</button>
              <button class="btn-action edit" @click="openEdit(admin)">Edit</button>
              <button class="btn-action delete" @click="deletingAdmin = admin">Delete</button>
            </td>
          </tr>
          <tr v-if="filteredAdmins.length === 0">
            <td colspan="6" class="no-results">No admins found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ── VIEW MODAL ── -->
    <div class="overlay" v-if="viewingAdmin" @click.self="viewingAdmin = null">
      <div class="modal">
        <div class="modal-avatar-lg">{{ initials(viewingAdmin.firstname, viewingAdmin.lastname) }}</div>
        <h3 class="modal-name">{{ viewingAdmin.firstname }} {{ viewingAdmin.lastname }}</h3>
        <span class="modal-role-badge" :class="viewingAdmin.role === 999 ? 'role-super' : 'role-admin'">
          {{ viewingAdmin.role === 999 ? 'Super Admin' : 'Admin' }}
        </span>

        <div class="modal-info-grid">
          <div class="info-item"><span class="info-label">Username</span><span class="info-value mono">{{ viewingAdmin.username }}</span></div>
          <div class="info-item"><span class="info-label">Email</span><span class="info-value">{{ viewingAdmin.email }}</span></div>
          <div class="info-item"><span class="info-label">Contact</span><span class="info-value">{{ viewingAdmin.contactNum }}</span></div>
          <div class="info-item"><span class="info-label">Branch</span><span class="info-value">{{ viewingAdmin.branch }}</span></div>
          <div class="info-item full"><span class="info-label">Address</span><span class="info-value">{{ viewingAdmin.address }}</span></div>
        </div>

        <div class="modal-actions">
          <button class="btn-action edit" @click="openEdit(viewingAdmin); viewingAdmin = null">Edit</button>
          <button class="btn-action delete" @click="viewingAdmin = null">Close</button>
        </div>
      </div>
    </div>

    <!-- ── ADD MODAL ── -->
    <div class="overlay" v-if="showAdd" @click.self="closeAdd">
      <div class="modal">
        <h3 class="modal-title">Add New Admin</h3>
        <p class="modal-subtitle">Create a new admin account</p>

        <div class="form-row">
          <div class="form-group">
            <label>First Name</label>
            <input v-model="addForm.firstname" class="modal-input" placeholder="John" />
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input v-model="addForm.lastname" class="modal-input" placeholder="Doe" />
          </div>
        </div>
        <div class="form-group">
          <label>Username</label>
          <input v-model="addForm.username" class="modal-input" placeholder="johndoe" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input v-model="addForm.email" type="email" class="modal-input" placeholder="john@gym.com" />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input v-model="addForm.password" type="password" class="modal-input" placeholder="Min. 8 characters" />
        </div>
        <div class="form-group">
          <label>Contact Number</label>
          <input v-model="addForm.contactNum" class="modal-input" placeholder="+63 900 000 0000" />
        </div>
        <div class="form-group">
          <label>Address</label>
          <input v-model="addForm.address" class="modal-input" placeholder="123 Street, City" />
        </div>
        <div class="form-group">
          <label>Branch</label>
          <select v-model="addForm.branch" class="modal-input">
            <option value="">Select branch</option>
            <option>General Luna</option>
            <option>Rimando Road</option>
          </select>
        </div>

        <div v-if="addError" class="error-inline">⚠ {{ addError }}</div>

        <div class="modal-actions">
          <button class="btn-action edit" @click="confirmAdd" :disabled="saving">
            {{ saving ? 'Creating...' : 'Create Admin' }}
          </button>
          <button class="btn-action delete" @click="closeAdd">Cancel</button>
        </div>
      </div>
    </div>

    <!-- ── EDIT MODAL ── -->
    <div class="overlay" v-if="editingAdmin" @click.self="editingAdmin = null">
      <div class="modal">
        <h3 class="modal-title">Edit Admin</h3>
        <p class="modal-subtitle">Update account information</p>

        <div class="form-row">
          <div class="form-group">
            <label>First Name</label>
            <input v-model="editingAdmin.firstname" class="modal-input" />
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input v-model="editingAdmin.lastname" class="modal-input" />
          </div>
        </div>
        <div class="form-group">
          <label>Username</label>
          <input v-model="editingAdmin.username" class="modal-input" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input v-model="editingAdmin.email" type="email" class="modal-input" />
        </div>
        <div class="form-group">
          <label>New Password <span class="label-hint">(leave blank to keep current)</span></label>
          <input v-model="editingAdmin.newPassword" type="password" class="modal-input" placeholder="••••••••" />
        </div>
        <div class="form-group">
          <label>Contact Number</label>
          <input v-model="editingAdmin.contactNum" class="modal-input" />
        </div>
        <div class="form-group">
          <label>Address</label>
          <input v-model="editingAdmin.address" class="modal-input" />
        </div>
        <div class="form-group">
          <label>Branch</label>
          <select v-model="editingAdmin.branch" class="modal-input">
            <option>General Luna</option>
            <option>Rimando Road</option>
          </select>
        </div>

        <div v-if="editError" class="error-inline">⚠ {{ editError }}</div>

        <div class="modal-actions">
          <button class="btn-action edit" @click="saveEdit" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
          <button class="btn-action delete" @click="editingAdmin = null">Cancel</button>
        </div>
      </div>
    </div>

    <!-- ── DELETE MODAL ── -->
    <div class="overlay" v-if="deletingAdmin" @click.self="deletingAdmin = null">
      <div class="modal modal-sm">
        <div class="delete-icon">⚠</div>
        <h3 class="modal-title">Delete Admin?</h3>
        <p class="delete-msg">
          This will permanently remove
          <strong>{{ deletingAdmin.firstname }} {{ deletingAdmin.lastname }}</strong>
          from the system.
        </p>
        <div v-if="deleteError" class="error-inline">{{ deleteError }}</div>
        <div class="modal-actions">
          <button class="btn-action delete confirm" @click="confirmDelete" :disabled="deleting">
            {{ deleting ? 'Deleting...' : 'Yes, Delete' }}
          </button>
          <button class="btn-action edit" @click="deletingAdmin = null">Cancel</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
const BASE_URL = 'http://localhost:3500/superadmin/editadmin'

export default {
  data() {
    return {
      search: '',
      admins: [],
      viewingAdmin: null,
      editingAdmin: null,
      deletingAdmin: null,
      showAdd: false,
      addForm: { firstname: '', lastname: '', username: '', email: '', password: '', contactNum: '', address: '', branch: '' },
      loading: false,
      saving: false,
      deleting: false,
      error: null,
      addError: null,
      editError: null,
      deleteError: null,
    }
  },

  computed: {
    filteredAdmins() {
      const s = this.search.toLowerCase()
      return this.admins.filter(a =>
        (a.firstname + ' ' + a.lastname).toLowerCase().includes(s) ||
        a.username.toLowerCase().includes(s) ||
        a.email.toLowerCase().includes(s) ||
        a.branch.toLowerCase().includes(s)
      )
    }
  },

  methods: {
    getToken() { return localStorage.getItem('superadminToken') },
    authHeaders() {
      return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.getToken()}` }
    },
    initials(first, last) {
      return ((first?.[0] || '') + (last?.[0] || '')).toUpperCase()
    },
    viewAdmin(admin) { this.viewingAdmin = { ...admin } },
    openEdit(admin) {
      this.editingAdmin = { ...admin, newPassword: '' }
      this.editError = null
    },
    openAdd() {
      this.addForm = { firstname: '', lastname: '', username: '', email: '', password: '', contactNum: '', address: '', branch: '' }
      this.addError = null
      this.showAdd = true
    },
    closeAdd() { this.showAdd = false },

    async fetchAdmins() {
      this.loading = true
      this.error = null
      try {
        const res = await fetch(BASE_URL, { headers: this.authHeaders() })
        const data = await res.json()
        if (!res.ok) { this.error = data.message || 'Failed to fetch admins.'; return }
        this.admins = data.admins
      } catch { this.error = 'Network error.' }
      finally { this.loading = false }
    },

    async confirmAdd() {
      const f = this.addForm
      if (!f.firstname || !f.lastname || !f.username || !f.email || !f.password || !f.contactNum || !f.address || !f.branch) {
        this.addError = 'All fields are required.'; return
      }
      this.saving = true; this.addError = null
      try {
        const res = await fetch(BASE_URL, {
          method: 'POST',
          headers: this.authHeaders(),
          body: JSON.stringify(f)
        })
        const data = await res.json()
        if (!res.ok) { this.addError = data.message || 'Failed to create admin.'; return }
        this.admins.unshift(data.admin)
        this.showAdd = false
      } catch { this.addError = 'Network error.' }
      finally { this.saving = false }
    },

    async saveEdit() {
      this.saving = true; this.editError = null
      try {
        const payload = { ...this.editingAdmin }
        if (!payload.newPassword) delete payload.newPassword
        const res = await fetch(`${BASE_URL}/${this.editingAdmin._id}`, {
          method: 'PUT',
          headers: this.authHeaders(),
          body: JSON.stringify(payload)
        })
        const data = await res.json()
        if (!res.ok) { this.editError = data.message || 'Failed to update.'; return }
        const idx = this.admins.findIndex(a => a._id === data.admin._id)
        if (idx !== -1) this.admins.splice(idx, 1, data.admin)
        this.editingAdmin = null
      } catch { this.editError = 'Network error.' }
      finally { this.saving = false }
    },

    async confirmDelete() {
      this.deleting = true; this.deleteError = null
      try {
        const res = await fetch(`${BASE_URL}/${this.deletingAdmin._id}`, {
          method: 'DELETE',
          headers: this.authHeaders()
        })
        const data = await res.json()
        if (!res.ok) { this.deleteError = data.message || 'Failed to delete.'; return }
        this.admins = this.admins.filter(a => a._id !== this.deletingAdmin._id)
        this.deletingAdmin = null
      } catch { this.deleteError = 'Network error.' }
      finally { this.deleting = false }
    }
  },

  mounted() { this.fetchAdmins() }
}
</script>

<style scoped>
.admins-page { width: 100%; font-family: 'Plus Jakarta Sans', sans-serif; }

/* ── Header ── */
.admins-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}
.admins-header-left { display: flex; align-items: center; gap: 12px; }
.admins-title { color: #fff; font-size: 22px; font-weight: 700; margin: 0; }
.admins-count {
  background: rgba(232,83,26,0.12);
  color: #f87171;
  border: 0.5px solid rgba(232,83,26,0.25);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
}
.admins-header-right { display: flex; gap: 10px; align-items: center; }

.search-wrap { position: relative; }
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #555;
  font-size: 16px;
  pointer-events: none;
}
.search-input {
  padding: 9px 14px 9px 34px;
  border-radius: 10px;
  border: 1px solid #481E14;
  background: #1a1a1a;
  color: #fff;
  font-size: 13.5px;
  width: 210px;
  outline: none;
  transition: border-color 0.2s;
}
.search-input:focus { border-color: #e8531a; }

.btn-add {
  padding: 9px 18px;
  border-radius: 10px;
  border: none;
  background: #e8531a;
  color: #fff;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}
.btn-add:hover { background: #c94316; }

/* ── Table ── */
.table-wrap {
  background: #1a1a1a;
  border: 1px solid #481E14;
  border-radius: 16px;
  overflow: hidden;
}
table { width: 100%; border-collapse: collapse; }
thead { background: #0f0f0f; }
th {
  padding: 13px 18px;
  text-align: left;
  color: #555;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  border-bottom: 1px solid #2a1a14;
}
td {
  padding: 13px 18px;
  color: #ddd;
  font-size: 13.5px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  vertical-align: middle;
}
tr:last-child td { border-bottom: none; }
tr:hover td { background: rgba(232,83,26,0.04); }

.admin-info { display: flex; align-items: center; gap: 12px; }
.avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: rgba(155,57,34,0.5);
  border: 1px solid rgba(232,83,26,0.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; color: #f87171;
  flex-shrink: 0;
}
.admin-name-col { display: flex; flex-direction: column; gap: 2px; }
.admin-name { font-size: 13.5px; font-weight: 600; color: #fff; }
.admin-email { font-size: 11.5px; color: #555; }
.mono { font-family: 'Share Tech Mono', monospace; font-size: 13px; color: #aaa; }
.muted { color: #666; font-size: 13px; }

.branch-badge {
  background: rgba(72,30,20,0.6);
  color: #e8531a;
  border: 0.5px solid rgba(232,83,26,0.2);
  border-radius: 6px;
  font-size: 11.5px;
  font-weight: 600;
  padding: 3px 9px;
  white-space: nowrap;
}
.role-badge {
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  white-space: nowrap;
}
.role-admin  { background: rgba(255,255,255,0.05); color: #888; border: 0.5px solid #333; }
.role-super  { background: rgba(232,83,26,0.12); color: #f87171; border: 0.5px solid rgba(232,83,26,0.25); }

.actions { display: flex; gap: 6px; }
.btn-action {
  padding: 5px 13px;
  border-radius: 7px;
  border: none;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.btn-action.view   { background: rgba(72,30,20,0.6); color: #e8531a; border: 0.5px solid rgba(232,83,26,0.2); }
.btn-action.view:hover { background: rgba(232,83,26,0.15); }
.btn-action.edit   { background: #e8531a; color: #fff; }
.btn-action.edit:hover { background: #c94316; }
.btn-action.delete { background: transparent; border: 0.5px solid #333; color: #666; }
.btn-action.delete:hover { border-color: #dc2626; color: #f87171; background: rgba(220,38,38,0.08); }
.btn-action.delete.confirm { background: #dc2626; color: #fff; border-color: #dc2626; }
.btn-action.delete.confirm:hover { background: #b91c1c; }
.btn-action:disabled { opacity: 0.5; cursor: not-allowed; }

.no-results { text-align: center; color: #444; padding: 48px; font-size: 13.5px; }
.state-msg  { color: #555; padding: 20px; font-size: 13.5px; }
.error-banner {
  background: rgba(220,38,38,0.08);
  border: 1px solid rgba(220,38,38,0.2);
  color: #f87171;
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 13px;
  margin-bottom: 16px;
}

/* ── Modal ── */
.overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.18s ease;
}
.modal {
  background: #141414;
  border: 1px solid #2a1a14;
  border-radius: 18px;
  padding: 28px;
  width: 480px;
  max-height: 88vh;
  display: flex; flex-direction: column; gap: 12px;
  overflow-y: auto;
  animation: popIn 0.18s ease;
}
.modal-sm { width: 380px; align-items: center; text-align: center; }
.modal::-webkit-scrollbar { width: 4px; }
.modal::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }

.modal-avatar-lg {
  width: 72px; height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #9B3922, #e8531a);
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; font-weight: 700; color: #fff;
  margin: 0 auto 4px;
}
.modal-name { color: #fff; font-size: 20px; font-weight: 700; margin: 0; text-align: center; }
.modal-role-badge { display: inline-block; margin: 0 auto; }
.modal-title { color: #fff; font-size: 18px; font-weight: 700; margin: 0; }
.modal-subtitle { color: #555; font-size: 13px; margin: 0; }

.modal-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 6px;
}
.info-item {
  background: #1a1a1a;
  border: 0.5px solid #2a2a2a;
  border-radius: 10px;
  padding: 10px 14px;
  display: flex; flex-direction: column; gap: 4px;
}
.info-item.full { grid-column: span 2; }
.info-label { font-size: 10px; color: #555; text-transform: uppercase; letter-spacing: 0.5px; }
.info-value { font-size: 13.5px; color: #e5e5e5; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-group label {
  font-size: 11.5px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.label-hint { font-size: 10.5px; color: #444; text-transform: none; letter-spacing: 0; font-weight: 400; }

.modal-input {
  padding: 9px 12px;
  border-radius: 9px;
  border: 1px solid #2a2a2a;
  background: #0d0d0d;
  color: #e5e5e5;
  font-size: 13.5px;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.15s;
  font-family: inherit;
}
.modal-input:focus { border-color: #e8531a; }
.modal-input option { background: #1a1a1a; }

.error-inline {
  background: rgba(220,38,38,0.08);
  border: 1px solid rgba(220,38,38,0.2);
  border-left: 3px solid #dc2626;
  color: #f87171;
  font-size: 12.5px;
  padding: 9px 12px;
  border-radius: 6px;
}

.modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 4px; }
.modal-sm .modal-actions { justify-content: center; }

.delete-icon { font-size: 32px; color: #dc2626; }
.delete-msg { font-size: 14px; color: #888; line-height: 1.5; margin: 0; }
.delete-msg strong { color: #e8531a; }

@keyframes popIn {
  from { transform: scale(0.94); opacity: 0; }
  to   { transform: scale(1);    opacity: 1; }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@media (max-width: 700px) {
  .admins-header { flex-direction: column; align-items: flex-start; }
  .modal { width: calc(100vw - 32px); padding: 20px; }
  .form-row { grid-template-columns: 1fr; }
  .modal-info-grid { grid-template-columns: 1fr; }
  .info-item.full { grid-column: span 1; }
}
</style>