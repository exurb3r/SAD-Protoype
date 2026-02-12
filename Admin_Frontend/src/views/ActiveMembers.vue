<template>
  <div class="page">
    <div class="header">
      <h1>Active Members</h1>
      <input placeholder="Search member..." />
    </div>

    <div class="filters">
      <select>
        <option>All Plans</option>
        <option>Monthly</option>
        <option>Annual</option>
      </select>
    </div>

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Plan</th>
          <th>Status</th>
          <th>Expiry</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>Juan Dela Cruz</td>
          <td>Monthly</td>
          <td class="active">Active</td>
          <td>2026-03-01</td>
          <td>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      Showing 1-10 of 124 members
    </div>
  </div>
</template>

<script>
import { members } from "../store/members"

export default {
  setup() {
    return { members }
  }
}
</script>


<style>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 12px;
  border-bottom: 1px solid #333;
}

th {
  text-align: left;
  color: #aaa;
}
</style>
