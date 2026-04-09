<template>
  <div class="logbook-container">

    <!-- Header -->
    <div class="logbook-header">
      <div>
        <h2 class="logbook-title">Community Announcements</h2>
        <p class="logbook-sub">Manage gym announcements and updates.</p>
      </div>
    </div>

    <!-- CREATE POST -->
    <div class="panel form-panel">
      <h3 class="section-title">Create Announcement</h3>

      <input v-model="form.title" placeholder="Title" />
      <textarea v-model="form.contents" placeholder="Write announcement..." />

      <button class="btn primary" @click="addPost">➕ Post</button>
    </div>

    <!-- POSTS -->
    <div class="panel">
      <div
        v-for="(p, index) in posts"
        :key="index"
        class="log-item"
      >

        <div class="log-body">

          <!-- EDIT MODE -->
          <div v-if="editIndex === index">
            <input v-model="editForm.title" />
            <textarea v-model="editForm.contents" />
          </div>

          <!-- VIEW MODE -->
          <div v-else>
            <p class="log-name">{{ p.title }}</p>
            <p class="log-details">
              {{ adminEmail }} • {{ formatDate(p.date) }} • {{ p.time }}
            </p>
            <p class="log-time">{{ p.contents }}</p>
          </div>

        </div>

        <div class="log-right">
          <div class="actions">
            <button v-if="editIndex !== index" @click="startEdit(index)">✏️</button>
            <button v-if="editIndex === index" @click="saveEdit(index)">💾</button>
            <button @click="deletePost(index)">🗑️</button>
          </div>
        </div>

      </div>

      <div v-if="posts.length === 0" class="empty">
        No announcements yet.
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";

/* ================= ADMIN (matches your model) ================= */
const adminEmail = "admin@gym.com";

/* ================= DUMMY DATA ================= */
const posts = ref([
  {
    title: "Gym Closed Tomorrow",
    date: new Date(),
    time: "8:00 AM",
    contents: "The gym will be closed due to maintenance.",
  },
  {
    title: "New Equipment Arrived",
    date: new Date(),
    time: "10:30 AM",
    contents: "We added new machines in the strength section!",
  },
]);

/* ================= FORM ================= */
const form = ref({
  title: "",
  contents: "",
});

/* ================= ADD POST ================= */
const addPost = () => {
  if (!form.value.title || !form.value.contents) return;

  posts.value.unshift({
    title: form.value.title,
    contents: form.value.contents,
    date: new Date(),
    time: new Date().toLocaleTimeString(),
  });

  form.value.title = "";
  form.value.contents = "";
};

/* ================= EDIT ================= */
const editIndex = ref(null);

const editForm = ref({
  title: "",
  contents: "",
});

const startEdit = (index) => {
  editIndex.value = index;
  editForm.value = {
    title: posts.value[index].title,
    contents: posts.value[index].contents,
  };
};

const saveEdit = (index) => {
  posts.value[index].title = editForm.value.title;
  posts.value[index].contents = editForm.value.contents;
  editIndex.value = null;
};

/* ================= DELETE ================= */
const deletePost = (index) => {
  posts.value.splice(index, 1);
};

/* ================= HELPERS ================= */
const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};
</script>

<style scoped>
.logbook-container {
  width: 100%;
  color: #eaeaea;
}

/* HEADER */
.logbook-header {
  margin-bottom: 28px;
}
.logbook-title {
  font-size: 24px;
  font-weight: 600;
}
.logbook-sub {
  color: #888;
  font-size: 13px;
  margin-top: 4px;
}

/* PANEL BASE */
.panel {
  background: #121212;
  border-radius: 18px;
  border: 1px solid #222;
  margin-bottom: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}

/* FORM PANEL */
.form-panel {
  padding: 22px;
}

.section-title {
  font-size: 15px;
  margin-bottom: 12px;
  color: #aaa;
}

/* INPUTS */
.form-panel input,
.form-panel textarea {
  width: 100%;
  background: #0f0f0f;
  border: 1px solid #222;
  color: #eee;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 12px;
  transition: 0.2s;
}

.form-panel textarea {
  min-height: 90px;
  resize: none;
}

.form-panel input:focus,
.form-panel textarea:focus {
  outline: none;
  border-color: #F2613F;
  box-shadow: 0 0 0 2px rgba(242, 97, 63, 0.2);
}

/* BUTTON */
.btn.primary {
  background: linear-gradient(135deg, #F2613F, #ff8a65);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s;
  font-weight: 500;
}
.btn.primary:hover {
  opacity: 0.9;
}

/* POSTS PANEL */
.panel:not(.form-panel) {
  padding: 10px;
}

/* POST CARD */
.log-item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border-radius: 14px;
  transition: 0.2s;
}

.log-item:hover {
  background: #181818;
}

/* LEFT CONTENT */
.log-body {
  flex: 1;
}

/* TITLE */
.log-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

/* META */
.log-details {
  color: #777;
  font-size: 12px;
  margin-bottom: 8px;
}

/* CONTENT */
.log-time {
  color: #ccc;
  font-size: 14px;
  line-height: 1.5;
}

/* ACTIONS */
.log-right {
  display: flex;
  align-items: flex-start;
}

.actions {
  display: flex;
  gap: 6px;
}

/* ICON BUTTONS */
.actions button {
  background: #1f1f1f;
  border: 1px solid #2a2a2a;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
  color: #aaa;
}

.actions button:hover {
  background: #F2613F;
  color: white;
  border-color: #F2613F;
}

/* EDIT MODE INPUTS */
.log-body input,
.log-body textarea {
  width: 100%;
  background: #0f0f0f;
  border: 1px solid #333;
  color: white;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 8px;
}

/* EMPTY */
.empty {
  text-align: center;
  color: #555;
  padding: 40px;
}
</style>