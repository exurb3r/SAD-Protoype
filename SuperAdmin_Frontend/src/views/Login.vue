<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const email = ref("")
const password = ref("")
const error = ref("")
const loading = ref(false)
const mounted = ref(false)

onMounted(() => {
  setTimeout(() => { mounted.value = true }, 50)
  const token = localStorage.getItem("superadminToken")
  if (token) {
    router.push("/dashboard")
  }
})

const handleLogin = async () => {
  error.value = ""
  loading.value = true

  try {
    const response = await fetch("http://localhost:3500/superadmin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value, password: password.value })
    })

    const data = await response.json()

    if (!response.ok) {
      error.value = data.message || "Access denied"
      loading.value = false
      return
    }

    localStorage.setItem("superadminToken", data.token)
    localStorage.setItem("superadminCredentials", JSON.stringify(data.user))
    router.push("/dashboard")

  } catch (err) {
    error.value = "Server unreachable. Try again."
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="sa-root">

    <!-- Grid background -->
    <div class="sa-grid" />
    <div class="sa-vignette" />

    <!-- Top bar -->
    <div class="sa-topbar" :class="{ visible: mounted }">
      <span class="sa-topbar-brand">ARMZTRONG <span class="sa-topbar-accent">SYSTEM</span></span>
      <span class="sa-topbar-status">
        <span class="sa-dot" /> SECURE CHANNEL ACTIVE
      </span>
    </div>

    <!-- Center card -->
    <div class="sa-center" :class="{ visible: mounted }">

      <div class="sa-card">

        <!-- Corner accents -->
        <span class="sa-corner sa-corner--tl" />
        <span class="sa-corner sa-corner--tr" />
        <span class="sa-corner sa-corner--bl" />
        <span class="sa-corner sa-corner--br" />

        <div class="sa-card-inner">

          <div class="sa-eyebrow">RESTRICTED ACCESS</div>

          <div class="sa-shield">
            <svg viewBox="0 0 40 46" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2L4 9V22C4 31.4 11 40.2 20 44C29 40.2 36 31.4 36 22V9L20 2Z" stroke="#e8531a" stroke-width="1.5" fill="rgba(220,38,38,0.08)"/>
              <path d="M14 23l4 4 8-8" stroke="#e8531a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>

          <h1 class="sa-title">Super Admin</h1>
          <p class="sa-subtitle">Authenticate to access root controls</p>

          <form @submit.prevent="handleLogin" class="sa-form">

            <div v-if="error" class="sa-error">
              <span class="sa-error-icon">⚠</span> {{ error }}
            </div>

            <div class="sa-field">
              <label>EMAIL ADDRESS</label>
              <div class="sa-input-wrap">
                <input
                  v-model="email"
                  type="email"
                  placeholder="superadmin@armztrong.com"
                  required
                  autocomplete="off"
                />
                <span class="sa-input-line" />
              </div>
            </div>

            <div class="sa-field">
              <label>PASSWORD</label>
              <div class="sa-input-wrap">
                <input
                  v-model="password"
                  type="password"
                  placeholder="••••••••••••"
                  required
                />
                <span class="sa-input-line" />
              </div>
            </div>

            <button type="submit" class="sa-btn" :disabled="loading">
              <span v-if="!loading" class="sa-btn-content">
                <span>AUTHENTICATE</span>
                <span class="sa-btn-arrow">→</span>
              </span>
              <span v-else class="sa-btn-content sa-btn-loading">
                <span class="sa-spinner" />
                <span>VERIFYING...</span>
              </span>
            </button>

          </form>

          <div class="sa-footer">
            <span class="sa-lock-icon">🔒</span>
            All access attempts are logged and monitored
          </div>

        </div>
      </div>

    </div>

    <!-- Bottom bar -->
    <div class="sa-bottombar" :class="{ visible: mounted }">
      <span>ARMZTRONG GYM MANAGEMENT &nbsp;·&nbsp; SUPER ADMIN PORTAL</span>
      <span>v2.0.0</span>
    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&family=Outfit:wght@300;400;600&display=swap');

/* ── Root ── */
.sa-root {
  height: 100vh;
  width: 100%;
  background: #080808;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  font-family: 'Outfit', sans-serif;
}

/* ── Grid background ── */
.sa-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(220,38,38,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(220,38,38,0.05) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}

.sa-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 20%, #080808 75%);
  pointer-events: none;
}

/* ── Top bar ── */
.sa-topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  border-bottom: 1px solid rgba(220,38,38,0.15);
  background: rgba(8,8,8,0.92);
  backdrop-filter: blur(8px);
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px;
  letter-spacing: 1.5px;
  color: #3a3a3a;
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 0.5s ease, transform 0.5s ease;
  z-index: 10;
}

.sa-topbar.visible { opacity: 1; transform: translateY(0); }

