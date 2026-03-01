<template>
  <div class="add-member-container">

    <div class="form-card">
      <h2>Add New Member</h2>
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

      <!-- Form -->
      <div class="form-grid">

        <div class="form-group">
          <label>Full Name</label>
          <input v-model="form.name" class="form-input" placeholder="e.g. Juan Dela Cruz" />
          <span class="error" v-if="errors.name">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label>Contact Number</label>
          <input v-model="form.contact" class="form-input" placeholder="e.g. 09171234567" />
          <span class="error" v-if="errors.contact">{{ errors.contact }}</span>
        </div>

        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" class="form-input" placeholder="e.g. juan@email.com" />
          <span class="error" v-if="errors.email">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label>Membership Type</label>
          <select v-model="form.type" class="form-input">
            <option value="" disabled>Select type</option>
            <option>Basic</option>
            <option>Standard</option>
            <option>Premium</option>
          </select>
          <span class="error" v-if="errors.type">{{ errors.type }}</span>
        </div>

        <div class="form-group">
          <label>Start Date</label>
          <input v-model="form.startDate" type="date" class="form-input" />
          <span class="error" v-if="errors.startDate">{{ errors.startDate }}</span>
        </div>

        <div class="form-group">
          <label>Expiry Date</label>
          <input v-model="form.expiry" type="date" class="form-input" />
          <span class="error" v-if="errors.expiry">{{ errors.expiry }}</span>
        </div>

        <div class="form-group full-width">
          <label>Address</label>
          <input v-model="form.address" class="form-input" placeholder="e.g. 123 Rizal St, Manila" />
          <span class="error" v-if="errors.address">{{ errors.address }}</span>
        </div>

      </div>

      <!-- Submit -->
      <div class="form-footer">
        <button class="btn-reset" @click="resetForm">Reset</button>
        <button class="btn-submit" @click="submitForm">Add Member</button>
      </div>
    </div>

    <!-- Success Modal -->
    <div class="modal-overlay" v-if="showSuccess" @click.self="showSuccess = false">
      <div class="modal">
        <div class="success-icon">✓</div>
        <h3>Member Added!</h3>
        <p>{{ form.name || 'The member' }} has been successfully registered.</p>
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
      photoPreview: null,
      form: {
        name: '',
        contact: '',
        email: '',
        type: '',
        startDate: '',
        expiry: '',
        address: '',
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
      if (!this.form.name.trim())       errors.name      = 'Full name is required.'
      if (!this.form.contact.trim())    errors.contact   = 'Contact number is required.'
      if (!this.form.email.trim())      errors.email     = 'Email is required.'
      if (!this.form.type)              errors.type      = 'Please select a membership type.'
      if (!this.form.startDate)         errors.startDate = 'Start date is required.'
      if (!this.form.expiry)            errors.expiry    = 'Expiry date is required.'
      if (!this.form.address.trim())    errors.address   = 'Address is required.'
      return errors
    },
    submitForm() {
      this.errors = this.validate()
      if (Object.keys(this.errors).length === 0) {
        this.showSuccess = true
      }
    },
    resetForm() {
      this.form = { name: '', contact: '', email: '', type: '', startDate: '', expiry: '', address: '' }
      this.photoPreview = null
      this.errors = {}
    }
  }
}
</script>

<style scoped>
.add-member-container {
  width: 100%;
}

.form-card {
  background: #1a1a1a;
  border: 1px solid #481E14;
  border-radius: 16px;
  padding: 32px;
}

.form-card h2 {
  color: white;
  margin: 0 0 6px 0;
}

.subtitle {
  color: #aaa;
  margin: 0 0 28px 0;
  font-size: 14px;
}

/* Photo Upload */
.photo-section {
  display: flex;
  justify-content: center;
  margin-bottom: 28px;
}

.photo-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px dashed #481E14;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: 0.2s;
}

.photo-preview:hover {
  border-color: #F2613F;
}

.photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #555;
}

.photo-placeholder span {
  font-size: 28px;
  line-height: 1;
  color: #F2613F;
}

.photo-placeholder p {
  margin: 4px 0 0;
  font-size: 11px;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.full-width {
  grid-column: 1 / -1;
}

label {
  color: #aaa;
  font-size: 13px;
}

.form-input {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #481E14;
  background: #0C0C0C;
  color: white;
  font-size: 14px;
  outline: none;
  transition: 0.2s;
}

.form-input:focus {
  border-color: #F2613F;
}

.form-input option {
  background: #0C0C0C;
}

.error {
  color: #c0392b;
  font-size: 12px;
}

/* Footer */
.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 28px;
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

/* Success Modal */
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
  padding: 40px 32px;
  width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.success-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #481E14;
  color: #F2613F;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal h3 {
  color: white;
  margin: 0;
}

.modal p {
  color: #aaa;
  margin: 0;
  font-size: 14px;
}
</style>