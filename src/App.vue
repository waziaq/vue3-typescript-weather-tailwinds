<script setup lang="ts">
import SiteNavigation from './components/SiteNavigation.vue';
</script>

<template>
  <div class="flex flex-col min-h-screen font-roboto bg-gradient-to-br from-weather-primary to-weather-secondary">
    <SiteNavigation />
    <RouterView />
  </div>
</template>

<style scoped></style>
