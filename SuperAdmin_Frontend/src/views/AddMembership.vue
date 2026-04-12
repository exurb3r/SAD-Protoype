<template>
  <div class="add-member-container">

    <div class="form-card">
      <h2>Whitelist Member</h2>
      <p class="subtitle">Fill in the details to register a new gym member.</p>

      <!-- Photo Upload -->
      <div class="photo-section">
        <div class="photo-preview" @click="triggerFileInput">
          <img v-if="photoPreview" :src="photoPreview" alt="Preview" />
          <div v-else class="photo-placeholder">
            <span>+</span>
            <p>Upload Photo</p>
          </div>
        </div>
        <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="handlePhoto" />
      </div>

      <div class="form-grid">

        <div class="form-group">
          <label>First Name</label>
          <input v-model="form.firstname" class="form-input" />
          <span class="error" v-if="errors.firstname">{{ errors.firstname }}</span>
        </div>

        <div class="form-group">
          <label>Last Name</label>
          <input v-model="form.lastname" class="form-input" />
          <span class="error" v-if="errors.lastname">{{ errors.lastname }}</span>
        </div>

        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" class="form-input" />
          <span class="error" v-if="errors.email">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label>Contact Number</label>
          <input v-model="form.contactNum" class="form-input" />
          <span class="error" v-if="errors.contactNum">{{ errors.contactNum }}</span>
        </div>

        <div class="form-group">
          <label>Contact Person</label>
          <input v-model="form.contactPerson" class="form-input" />
          <span class="error" v-if="errors.contactPerson">{{ errors.contactPerson }}</span>
        </div>

        <div class="form-group">
          <label>Contact Person Number</label>
          <input v-model="form.contactPersonNum" class="form-input" />
          <span class="error" v-if="errors.contactPersonNum">{{ errors.contactPersonNum }}</span>
        </div>

        <div class="form-group">
          <label>Gym ID</label>
          <input v-model="form.gymId" class="form-input" />
          <span class="error" v-if="errors.gymId">{{ errors.gymId }}</span>
        </div>

        <div class="form-group">
          <label>RFID (Optional)</label>
          <input v-model="form.rfid" class="form-input" />
        </div>

        <div class="form-group">
          <label>Assigned Trainer (Optional)</label>
          <input v-model="form.assignedTrainer" class="form-input" />
        </div>

        <div class="form-group">
          <label>Branch</label>
          <select v-model="form.membershipStatus[0].branch" class="form-input">
            <option>General Luna</option>
            <option>Rimando Road</option>
            <option>Visiting</option>
          </select>
        </div>

        <div class="form-group">
          <label>Membership Type</label>
          <select v-model="form.membershipStatus[0].category" class="form-input">
            <option value="" disabled>Select membership</option>
            <option>Walk-in</option>
            <option>Standard</option>
            <option>Standard Renewal</option>
            <option>New Member / Early Renew</option>
            <option>Classic - Student</option>
            <option>Classic - Regular</option>
            <option>Premium - Student</option>
            <option>Premium - Regular</option>
            <option>VIP - Student</option>
            <option>VIP - Regular</option>
          </select>
          <span class="error" v-if="errors.category">{{ errors.category }}</span>
        </div>

        <div class="form-group">
          <label>Start Date</label>
          <input v-model="form.membershipStatus[0].startDate" type="date" class="form-input" />
          <span class="error" v-if="errors.startDate">{{ errors.startDate }}</span>
        </div>

        <div class="form-group">
          <label>Expiry Date</label>
          <input v-model="form.membershipStatus[0].expiryDate" type="date" class="form-input" />
          <span class="error" v-if="errors.expiryDate">{{ errors.expiryDate }}</span>
        </div>

        <div class="form-group full-width">
          <label>Address</label>
          <input v-model="form.address" class="form-input" />
          <span class="error" v-if="errors.address">{{ errors.address }}</span>
        </div>

      </div>

      <div class="form-footer">
        <button class="btn-reset" @click="resetForm">Reset</button>
       <button class="btn-submit" @click="submitForm" :disabled="isLoading">
        {{ isLoading ? 'Adding...' : 'Add Member' }}
      </button>
      </div>
    </div>

    <div class="modal-overlay" v-if="showSuccess" @click.self="showSuccess = false">
      <div class="modal">
        <div class="success-icon">✓</div>
        <h3>Member Added!</h3>
        <p>{{ form.firstname }} {{ form.lastname }} has been successfully registered.</p>
        <button class="btn-submit" @click="showSuccess = false; resetForm()">Add Another</button>
      </div>
    </div>

  </div>
</template>


