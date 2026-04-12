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
      <p v-if="error" class="error-msg">{{ error }}</p>
      <button class="btn primary" @click="addPost">➕ Post</button>
    </div>

    <!-- POSTS -->
    <div class="panel">

      <div v-if="loading" class="empty">Loading announcements...</div>

      <div
        v-for="(p, index) in posts"
        :key="p._id"
        class="log-item"
      >

        <div class="log-body">

          <!-- EDIT MODE -->
          <div v-if="editIndex === index">
            <input v-model="editForm.title" />
            <textarea v-model="editForm.contents" />
            <p v-if="editError" class="error-msg">{{ editError }}</p>
          </div>

          <!-- VIEW MODE -->
          <div v-else>
            <p class="log-name">{{ p.title }}</p>
            <p class="log-details">
              {{ p.ownerEmail }} • {{ formatDate(p.date) }} • {{ p.time }}
            </p>
            <p class="log-time">{{ p.contents }}</p>
          </div>

        </div>

        <!-- ACTIONS — only visible to owner -->
        <div class="log-right">
          <div class="actions">
            <template v-if="p.isOwner">
              <button v-if="editIndex !== index" @click="startEdit(index)">✏️</button>
              <button v-if="editIndex === index" @click="saveEdit(index)">💾</button>
              <button v-if="editIndex === index" @click="editIndex = null">✕</button>
              <button @click="deletePost(index)">🗑️</button>
            </template>
          </div>
        </div>

      </div>

      <div v-if="posts.length === 0 && !loading" class="empty">
        No announcements yet.
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const BASE_URL = "http://localhost:3500/admins/communitypost";

const posts     = ref([]);
const loading   = ref(false);
const error     = ref("");
const editError = ref("");

const form          = ref({ title: "", contents: "" });
const editIndex     = ref(null);
const editForm      = ref({ title: "", contents: "" });
const editPostId    = ref(null);

const getToken    = () => localStorage.getItem("adminToken");
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

onMounted(() => {
  fetchPosts();
});

/* ── FETCH ALL POSTS ── */
const fetchPosts = async () => {
  loading.value = true;
  error.value   = "";
  try {
    const res  = await fetch(BASE_URL, { headers: authHeaders() });
    const data = await res.json();
    if (!res.ok) { error.value = data.message; return; }
    posts.value = data.posts; // each post has isOwner & ownerEmail from backend
  } catch {
    error.value = "Network error.";
  } finally {
    loading.value = false;
  }
};

/* ── ADD POST ── */
const addPost = async () => {
  if (!form.value.title || !form.value.contents) return;
  error.value = "";
  try {
    const res  = await fetch(BASE_URL, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(form.value),
    });
    const data = await res.json();
    if (!res.ok) { error.value = data.message; return; }
    posts.value.unshift(data.post); // post already has isOwner: true from backend
    form.value = { title: "", contents: "" };
  } catch {
    error.value = "Network error.";
  }
};

/* ── START EDIT ── */
const startEdit = (index) => {
  editIndex.value  = index;
  editPostId.value = posts.value[index]._id;
  editError.value  = "";
  editForm.value   = {
    title:    posts.value[index].title,
    contents: posts.value[index].contents,
  };
};

/* ── SAVE EDIT ── */
const saveEdit = async (index) => {
  editError.value = "";
  try {
    const res  = await fetch(`${BASE_URL}/${editPostId.value}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(editForm.value),
    });
    const data = await res.json();
    if (!res.ok) { editError.value = data.message; return; }
    posts.value[index] = data.post;  // already has isOwner & ownerEmail
    posts.value        = [...posts.value];
    editIndex.value    = null;
  } catch {
    editError.value = "Network error.";
  }
};

/* ── DELETE POST ── */
const deletePost = async (index) => {
  const id = posts.value[index]._id;
  try {
    const res  = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    const data = await res.json();
    if (!res.ok) { error.value = data.message; return; }
    posts.value.splice(index, 1);
    if (editIndex.value === index) editIndex.value = null;
  } catch {
    error.value = "Network error.";
  }
};

/* ── HELPERS ── */
const formatDate = (date) => new Date(date).toLocaleDateString();
</script>

<style scoped>
.logbook-container {
  width: 100%;
  color: #eaeaea;
}

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

.panel {
  background: #121212;
  border-radius: 18px;
  border: 1px solid #222;
  margin-bottom: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}

.form-panel {
  padding: 22px;
}

.section-title {
  font-size: 15px;
  margin-bottom: 12px;
  color: #aaa;
}

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
  box-sizing: border-box;
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

.panel:not(.form-panel) {
  padding: 10px;
}

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

.log-body {
  flex: 1;
}

.log-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.log-details {
  color: #777;
  font-size: 12px;
  margin-bottom: 8px;
}

.log-time {
  color: #ccc;
  font-size: 14px;
  line-height: 1.5;
}

.log-right {
  display: flex;
  align-items: flex-start;
}

.actions {
  display: flex;
  gap: 6px;
  min-width: 0; /* no space reserved when empty */
}

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

.log-body input,
.log-body textarea {
  width: 100%;
  background: #0f0f0f;
  border: 1px solid #333;
  color: white;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 8px;
  box-sizing: border-box;
}

.error-msg {
  color: #e74c3c;
  font-size: 12px;
  margin-bottom: 8px;
}

.empty {
  text-align: center;
  color: #555;
  padding: 40px;
}
</style>