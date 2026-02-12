<template>
  <div class="form-page">
    <h1>Add Membership</h1>

    <div class="form-section">
      <h3>Member Information</h3>
      <input placeholder="Full Name" />
      <input placeholder="Email" />
      <input placeholder="Contact Number" />
    </div>

    <div class="form-section">
      <h3>Membership Details</h3>
      <select>
        <option>Monthly</option>
        <option>Quarterly</option>
        <option>Annual</option>
      </select>
      <input type="date" />
    </div>

    <div class="form-section">
      <h3>Payment Information</h3>
      <select>
        <option>Cash</option>
        <option>GCash</option>
        <option>Credit Card</option>
      </select>
      <input placeholder="Amount Paid" />
    </div>

    <button class="submit-btn">Create Membership</button>
  </div>
</template>


<script>
import { ref } from "vue"
import { members } from "../store/members"

export default {
  setup() {
    const name = ref("")
    const plan = ref("")
    const expiry = ref("")

    const addMember = () => {
      members.push({
        id: Date.now(),
        name: name.value,
        plan: plan.value,
        status: "Active",
        expiry: expiry.value
      })

      name.value = ""
      plan.value = ""
      expiry.value = ""
    }

    return { name, plan, expiry, addMember }
  }
}
</script>


<style>
input {
  display: block;
  margin: 10px 0;
  padding: 10px;
  width: 300px;
}

button {
  padding: 10px 20px;
  background: orange;
  border: none;
  cursor: pointer;
}
</style>
