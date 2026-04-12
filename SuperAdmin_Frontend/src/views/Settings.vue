<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('general')
const loading = ref(false)
const saveMessage = ref('')
const saveError = ref('')

const adminProfile = ref({
  username: 'armstrong_admin',
  firstName: 'John',
  lastName: 'Armstrong',
  email: 'admin@armstronggym.com',
  address: '123 Fitness Street, Manila, Philippines'
})

const notifications = ref({
  emailNotifications: true,
  smsNotifications: false,
  newMemberAlerts: true,
  attendanceAlerts: false
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordError = ref('')
const passwordSuccess = ref('')

const securitySettings = ref({
  twoFactorAuth: false,
  sessionTimeout: 30,
  requireStrongPassword: true
})

function saveSettings() {
  loading.value = true
  saveMessage.value = ''
  saveError.value = ''
  setTimeout(() => {
    loading.value = false
    saveMessage.value = 'Settings saved successfully!'
    setTimeout(() => { saveMessage.value = '' }, 3000)
  }, 800)
}

function changePassword() {
  passwordError.value = ''
  passwordSuccess.value = ''

  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword || !passwordForm.value.confirmPassword) {
    passwordError.value = 'All fields are required.'
    return
  }
  if (passwordForm.value.newPassword.length < 8) {
    passwordError.value = 'New password must be at least 8 characters.'
    return
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'New passwords do not match.'
    return
  }

  loading.value = true
  setTimeout(() => {
    loading.value = false
    passwordSuccess.value = 'Password changed successfully!'
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
    setTimeout(() => { passwordSuccess.value = '' }, 3000)
  }, 800)
}
</script>

<template>
  <div class="settings-page">
    <div class="settings-content">

      <!-- Sidebar -->
      <div class="settings-sidebar">
        <button class="tab-btn" :class="{ active: activeTab === 'general' }" @click="activeTab = 'general'">
          <span>👤</span> My Profile
        </button>
        <button class="tab-btn" :class="{ active: activeTab === 'notifications' }" @click="activeTab = 'notifications'">
          <span>🔔</span> Notifications
        </button>
        <button class="tab-btn" :class="{ active: activeTab === 'security' }" @click="activeTab = 'security'">
          <span>🔒</span> Security
        </button>
        <button class="tab-btn" :class="{ active: activeTab === 'backup' }" @click="activeTab = 'backup'">
          <span>💾</span> Backup & Restore
        </button>
      </div>

      <!-- Main -->
      <div class="settings-main">

        <!-- Toast -->
        <div v-if="saveMessage" class="toast toast-success">✅ {{ saveMessage }}</div>
        <div v-if="saveError" class="toast toast-error">❌ {{ saveError }}</div>

        <!-- GENERAL / MY PROFILE -->
        <div v-if="activeTab === 'general'" class="settings-section">
          <h2>👤 My Profile</h2>
          <p class="section-desc">Update your admin account information</p>

          <div class="panel">
            <h4 class="panel-title">Account Details</h4>
            <div class="form-group">
              <label>Username</label>
              <input v-model="adminProfile.username" type="text" class="form-input" placeholder="Enter username" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>First Name</label>
                <input v-model="adminProfile.firstName" type="text" class="form-input" placeholder="First name" />
              </div>
              <div class="form-group">
                <label>Last Name</label>
                <input v-model="adminProfile.lastName" type="text" class="form-input" placeholder="Last name" />
              </div>
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input v-model="adminProfile.email" type="email" class="form-input" placeholder="admin@example.com" />
            </div>
            <div class="form-group">
              <label>Address</label>
              <textarea v-model="adminProfile.address" class="form-textarea" rows="3" placeholder="Enter your address"></textarea>
            </div>
          </div>

          <button @click="saveSettings" class="save-btn" :disabled="loading">
            {{ loading ? 'Saving...' : '💾 Save Changes' }}
          </button>
        </div>

        <!-- NOTIFICATIONS -->
        <div v-if="activeTab === 'notifications'" class="settings-section">
          <h2>🔔 Notification Settings</h2>
          <p class="section-desc">Control how and when you receive notifications</p>

          <div class="panel">
            <h4 class="panel-title">Notification Channels</h4>
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-label">Email Notifications</div>
                <div class="setting-desc">Receive notifications via email</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="notifications.emailNotifications" />
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-label">SMS Notifications</div>
                <div class="setting-desc">Receive notifications via SMS</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="notifications.smsNotifications" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="panel">
            <h4 class="panel-title">Event Alerts</h4>
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-label">New Member Alerts</div>
                <div class="setting-desc">Get notified when new members join</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="notifications.newMemberAlerts" />
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-label">Attendance Alerts</div>
                <div class="setting-desc">Daily attendance summary notifications</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="notifications.attendanceAlerts" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <button @click="saveSettings" class="save-btn" :disabled="loading">
            {{ loading ? 'Saving...' : '💾 Save Changes' }}
          </button>
        </div>

        <!-- SECURITY -->
        <div v-if="activeTab === 'security'" class="settings-section">
          <h2>🔒 Security Settings</h2>
          <p class="section-desc">Manage your password and account security</p>

          <!-- Change Password -->
          <div class="panel">
            <h4 class="panel-title">Change Password</h4>

            <div v-if="passwordError" class="inline-msg error">❌ {{ passwordError }}</div>
            <div v-if="passwordSuccess" class="inline-msg success">✅ {{ passwordSuccess }}</div>

            <div class="form-group">
              <label>Current Password</label>
              <input v-model="passwordForm.currentPassword" type="password" class="form-input" placeholder="Enter current password" />
            </div>
            <div class="form-group">
              <label>New Password</label>
              <input v-model="passwordForm.newPassword" type="password" class="form-input" placeholder="Enter new password" />
              <small>Minimum 8 characters</small>
            </div>
            <div class="form-group">
              <label>Confirm New Password</label>
              <input v-model="passwordForm.confirmPassword" type="password" class="form-input" placeholder="Re-enter new password" />
            </div>

            <button @click="changePassword" class="save-btn" :disabled="loading">
              {{ loading ? 'Updating...' : '🔑 Update Password' }}
            </button>
          </div>

          <!-- Auth Settings -->
          <div class="panel">
            <h4 class="panel-title">Authentication</h4>
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-label">Two-Factor Authentication</div>
                <div class="setting-desc">Add an extra layer of security to your account</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="securitySettings.twoFactorAuth" />
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-label">Require Strong Passwords</div>
                <div class="setting-desc">Enforce password complexity requirements</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="securitySettings.requireStrongPassword" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <!-- Session -->
          <div class="panel">
            <h4 class="panel-title">Session</h4>
            <div class="form-group">
              <label>Session Timeout (minutes)</label>
              <input v-model="securitySettings.sessionTimeout" type="number" class="form-input" min="5" max="120" style="max-width: 200px;" />
              <small>Auto-logout after inactivity</small>
            </div>
          </div>
        </div>

        <!-- BACKUP -->
        <div v-if="activeTab === 'backup'" class="settings-section">
          <h2>💾 Backup & Restore</h2>
          <p class="section-desc">Manage your data backups and restore options</p>

          <div class="panel">
            <h4 class="panel-title">Data Management</h4>
            <div class="backup-card">
              <div class="backup-icon">💾</div>
              <div class="backup-info">
                <h3>Database Backup</h3>
                <p>Last backup: April 10, 2026 — 10:30 AM</p>
              </div>
              <button class="action-btn primary">Create Backup</button>
            </div>
            <div class="backup-card">
              <div class="backup-icon">📥</div>
              <div class="backup-info">
                <h3>Restore from Backup</h3>
                <p>Restore your data from a previous backup</p>
              </div>
              <button class="action-btn">Restore</button>
            </div>
            <div class="backup-card">
              <div class="backup-icon">📤</div>
              <div class="backup-info">
                <h3>Export Data</h3>
                <p>Download all your data in CSV format</p>
              </div>
              <button class="action-btn">Export CSV</button>
            </div>
          </div>

          <div class="panel">
            <h4 class="panel-title">Automation</h4>
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-label">Automatic Daily Backups</div>
                <div class="setting-desc">Automatically backup data every day at 2:00 AM</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" checked />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  min-height: 100vh;
  background: #111111;
}

