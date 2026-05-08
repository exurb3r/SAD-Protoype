<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const email = ref("")
const password = ref("")
const error = ref("")
const loading = ref(false)

const show2FA = ref(false)
const verified = ref(false)
const twoFAError = ref("")
const resendMsg = ref("")
const pendingData = ref<any>(null)
const code = ref(["", "", "", "", "", ""])
const inputs = ref<HTMLInputElement[]>([])

const MASKED_PHONE = "0951*********90"
const HARDCODED_CODE = "999999"

onMounted(() => {
  const token = localStorage.getItem("adminToken")
  if (token) router.push("/dashboard")
})

const handleLogin = async () => {
  error.value = ""
  loading.value = true

  try {
    const response = await fetch("http://localhost:3500/admins/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value, password: password.value })
    })

    const data = await response.json()

    if (!response.ok) {
      error.value = data.message || "Login failed"
      return
    }

    pendingData.value = data
    show2FA.value = true

  } catch (err) {
    error.value = "Server error. Please try again."
    console.error(err)
  } finally {
    loading.value = false
  }
}

function handleChange(i: number, val: string) {
  if (!/^\d?$/.test(val)) return
  code.value[i] = val
  if (val && i < 5) inputs.value[i + 1]?.focus()
}

function handleKeyDown(i: number, e: KeyboardEvent) {
  if (e.key === "Backspace" && !code.value[i] && i > 0) {
    inputs.value[i - 1]?.focus()
  }
}

function handlePaste(e: ClipboardEvent) {
  const pasted = e.clipboardData?.getData("text").replace(/\D/g, "").slice(0, 6) ?? ""
  if (pasted.length === 6) {
    code.value = pasted.split("")
    inputs.value[5]?.focus()
  }
  e.preventDefault()
}

function handleVerify() {
  const entered = code.value.join("")
  if (entered === HARDCODED_CODE) {
    verified.value = true
    setTimeout(() => {
      localStorage.setItem("adminToken", pendingData.value.token)
      localStorage.setItem("adminCredentials", JSON.stringify(pendingData.value.user))
      router.push("/dashboard")
    }, 2500)
  } else {
    twoFAError.value = "Incorrect code. Please try again."
  }
}

function handleResend() {
  twoFAError.value = ""
  resendMsg.value = ""
  setTimeout(() => { resendMsg.value = "A new code has been sent." }, 300)
}
</script>

<template>
  <div class="login-page">

    <!-- 2FA MODAL -->
    <Teleport to="body">
      <div v-if="show2FA" class="modal-overlay">

        <!-- SUCCESS STATE -->
        <div v-if="verified" class="modal-card success-card">
          <div class="ripple-wrap">
            <div class="ripple-ring" />
            <div class="ripple-ring" />
            <div class="ripple-ring" />
            <div class="success-ring">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path class="check-path" d="M8 18 L15 25 L28 11"
                  stroke="#4ade80" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>
          <h3 class="success-title">Identity Confirmed</h3>
          <p class="success-sub">Verification successful. Redirecting you to dashboard...</p>
          <div class="progress-track">
            <div class="progress-bar" />
          </div>
        </div>

        <!-- VERIFY STATE -->
        <div v-else class="modal-card">
          <h3 class="modal-title">Verify it's you</h3>
          <p class="modal-sub">
            We sent a 6-digit code to <strong class="phone-highlight">{{ MASKED_PHONE }}</strong>
          </p>

          <div v-if="twoFAError" class="error-box">{{ twoFAError }}</div>
          <div v-if="resendMsg" class="success-box">{{ resendMsg }}</div>

          <div class="code-inputs">
            <input
              v-for="(digit, i) in code"
              :key="i"
              :ref="el => { if (el) inputs[i] = el as HTMLInputElement }"
              class="code-input"
              type="text"
              inputmode="numeric"
              maxlength="1"
              :value="digit"
              :autofocus="i === 0"
              @input="handleChange(i, ($event.target as HTMLInputElement).value)"
              @keydown="handleKeyDown(i, $event)"
              @paste="handlePaste"
            />
          </div>

          <button
            class="verify-btn"
            :disabled="code.some(d => d === '')"
            @click="handleVerify"
          >
            Verify & Sign In
          </button>

          <p class="resend-row">
            Didn't receive it?
            <button class="resend-btn" @click="handleResend">Resend code</button>
          </p>
        </div>

      </div>
    </Teleport>

    <!-- LEFT PANEL -->
    <div class="left-panel">
      <div class="brand">
        <h1>Armztrong Gym</h1>
        <p>Admin Control Panel</p>
      </div>
      <div class="tagline">
        <h2>Manage your gym with confidence</h2>
        <p>Access members, track performance, manage rewards, and monitor activity — all in one place.</p>
      </div>
    </div>

    <!-- RIGHT PANEL -->
    <div class="right-panel">
      <div class="login-card">
        <h2>Admin Login</h2>
        <p class="subtitle">Sign in to continue</p>

        <form @submit.prevent="handleLogin">
          <div v-if="error" class="error-box">{{ error }}</div>

          <div class="input-group">
            <label>Email</label>
            <input v-model="email" type="email" placeholder="Enter your email" required />
          </div>

          <div class="input-group">
            <label>Password</label>
            <input v-model="password" type="password" placeholder="Enter your password" required />
          </div>

          <button type="submit" :disabled="loading">
            {{ loading ? "Signing in..." : "Sign In" }}
          </button>
        </form>

        <div class="footer-note">Secure admin access only</div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* ── PAGE ── */
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

