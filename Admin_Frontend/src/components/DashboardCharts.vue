<template>
  <div style="display: flex; gap: 1.5rem; padding: 1rem;">
    <!-- Attendance & Revenue Chart -->
    <div style="flex: 2; background: #1e1e1e; border-radius: 12px; padding: 1.5rem;">
      <h3 style="color: #fff; margin-bottom: 1rem;">Attendance & Revenue</h3>
      <apexchart type="bar" :options="barOptions" :series="barSeries" height="280" />
    </div>

    <!-- Membership Breakdown -->
    <div style="flex: 1; background: #1e1e1e; border-radius: 12px; padding: 1.5rem;">
      <h3 style="color: #fff; margin-bottom: 1rem;">Membership Types</h3>
      <apexchart type="donut" :options="donutOptions" :series="donutSeries" height="280" />
    </div>
  </div>
</template>

<script setup>
const barSeries = [
  { name: "Attendance", type: "bar",  data: [32, 28, 45, 38, 52, 60, 20] },
  { name: "Revenue (₱)", type: "line", data: [4800, 4200, 6750, 5700, 7800, 9000, 3000] },
];

  const barOptions = {
  chart: { background: "transparent", toolbar: { show: false } },
  grid: { padding: { right: 20 } },
  colors: ["#e8531a", "#f28c5e"],
  xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], labels: { style: { colors: "#aaa" } } },
  yaxis: [
    { labels: { style: { colors: "#aaa" } } },
    { opposite: true, labels: { style: { colors: "#f28c5e" } } },
  ],
  grid: { borderColor: "#333" },
  legend: { labels: { colors: "#fff" } },
  tooltip: { theme: "dark" },
  stroke: { width: [0, 2] },
};

const donutSeries = [60, 25, 15];
const donutOptions = {
  labels: ["Monthly", "Quarterly", "Annual"],
  colors: ["#e8531a", "#f28c5e", "#7a2e0e"],
  chart: { background: "transparent" },
  legend: { labels: { colors: "#fff" } },
  tooltip: { theme: "dark" },
};
</script>