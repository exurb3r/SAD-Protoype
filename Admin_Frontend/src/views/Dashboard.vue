<template>
  <div>
    <h1>Dashboard</h1>

    <div class="cards">
      <div class="card">
        <h3>Active Members</h3>
        <p>103020302</p>
      </div>

      <div class="card">
        <h3>New This Month</h3>
        <p>15</p>
      </div>

      <div class="card">
        <h3>Expiring Soon</h3>
        <p>213</p>
      </div>

      <div class="card">
        <h3>App Users</h3>
        <p>200</p>
      </div>
    </div>
  </div>
</template>

<script>

</script>


<style>
.cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.card {
  background-color: #1c1c1c;
  padding: 20px;
  border-radius: 10px;
}

.card h3 {
  margin-bottom: 10px;
  color: #aaa;
}

.card p {
  font-size: 24px;
  font-weight: bold;
}
</style>
