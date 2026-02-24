<template>
  <div class="layout">
    <SideBar />
    <div class="main">
      <TopBar />
      <div class="page-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from './components/SideBar.vue'
import TopBar from './components/TopBar.vue'

export default {
  components: { SideBar, TopBar }
}
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.layout {
  display: flex;
  min-height: 100vh;
   background: #0C0C0C;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.page-content {
  padding: 30px;
  flex: 1;
}
</style>