

<template>
  <div class="layout">
    <SideBar />
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import SideBar from './components/SideBar.vue'

export default {
  components: { SideBar }
}
</script>

<style>
body {
  margin: 0;
}

.layout {
  display: flex;
  height: 100vh;
}

.main-content {
  flex: 1;
  background-color: #111;
  color: white;
  padding: 30px;
  overflow-y: auto;
}
</style>
