<template>
  <div class="rwd-container">

    <!-- HEADER -->
    <div class="rwd-header">
      <div>
        <h2>Reward Users</h2>
        <p class="rwd-subtitle">Grant achievements and experience points</p>
      </div>
      <input v-model="search" class="rwd-search" placeholder="Search users..." />
    </div>

    <!-- TOAST -->
    <div class="rwd-toast" v-if="toast">{{ toast }}</div>

    <!-- LOADING -->
    <div class="rwd-loading" v-if="loading">Loading users...</div>

    <!-- TABLE -->
    <div class="rwd-table-wrapper" v-if="!loading">
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Level</th>
            <th>EXP</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">

            <td class="rwd-user">
              <div class="rwd-avatar">{{ initials(user.username) }}</div>
              <div>
                <p class="rwd-name">{{ user.username }}</p>
                <p class="rwd-sub">Member</p>
              </div>
            </td>

            <td>{{ user.email }}</td>

            <td>
              <span class="rwd-level">Lv. {{ user.level }}</span>
            </td>

            <td>
              <div class="rwd-exp-bar">
                <div
                  class="rwd-exp-fill"
                  :style="{ width: expPercent(user) + '%' }"
                ></div>
              </div>
              <small>{{ user.exp_points }} / {{ expRequired(user.level) }} XP</small>
            </td>

            <td>
              <button class="rwd-btn" @click="openReward(user)">
                🎁 Reward
              </button>
            </td>

          </tr>

          <tr v-if="filteredUsers.length === 0">
            <td colspan="5" class="rwd-empty">No users found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL -->
    <div class="rwd-modal-overlay" v-if="selectedUser" @click.self="closeModal">
      <div class="rwd-modal">

        <h3>Reward User</h3>

        <div class="rwd-user-info">
          <p><strong>{{ selectedUser.username }}</strong></p>
          <p>{{ selectedUser.email }}</p>
        </div>

        <label>Achievement Title</label>
        <input v-model="form.title" class="rwd-input" placeholder="Enter title" />

        <label>Description</label>
        <input v-model="form.description" class="rwd-input" placeholder="Optional" />

        <label>EXP Gained</label>
        <input
          type="number"
          v-model.number="form.exp"
          class="rwd-input"
          min="1"
          placeholder="Enter EXP"
        />

        <div class="rwd-quick">
          <button @click="form.exp = 50">+50</button>
          <button @click="form.exp = 100">+100</button>
          <button @click="form.exp = 200">+200</button>
        </div>

        <div class="rwd-actions">
          <button class="rwd-submit" @click="giveReward" :disabled="submitting">
            {{ submitting ? 'Submitting...' : 'Submit' }}
          </button>
          <button class="rwd-cancel" @click="closeModal">Cancel</button>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
const API_BASE = 'http://localhost:3500/admins/reward'

