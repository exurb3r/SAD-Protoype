<template>
  <div class="dashboard-container">

    <!-- Welcome Box -->
    <div class="welcome-box">
      <p class="welcome-text">Welcome back</p>
      <h2 class="welcome-name">Ewan ewan ewan</h2>
    </div>

    <!-- Stats Row -->
    <div class="stats-row">
      <div class="box">
        <p>Active Members</p>
        <h3>124</h3>
      </div>

      <div class="box">
        <p>New This Month</p>
        <h3>15</h3>
      </div>

      <div class="box">
        <p>Expiring Soon</p>
        <h3>8</h3>
      </div>

      <div class="box">
        <p>App Users</p>
        <h3>200</h3>
      </div>
    </div>

    <!-- Chart Box -->
    <div class="chart-box">
      Chart Section
    </div>

  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.dashboard-container {
  width: 100%;
}

.welcome-box {
  background: #1a1a1a;
  padding: 25px;
  border-radius: 16px;
  margin-bottom: 25px;
  border: 1px solid #481E14;
}

.welcome-text {
  color: #aaa;
  margin: 0 0 6px 0;
}

.welcome-name {
  color: white;
  margin: 0;
  font-size: 22px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 25px;
}

.box {
  background: #1a1a1a;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #481E14;
  transition: 0.2s ease;
}

.box:hover {
  transform: translateY(-4px);
  border-color: #9B3922;
  background-color: #1f1210;
}

.box p {
  color: #aaa;
  margin: 0 0 8px 0;
}

.box h3 {
  color: white;
  margin: 0;
  font-size: 22px;
}

.chart-box {
  background: #1a1a1a;
  height: 260px;
  border-radius: 16px;
  border: 1px solid #481E14;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
}
</style>