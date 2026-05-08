<style scoped>
.wrap {
  width: 100%;
  color: #ddd;
  font-family: Arial, sans-serif;
}

/* Toast */
.toast {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #1a1a1a;
  border: 1px solid #481E14;
  padding: 10px 14px;
  border-radius: 10px;
  display: flex;
  gap: 8px;
  align-items: center;
  z-index: 10;
}
.toast.success { border-color: #3ddc84; }
.toast.error { border-color: #e25c5c; }

/* Header */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  flex-wrap: wrap;
  gap: 12px;
}

.top-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #481E14;
  display: flex;
  align-items: center;
  justify-content: center;
}

.top-left h2 {
  color: white;
  margin: 0;
  font-size: 18px;
}

.top-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #1a1a1a;
  border: 1px solid #481E14;
  border-radius: 10px;
  padding: 8px 12px;
}

.search-box input {
  background: transparent;
  border: none;
  outline: none;
  color: white;
  width: 160px;
  font-size: 13px;
}

select {
  background: #1a1a1a;
  border: 1px solid #481E14;
  color: white;
  border-radius: 10px;
  padding: 8px 10px;
}

/* Buttons */
.btn {
  border: none;
  border-radius: 10px;
  padding: 7px 12px;
  font-size: 13px;
  cursor: pointer;
}

.btn-primary {
  background: #F2613F;
  color: white;
}

.btn-archive {
  background: #2b1a0d;
  color: #f0a500;
}

.btn-restore {
  background: #0d2b1d;
  color: #3ddc84;
}

.btn-delete {
  background: #2b0d0d;
  color: #e25c5c;
}

.btn-cancel {
  background: #333;
  color: #aaa;
}

