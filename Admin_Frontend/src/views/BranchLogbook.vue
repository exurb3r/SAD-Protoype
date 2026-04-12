<script setup>
import { ref, computed, onMounted } from "vue";

const logs = ref([]);
const dateFilter = ref("all");
const selectedDate = ref("");

const editId = ref(null);
const editForm = ref({
  timeIn: "",
  timeOut: "",
});

const API_URL = "http://localhost:3500/admins/logbook";

const getToken = () => localStorage.getItem("adminToken");

const fetchLogs = async () => {
  try {
    const res = await fetch(API_URL, {
      headers: {
        Authorization: "Bearer " + getToken()
      }
    });

    const data = await res.json();
    logs.value = data;

  } catch (err) {
    console.error("Fetch error:", err);
  }
};

onMounted(fetchLogs);

const filteredLogs = computed(() => {
  if (dateFilter.value === "all") return logs.value;

  const today = new Date().toDateString();

  if (dateFilter.value === "today") {
    return logs.value.filter(l =>
      new Date(l.date).toDateString() === today
    );
  }

  if (dateFilter.value === "custom" && selectedDate.value) {
    return logs.value.filter(l =>
      new Date(l.date).toDateString() ===
      new Date(selectedDate.value).toDateString()
    );
  }

  return logs.value;
});

const startEdit = (log) => {
  editId.value = log._id;
  editForm.value = {
    timeIn: log.timeIn,
    timeOut: log.timeOut,
  };
};

const saveEdit = async (log) => {
  try {
    const res = await fetch(`${API_URL}/${log._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken()
      },
      body: JSON.stringify({
        timeIn: editForm.value.timeIn,
        timeOut: editForm.value.timeOut
      })
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
      headers: {
        Authorization: "Bearer " + getToken()
      }
    });

    logs.value = logs.value.filter(l => l._id !== id);

  } catch (err) {
    console.error("Delete error:", err);
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};
</script>

<template>
  <div class="logbook-container">
    <div class="logbook-header">
      <div>
        <h2 class="logbook-title">Branch Logbook</h2>
        <p class="logbook-sub">View and manage member attendance logs.</p>
      </div>
    </div>

    <div class="filter-bar">
      <select v-model="dateFilter">
        <option value="all">All</option>
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
            IN: {{ log.timeIn || '-' }} | OUT: {{ log.timeOut || '-' }}
          </p>
        </div>

        <div class="log-right">
          <p class="log-date">{{ formatDate(log.date) }}</p>

          <div class="actions">
            <button v-if="editId !== log._id" @click="startEdit(log)">✏️</button>
            <button v-if="editId === log._id" @click="saveEdit(log)">💾</button>
            <button @click="deleteLog(log._id)">🗑️</button>
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
.logbook-container {
  width: 100%;
}

.logbook-header {
  margin-bottom: 20px;
}
.logbook-title {
  color: white;
  font-size: 22px;
  font-weight: 700;
}
.logbook-sub {
  color: #777;
  font-size: 13px;
}

.filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}
.filter-bar select,
.filter-bar input {
  background: #111;
  border: 1px solid #2a2a2a;
  color: #ddd;
  padding: 8px;
  border-radius: 8px;
}

.panel {
  background: #1a1a1a;
  border-radius: 16px;
  border: 1px solid #481E14;
}

.log-item {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #1f1f1f;
}
.log-item:hover {
  background: #1f1f1f;
}

.log-body {
  flex: 1;
}
.log-name {
  color: white;
  font-weight: 600;
}
.log-details {
  color: #888;
  font-size: 12px;
}
.log-time {
  color: #aaa;
  font-size: 12px;
}

.log-right {
  text-align: right;
}
.log-date {
  color: #666;
  font-size: 12px;
}

.actions {
  margin-top: 5px;
}
.actions button {
  background: #2a2a2a;
  border: none;
  margin-left: 5px;
  padding: 5px 8px;
  border-radius: 6px;
  cursor: pointer;
}
.actions button:hover {
  background: #481E14;
}

.edit-fields input {
  background: #111;
  border: 1px solid #2a2a2a;
  color: #ddd;
  padding: 5px;
  margin-right: 5px;
  border-radius: 6px;
}

.empty {
  text-align: center;
  color: #555;
  padding: 30px;
}
</style>