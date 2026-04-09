<template>
  <div class="members-container">

    <div class="members-header">
      <h2></h2>
      <input v-model="search" class="search-input" type="text" placeholder="Search members..." />
    </div>

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
              <div class="avatar">{{ initials(member.firstname, member.lastname) }}</div>
              <span>{{ member.firstname }} {{ member.lastname }}</span>
            </td>

            <td>
              <span class="badge">
                {{ member.membershipStatus[0]?.category }}
              </span>
            </td>

            <td>
              {{ member.membershipStatus[0]?.expiryDate }}
            </td>

            <td>
              {{ member.contactNum }}
            </td>
            

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

    <!-- VIEW MODAL -->

    <div class="modal-overlay" v-if="selectedMember" @click.self="selectedMember = null">
      <div class="modal">
        <div class="modal-avatar">
          {{ initials(selectedMember.firstname, selectedMember.lastname) }}
        </div>

        <h3>{{ selectedMember.firstname }} {{ selectedMember.lastname }}</h3>

        <p><span>Membership:</span> {{ selectedMember.membershipStatus[0]?.category }}</p>
        <p><span>Expiry:</span> {{ selectedMember.membershipStatus[0]?.expiryDate }}</p>
        <p><span>Contact:</span> {{ selectedMember.contactNum }}</p>
        <p><span>Contact Person:</span> {{ selectedMember.contactPerson }}</p>
        <p><span>Contact Person Number:</span> {{ selectedMember.contactPersonNum }}</p>
        <p><span>Address:</span> {{ selectedMember.address }}</p>

        <button class="btn delete" @click="selectedMember = null">Close</button>
      </div>
    </div>

    <!-- EDIT MODAL -->

    <div class="modal-overlay" v-if="editingMember" @click.self="editingMember = null">
      <div class="modal">

        <h3>Edit Member</h3>

        <label>First Name</label>
        <input v-model="editingMember.firstname" class="modal-input" />

        <label>Last Name</label>
        <input v-model="editingMember.lastname" class="modal-input" />

        <label>Email</label>
        <input v-model="editingMember.email" class="modal-input" />

        <label>Contact</label>
        <input v-model="editingMember.contactNum" class="modal-input" />

        <label>Contact Person</label>
        <input v-model="editingMember.contactPerson" class="modal-input" />

        <label>Contact Person Number</label>
        <input v-model="editingMember.contactPersonNum" class="modal-input" />

        <label>Address</label>
        <input v-model="editingMember.address" class="modal-input" />

        <label>Gym ID</label>
        <input v-model="editingMember.gymId" class="modal-input" />

        <label>RFID</label>
        <input v-model="editingMember.rfid" class="modal-input" />

        <label>Assigned Trainer</label>
        <input v-model="editingMember.assignedTrainer" class="modal-input" />

        <label>Membership Type</label>
        <select v-model="editingMember.membershipStatus[0].category" class="modal-input">
          <option>Standard</option>
          <option>Standard Renewal</option>
          <option>New Member / Early Renew</option>
          <option>Classic (Student)</option>
          <option>Classic (Regular)</option>
          <option>Premium (Student)</option>
          <option>Premium (Regular)</option>
          <option>VIP (Student)</option>
          <option>VIP (Regular)</option>
        </select>

        <label>Start Date</label>
        <input
          v-model="editingMember.membershipStatus[0].startDate"
          type="date"
          class="modal-input"
        />

        <label>Expiry Date</label>
        <input
          v-model="editingMember.membershipStatus[0].expiryDate"
          type="date"
          class="modal-input"
        />

        <div class="modal-actions">
          <button class="btn edit" @click="saveEdit">Save</button>
          <button class="btn delete" @click="editingMember = null">Cancel</button>
        </div>

      </div>
    </div>

    <!-- DELETE MODAL -->

    <div class="modal-overlay" v-if="deletingMember" @click.self="deletingMember = null">
      <div class="modal">

        <h3>Delete Member?</h3>

        <p class="delete-msg">
          Are you sure you want to delete
          <span>{{ deletingMember.firstname }} {{ deletingMember.lastname }}</span> ?
        </p>

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

