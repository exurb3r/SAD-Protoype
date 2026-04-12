<template>
  <div class="staff-container">

    <!-- Header -->
    <div class="staff-header">
      <div>
        <h2 class="staff-title">Staff Management</h2>
        <p class="staff-sub">Manage your gym staff, roles, and schedules.</p>
      </div>
      <button class="btn-add" @click="openModal()">+ Add Staff</button>
    </div>

    <!-- Summary Cards -->
    <div class="summary-row">
      <div class="summary-card" v-for="s in summary" :key="s.label">
        <span class="summary-icon">{{ s.icon }}</span>
        <div>
          <p>{{ s.label }}</p>
          <h3>{{ s.value }}</h3>
        </div>
      </div>
    </div>

    <!-- Staff Table -->
    <div class="panel">
      <div class="panel-top">
        <h4 class="panel-title">All Staff</h4>
        <input class="search-input" v-model="search" placeholder="🔍 Search staff..." />
      </div>
      <table class="staff-table">
        <thead>
          <tr>
            <th>Staff</th>
            <th>Role</th>
            <th>Shift</th>
            <th>Schedule</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="staff in filteredStaff" :key="staff.id">
            <td>
              <div class="member-cell">
                <div class="avatar">
                  <img :src="`https://api.dicebear.com/7.x/initials/svg?seed=${staff.name}&backgroundColor=481E14&fontFamily=Arial&fontSize=40`" :alt="staff.name" />
                </div>
                <div>
                  <p class="staff-name">{{ staff.name }}</p>
                  <p class="staff-email">{{ staff.email }}</p>
                </div>
              </div>
            </td>
            <td><span class="role-badge">{{ staff.role }}</span></td>
            <td>{{ staff.shift }}</td>
            <td>{{ staff.schedule }}</td>
            <td><span class="badge" :class="staff.status.toLowerCase()">{{ staff.status }}</span></td>
            <td>
              <div class="action-btns">
                <button class="btn-edit" @click="openModal(staff)">✏️ Edit</button>
                <button class="btn-delete" @click="deleteStaff(staff.id)">🗑️ Delete</button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredStaff.length === 0">
            <td colspan="6" class="empty">No staff found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div class="modal-overlay" v-if="showModal" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingStaff ? 'Edit Staff' : 'Add New Staff' }}</h3>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label>Full Name</label>
            <input v-model="form.name" placeholder="e.g. Juan dela Cruz" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="form.email" placeholder="e.g. juan@gym.com" />
          </div>
          <div class="form-group">
            <label>Role</label>
            <select v-model="form.role">
              <option>Trainer</option>
              <option>Receptionist</option>
              <option>Cleaner</option>
              <option>Security</option>
              <option>Manager</option>
            </select>
          </div>
          <div class="form-group">
            <label>Shift</label>
            <select v-model="form.shift">
              <option>Morning (6AM - 2PM)</option>
              <option>Afternoon (2PM - 10PM)</option>
              <option>Night (10PM - 6AM)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Schedule</label>
            <input v-model="form.schedule" placeholder="e.g. Mon - Fri" />
          </div>
          <div class="form-group">
            <label>Status</label>
            <select v-model="form.status">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="closeModal">Cancel</button>
          <button class="btn-save" @click="saveStaff">{{ editingStaff ? 'Save Changes' : 'Add Staff' }}</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const search = ref("");
const showModal = ref(false);
const editingStaff = ref(null);

const form = ref({ name: "", email: "", role: "Trainer", shift: "Morning (6AM - 2PM)", schedule: "Mon - Fri", status: "Active" });

const staffList = ref([
  { id: 1, name: "Abegail Moyaen",    email: "abegail@gym.com",    role: "Trainer",       shift: "Morning (6AM - 2PM)",   schedule: "Mon - Fri", status: "Active" },
  { id: 2, name: "Chris P Bacon",      email: "chrisppata@gym.com",    role: "Receptionist",  shift: "Morning (6AM - 2PM)",   schedule: "Mon - Sat", status: "Active" },
  { id: 3, name: "Roven Santos", email: "robien@gym.com",    role: "Trainer",       shift: "Afternoon (2PM - 10PM)", schedule: "Tue - Sun", status: "Active" },
  { id: 4, name: "Jochelle Maltu",     email: "jochelle@gym.com",      role: "Cleaner",       shift: "Night (10PM - 6AM)",    schedule: "Mon - Fri", status: "Inactive" },
  { id: 5, name: "Kurt Morales",   email: "nke@gym.com",     role: "Security",      shift: "Night (10PM - 6AM)",    schedule: "Mon - Sun", status: "Active" },
  { id: 6, name: "Janina Somera",      email: "janeyna@gym.com",     role: "Manager",       shift: "Morning (6AM - 2PM)",   schedule: "Mon - Fri", status: "Active" },
]);

const summary = computed(() => [
  { label: "Total Staff",    value: staffList.value.length,                                          icon: "" },
  { label: "Active",         value: staffList.value.filter(s => s.status === "Active").length,       icon: "" },
  { label: "Inactive",       value: staffList.value.filter(s => s.status === "Inactive").length,     icon: "" },
  { label: "Trainers",       value: staffList.value.filter(s => s.role === "Trainer").length,        icon: "" },
]);