/* Stats */
.stats-row {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.stat-card {
  flex: 1;
  min-width: 120px;
  background: #111;
  border: 1px solid #481E14;
  border-radius: 12px;
  padding: 12px;
}

.stat-label {
  font-size: 12px;
  color: #888;
}

.stat-val {
  font-size: 18px;
  margin-top: 4px;
}

.stat-val.green { color: #3ddc84; }
.stat-val.red { color: #e25c5c; }

/* Tabs */
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.tab-btn {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid #481E14;
  background: transparent;
  color: #aaa;
  cursor: pointer;
}

.tab-btn.active {
  background: #481E14;
  color: #F2613F;
  font-weight: bold;
}

/* Table */
.table-wrap {
  background: #111;
  border: 1px solid #481E14;
  border-radius: 14px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

thead th {
  background: #1a1a1a;
  color: #aaa;
  padding: 12px 14px;
  text-align: left;
  cursor: pointer;
}

tbody tr {
  border-bottom: 1px solid #2a1a14;
  transition: 0.15s;
}

tbody tr:hover {
  background: #1f1010;
}

td {
  padding: 12px 14px;
}

/* User cell */
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
  color: #F2613F;
  font-weight: bold;
}

/* Badges */
.badge {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}

.badge-active {
  background: #0d2b1d;
  color: #3ddc84;
}

.badge-archived {
  background: #2b0d0d;
  color: #e25c5c;
}

/* Actions */
.action-btns {
  display: flex;
  gap: 6px;
}

/* No results */
.no-results {
  text-align: center;
  padding: 40px;
  color: #666;
}

/* Modal */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: #1a1a1a;
  border: 1px solid #481E14;
  border-radius: 14px;
  width: 400px;
  max-width: 90%;
  padding: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  color: white;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #aaa;
  font-size: 20px;
  cursor: pointer;
}

.modal-body {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-body input {
  background: #111;
  border: 1px solid #481E14;
  border-radius: 8px;
  padding: 8px;
  color: white;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 14px;
}
</style>

<template>
<div class="wrap" style="position:relative;">

  <!-- Toast -->
  <div v-if="toast.show" :class="['toast', toast.type]">
    <i :class="['ti', toast.icon]" style="font-size:15px;"></i>
    {{ toast.message }}
  </div>

  <!-- Header -->
  <div class="top-bar">
    <div class="top-left">
      <div class="icon-circle"><i class="ti ti-archive"></i></div>
      <h2>Member Archive</h2>
    </div>

    <div class="top-right">
      <div class="search-box">
        <i class="ti ti-search"></i>
        <input type="text" v-model="search" placeholder="Search members..." />
      </div>

      <select v-model="membershipFilter">
        <option value="All">All plans</option>
        <option value="Monthly">Monthly</option>
        <option value="Annual">Annual</option>
        <option value="Premium">Premium</option>
      </select>
    </div>
  </div>

  <!-- Stats -->
  <div class="stats-row">
    <div class="stat-card">
      <div class="stat-label">Active members</div>
      <div class="stat-val green">{{ stats.active }}</div>
    </div>

    <div class="stat-card">
      <div class="stat-label">Archived</div>
      <div class="stat-val red">{{ stats.archived }}</div>
    </div>

    <div class="stat-card">
      <div class="stat-label">Monthly plan</div>
      <div class="stat-val">{{ stats.monthly }}</div>
    </div>

    <div class="stat-card">
      <div class="stat-label">Annual plan</div>
      <div class="stat-val">{{ stats.annual }}</div>
    </div>

    <div class="stat-card">
      <div class="stat-label">Premium plan</div>
      <div class="stat-val">{{ stats.premium }}</div>
    </div>
  </div>

  <!-- Tabs -->
  <div class="tabs">
    <button class="tab-btn" :class="{active: currentTab === 'active'}" @click="currentTab='active'">
      <i class="ti ti-users"></i> Active members
    </button>

    <button class="tab-btn" :class="{active: currentTab === 'archived'}" @click="currentTab='archived'">
      <i class="ti ti-archive"></i> Archived members
    </button>
  </div>

  <!-- Table -->
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th @click="sortBy('name')">Name</th>
          <th @click="sortBy('membership')">Plan</th>
          <th @click="sortBy('joinDate')">Joined</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="m in filteredMembers" :key="m.id" @click="openDetail(m)">
          <td>
            <div class="user-cell">
              <div class="avatar">{{ initials(m.name) }}</div>
              <div>
                <div style="font-weight:500;">{{ m.name }}</div>
                <div style="font-size:11px;">{{ m.email }}</div>
              </div>
            </div>
          </td>

          <td>
            <span class="badge" :class="badgeClass(m.membership)">
              {{ m.membership }}
            </span>
          </td>

          <td>{{ formatDate(m.joinDate) }}</td>

          <td>
            <span v-if="m.is_archived" class="badge badge-archived">Archived</span>
            <span v-else class="badge badge-active">Active</span>
          </td>

          <td @click.stop>
            <div class="action-btns">
              <button v-if="!m.is_archived" class="btn btn-archive" @click="openArchive(m)">
                Archive
              </button>

              <template v-else>
                <button class="btn btn-restore" @click="openRestore(m)">Restore</button>
                <button class="btn btn-delete" @click="openDelete(m)">Delete</button>
              </template>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="filteredMembers.length === 0" class="no-results">
      No members found
    </div>
  </div>

  <!-- Detail Modal -->
  <div v-if="modals.detail" class="overlay" @click.self="closeModal('detail')">
    <div class="modal">
      <div class="modal-header">
        <h3>Member details</h3>
        <button class="close-btn" @click="closeModal('detail')">×</button>
      </div>

      <div class="modal-body" v-if="selectedMember">
        <p>{{ selectedMember.name }}</p>
        <p>{{ selectedMember.email }}</p>
      </div>
    </div>
  </div>

  <!-- Add Modal -->
  <div v-if="modals.add" class="overlay" @click.self="closeModal('add')">
    <div class="modal">
      <div class="modal-header">
        <h3>Add new member</h3>
        <button class="close-btn" @click="closeModal('add')">×</button>
      </div>

      <div class="modal-body">
        <input v-model="form.first" placeholder="First name" />
        <input v-model="form.last" placeholder="Last name" />
        <input v-model="form.email" placeholder="Email" />
      </div>

      <div class="modal-footer">
        <button class="btn btn-cancel" @click="closeModal('add')">Cancel</button>
        <button class="btn btn-primary" @click="confirmAdd">Add</button>
      </div>
    </div>
  </div>

</div>
</template>

```vue
<script>
export default {
  data() {
    return {
      members: [
        {id:1,name:'John Doe',email:'john.doe@gmail.com',phone:'+63 917 111 2222',membership:'Monthly',joinDate:'2026-01-15',is_archived:false},
        {id:2,name:'Jane Smith',email:'jane.smith@gmail.com',phone:'+63 918 333 4444',membership:'Annual',joinDate:'2026-06-22',is_archived:false},
        {id:3,name:'Mark Lee',email:'mark.lee@gmail.com',phone:'+63 919 555 6666',membership:'Monthly',joinDate:'2023-11-05',is_archived:true},
        {id:4,name:'Anna Cruz',email:'anna.cruz@gmail.com',phone:'+63 920 777 8888',membership:'Annual',joinDate:'2026-03-10',is_archived:false},
        {id:5,name:'Rico Santos',email:'rico.santos@gmail.com',phone:'+63 921 999 0000',membership:'Premium',joinDate:'2026-02-28',is_archived:false},
        {id:6,name:'Mika Reyes',email:'mika.reyes@gmail.com',phone:'+63 922 123 4567',membership:'Premium',joinDate:'2023-08-14',is_archived:true},
        {id:7,name:'Paolo Lim',email:'paolo.lim@gmail.com',phone:'+63 923 234 5678',membership:'Monthly',joinDate:'2026-04-01',is_archived:false},
        {id:8,name:'Clara Tan',email:'clara.tan@gmail.com',phone:'+63 924 345 6789',membership:'Annual',joinDate:'2023-12-20',is_archived:true},
      ],
      nextId: 9,
      search: '',
      membershipFilter: 'All',
      currentTab: 'active',
      sortKey: null,
      sortDir: 1,

      toast: {
        show: false,
        message: '',
        type: '',
        icon: ''
      },

      modals: {
        detail: false,
        add: false
      },

      selectedMember: null,

      form: {
        first: '',
        last: '',
        email: ''
      }
    }
  },

  computed: {
    stats() {
      const active = this.members.filter(m => !m.is_archived).length
      const archived = this.members.filter(m => m.is_archived).length
      const monthly = this.members.filter(m => !m.is_archived && m.membership === 'Monthly').length
      const annual = this.members.filter(m => !m.is_archived && m.membership === 'Annual').length
      const premium = this.members.filter(m => !m.is_archived && m.membership === 'Premium').length

      return { active, archived, monthly, annual, premium }
    },

    filteredMembers() {
      let list = this.members.filter(m => {
        const matchTab = this.currentTab === 'active' ? !m.is_archived : m.is_archived
        const matchSearch = !this.search ||
          m.name.toLowerCase().includes(this.search.toLowerCase()) ||
          m.email.toLowerCase().includes(this.search.toLowerCase())
        const matchPlan = this.membershipFilter === 'All' || m.membership === this.membershipFilter

        return matchTab && matchSearch && matchPlan
      })

      if (this.sortKey) {
        list = [...list].sort((a, b) => {
          const av = a[this.sortKey] || ''
          const bv = b[this.sortKey] || ''
          return av < bv ? -this.sortDir : av > bv ? this.sortDir : 0
        })
      }

      return list
    }
  },

  methods: {
    sortBy(key) {
      if (this.sortKey === key) this.sortDir *= -1
      else {
        this.sortKey = key
        this.sortDir = 1
      }
    },

    badgeClass(plan) {
      if (plan === 'Monthly') return 'badge-monthly'
      if (plan === 'Annual') return 'badge-annual'
      return 'badge-premium'
    },

    initials(name) {
      return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    },

    formatDate(d) {
      if (!d) return '-'
      return new Date(d).toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },

    openDetail(member) {
      this.selectedMember = member
      this.modals.detail = true
    },

    openAddModal() {
      this.form.first = ''
      this.form.last = ''
      this.form.email = ''
      this.modals.add = true
    },

    confirmAdd() {
      if (!this.form.first || !this.form.last || !this.form.email) {
        this.showToast('ti-alert-circle', 'Please fill in required fields', 'toast-error')
        return
      }

      this.members.unshift({
        id: this.nextId++,
        name: `${this.form.first} ${this.form.last}`,
        email: this.form.email,
        membership: 'Monthly',
        joinDate: new Date().toISOString().split('T')[0],
        is_archived: false
      })

      this.modals.add = false
      this.showToast('ti-user-plus', 'New member added successfully', 'toast-success')
    },

    openArchive(member) {
      member.is_archived = true
      this.showToast('ti-archive', 'Member archived', 'toast-info')
    },

    openRestore(member) {
      member.is_archived = false
      this.showToast('ti-refresh', 'Member restored', 'toast-success')
    },

    openDelete(member) {
      this.members = this.members.filter(m => m.id !== member.id)
      this.showToast('ti-trash', 'Member deleted', 'toast-error')
    },

    closeModal(type) {
      this.modals[type] = false
    },

    showToast(icon, message, type) {
      this.toast = {
        show: true,
        message,
        type,
        icon
      }

      setTimeout(() => {
        this.toast.show = false
      }, 3000)
    }
  }
}
</script>

