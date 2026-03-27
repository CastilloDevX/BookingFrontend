<script setup>
import Button from '@/components/Button.vue';
</script>

<template>
    <section class="text-center flex flex-col justify-center items-center gap-y-4 h-96">
        <i
            class="pi pi-exclamation-triangle text-yellow-500 text-7xl">
        </i>
        <div class="text-6xl font-bold">
            Error 404
        </div>
        <div class="text-xl">
            El recurso solicitado no existe.
        </div>
        <Button :to="'/'" :text="'Volver'" :font-size="'xl'">
        </Button>
    </section>
</template>

<style scoped>
.pi {
    font-size: 5rem; /* Adjust as needed */
}
</style>