{
id:1,
firstname:"Abegail",
lastname:"Moyaen",
email:"abegail@email.com",
contactNum:"09123123123",
contactPerson:"Juan Moyaen",
contactPersonNum:"0912312312",
address:"General Luna",
gymId:"GYM001",
rfid:"RF001",
assignedTrainer:"Coach Mike",
membershipStatus:[
{
category:"Premium (Regular)",
branch:"General Luna",
startDate:"2025-05-01",
expiryDate:"2025-06-01",
remainingDays:30,
isActive:true
}
]
},

{
id:2,
firstname:"Jochelle",
lastname:"Maltu",
email:"jochelle@email.com",
contactNum:"091231234",
contactPerson:"Maria Maltu",
contactPersonNum:"0912312312",
address:"General Luna",
gymId:"GYM002",
rfid:"RF002",
assignedTrainer:"Coach Ken",
membershipStatus:[
{
category:"Standard",
branch:"General Luna",
startDate:"2025-03-01",
expiryDate:"2025-04-01",
remainingDays:30,
isActive:true
}
]
}

]

}
},

computed: {

filteredMembers(){
return this.members.filter(m=>
(m.firstname+" "+m.lastname).toLowerCase().includes(this.search.toLowerCase()) ||
m.membershipStatus[0]?.category.toLowerCase().includes(this.search.toLowerCase()) ||
m.contactNum.includes(this.search)
)
}

},

methods: {

initials(first,last){
return (first[0]+last[0]).toUpperCase()
},

viewMember(member){
this.selectedMember={...member}
},

editMember(member){
this.editingMember=JSON.parse(JSON.stringify(member))
},

saveEdit(){

const index=this.members.findIndex(m=>m.id===this.editingMember.id)

if(index!==-1){
this.members[index]={...this.editingMember}
}

this.editingMember=null
},

confirmDelete(){
this.members=this.members.filter(m=>m.id!==this.deletingMember.id)
this.deletingMember=null
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
}

.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  background-color:#2a2a2a;
  color:#aaa;
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
}

.btn.view {
  background-color: #481E14;
  color: #F2613F;
}

.btn.edit {
  background-color: #2a2a2a;
  color: #aaa;
}

.btn.delete {
  background-color: #1a1a1a;
  color: #c0392b;
  border: 1px solid #c0392b;
}

.no-results {
  text-align: center;
  color: #555;
  padding: 40px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  animation: fadeIn 0.2s ease;
}

.modal {
  background: #121212;
  border: 1px solid #2b2b2b;
  border-radius: 18px;
  padding: 28px 28px 24px 28px;

  width: 420px;
  max-height: 85vh;

  display: flex;
  flex-direction: column;
  gap: 14px;

  overflow-y: auto;

  box-shadow:
    0 10px 40px rgba(0,0,0,0.6),
    0 0 0 1px rgba(255,255,255,0.02);

  animation: modalPop 0.18s ease;
}

.modal h3 {
  margin: 0 0 10px 0;
  color: white;
  font-size: 20px;
  font-weight: 600;
}

.modal label {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}

.modal-input {
  padding: 11px 12px;
  border-radius: 10px;
  border: 1px solid #2a2a2a;
  background: #0C0C0C;
  color: white;
  font-size: 14px;

  transition: all 0.15s ease;
}

.modal-input:focus {
  outline: none;
  border-color: #F2613F;
  box-shadow: 0 0 0 2px rgba(242,97,63,0.15);
}

/* AVATAR */

.modal-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg,#9B3922,#F2613F);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: bold;
  color: white;
  margin: 0 auto 10px;
}

/* VIEW TEXT */

.modal p {
  margin: 2px 0;
  font-size: 14px;
  color: #ddd;
}

.modal p span {
  color: #888;
  margin-right: 6px;
}


.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 14px;
}


.btn {
  padding: 8px 16px;
  border-radius: 10px;
  border: none;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.15s ease;
}

.btn.edit {
  background: #F2613F;
  color: white;
}

.btn.edit:hover {
  background: #ff7b5a;
}


.btn.delete {
  background: transparent;
  border: 1px solid #444;
  color: #aaa;
}

.btn.delete:hover {
  background: #1f1f1f;
  border-color: #666;
}

.delete-msg {
  color: #bbb;
  font-size: 14px;
}

.delete-msg span {
  color: #F2613F;
  font-weight: 600;
}


.modal::-webkit-scrollbar {
  width: 6px;
}

.modal::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 4px;
}


@keyframes modalPop {
  from {
    transform: scale(0.92);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from { opacity:0 }
  to { opacity:1 }
}
</style>