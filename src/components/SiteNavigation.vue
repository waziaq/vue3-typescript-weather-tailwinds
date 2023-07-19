<template>
    <header class="sticky top-0">
        <nav class="container py-4 relative">
            <p class="gap-2 flex justify-center items-center text-sm text-white">
                <i class="fa-solid fa-location-arrow text-lg"></i>
                <span>Melaka, Malaysia</span>
            </p>
            <p class="absolute top-1/2 right-4 -translate-y-1/2 text-xs text-white space-x-4">
                <i class="fa-solid fa-pen-to-square"></i>
                <i @click="toggleModal" class="fa-solid fa-circle-info cursor-pointer"></i>
            </p>
        </nav>
        <BaseModal :modal-active="modalActive" @close-modal="toggleModal">
            <div class="text-black text-sm">
                <h1>Hy</h1>
            </div>
        </BaseModal>
    </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseModal from './BaseModal.vue';

const modalActive = ref(false);
const toggleModal = () => {
    modalActive.value = !modalActive.value;
}
</script>

<style scoped>

</style>