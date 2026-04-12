<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const email = ref("")
const password = ref("")
const error = ref("")
const loading = ref(false)

// Redirect if already logged in
onMounted(() => {
  const token = localStorage.getItem("token")
  if (token) {
    router.push("/dashboard")
  }
})

const handleLogin = async () => {
  error.value = ""
  loading.value = true

  try {
    const response = await fetch("http://localhost:3500/admins/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    const data = await response.json()

    if (!response.ok) {
      error.value = data.message || "Login failed"
      loading.value = false
      return
    }

    localStorage.setItem("adminToken", data.token)
    localStorage.setItem("adminCredentials", JSON.stringify(data.user))

    router.push("/dashboard")

  } catch (err) {
    error.value = "Server error. Please try again."
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">

    <!-- LEFT PANEL -->
    <div class="left-panel">
      <div class="brand">
        <h1>Armztrong Gym</h1>
        <p>Admin Control Panel</p>
      </div>

      <div class="tagline">
        <h2>Manage your gym with confidence</h2>
        <p>
          Access members, track performance, manage rewards,
          and monitor activity — all in one place.
        </p>
      </div>
    </div>

    <!-- RIGHT PANEL -->
    <div class="right-panel">
      <div class="login-card">

        <h2>Admin Login</h2>
        <p class="subtitle">Sign in to continue</p>

        <form @submit.prevent="handleLogin">

          <div v-if="error" class="error-box">
            {{ error }}
          </div>

          <div class="input-group">
            <label>Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div class="input-group">
            <label>Password</label>
            <input
              v-model="password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" :disabled="loading">
            <span v-if="!loading">Sign In</span>
            <span v-else>Signing in...</span>
          </button>

        </form>

        <div class="footer-note">
          Secure admin access only
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  font-family: Arial, sans-serif;
}

.left-panel {
  flex: 1;
  background: linear-gradient(135deg, #0C0C0C, #1a1a1a);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  border-right: 1px solid #2a2a2a;
}

.brand h1 {
  color: #F2613F;
  font-size: 28px;
  margin-bottom: 5px;
}

.brand p {
  color: #888;
  font-size: 14px;
}

.tagline {
  margin-top: 40px;
  max-width: 400px;
}

.tagline h2 {
  font-size: 28px;
  margin-bottom: 10px;
}

.tagline p {
  color: #aaa;
  line-height: 1.6;
}

.right-panel {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0C0C0C;
}

.login-card {
  width: 360px;
  padding: 35px;
  border-radius: 16px;
  background: #1a1a1a;
  border: 1px solid #481E14;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

h2 {
  color: #F2613F;
  margin-bottom: 5px;
}

.subtitle {
  color: #888;
  font-size: 13px;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 14px;
}

label {
  display: block;
  font-size: 12px;
  color: #aaa;
  margin-bottom: 6px;
}

input {
  width: 100%;
  padding: 11px;
  border-radius: 8px;
  border: 1px solid #2a2a2a;
  background: #0C0C0C;
  color: white;
  outline: none;
  transition: 0.2s;
}

input:focus {
  border-color: #F2613F;
  box-shadow: 0 0 0 2px rgba(242,97,63,0.2);
}

button {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #F2613F, #9B3922);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

button:hover {
  opacity: 0.9;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-box {
  background: rgba(255, 77, 77, 0.1);
  border: 1px solid #ff4d4d;
  color: #ff6b6b;
  padding: 10px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 15px;
}

.footer-note {
  margin-top: 15px;
  font-size: 11px;
  color: #666;
  text-align: center;
}
</style>