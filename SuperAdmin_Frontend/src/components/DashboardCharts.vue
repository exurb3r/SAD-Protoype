<template>
  <div style="display: flex; gap: 1.5rem; padding: 1rem;">
    <!-- Daily Logins Chart -->
    <div style="flex: 2; background: #1e1e1e; border-radius: 12px; padding: 1.5rem;">
      <h3 style="color: #fff; margin-bottom: 1rem;">Daily Logins</h3>
      <apexchart type="bar" :options="barOptions" :series="barSeries" height="280" />
    </div>

    <!-- Active Memberships Breakdown -->
    <div style="flex: 1; background: #1e1e1e; border-radius: 12px; padding: 1.5rem;">
      <h3 style="color: #fff; margin-bottom: 1rem;">Active Memberships</h3>
      <apexchart type="donut" :options="donutOptions" :series="donutSeries" height="280" />
    </div>
  </div>
</template>

<script setup>
const barSeries = [
  { name: "Member Logins", type: "bar",  data: [32, 28, 45, 38, 52, 60, 20] },
  { name: "Walk-in Guests", type: "line", data: [8, 5, 12, 9, 14, 18, 6] },
];

const barOptions = {
  chart: { background: "transparent", toolbar: { show: false } },
  colors: ["#e8531a", "#f28c5e"],
  xaxis: {
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    labels: { style: { colors: "#aaa" } }
  },
  yaxis: [
    {
      title: { text: "Logins", style: { color: "#aaa" } },
      labels: { style: { colors: "#aaa" } }
    },
    {
      opposite: true,
      title: { text: "Walk-ins", style: { color: "#f28c5e" } },
      labels: { style: { colors: "#f28c5e" } }
    },
  ],
  grid: { borderColor: "#333" },
  legend: { labels: { colors: "#fff" } },
  tooltip: { theme: "dark" },
  stroke: { width: [0, 2] },
};

const donutSeries = [74, 31, 19];
const donutOptions = {
  labels: ["Monthly", "Quarterly", "Annual"],
  colors: ["#e8531a", "#f28c5e", "#7a2e0e"],
  chart: { background: "transparent" },
  legend: { labels: { colors: "#fff" } },
  tooltip: { theme: "dark" },
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          total: {
            show: true,
            label: "Active",
            color: "#fff",
            formatter: () => "124"
          }
        }
      }
    }
  }
};
</script>