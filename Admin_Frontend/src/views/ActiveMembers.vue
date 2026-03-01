<template>
  <div class="members-container">

    <!-- Header -->
    <div class="members-header">
      <h2>Active Members</h2>
      <input
        v-model="search"
        class="search-input"
        type="text"
        placeholder="Search members..."
      />
    </div>

    <!-- Table -->
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Member</th>
            <th>Membership Type</th>
            <th>Expiry Date</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in filteredMembers" :key="member.id">
            <td class="member-info">
              <div class="avatar">{{ initials(member.name) }}</div>
              <span>{{ member.name }}</span>
            </td>
            <td>
              <span :class="['badge', member.type.toLowerCase()]">{{ member.type }}</span>
            </td>
            <td>{{ member.expiry }}</td>
            <td>{{ member.contact }}</td>
            <td class="actions">
              <button class="btn view" @click="viewMember(member)">View</button>
              <button class="btn edit" @click="editMember(member)">Edit</button>
              <button class="btn delete" @click="deletingMember = member">Delete</button>
            </td>
          </tr>
          <tr v-if="filteredMembers.length === 0">
            <td colspan="5" class="no-results">No members found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- View Modal -->
    <div class="modal-overlay" v-if="selectedMember" @click.self="selectedMember = null">
      <div class="modal">
        <div class="modal-avatar">{{ initials(selectedMember.name) }}</div>
        <h3>{{ selectedMember.name }}</h3>
        <p><span>Membership:</span> {{ selectedMember.type }}</p>
        <p><span>Expiry:</span> {{ selectedMember.expiry }}</p>
        <p><span>Contact:</span> {{ selectedMember.contact }}</p>
        <button class="btn delete" @click="selectedMember = null">Close</button>
      </div>
    </div>

    <!-- Edit Modal -->
    <div class="modal-overlay" v-if="editingMember" @click.self="editingMember = null">
      <div class="modal">
        <h3>Edit Member</h3>
        <label>Name</label>
        <input v-model="editingMember.name" class="modal-input" />
        <label>Membership Type</label>
        <select v-model="editingMember.type" class="modal-input">
          <option>Basic</option>
          <option>Standard</option>
          <option>Premium</option>
        </select>
        <label>Expiry Date</label>
        <input v-model="editingMember.expiry" type="date" class="modal-input" />
        <label>Contact</label>
        <input v-model="editingMember.contact" class="modal-input" />
        <div class="modal-actions">
          <button class="btn edit" @click="saveEdit">Save</button>
          <button class="btn delete" @click="editingMember = null">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal-overlay" v-if="deletingMember" @click.self="deletingMember = null">
      <div class="modal">
        <h3>Delete Member?</h3>
        <p class="delete-msg">Are you sure you want to delete <span>{{ deletingMember.name }}</span>? This cannot be undone.</p>
        <div class="modal-actions">
          <button class="btn delete" @click="confirmDelete">Yes, Delete</button>
          <button class="btn edit" @click="deletingMember = null">Cancel</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      selectedMember: null,
      editingMember: null,
      deletingMember: null,
      members: [
        { id: 1, name: 'Juan Dela Cruz', type: 'Premium',  expiry: '2025-06-30', contact: '09171234567' },
        { id: 2, name: 'Maria Santos',   type: 'Basic',    expiry: '2025-03-15', contact: '09281234567' },
        { id: 3, name: 'Carlo Reyes',    type: 'Standard', expiry: '2025-05-01', contact: '09391234567' },
        { id: 4, name: 'Anna Lim',       type: 'Premium',  expiry: '2025-07-20', contact: '09451234567' },
        { id: 5, name: 'Jose Garcia',    type: 'Basic',    expiry: '2025-02-28', contact: '09561234567' },
      ]
    }
  },
  computed: {
    filteredMembers() {
      return this.members.filter(m =>
        m.name.toLowerCase().includes(this.search.toLowerCase()) ||
        m.type.toLowerCase().includes(this.search.toLowerCase()) ||
        m.contact.includes(this.search)
      )
    }
  },
  methods: {
    initials(name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    },
    viewMember(member) {
      this.selectedMember = { ...member }
    },
    editMember(member) {
      this.editingMember = { ...member }
    },
    saveEdit() {
      const index = this.members.findIndex(m => m.id === this.editingMember.id)
      if (index !== -1) this.members[index] = { ...this.editingMember }
      this.editingMember = null
    },
    confirmDelete() {
      this.members = this.members.filter(m => m.id !== this.deletingMember.id)
      this.deletingMember = null
    }
  }
}
</script>

<style scoped>
.members-container {
  width: 100%;
}

.members-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.members-header h2 {
  color: white;
  margin: 0;
}

.search-input {
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid #481E14;
  background: #1a1a1a;
  color: white;
  font-size: 14px;
  width: 240px;
  outline: none;
  transition: 0.2s;
}

.search-input:focus {
  border-color: #F2613F;
}

.table-wrapper {
  background: #1a1a1a;
  border-radius: 16px;
  border: 1px solid #481E14;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #0C0C0C;
}

th {
  padding: 14px 20px;
  text-align: left;
  color: #aaa;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #481E14;
}

td {
  padding: 14px 20px;
  color: white;
  font-size: 14px;
  border-bottom: 1px solid #2a2a2a;
}

tr:last-child td {
  border-bottom: none;
}

tr:hover td {
  background-color: #1f1210;
}

.member-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #9B3922;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: bold;
  color: white;
  flex-shrink: 0;
}

.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.badge.premium {
  background-color: #481E14;
  color: #F2613F;
}

.badge.standard {
  background-color: #2a2a2a;
  color: #aaa;
}

.badge.basic {
  background-color: #1f1f1f;
  color: #777;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 6px 14px;
  border-radius: 8px;
  border: none;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
}

.btn.view {
  background-color: #481E14;
  color: #F2613F;
}

.btn.view:hover {
  background-color: #9B3922;
  color: white;
}

.btn.edit {
  background-color: #2a2a2a;
  color: #aaa;
}

.btn.edit:hover {
  background-color: #444;
  color: white;
}

.btn.delete {
  background-color: #1a1a1a;
  color: #c0392b;
  border: 1px solid #c0392b;
}

.btn.delete:hover {
  background-color: #c0392b;
  color: white;
}

.no-results {
  text-align: center;
  color: #555;
  padding: 40px;
}

/* Modals */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: #1a1a1a;
  border: 1px solid #481E14;
  border-radius: 16px;
  padding: 32px;
  width: 360px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #9B3922;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin: 0 auto 8px;
}

.modal h3 {
  color: white;
  margin: 0;
  text-align: center;
}

.modal p {
  color: #aaa;
  margin: 0;
  font-size: 14px;
}

.modal p span {
  color: #F2613F;
  font-weight: bold;
}

.delete-msg {
  text-align: center;
  color: #aaa;
}

.modal label {
  color: #aaa;
  font-size: 13px;
}

.modal-input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #481E14;
  background: #0C0C0C;
  color: white;
  font-size: 14px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}

.modal-input:focus {
  border-color: #F2613F;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}
</style>