const filteredStaff = computed(() =>
  staffList.value.filter(s =>
    s.name.toLowerCase().includes(search.value.toLowerCase()) ||
    s.role.toLowerCase().includes(search.value.toLowerCase())
  )
);

const openModal = (staff = null) => {
  editingStaff.value = staff;
  form.value = staff
    ? { ...staff }
    : { name: "", email: "", role: "Trainer", shift: "Morning (6AM - 2PM)", schedule: "Mon - Fri", status: "Active" };
  showModal.value = true;
};

const closeModal = () => { showModal.value = false; editingStaff.value = null; };

const saveStaff = () => {
  if (!form.value.name) return;
  if (editingStaff.value) {
    const i = staffList.value.findIndex(s => s.id === form.value.id);
    staffList.value[i] = { ...form.value };
  } else {
    staffList.value.push({ ...form.value, id: Date.now() });
  }
  closeModal();
};

const deleteStaff = (id) => {
  staffList.value = staffList.value.filter(s => s.id !== id);
};
</script>

<style scoped>
.staff-container { width: 100%; }

/* Header */
.staff-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.staff-title { color: white; margin: 0 0 4px 0; font-size: 22px; font-weight: 700; }
.staff-sub { color: #777; margin: 0; font-size: 13px; }
.btn-add { background: #e8531a; color: white; border: none; padding: 10px 20px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: 0.2s; }
.btn-add:hover { background: #c94415; }

/* Summary */
.summary-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.summary-card { background: #1a1a1a; border: 1px solid #481E14; border-radius: 14px; padding: 18px; display: flex; align-items: center; gap: 14px; }
.summary-icon { font-size: 26px; }
.summary-card p { color: #aaa; margin: 0 0 4px 0; font-size: 12px; }
.summary-card h3 { color: white; margin: 0; font-size: 22px; font-weight: 700; }

/* Panel */
.panel { background: #1a1a1a; border-radius: 16px; border: 1px solid #481E14; padding: 20px; }
.panel-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.panel-title { color: white; margin: 0; font-size: 15px; font-weight: 600; }
.search-input { background: #2a2a2a; border: 1px solid #481E14; color: white; padding: 8px 14px; border-radius: 8px; font-size: 13px; outline: none; width: 220px; }
.search-input::placeholder { color: #666; }

/* Table */
.staff-table { width: 100%; border-collapse: collapse; }
.staff-table th { color: #777; font-size: 12px; text-align: left; padding: 8px 12px; border-bottom: 1px solid #2a2a2a; }
.staff-table td { color: #ddd; font-size: 13px; padding: 12px; border-bottom: 1px solid #1f1f1f; }
.staff-table tr:last-child td { border-bottom: none; }
.member-cell { display: flex; align-items: center; gap: 10px; }
.avatar { width: 36px; height: 36px; border-radius: 50%; overflow: hidden; background: #2a2a2a; flex-shrink: 0; }
.avatar img { width: 100%; height: 100%; object-fit: cover; }
.staff-name { color: white; margin: 0 0 2px 0; font-size: 13px; font-weight: 600; }
.staff-email { color: #666; margin: 0; font-size: 11px; }
.role-badge { background: #2a2a2a; color: #e8531a; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.badge.active   { background: #14532d; color: #4ade80; }
.badge.inactive { background: #2a2a2a; color: #aaa; }
.action-btns { display: flex; gap: 8px; }
.btn-edit   { background: #2a2a2a; color: #aaa; border: none; padding: 5px 10px; border-radius: 6px; font-size: 12px; cursor: pointer; transition: 0.2s; }
.btn-edit:hover { background: #481E14; color: #e8531a; }
.btn-delete { background: #2a2a2a; color: #aaa; border: none; padding: 5px 10px; border-radius: 6px; font-size: 12px; cursor: pointer; transition: 0.2s; }
.btn-delete:hover { background: #3a1010; color: #f87171; }
.empty { text-align: center; color: #555; padding: 30px; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 999; }
.modal { background: #1a1a1a; border: 1px solid #481E14; border-radius: 20px; padding: 32px; width: 520px; max-width: 90vw; }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.modal-header h3 { color: white; margin: 0; font-size: 18px; }
.modal-close { background: none; border: none; color: #aaa; font-size: 18px; cursor: pointer; }
.modal-close:hover { color: white; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { color: #aaa; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.form-group input, .form-group select { background: #2a2a2a; border: 1px solid #481E14; color: white; padding: 10px 12px; border-radius: 8px; font-size: 13px; outline: none; }
.form-group input:focus, .form-group select:focus { border-color: #e8531a; }
.form-group select option { background: #1a1a1a; }
.modal-footer { display: flex; justify-content: flex-end; gap: 12px; }
.btn-cancel { background: #2a2a2a; color: #aaa; border: none; padding: 10px 20px; border-radius: 10px; font-size: 14px; cursor: pointer; }
.btn-cancel:hover { color: white; }
.btn-save { background: #e8531a; color: white; border: none; padding: 10px 20px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; }
.btn-save:hover { background: #c94415; }
</style>