<script>
export default {
  data() {
    return {
      showSuccess: false,
      isLoading: false,
      photoPreview: null,
      serverError: '',
      form: {
        firstname: '',
        lastname: '',
        email: '',
        contactNum: '',
        contactPerson: '',
        contactPersonNum: '',
        address: '',
        gymId: '',
        rfid: '',
        assignedTrainer: '',
        membershipStatus: [
          {
            category: '',
            branch: 'General Luna',
            startDate: '',
            expiryDate: ''
          }
        ]
      },
      errors: {}
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click()
    },

    handlePhoto(e) {
      const file = e.target.files[0]
      if (file) {
        this.photoPreview = URL.createObjectURL(file)
      }
    },

    validate() {
      const errors = {}

      if (!this.form.firstname.trim()) errors.firstname = 'First name required'
      if (!this.form.lastname.trim()) errors.lastname = 'Last name required'
      if (!this.form.email.trim()) errors.email = 'Email required'
      if (!this.form.contactNum.trim()) errors.contactNum = 'Contact number required'
      if (!this.form.contactPerson.trim()) errors.contactPerson = 'Contact person required'
      if (!this.form.contactPersonNum.trim()) errors.contactPersonNum = 'Contact person number required'
      if (!this.form.address.trim()) errors.address = 'Address required'
      if (!this.form.gymId.trim()) errors.gymId = 'Gym ID required'
      if (!this.form.membershipStatus[0].category) errors.category = 'Membership type required'

      // ✅ startDate and expiryDate are now optional — removed from validation

      return errors
    },

    async submitForm() {
      this.errors = this.validate()
      this.serverError = ''

      if (Object.keys(this.errors).length > 0) return

      // Build a clean payload — strip empty optional dates so backend doesn't get ''
      const payload = {
        ...this.form,
        membershipStatus: [
          {
            ...this.form.membershipStatus[0],
            startDate: this.form.membershipStatus[0].startDate || undefined,
            expiryDate: this.form.membershipStatus[0].expiryDate || undefined
          }
        ]
      }

      this.isLoading = true
      try {
        const token = localStorage.getItem('adminToken') // adjust key to match how you store your JWT

        const response = await fetch('http://localhost:3500/admins/addmembership/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        })

        const data = await response.json()

        if (!response.ok) {
          // Surface backend error (e.g. duplicate email/gymId/RFID)
          this.serverError = data.message || 'Something went wrong. Please try again.'
          return
        }

        this.showSuccess = true

      } catch (err) {
        this.serverError = 'Network error. Please check your connection.'
      } finally {
        this.isLoading = false
      }
    },

    resetForm() {
      this.form = {
        firstname: '',
        lastname: '',
        email: '',
        contactNum: '',
        contactPerson: '',
        contactPersonNum: '',
        address: '',
        gymId: '',
        rfid: '',
        assignedTrainer: '',
        membershipStatus: [
          {
            category: '',
            branch: 'General Luna',
            startDate: '',
            expiryDate: ''
          }
        ]
      }
      this.photoPreview = null
      this.errors = {}
      this.serverError = ''
    }
  }
}
</script>

<style scoped>
/* SAME CSS YOU PROVIDED — UNCHANGED */
.add-member-container { width: 100%; }
.form-card { background:#1a1a1a;border:1px solid #481E14;border-radius:16px;padding:32px; }
.form-card h2 { color:white;margin:0 0 6px 0; }
.subtitle { color:#aaa;margin:0 0 28px 0;font-size:14px; }
.photo-section { display:flex;justify-content:center;margin-bottom:28px; }
.photo-preview { width:100px;height:100px;border-radius:50%;border:2px dashed #481E14;display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden; }
.photo-preview img { width:100%;height:100%;object-fit:cover; }
.photo-placeholder { display:flex;flex-direction:column;align-items:center;color:#555; }
.photo-placeholder span { font-size:28px;color:#F2613F; }
.form-grid { display:grid;grid-template-columns:1fr 1fr;gap:20px; }
.form-group { display:flex;flex-direction:column;gap:6px; }
.full-width { grid-column:1/-1; }
label { color:#aaa;font-size:13px; }
.form-input { padding:10px 14px;border-radius:10px;border:1px solid #481E14;background:#0C0C0C;color:white; }
.error { color:#c0392b;font-size:12px; }
.form-footer { display:flex;justify-content:flex-end;gap:12px;margin-top:28px; }
.btn-reset { padding:10px 24px;border-radius:10px;border:1px solid #481E14;background:transparent;color:#aaa; }
.btn-submit { padding:10px 24px;border-radius:10px;border:none;background:#F2613F;color:white;font-weight:bold; }
.modal-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center; }
.modal { background:#1a1a1a;border:1px solid #481E14;border-radius:16px;padding:40px 32px;width:340px;text-align:center; }
.success-icon { width:60px;height:60px;border-radius:50%;background:#481E14;color:#F2613F;font-size:28px;display:flex;align-items:center;justify-content:center; }
</style>