<template>
    <Transition name="modal-outer">
        <div v-show="modalActive"
            class="absolute z-10 w-full bg-black bg-opacity-50 h-screen top-0 left-0 flex justify-center px-8">
            <Transition name="modal-inner">
                <div v-if="modalActive"
                class="p-6 bg-white bg-opacity-90 border self-start mt-32 min-w-full rounded-md max-w-screen-md">
                <slot />
                <button @click="$emit('close-modal')" class="text-white bg-weather-primary py-2 px-6 rounded-lg">
                    Close
                </button>
            </div>
            </Transition>
        </div>
    </Transition>
</template>

<script setup lang="ts">
defineEmits(["close-modal"]);
defineProps({
    modalActive: {
        type: Boolean,
        default: false
    }
})
</script>

<style scoped>
.modal-outer-enter-active,
.modal-outer-leave-active {
    transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-outer-enter-from,
.modal-outer-leave-to {
    opacity: 0;
}

.modal-inner-enter-active {
    transition: all 0.3s cubic-bezier(0.53, 0.02, 0.19, 1.02) 0.15s;
}

.modal-inner-leave-active {
    transition: all 0.3s cubic-bezier(0.53, 0.02, 0.19, 1.02);
}
</style>