.brand h1 { color: #F2613F; font-size: 28px; margin-bottom: 5px; }
.brand p  { color: #888; font-size: 14px; }
.tagline  { margin-top: 40px; max-width: 400px; }
.tagline h2 { font-size: 28px; margin-bottom: 10px; }
.tagline p  { color: #aaa; line-height: 1.6; }

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

h2 { color: #F2613F; margin-bottom: 5px; }
.subtitle { color: #888; font-size: 13px; margin-bottom: 20px; }
.input-group { margin-bottom: 14px; }

label { display: block; font-size: 12px; color: #aaa; margin-bottom: 6px; }

input {
  width: 100%;
  padding: 11px;
  border-radius: 8px;
  border: 1px solid #2a2a2a;
  background: #0C0C0C;
  color: white;
  outline: none;
  transition: 0.2s;
  box-sizing: border-box;
}

input:focus {
  border-color: #F2613F;
  box-shadow: 0 0 0 2px rgba(242,97,63,0.2);
}

button[type="submit"] {
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

button[type="submit"]:hover    { opacity: 0.9; }
button[type="submit"]:disabled { opacity: 0.6; cursor: not-allowed; }

.error-box {
  background: rgba(255,77,77,0.1);
  border: 1px solid #ff4d4d;
  color: #ff6b6b;
  padding: 10px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 15px;
}

.footer-note { margin-top: 15px; font-size: 11px; color: #666; text-align: center; }

/* ── MODAL ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.78);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 16px;
}

.modal-card {
  background: #1a1a1a;
  border: 1px solid #481E14;
  border-radius: 16px;
  padding: 32px 28px;
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
}

.modal-title { color: #F2613F; font-size: 20px; margin: 0; }
.modal-sub   { color: #888; font-size: 13px; margin: 0; }
.phone-highlight { color: #e5e5e5; }

.success-box {
  background: rgba(34,197,94,0.1);
  border: 0.5px solid rgba(34,197,94,0.3);
  border-radius: 8px;
  color: #4ade80;
  font-size: 13px;
  padding: 10px 12px;
}

/* ── CODE INPUTS ── */
.code-inputs {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.code-input {
  width: 44px !important;
  height: 52px;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  padding: 0 !important;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  background: #0C0C0C;
  color: white;
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;
}

.code-input:focus { border-color: #F2613F; box-shadow: 0 0 0 2px rgba(242,97,63,0.2); }

/* ── VERIFY BUTTON ── */
.verify-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #F2613F, #9B3922);
  color: white;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.verify-btn:hover:not(:disabled) { opacity: 0.9; }
.verify-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── RESEND ── */
.resend-row {
  text-align: center;
  font-size: 13px;
  color: #666;
  margin: 0;
}

.resend-btn {
  background: none;
  border: none;
  color: #F2613F;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  margin-left: 4px;
  transition: color 0.15s;
}

.resend-btn:hover { color: #f87c5a; }

/* ── SUCCESS SCREEN ── */
.success-card {
  align-items: center;
  text-align: center;
  padding: 48px 28px;
  animation: fadeIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.ripple-wrap {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 24px;
}

.ripple-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(34,197,94,0.5);
  animation: ripple 1.5s ease-out infinite;
}

.ripple-ring:nth-child(2) { animation-delay: 0.5s; }
.ripple-ring:nth-child(3) { animation-delay: 1s; }

.success-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(34,197,94,0.1);
  border: 1.5px solid rgba(34,197,94,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  animation: successPulse 1.2s ease-in-out infinite;
}

.check-path {
  stroke-dasharray: 60;
  stroke-dashoffset: 60;
  animation: checkDraw 0.5s ease 0.3s forwards;
}

.success-title { color: #fff; font-size: 20px; margin: 0; }
.success-sub   { color: #666; font-size: 13px; margin: 0; }

.progress-track {
  width: 100%;
  height: 3px;
  background: rgba(255,255,255,0.06);
  border-radius: 99px;
  overflow: hidden;
  margin-top: 8px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #16a34a, #4ade80);
  border-radius: 99px;
  animation: progressFill 2.3s linear forwards;
}

/* ── KEYFRAMES ── */
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes checkDraw {
  from { stroke-dashoffset: 60; }
  to   { stroke-dashoffset: 0; }
}
@keyframes ripple {
  0%   { transform: scale(0.8); opacity: 0.6; }
  100% { transform: scale(2.2); opacity: 0; }
}
@keyframes successPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.3); }
  50%       { box-shadow: 0 0 0 16px rgba(34,197,94,0); }
}
@keyframes progressFill {
  from { width: 0%; }
  to   { width: 100%; }
}
</style>