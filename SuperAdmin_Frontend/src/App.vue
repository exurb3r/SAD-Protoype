<template>
  <router-view />
</template>

<script>
  import AppLayout from './layout/AppLayout.vue';
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
  align-items: stretch;
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