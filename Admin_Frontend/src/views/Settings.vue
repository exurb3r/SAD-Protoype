<script setup lang="ts">
import { ref } from 'vue'
import TopBar from '../components/TopBar.vue'

const activeTab = ref('general')
const loading = ref(false)
const saveMessage = ref('')

const gymSettings = ref({
  gym_name: 'Armstrong Gym',
  email: 'contact@armstronggym.com',
  phone: '+1234567890',
  address: '123 Fitness Street',
  currency: 'PHP',
  timezone: 'Asia/Manila'
})

const notifications = ref({
  emailNotifications: true,
  smsNotifications: false,
  membershipExpiry: true,
  paymentReminders: true,
  newMemberAlerts: true,
  attendanceAlerts: false
})

const membershipPlans = ref([
  { id: 1, name: 'Monthly', price: 50, duration: 1, active: true },
  { id: 2, name: 'Quarterly', price: 135, duration: 3, active: true },
  { id: 3, name: 'Annual', price: 480, duration: 12, active: true }
])

const securitySettings = ref({
  twoFactorAuth: false,
  sessionTimeout: 30,
  passwordExpiry: 90,
  requireStrongPassword: true
})

function saveSettings() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    saveMessage.value = 'Settings saved successfully!'
    setTimeout(() => { saveMessage.value = '' }, 3000)
  }, 800)
}
</script>

<template>
  <div class="settings-page">
    <TopBar title="Settings" />

    <div class="settings-content">

      <!-- Sidebar -->
      <div class="settings-sidebar">
        <button class="tab-btn" :class="{ active: activeTab === 'general' }" @click="activeTab = 'general'">
          <span>⚙️</span> General
        </button>
        <button class="tab-btn" :class="{ active: activeTab === 'plans' }" @click="activeTab = 'plans'">
          <span>💳</span> Membership Plans
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
        <div v-if="saveMessage" class="save-message">
          ✅ {{ saveMessage }}
        </div>

        <!-- GENERAL -->
        <div v-if="activeTab === 'general'" class="settings-section">
          <h2>⚙️ General Settings</h2>
          <p class="section-desc">Manage your gym's basic information and preferences</p>

          <div class="panel">
            <h4 class="panel-title">Gym Information</h4>
            <div class="form-group">
              <label>Gym Name</label>
              <input v-model="gymSettings.gym_name" type="text" class="form-input" placeholder="Enter gym name" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Contact Email</label>
                <input v-model="gymSettings.email" type="email" class="form-input" placeholder="contact@gym.com" />
              </div>
              <div class="form-group">
                <label>Phone Number</label>
                <input v-model="gymSettings.phone" type="tel" class="form-input" placeholder="+1234567890" />
              </div>
            </div>
            <div class="form-group">
              <label>Address</label>
              <textarea v-model="gymSettings.address" class="form-textarea" rows="3" placeholder="Enter gym address"></textarea>
            </div>
          </div>

          <div class="panel">
            <h4 class="panel-title">Regional Preferences</h4>
            <div class="form-row">
              <div class="form-group">
                <label>Currency</label>
                <select v-model="gymSettings.currency" class="form-select">
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — British Pound</option>
                  <option value="PHP">PHP — Philippine Peso</option>
                </select>
              </div>
              <div class="form-group">
                <label>Timezone</label>
                <select v-model="gymSettings.timezone" class="form-select">
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Asia/Manila">Manila Time</option>
                </select>
              </div>
            </div>
          </div>

          <button @click="saveSettings" class="save-btn" :disabled="loading">
            {{ loading ? 'Saving...' : '💾 Save Changes' }}
          </button>
        </div>

        <!-- PLANS -->
        <div v-if="activeTab === 'plans'" class="settings-section">
          <h2>💳 Membership Plans</h2>
          <p class="section-desc">Configure your membership plans and pricing</p>

          <div class="plans-list">
            <div v-for="plan in membershipPlans" :key="plan.id" class="plan-card">
              <div class="plan-card-header">
                <input v-model="plan.name" type="text" class="plan-name-input" placeholder="Plan name" />
                <label class="toggle-switch">
                  <input type="checkbox" v-model="plan.active" />
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <div class="plan-fields">
                <div class="form-group">
                  <label>Price</label>
                  <div class="input-prefix-wrap">
                    <span class="prefix">₱</span>
                    <input v-model="plan.price" type="number" class="form-input" step="0.01" />
                  </div>
                </div>
                <div class="form-group">
                  <label>Duration (months)</label>
                  <input v-model="plan.duration" type="number" class="form-input" min="1" />
                </div>
              </div>
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
            <h4 class="panel-title">Event Notifications</h4>
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-label">Membership Expiry</div>
                <div class="setting-desc">Get notified when memberships are about to expire</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="notifications.membershipExpiry" />
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-label">Payment Reminders</div>
                <div class="setting-desc">Send payment reminders to members</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="notifications.paymentReminders" />
                <span class="toggle-slider"></span>
              </label>
            </div>
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
        </div>

        <!-- SECURITY -->
        <div v-if="activeTab === 'security'" class="settings-section">
          <h2>🔒 Security Settings</h2>
          <p class="section-desc">Configure security and authentication settings</p>

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

          <div class="panel">
            <h4 class="panel-title">Session & Expiry</h4>
            <div class="form-row">
              <div class="form-group">
                <label>Session Timeout (minutes)</label>
                <input v-model="securitySettings.sessionTimeout" type="number" class="form-input" min="5" max="120" />
                <small>Auto-logout after inactivity</small>
              </div>
              <div class="form-group">
                <label>Password Expiry (days)</label>
                <input v-model="securitySettings.passwordExpiry" type="number" class="form-input" min="30" max="365" />
                <small>Require password change after this period</small>
              </div>
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
                <p>Last backup: March 17, 2026 — 10:30 AM</p>
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

.save-message {
  background: #14532d;
  color: #4ade80;
  border: 1px solid #166534;
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 13.5px;
  font-weight: 500;
}

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
.form-select,
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
}
.form-input:focus,
.form-select:focus,
.form-textarea:focus { border-color: #e8531a; }
.form-textarea { resize: vertical; }
.form-select option { background: #1a1a1a; }

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

/* Plans */
.plans-list { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; }
.plan-card {
  background: #111111;
  border: 1px solid #481E14;
  border-radius: 14px;
  padding: 18px 20px;
  transition: border-color 0.2s;
}
.plan-card:hover { border-color: #e8531a; }
.plan-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}
.plan-name-input {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  outline: none;
  padding: 0;
}
.plan-name-input:focus { border-bottom: 1px solid #e8531a; }
.plan-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.input-prefix-wrap { position: relative; }
.input-prefix-wrap .prefix {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 13px;
}
.input-prefix-wrap .form-input { padding-left: 26px; }

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
  .plan-fields { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .settings-content { padding: 16px; }
}
</style>