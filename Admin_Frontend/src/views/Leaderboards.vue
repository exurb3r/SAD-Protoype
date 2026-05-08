<template>
  <div class="leaderboard-admin">

    <!-- Header -->
    <div class="header">
      <div>
        <h2>Leaderboard Management</h2>
        <p>View rankings by category and timeframe</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters">
      <select v-model="selectedBoard" @change="fetchLeaderboard">
        <option v-for="b in boardsConfig" :key="b.key" :value="b.key">
          {{ b.label }}
        </option>
      </select>

      <select v-model="selectedRange" @change="fetchLeaderboard">
        <option value="all">All Time</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </select>

      <input type="date" v-model="startDate" @change="fetchLeaderboard" />
      <input type="date" v-model="endDate" @change="fetchLeaderboard" />

      <input
        type="text"
        v-model="search"
        placeholder="Search user..."
      />
    </div>

    <!-- Table -->
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th @click="sortBy('username')">Username</th>
            <th @click="sortBy('score')">Score</th>
            <th @click="sortBy('date')">Date Achieved</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(user, index) in filteredLeaderboard" :key="index">
            <td>
              <span v-if="index === 0">①</span>
              <span v-else-if="index === 1">②</span>
              <span v-else-if="index === 2">③</span>
              <span v-else>#{{ index + 1 }}</span>
            </td>

            <td>{{ user.username }}</td>

            <td>
              {{ formatScore(user) }}
              <span v-if="currentUnit"> {{ currentUnit }}</span>
            </td>

            <td>{{ formatDate(user.date) }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredLeaderboard.length === 0">
        No leaderboard data found
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "AdminLeaderboard",

  data() {
    return {
      leaderboard: [
        { username: "IronMike", level: 25, exp: 12000, streak: 15, workouts: 80, date: "2026-05-01" },
        { username: "FitQueen", level: 30, exp: 15000, streak: 22, workouts: 95, date: "2026-05-03" },
        { username: "BeastMode", level: 20, exp: 9800, streak: 10, workouts: 70, date: "2026-04-28" },
        { username: "GymRat", level: 18, exp: 8700, streak: 8, workouts: 60, date: "2026-04-25" },
        { username: "PowerLift", level: 35, exp: 20000, streak: 30, workouts: 120, date: "2026-05-05" },
        { username: "CardioKing", level: 22, exp: 11000, streak: 12, workouts: 85, date: "2026-05-02" },
        { username: "FlexMaster", level: 28, exp: 14000, streak: 18, workouts: 90, date: "2026-05-04" }
      ],
      search: "",
      selectedBoard: "topLevel",
      selectedRange: "all",
      startDate: "",
      endDate: "",
      sortKey: "score",
      sortOrder: "desc",

      boardsConfig: [
        { key: "topLevel", label: "Top Level", unit: "lvl" },
        { key: "topExp", label: "Top EXP", unit: "xp" },
        { key: "topStreak", label: "Top Streak", unit: "days" },
        { key: "topWorkouts", label: "Most Workouts", unit: "" },
      ],
    };
  },

  computed: {
    currentUnit() {
      return this.boardsConfig.find(b => b.key === this.selectedBoard)?.unit;
    },

    filteredLeaderboard() {
      let data = [...this.leaderboard];

      if (this.search) {
        data = data.filter(u =>
          u.username.toLowerCase().includes(this.search.toLowerCase())
        );
      }

      data.sort((a, b) => {
        let valA = this.getScoreValue(a);
        let valB = this.getScoreValue(b);

        if (this.sortOrder === "asc") return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
      });

      return data;
    },
  },

  methods: {
    fetchLeaderboard() {
      const dummy = [
        { username: "IronMike", level: 25, exp: 12000, streak: 15, workouts: 80, date: "2026-05-01" },
        { username: "FitQueen", level: 30, exp: 15000, streak: 22, workouts: 95, date: "2026-05-03" },
        { username: "BeastMode", level: 20, exp: 9800, streak: 10, workouts: 70, date: "2026-04-28" },
        { username: "GymRat", level: 18, exp: 8700, streak: 8, workouts: 60, date: "2026-04-25" },
        { username: "PowerLift", level: 35, exp: 20000, streak: 30, workouts: 120, date: "2026-05-05" },
        { username: "CardioKing", level: 22, exp: 11000, streak: 12, workouts: 85, date: "2026-05-02" },
        { username: "FlexMaster", level: 28, exp: 14000, streak: 18, workouts: 90, date: "2026-05-04" }
      ];

      this.leaderboard = dummy;
    },

    sortBy(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
      } else {
        this.sortKey = key;
        this.sortOrder = "desc";
      }
    },

    getScoreValue(user) {
      switch (this.selectedBoard) {
        case "topLevel":
          return user.level || 0;
        case "topExp":
          return user.exp || 0;
        case "topStreak":
          return user.streak || 0;
        case "topWorkouts":
          return user.workouts || 0;
        default:
          return 0;
      }
    },

    formatScore(user) {
      return this.getScoreValue(user).toLocaleString();
    },

    formatDate(date) {
      if (!date) return "-";
      return new Date(date).toLocaleDateString();
    },
  },

  mounted() {
    this.fetchLeaderboard();
  },
};
</script>

<style scoped>
.leaderboard-admin {
  width: 100%;
  color: #ddd;
}


.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.header h2 {
  color: white;
  margin: 0;
  font-size: 20px;
}

.header p {
  margin: 2px 0 0;
  font-size: 13px;
  color: #888;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filters input,
.filters select {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #481E14;
  background: #1a1a1a;
  color: white;
  font-size: 13px;
  outline: none;
  transition: 0.2s;
}

.filters input:focus,
.filters select:focus {
  border-color: #F2613F;
}

.table-wrap {
  background: #111;
  border: 1px solid #481E14;
  border-radius: 14px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

thead th {
  background: #1a1a1a;
  color: #aaa;
  font-weight: 500;
  padding: 12px 16px;
  border-bottom: 1px solid #481E14;
  text-align: left;
  cursor: pointer;
  user-select: none;
}

tbody tr {
  border-bottom: 0.5px solid #2a1a14;
  transition: background 0.15s;
}

tbody tr:hover {
  background: #1f1010;
}

tbody tr:last-child {
  border-bottom: none;
}

td {
  padding: 12px 16px;
  color: #ccc;
  vertical-align: middle;
}


td:first-child {
  font-weight: 600;
  color: white;
}

tbody tr:nth-child(1) td:first-child {
  color: gold;
}

tbody tr:nth-child(2) td:first-child {
  color: silver;
}

tbody tr:nth-child(3) td:first-child {
  color: #cd7f32;
}

/* Score */
td:nth-child(3) {
  color: #F2613F;
  font-weight: 500;
}

/* No results */
.table-wrap > div {
  text-align: center;
  color: #555;
  padding: 60px;
  background: #1a1a1a;
}
</style>