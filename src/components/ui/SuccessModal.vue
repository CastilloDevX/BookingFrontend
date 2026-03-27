<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['close'])

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

const close = () => emit('close')

</script>
<template>
    <!-- Success submitting booking modal -->
    <div class="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50"
        @click="close">
        <div class="flex flex-col gap-y-6 justify-stretch bg-white rounded-lg shadow-lg px-8 py-6 w-96 relative"
            @click.stop>
            <div class="flex flex-row items-center justify-center gap-x-4">
                <span class="pi pi-info-circle text-sky-600 font-semibold"></span>
                <span class="text-sky-600 text-lg font-semibold">{{ title }}</span>
            </div>
            <div class="text-md text-justify">
                {{ message }}
                <!-- Su reservación en el espacio {{ spaceName }} a las
                {{ selectedSchedule[0] }} horas con fecha {{ selectedDayFormatted }}
                ha sido reescrita en el registro exitosamente. -->
            </div>
            <button @click="close"
                class="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all duration-200">
                Aceptar
            </button>
        </div>
    </div>
</template>