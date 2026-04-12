<script setup>
import { ref, computed, onMounted } from "vue";

const logs = ref([]);
const dateFilter = ref("all");
const selectedDate = ref("");
const activeTab = ref("all");

const tabs = [
  { label: "All",          value: "all" },
  { label: "General Luna", value: "General Luna" },
  { label: "Rimando Road", value: "Rimando Road" },
];

const editId = ref(null);
const editForm = ref({ timeIn: "", timeOut: "" });

const API_URL = "http://localhost:3500/superadmin/logbook";

const getToken = () => localStorage.getItem("superadminToken");

const fetchLogs = async () => {
  try {
    const res = await fetch(API_URL, {
      headers: { Authorization: "Bearer " + getToken() }
    });
    const data = await res.json();
    logs.value = data;
  } catch (err) {
    console.error("Fetch error:", err);
  }
};

onMounted(fetchLogs);

const tabCount = (tab) => {
  if (tab === "all") return logs.value.length;
  return logs.value.filter(l => l.branch === tab).length;
};

const filteredLogs = computed(() => {
  let result = logs.value;

  // Branch filter
  if (activeTab.value !== "all") {
    result = result.filter(l => l.branch === activeTab.value);
  }

  // Date filter
  const today = new Date().toDateString();
  if (dateFilter.value === "today") {
    result = result.filter(l => new Date(l.date).toDateString() === today);
  } else if (dateFilter.value === "custom" && selectedDate.value) {
    result = result.filter(l =>
      new Date(l.date).toDateString() === new Date(selectedDate.value).toDateString()
    );
  }

  return result;
});

const startEdit = (log) => {
  editId.value = log._id;
  editForm.value = { timeIn: log.timeIn, timeOut: log.timeOut };
};

const saveEdit = async (log) => {
  try {
    const res = await fetch(`${API_URL}/${log._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken()
      },
      body: JSON.stringify({ timeIn: editForm.value.timeIn, timeOut: editForm.value.timeOut })
    });
    const updated = await res.json();
    log.timeIn = updated.timeIn;
    log.timeOut = updated.timeOut;
    editId.value = null;
  } catch (err) {
    console.error("Update error:", err);
  }
};

const deleteLog = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + getToken() }
    });
    logs.value = logs.value.filter(l => l._id !== id);
  } catch (err) {
    console.error("Delete error:", err);
  }
};

const formatDate = (date) => new Date(date).toLocaleDateString();
</script>

<template>
  <div class="logbook-container">

    <div class="logbook-header">
      <div>
        <h2 class="logbook-title">Logbook</h2>
        <p class="logbook-sub">View and manage member attendance across all branches.</p>
      </div>
    </div>

    <!-- BRANCH TABS -->
    <div class="branch-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        :class="['tab-btn', { active: activeTab === tab.value }]"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
        <span class="tab-count">{{ tabCount(tab.value) }}</span>
      </button>
    </div>

    <!-- DATE FILTER -->
    <div class="filter-bar">
      <select v-model="dateFilter">
        <option value="all">All Dates</option>
        <option value="today">Today</option>
        <option value="custom">Custom Date</option>
      </select>
      <input
        v-if="dateFilter === 'custom'"
        type="date"
        v-model="selectedDate"
      />
    </div>

    <div class="panel">
      <div v-for="log in filteredLogs" :key="log._id" class="log-item">
        <div class="log-body">
          <p class="log-name">{{ log.firstname }} {{ log.lastname }}</p>
          <p class="log-details">{{ log.email }} • {{ log.branch }}</p>

          <div v-if="editId === log._id" class="edit-fields">
            <input v-model="editForm.timeIn" placeholder="Time In" />
            <input v-model="editForm.timeOut" placeholder="Time Out" />
          </div>
          <p v-else class="log-time">
            IN: {{ log.timeIn || '—' }} | OUT: {{ log.timeOut || '—' }}
          </p>
        </div>

        <div class="log-right">
          <p class="log-date">{{ formatDate(log.date) }}</p>
          <div class="actions">
            <button v-if="editId !== log._id" class="btn-icon" @click="startEdit(log)" title="Edit">✏️</button>
            <button v-if="editId === log._id" class="btn-icon" @click="saveEdit(log)" title="Save">💾</button>
            <button class="btn-icon btn-delete" @click="deleteLog(log._id)" title="Delete">🗑️</button>
          </div>
        </div>
      </div>

      <div v-if="filteredLogs.length === 0" class="empty">
        No log entries found.
      </div>
    </div>

  </div>
</template>

<style scoped>
.logbook-container { width: 100%; }

.logbook-header { margin-bottom: 16px; }
.logbook-title { color: white; font-size: 22px; font-weight: 700; margin: 0; }
.logbook-sub { color: #777; font-size: 13px; margin: 4px 0 0; }

/* BRANCH TABS */
.branch-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}
.tab-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid #2a2a2a;
  background: transparent;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  transition: 0.15s;
}
.tab-btn:hover { border-color: #444; color: #aaa; }
.tab-btn.active {
  background: rgba(242, 97, 63, 0.1);
  border-color: rgba(242, 97, 63, 0.35);
  color: #F2613F;
}
.tab-count {
  font-size: 11px;
  padding: 1px 7px;
  border-radius: 20px;
  background: rgba(255,255,255,0.06);
  color: inherit;
}
.tab-btn.active .tab-count { background: rgba(242, 97, 63, 0.2); }

/* DATE FILTER */
.filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}
.filter-bar select,
.filter-bar input {
  background: #111;
  border: 1px solid #2a2a2a;
  color: #ddd;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  outline: none;
  transition: 0.15s;
}
.filter-bar select:focus,
.filter-bar input:focus { border-color: #F2613F; }

/* PANEL */
.panel {
  background: #1a1a1a;
  border-radius: 16px;
  border: 1px solid #481E14;
  overflow: hidden;
}

.log-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 20px;
  border-bottom: 1px solid #222;
  transition: 0.15s;
}
.log-item:last-child { border-bottom: none; }
.log-item:hover { background: #1f1210; }

.log-body { flex: 1; }
.log-name { color: white; font-weight: 600; font-size: 14px; margin: 0 0 3px; }
.log-details { color: #888; font-size: 12px; margin: 0 0 6px; }
.log-time { color: #aaa; font-size: 12px; margin: 0; }

.log-right { text-align: right; flex-shrink: 0; }
.log-date { color: #555; font-size: 12px; margin: 0 0 8px; }

.actions { display: flex; gap: 6px; justify-content: flex-end; }
.btn-icon {
  background: #2a2a2a;
  border: none;
  padding: 5px 9px;
  border-radius: 7px;
  cursor: pointer;
  font-size: 13px;
  transition: 0.15s;
}
.btn-icon:hover { background: #481E14; }
.btn-delete:hover { background: #3a1212; }

.edit-fields { display: flex; gap: 8px; margin: 4px 0; }
.edit-fields input {
  background: #111;
  border: 1px solid #2a2a2a;
  color: #ddd;
  padding: 6px 10px;
  border-radius: 7px;
  font-size: 13px;
  width: 110px;
  outline: none;
  transition: 0.15s;
}
.edit-fields input:focus { border-color: #F2613F; }

.empty { text-align: center; color: #555; padding: 40px; font-size: 14px; }
</style>