.settings-content {
  display: flex;
  gap: 20px;
  padding: 28px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Sidebar */
.settings-sidebar {
  width: 220px;
  flex-shrink: 0;
  background: #1a1a1a;
  border: 1px solid #481E14;
  border-radius: 16px;
  padding: 12px;
  height: fit-content;
  position: sticky;
  top: 90px;
}

.tab-btn {
  width: 100%;
  background: transparent;
  border: none;
  color: #aaa;
  padding: 11px 14px;
  text-align: left;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13.5px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}
.tab-btn:hover { background: #1f1210; color: #fff; }
.tab-btn.active { background: #e8531a; color: #fff; }

/* Main */
.settings-main {
  flex: 1;
  min-width: 0;
}

/* Toasts */
.toast {
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 13.5px;
  font-weight: 500;
}
.toast-success { background: #14532d; color: #4ade80; border: 1px solid #166534; }
.toast-error   { background: #450a0a; color: #f87171; border: 1px solid #7f1d1d; }

/* Inline messages */
.inline-msg {
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 16px;
}
.inline-msg.success { background: #14532d; color: #4ade80; border: 1px solid #166534; }
.inline-msg.error   { background: #450a0a; color: #f87171; border: 1px solid #7f1d1d; }

.settings-section h2 {
  font-size: 22px;
  color: #fff;
  margin: 0 0 6px 0;
  font-weight: 700;
}
.section-desc {
  color: #666;
  margin: 0 0 20px 0;
  font-size: 13px;
}

/* Panels */
.panel {
  background: #1a1a1a;
  border: 1px solid #481E14;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
}
.panel-title {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 16px 0;
}

/* Forms */
.form-group { margin-bottom: 16px; }
.form-group:last-child { margin-bottom: 0; }
.form-group label {
  display: block;
  color: #aaa;
  font-size: 12.5px;
  font-weight: 600;
  margin-bottom: 7px;
}
.form-group small {
  display: block;
  color: #555;
  font-size: 12px;
  margin-top: 5px;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.form-input,
.form-textarea {
  width: 100%;
  background: #111111;
  border: 1px solid #481E14;
  border-radius: 10px;
  padding: 10px 13px;
  color: #fff;
  font-size: 13.5px;
  transition: border-color 0.2s;
  outline: none;
  box-sizing: border-box;
}
.form-input:focus,
.form-textarea:focus { border-color: #e8531a; }
.form-textarea { resize: vertical; }

/* Save Button */
.save-btn {
  background: #e8531a;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 28px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 4px;
}
.save-btn:hover:not(:disabled) { background: #ff6a30; }
.save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Toggles */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 46px;
  height: 24px;
  flex-shrink: 0;
}
.toggle-switch input { opacity: 0; width: 0; height: 0; }
.toggle-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: #2a2a2a;
  border: 1px solid #481E14;
  border-radius: 24px;
  transition: 0.25s;
}
.toggle-slider:before {
  content: '';
  position: absolute;
  width: 16px; height: 16px;
  left: 3px; bottom: 3px;
  background: #666;
  border-radius: 50%;
  transition: 0.25s;
}
input:checked + .toggle-slider { background: #e8531a; border-color: #e8531a; }
input:checked + .toggle-slider:before { transform: translateX(22px); background: white; }

/* Setting Items */
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #2a2a2a;
}
.setting-item:last-child { border-bottom: none; padding-bottom: 0; }
.setting-item:first-child { padding-top: 0; }
.setting-info { flex: 1; padding-right: 16px; }
.setting-label { font-size: 13.5px; color: #ddd; font-weight: 600; margin-bottom: 3px; }
.setting-desc { font-size: 12.5px; color: #555; }

/* Backup */
.backup-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #2a2a2a;
}
.backup-card:last-child { border-bottom: none; padding-bottom: 0; }
.backup-card:first-child { padding-top: 0; }
.backup-icon {
  font-size: 28px;
  width: 52px; height: 52px;
  background: rgba(232, 83, 26, 0.1);
  border: 1px solid #481E14;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.backup-info { flex: 1; }
.backup-info h3 { font-size: 14px; color: #fff; margin: 0 0 3px 0; font-weight: 600; }
.backup-info p { font-size: 12px; color: #555; margin: 0; }
.action-btn {
  background: #2a2a2a;
  border: 1px solid #481E14;
  color: #aaa;
  border-radius: 20px;
  padding: 8px 18px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}
.action-btn:hover { border-color: #e8531a; color: #e8531a; }
.action-btn.primary { background: #e8531a; border-color: #e8531a; color: white; }
.action-btn.primary:hover { background: #ff6a30; }

/* Responsive */
@media (max-width: 900px) {
  .settings-content { flex-direction: column; }
  .settings-sidebar {
    width: 100%;
    position: static;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 10px;
  }
  .tab-btn { width: auto; flex: 1; justify-content: center; }
  .form-row { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .settings-content { padding: 16px; }
}
</style>
