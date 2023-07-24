<script setup lang="ts">
import SiteNavigation from './components/SiteNavigation.vue';
import Footer from './components/Footer.vue';
import { useHead } from '@vueuse/head';

useHead({
  title: 'SWA: Simple Weather App',
  meta: [
    {
      name: 'description',
      content: 'This is a simple weather app'
    },
    {
      property: 'og:title',
      content: 'SWA: Simple Weather App'
    },
    {
      property: 'og:description',
      content: 'This is a simple weather app'
    }
  ]
})
</script>

<template>
  <div class="flex flex-col min-h-screen font-roboto bg-gradient-to-br from-weather-primary to-weather-secondary">
    <SiteNavigation />
    <RouterView />
    <Footer />
  </div>
</template>

<style scoped></style>
