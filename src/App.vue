<script setup lang="ts">
import SiteNavigation from './components/SiteNavigation.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <div class="flex flex-col min-h-screen font-roboto bg-gradient-to-br from-weather-primary to-weather-secondary">
    <SiteNavigation />
    <RouterView />
    <Footer />
  </div>
</template>

<style scoped></style>
