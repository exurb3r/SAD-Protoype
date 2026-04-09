<template>
  <div class="logbook-container">

    <!-- Header -->
    <div class="logbook-header">
      <div>
        <h2 class="logbook-title">Branch Logbook</h2>
        <p class="logbook-sub">View and manage member attendance logs.</p>
      </div>
    </div>

    <!-- Filters -->
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

    <!-- Logs -->
    <div class="panel">
      <div v-for="log in filteredLogs" :key="log._id" class="log-item">

        <div class="log-body">
          <p class="log-name">{{ log.firstname }} {{ log.lastname }}</p>
          <p class="log-details">{{ log.email }} • {{ log.branch }}</p>

          <!-- EDIT MODE -->
          <div v-if="editId === log._id" class="edit-fields">
            <input v-model="editForm.timeIn" placeholder="Time In" />
            <input v-model="editForm.timeOut" placeholder="Time Out" />
          </div>

          <!-- VIEW MODE -->
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

<script setup>
import { ref, computed } from "vue";

/* ================= DUMMY DATA ================= */
const logs = ref([
  {
    _id: 1,
    firstname: "John",
    lastname: "Doe",
    email: "john@example.com",
    branch: "Main Branch",
    date: new Date(),
    timeIn: "08:30 AM",
    timeOut: "10:00 AM",
  },
  {
    _id: 2,
    firstname: "Jane",
    lastname: "Smith",
    email: "jane@example.com",
    branch: "East Branch",
    date: new Date(),
    timeIn: "09:00 AM",
    timeOut: "",
  },
]);

/* ================= FILTER ================= */
const dateFilter = ref("all");
const selectedDate = ref("");

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

/* ================= EDIT ================= */
const editId = ref(null);

const editForm = ref({
  timeIn: "",
  timeOut: "",
});

const startEdit = (log) => {
  editId.value = log._id;
  editForm.value = {
    timeIn: log.timeIn,
    timeOut: log.timeOut,
  };
};

const saveEdit = (log) => {
  log.timeIn = editForm.value.timeIn;
  log.timeOut = editForm.value.timeOut;
  editId.value = null;
};

/* ================= DELETE ================= */
const deleteLog = (id) => {
  logs.value = logs.value.filter(l => l._id !== id);
};

/* ================= HELPERS ================= */
const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};
</script>

<style scoped>
.logbook-container {
  width: 100%;
}

/* Header */
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

/* Filter */
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

/* Panel */
.panel {
  background: #1a1a1a;
  border-radius: 16px;
  border: 1px solid #481E14;
}

/* Log Item */
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

/* Actions */
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

/* Edit */
.edit-fields input {
  background: #111;
  border: 1px solid #2a2a2a;
  color: #ddd;
  padding: 5px;
  margin-right: 5px;
  border-radius: 6px;
}

/* Empty */
.empty {
  text-align: center;
  color: #555;
  padding: 30px;
}
</style>