export default {
  data() {
    return {
      search: "",
      selectedUser: null,
      toast: null,
      loading: false,
      submitting: false,
      users: [],
      form: {
        title: "",
        description: "",
        exp: 0
      }
    }
  },

  computed: {
    filteredUsers() {
      return this.users.filter(u =>
        u.username.toLowerCase().includes(this.search.toLowerCase()) ||
        u.email.toLowerCase().includes(this.search.toLowerCase())
      )
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

    // Matches backend's getExpRequired formula
    expRequired(level) {
      return Math.floor(100 * Math.pow(level, 1.5))
    },

    initials(name) {
      return name.split("_").map(n => n[0]).join("").toUpperCase()
    },

    expPercent(user) {
      const needed = this.expRequired(user.level)
      return Math.min((user.exp_points / needed) * 100, 100)
    },

    async fetchUsers() {
      this.loading = true
      try {
        const res = await fetch(API_BASE, {
          headers: this.authHeaders()
        })
        if (!res.ok) throw new Error('Failed to fetch users')
        this.users = await res.json()
      } catch (err) {
        console.error('fetchUsers:', err)
        this.showToast('Failed to load users')
      } finally {
        this.loading = false
      }
    },

    openReward(user) {
      this.selectedUser = user
      this.form = { title: "", description: "", exp: 0 }
    },

    closeModal() {
      this.selectedUser = null
    },

    async giveReward() {
      if (!this.form.title.trim()) {
        this.showToast("Title is required")
        return
      }
      if (!this.form.exp || this.form.exp <= 0) {
        this.showToast("EXP must be greater than 0")
        return
      }

      this.submitting = true
      try {
        const res = await fetch(API_BASE, {
          method: 'POST',
          headers: this.authHeaders(),
          body: JSON.stringify({
            userId:      this.selectedUser.id,
            title:       this.form.title,
            description: this.form.description,
            exp:         this.form.exp
          })
        })

        if (!res.ok) {
          const err = await res.json()
          this.showToast(err.message || 'Failed to grant reward')
          return
        }

        const result = await res.json()

        // Update local user state to reflect new level + exp from backend response
        const user = this.users.find(u => u.id === this.selectedUser.id)
        if (user) {
          user.level      = result.newLevel
          user.exp_points = result.remainingExp
        }

        this.showToast(
          result.leveledUp
            ? `Reward granted! 🎉 ${this.selectedUser.username} leveled up to Lv. ${result.newLevel}!`
            : 'Reward granted successfully 🎉'
        )
        this.closeModal()

      } catch (err) {
        console.error('giveReward:', err)
        this.showToast('Something went wrong. Please try again.')
      } finally {
        this.submitting = false
      }
    },

    showToast(msg) {
      this.toast = msg
      setTimeout(() => (this.toast = null), 3000)
    }
  },

  mounted() {
    this.fetchUsers()
  }
}
</script>

<style scoped>
.rwd-container {
  width: 100%;
  color: #eaeaea;
}

/* HEADER */
.rwd-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.rwd-header h2 {
  font-size: 22px;
  font-weight: 600;
}

.rwd-subtitle {
  color: #888;
  font-size: 13px;
  margin-top: 4px;
}

/* SEARCH */
.rwd-search {
  padding: 10px 16px;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
  background: #111;
  color: white;
  transition: 0.2s;
}

.rwd-search:focus {
  outline: none;
  border-color: #F2613F;
  box-shadow: 0 0 0 2px rgba(242, 97, 63, 0.2);
}

/* TABLE */
.rwd-table-wrapper {
  background: #121212;
  border-radius: 18px;
  border: 1px solid #222;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  color: #777;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: #0f0f0f;
}

td, th {
  padding: 16px;
}

tbody tr {
  transition: 0.2s;
}

tbody tr:hover {
  background: #181818;
}

/* USER */
.rwd-user {
  display: flex;
  align-items: center;
  gap: 14px;
}

.rwd-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #F2613F, #9B3922);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 13px;
}

.rwd-name {
  margin: 0;
  font-weight: 500;
}

.rwd-sub {
  color: #666;
  font-size: 11px;
}

/* LEVEL */
.rwd-level {
  background: rgba(242, 97, 63, 0.1);
  color: #F2613F;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

/* EXP */
.rwd-exp-bar {
  height: 8px;
  background: #1f1f1f;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 4px;
}

.rwd-exp-fill {
  height: 100%;
  background: linear-gradient(90deg, #F2613F, #ff8a65);
  transition: width 0.3s ease;
}

/* STATUS */
.rwd-status {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
}

/* BUTTON */
.rwd-btn {
  background: transparent;
  border: 1px solid #333;
  color: #F2613F;
  padding: 6px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
}

.rwd-btn:hover {
  background: #F2613F;
  color: white;
  border-color: #F2613F;
}

/* MODAL */
.rwd-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(6px);
}

.rwd-modal {
  background: #141414;
  padding: 26px;
  border-radius: 18px;
  width: 360px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.6);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* USER INFO */
.rwd-user-info {
  background: #0f0f0f;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 14px;
  color: #aaa;
}

/* INPUT */
.rwd-input {
  width: 100%;
  padding: 11px;
  background: #0c0c0c;
  border: 1px solid #222;
  color: white;
  border-radius: 10px;
  margin-bottom: 12px;
  transition: 0.2s;
}

.rwd-input:focus {
  outline: none;
  border-color: #F2613F;
  box-shadow: 0 0 0 2px rgba(242, 97, 63, 0.2);
}

/* QUICK */
.rwd-quick {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}

.rwd-quick button {
  flex: 1;
  background: #1f1f1f;
  border: none;
  color: #aaa;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.rwd-quick button:hover {
  background: #F2613F;
  color: white;
}

/* ACTIONS */
.rwd-actions {
  display: flex;
  gap: 10px;
}

.rwd-submit {
  flex: 1;
  background: linear-gradient(135deg, #F2613F, #ff8a65);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  transition: 0.2s;
}

.rwd-submit:hover {
  opacity: 0.9;
}

.rwd-cancel {
  flex: 1;
  border: 1px solid #333;
  color: #aaa;
  background: transparent;
  border-radius: 10px;
  cursor: pointer;
}

/* TOAST */
.rwd-toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: linear-gradient(135deg, #F2613F, #ff8a65);
  padding: 14px 20px;
  border-radius: 12px;
  color: white;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  animation: fadeIn 0.3s ease;
}

/* EMPTY */
.rwd-empty {
  text-align: center;
  color: #555;
  padding: 20px;
}
</style>