.sa-topbar-brand { color: #555; }
.sa-topbar-accent { color: #e8531a; }

.sa-topbar-status {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #3a7d44;
}

.sa-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #3a7d44;
  box-shadow: 0 0 6px #3a7d44;
  animation: sa-pulse 2s ease infinite;
}

@keyframes sa-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* ── Center ── */
.sa-center {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex: 1;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s;
}

.sa-center.visible { opacity: 1; transform: translateY(0); }

/* ── Card ── */
.sa-card {
  position: relative;
  width: 420px;
  padding: 2px;
  background: linear-gradient(135deg, rgba(220,38,38,0.35) 0%, rgba(72,30,20,0.2) 50%, rgba(220,38,38,0.2) 100%);
  border-radius: 4px;
}

.sa-card-inner {
  background: #0d0a0a;
  border-radius: 3px;
  padding: 44px 40px 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ── Corner accents ── */
.sa-corner {
  position: absolute;
  width: 14px;
  height: 14px;
  border-color: #e8531a;
  border-style: solid;
  z-index: 1;
}

.sa-corner--tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; border-radius: 2px 0 0 0; }
.sa-corner--tr { top: -1px; right: -1px; border-width: 2px 2px 0 0; border-radius: 0 2px 0 0; }
.sa-corner--bl { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; border-radius: 0 0 0 2px; }
.sa-corner--br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; border-radius: 0 0 2px 0; }

/* ── Eyebrow ── */
.sa-eyebrow {
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  letter-spacing: 3px;
  color: #e8531a;
  margin-bottom: 20px;
  opacity: 0.8;
}

/* ── Shield ── */
.sa-shield {
  width: 48px;
  height: 56px;
  margin-bottom: 18px;
  filter: drop-shadow(0 0 14px rgba(220,38,38,0.45));
}

.sa-shield svg { width: 100%; height: 100%; }

/* ── Title ── */
.sa-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0 0 6px;
  text-align: center;
}

.sa-subtitle {
  font-size: 12.5px;
  color: #444;
  margin: 0 0 30px;
  text-align: center;
  letter-spacing: 0.3px;
}

/* ── Form ── */
.sa-form { width: 100%; }

.sa-field {
  margin-bottom: 20px;
}

.sa-field label {
  display: block;
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  letter-spacing: 2px;
  color: #e8531a;
  margin-bottom: 8px;
  opacity: 0.75;
}

.sa-input-wrap {
  position: relative;
}

.sa-input-wrap input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  padding: 10px 0;
  color: #e8e8e8;
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
  letter-spacing: 0.5px;
}

.sa-input-wrap input::placeholder { color: #242424; }
.sa-input-wrap input:focus { border-bottom-color: rgba(220,38,38,0.5); }

.sa-input-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: #e8531a;
  transition: width 0.3s ease;
}

.sa-input-wrap input:focus ~ .sa-input-line { width: 100%; }

/* ── Error ── */
.sa-error {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(220,38,38,0.08);
  border: 1px solid rgba(220,38,38,0.2);
  border-left: 3px solid #dc2626;
  color: #f87171;
  font-size: 12.5px;
  padding: 10px 12px;
  border-radius: 2px;
  margin-bottom: 20px;
}

.sa-error-icon { font-size: 14px; flex-shrink: 0; }

/* ── Button ── */
.sa-btn {
  width: 100%;
  margin-top: 10px;
  padding: 14px;
  background: transparent;
  border: 1px solid rgba(220,38,38,0.4);
  color: #e8531a;
  font-family: 'Rajdhani', sans-serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 3px;
  cursor: pointer;
  border-radius: 2px;
  transition: background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
}

.sa-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(220,38,38,0.07);
  opacity: 0;
  transition: opacity 0.2s;
}

.sa-btn:hover:not(:disabled) {
  background: rgba(220,38,38,0.1);
  border-color: rgba(220,38,38,0.8);
  color: #ff6a30;
  box-shadow: 0 0 24px rgba(220,38,38,0.2), inset 0 0 20px rgba(220,38,38,0.05);
}

.sa-btn:hover::before { opacity: 1; }
.sa-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.sa-btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.sa-btn-arrow { transition: transform 0.2s; }
.sa-btn:hover .sa-btn-arrow { transform: translateX(4px); }
.sa-btn-loading { gap: 10px; }

.sa-spinner {
  width: 14px;
  height: 14px;
  border: 1.5px solid rgba(220,38,38,0.3);
  border-top-color: #e8531a;
  border-radius: 50%;
  animation: sa-spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes sa-spin {
  to { transform: rotate(360deg); }
}

/* ── Footer ── */
.sa-footer {
  margin-top: 28px;
  font-size: 11px;
  color: #2e2e2e;
  display: flex;
  align-items: center;
  gap: 6px;
  letter-spacing: 0.3px;
}

.sa-lock-icon { font-size: 12px; }

/* ── Bottom bar ── */
.sa-bottombar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  border-top: 1px solid rgba(220,38,38,0.08);
  background: rgba(8,8,8,0.92);
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  letter-spacing: 1.2px;
  color: #2a2a2a;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s;
}

.sa-bottombar.visible { opacity: 1; transform: translateY(0); }

/* ── Responsive ── */
@media (max-width: 500px) {
  .sa-card { width: calc(100vw - 32px); }
  .sa-card-inner { padding: 36px 24px 28px; }
  .sa-topbar, .sa-bottombar { padding: 0 16px; }
}
</style>
