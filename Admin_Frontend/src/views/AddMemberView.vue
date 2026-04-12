<template>
  <div class="add-member-container">

    <div class="am-header">
      <div class="am-back" @click="$router.back()">← Back</div>
      <div>
        <h2>Add New Member</h2>
        <p class="am-sub">Select a user to enroll as a branch member</p>
      </div>
    </div>

    <div class="am-filters">
      <input v-model="search" class="search-input" placeholder="Search by name or email..." />
      <select v-model="branchFilter" class="am-select">
        <option value="all">All</option>
        <option value="Walk-in">Walk-in</option>
        <!-- Only show OTHER branches in the filter — admin's branch is excluded from results -->
        <option v-for="b in otherBranches" :key="b" :value="b">{{ b }}</option>
      </select>
    </div>

    <div v-if="loading" class="loading">Loading users...</div>
    <div v-if="fetchError" class="error-msg">{{ fetchError }}</div>

    <div class="table-wrapper" v-if="!loading">
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Current Branch</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user._id">
            <td class="member-info">
              <div class="avatar">{{ initials(user.firstname, user.lastname) }}</div>
              <span>{{ user.firstname }} {{ user.lastname }}</span>
            </td>
            <td>{{ user.email }}</td>
            <td>{{ user.branch }}</td>
            <td>
              <span :class="['status-badge', statusClass(user.status)]">
                {{ user.status }}
              </span>
            </td>
            <td>
              <button class="btn view" @click="openEnroll(user)">
                Add Membership
              </button>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0 && !loading">
            <td colspan="5" class="no-results">No eligible users found for this branch.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ENROLL MODAL -->
    <div class="modal-overlay" v-if="enrollingUser" @click.self="closeEnroll">
      <div class="modal">

        <div class="modal-avatar">
          {{ initials(enrollingUser.firstname, enrollingUser.lastname) }}
        </div>
        <h3>{{ enrollingUser.firstname }} {{ enrollingUser.lastname }}</h3>
        <p class="modal-email">{{ enrollingUser.email }}</p>

        <template v-if="!enrollingUser.isMember">
          <div class="section-label">Contact Information</div>

          <label>Contact Number</label>
          <input v-model="enrollForm.contactNum" class="modal-input" placeholder="e.g. 09171234567" />
          <span class="err" v-if="formErrors.contactNum">{{ formErrors.contactNum }}</span>

          <label>Contact Person</label>
          <input v-model="enrollForm.contactPerson" class="modal-input" placeholder="e.g. Juan Santos" />
          <span class="err" v-if="formErrors.contactPerson">{{ formErrors.contactPerson }}</span>

          <label>Contact Person Number</label>
          <input v-model="enrollForm.contactPersonNum" class="modal-input" placeholder="e.g. 09179876543" />
          <span class="err" v-if="formErrors.contactPersonNum">{{ formErrors.contactPersonNum }}</span>

          <label>Address</label>
          <input v-model="enrollForm.address" class="modal-input" placeholder="e.g. 123 Rizal St, Baguio City" />
          <span class="err" v-if="formErrors.address">{{ formErrors.address }}</span>

          <label>Gym ID</label>
          <input v-model="enrollForm.gymId" class="modal-input" placeholder="e.g. GYM-00123" />
          <span class="err" v-if="formErrors.gymId">{{ formErrors.gymId }}</span>

          <label>RFID <span class="optional">(optional)</span></label>
          <input v-model="enrollForm.rfid" class="modal-input" placeholder="e.g. RFID-4821" />

          <label>Assigned Trainer <span class="optional">(optional)</span></label>
          <input v-model="enrollForm.assignedTrainer" class="modal-input" placeholder="e.g. Coach Rico" />
        </template>

        <div class="section-notice" v-else>
          ℹ️ This user has memberships at other branches. A new membership at <strong>{{ adminBranch }}</strong> will be added.
        </div>

        <div class="section-label">Membership Details</div>

        <label>Branch</label>
        <input :value="adminBranch" class="modal-input" disabled />

        <label>Category</label>
        <select v-model="enrollForm.category" class="modal-input">
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
        <span class="err" v-if="formErrors.category">{{ formErrors.category }}</span>

        <label>Start Date</label>
        <input v-model="enrollForm.startDate" type="date" class="modal-input" />
        <span class="err" v-if="formErrors.startDate">{{ formErrors.startDate }}</span>

        <label>Expiry Date</label>
        <input v-model="enrollForm.expiryDate" type="date" class="modal-input" />
        <span class="err" v-if="formErrors.expiryDate">{{ formErrors.expiryDate }}</span>

        <div v-if="enrollError" class="error-msg">{{ enrollError }}</div>

        <div class="modal-actions">
          <button class="btn-submit" @click="confirmEnroll" :disabled="enrolling">
            {{ enrolling ? 'Adding...' : 'Confirm Add Membership' }}
          </button>
          <button class="btn-cancel" @click="closeEnroll">Cancel</button>
        </div>

      </div>
    </div>

    <!-- SUCCESS MODAL -->
    <div class="modal-overlay" v-if="successUser" @click.self="successUser = null">
      <div class="modal success-modal">
        <div class="success-icon">🎉</div>
        <h3>Membership Added!</h3>
        <p>{{ successUser }} has been successfully enrolled at {{ adminBranch }}.</p>
        <div class="modal-actions">
          <button class="btn-submit" @click="$router.back()">Go to Members</button>
          <button class="btn-cancel" @click="successUser = null">Add Another</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
const API_BASE   = 'http://localhost:3500/admins'
const ENROLL_URL = `${API_BASE}/enroll-member`

const ALL_BRANCHES = ['General Luna', 'Rimando Road', 'Walk-in']

export default {
  data() {
    return {
      search:        '',
      branchFilter:  'all',
      loading:       false,
      fetchError:    null,
      users:         [],
      adminBranch:   '',
      enrollingUser: null,
      successUser:   null,
      enrolling:     false,
      enrollError:   null,
      formErrors:    {},
      enrollForm: {
        contactNum:       '',
        contactPerson:    '',
        contactPersonNum: '',
        address:          '',
        gymId:            '',
        rfid:             '',
        assignedTrainer:  '',
        category:         'Standard',
        branch:           '',
        startDate:        '',
        expiryDate:       ''
      }
    }
  },

  computed: {
    // Branches the admin does NOT belong to — used in the filter dropdown
    otherBranches() {
      return ALL_BRANCHES.filter(b => b !== this.adminBranch)
    },

    filteredUsers() {
      if (!Array.isArray(this.users)) return []
      const s = this.search.toLowerCase()
      return this.users.filter(u => {
        const nameMatch =
          (u.firstname + ' ' + u.lastname).toLowerCase().includes(s) ||
          u.email.toLowerCase().includes(s)
        const branchMatch =
          this.branchFilter === 'all' || u.branch === this.branchFilter
        return nameMatch && branchMatch
      })
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

    decodeToken(token) {
      try {
        const base64 = token.split('.')[1]
          .replace(/-/g, '+')
          .replace(/_/g, '/')
        const padded = base64.padEnd(
          base64.length + (4 - base64.length % 4) % 4, '='
        )
        return JSON.parse(atob(padded))
      } catch (e) {
        console.error('Token decode failed:', e)
        return null
      }
    },

    initials(first, last) {
      return ((first?.[0] || '') + (last?.[0] || '')).toUpperCase()
    },

    statusClass(status) {
      if (status === 'General Luna') return 'general'
      if (status === 'Rimando Road') return 'rimando'
      return 'walkin'
    },

    async fetchUsers() {
      this.loading    = true
      this.fetchError = null
      try {
        const res  = await fetch(ENROLL_URL, { headers: this.authHeaders() })
        const data = await res.json()
        if (!res.ok) {
          this.fetchError = data.message || 'Failed to load users.'
          return
        }
        this.users = Array.isArray(data.users) ? data.users : []
      } catch {
        this.fetchError = 'Network error. Could not reach the server.'
        this.users = []
      } finally {
        this.loading = false
      }
    },

    openEnroll(user) {
      this.enrollingUser = user
      this.enrollForm = {
        contactNum:       '',
        contactPerson:    '',
        contactPersonNum: '',
        address:          '',
        gymId:            '',
        rfid:             '',
        assignedTrainer:  '',
        category:         'Standard',
        branch:           this.adminBranch,
        startDate:        '',
        expiryDate:       ''
      }
      this.formErrors  = {}
      this.enrollError = null
    },

    closeEnroll() {
      this.enrollingUser = null
    },

    validate() {
      const e     = {}
      const isNew = !this.enrollingUser.isMember

      if (isNew) {
        if (!this.enrollForm.contactNum.trim())       e.contactNum       = 'Contact number is required.'
        if (!this.enrollForm.contactPerson.trim())    e.contactPerson    = 'Contact person is required.'
        if (!this.enrollForm.contactPersonNum.trim()) e.contactPersonNum = 'Contact person number is required.'
        if (!this.enrollForm.address.trim())          e.address          = 'Address is required.'
        if (!this.enrollForm.gymId.trim())            e.gymId            = 'Gym ID is required.'
      }

      if (!this.enrollForm.category)   e.category   = 'Category is required.'
      if (!this.enrollForm.startDate)  e.startDate  = 'Start date is required.'
      if (!this.enrollForm.expiryDate) e.expiryDate = 'Expiry date is required.'

      return e
    },

    async confirmEnroll() {
      this.formErrors = this.validate()
      if (Object.keys(this.formErrors).length > 0) return

      this.enrolling   = true
      this.enrollError = null

      const u = this.enrollingUser

      const payload = {
        email: u.email,
        membershipStatus: [
          {
            category:   this.enrollForm.category,
            branch:     this.adminBranch,
            startDate:  this.enrollForm.startDate,
            expiryDate: this.enrollForm.expiryDate,
            isActive:   true
          }
        ]
      }

      if (!u.isMember) {
        Object.assign(payload, {
          firstname:        u.firstname,
          lastname:         u.lastname,
          contactNum:       this.enrollForm.contactNum,
          contactPerson:    this.enrollForm.contactPerson,
          contactPersonNum: this.enrollForm.contactPersonNum,
          address:          this.enrollForm.address,
          gymId:            this.enrollForm.gymId,
          rfid:             this.enrollForm.rfid            || undefined,
          assignedTrainer:  this.enrollForm.assignedTrainer || undefined
        })
      }

      try {
        const res  = await fetch(ENROLL_URL, {
          method:  'POST',
          headers: this.authHeaders(),
          body:    JSON.stringify(payload)
        })
        const data = await res.json()

        if (!res.ok) {
          this.enrollError = data.message || 'Failed to enroll member.'
          return
        }

        // Remove the user from the local list since they're now enrolled here
        this.users = this.users.filter(x => x._id !== u._id)

        const name = `${u.firstname} ${u.lastname}`
        this.closeEnroll()
        this.successUser = name

      } catch {
        this.enrollError = 'Network error. Please try again.'
      } finally {
        this.enrolling = false
      }
    }
  },

  mounted() {
    const token   = this.getToken()
    const decoded = this.decodeToken(token)
    this.adminBranch = decoded?.branch || 'General Luna'
    this.fetchUsers()
  }
}
</script>
<style scoped>
.add-member-container { width: 100%; }

.am-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
}
.am-back {
  color: #F2613F; font-size: 14px;
  cursor: pointer; padding-top: 6px; white-space: nowrap;
}
.am-back:hover { text-decoration: underline; }
.am-header h2 { color: white; margin: 0; }
.am-sub { color: #888; font-size: 13px; margin: 4px 0 0; }

.am-filters {
  display: flex; gap: 12px;
  margin-bottom: 20px; flex-wrap: wrap;
}

.search-input {
  padding: 10px 16px; border-radius: 10px;
  border: 1px solid #481E14; background: #1a1a1a;
  color: white; font-size: 14px; width: 260px;
  outline: none; transition: 0.2s;
}
.search-input:focus { border-color: #F2613F; }

.am-select {
  padding: 10px 14px; border-radius: 10px;
  border: 1px solid #481E14; background: #1a1a1a;
  color: white; font-size: 14px; outline: none; cursor: pointer;
}
.am-select:focus { border-color: #F2613F; }

.table-wrapper {
  background: #1a1a1a; border-radius: 16px;
  border: 1px solid #481E14; overflow: hidden;
}
table { width: 100%; border-collapse: collapse; }
thead { background: #0C0C0C; }
th {
  padding: 14px 20px; text-align: left; color: #aaa;
  font-size: 13px; text-transform: uppercase;
  letter-spacing: 0.5px; border-bottom: 1px solid #481E14;
}
td {
  padding: 14px 20px; color: white;
  font-size: 14px; border-bottom: 1px solid #2a2a2a;
}
tr:last-child td { border-bottom: none; }
tr:hover td { background: #1f1210; }

.member-info { display: flex; align-items: center; gap: 12px; }
.avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: #9B3922; display: flex; align-items: center;
  justify-content: center; font-size: 13px;
  font-weight: bold; color: white; flex-shrink: 0;
}

.status-badge {
  padding: 3px 10px; border-radius: 20px;
  font-size: 11px; font-weight: bold;
}
.status-badge.walkin  { background: #1a2a1a; color: #4caf82; }
.status-badge.general { background: #1a1a2a; color: #4a9eff; }
.status-badge.rimando { background: #2a1a2a; color: #c47eff; }

.btn {
  padding: 6px 14px; border-radius: 8px;
  border: none; font-size: 13px;
  cursor: pointer; transition: 0.15s;
}
.btn.view { background: #481E14; color: #F2613F; }
.btn.view:hover:not(:disabled) { background: #5a2518; }
.btn.view:disabled { opacity: 0.5; cursor: not-allowed; }

.no-results { text-align: center; color: #555; padding: 40px; }
.loading    { color: #aaa; padding: 20px; }
.error-msg  { color: #c0392b; font-size: 13px; padding: 4px 0; }

/* MODAL */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; animation: fadeIn 0.2s ease;
}
.modal {
  background: #121212; border: 1px solid #2b2b2b;
  border-radius: 18px; padding: 28px; width: 460px;
  max-height: 85vh; display: flex; flex-direction: column;
  gap: 10px; overflow-y: auto; animation: modalPop 0.18s ease;
}
.modal h3 { margin: 0 0 2px; color: white; font-size: 20px; }
.modal label { font-size: 12px; color: #888; }
.modal-email { color: #888; font-size: 13px; margin: 0; }

.modal-avatar {
  width: 64px; height: 64px; border-radius: 50%;
  background: linear-gradient(135deg,#9B3922,#F2613F);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; font-weight: bold; color: white;
  margin: 0 auto 6px;
}
.modal-input {
  padding: 10px 12px; border-radius: 10px;
  border: 1px solid #2a2a2a; background: #0C0C0C;
  color: white; font-size: 14px; width: 100%;
  box-sizing: border-box; transition: 0.15s;
}
.modal-input:focus { outline: none; border-color: #F2613F; }

.section-label {
  font-size: 12px; color: #888;
  text-transform: uppercase; letter-spacing: 0.5px;
  margin-top: 8px; border-top: 1px solid #2a2a2a; padding-top: 10px;
}
.optional { color: #555; font-size: 11px; }
.err { color: #c0392b; font-size: 12px; }
.modal-actions { display: flex; gap: 10px; margin-top: 8px; }

.btn-submit {
  flex: 1; padding: 11px; border-radius: 10px;
  border: none; background: #F2613F; color: white;
  font-size: 14px; font-weight: bold; cursor: pointer; transition: 0.2s;
}
.btn-submit:hover:not(:disabled) { background: #9B3922; }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-cancel {
  flex: 1; padding: 11px; border-radius: 10px;
  border: 1px solid #444; background: transparent;
  color: #aaa; font-size: 14px; cursor: pointer; transition: 0.2s;
}
.btn-cancel:hover { background: #1f1f1f; border-color: #666; }

.success-modal { text-align: center; align-items: center; }
.success-icon { font-size: 48px; }
.success-modal h3 { color: #4caf82; }
.success-modal p { color: #bbb; font-size: 14px; }

.modal::-webkit-scrollbar { width: 6px; }
.modal::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }

@keyframes modalPop {
  from { transform: scale(0.92); opacity: 0; }
  to   { transform: scale(1);    opacity: 1; }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
</style>