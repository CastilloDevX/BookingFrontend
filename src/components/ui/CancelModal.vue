<script setup>
import { defineEmits } from 'vue';
import Button from '../Button.vue';

const emit = defineEmits(['close', 'cancel'])
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

const close = () => emit('close')
const cancel = () => emit('cancel')

</script>
<template>
    <!-- Cancel Booking modal -->
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10" @click="close">
        <div class="bg-white rounded-lg shadow-lg px-8 py-6 w-96 relative" @click.stop>
            <!-- Title -->
            <div class="text-2xl font-semibold text-center mb-4">{{ title }}</div>

            <!-- Description -->
            <div class="text-lg text-center mb-8">{{ description }}</div>

            <!-- Cancel and OK buttons -->
            <div class="flex flex-row justify-center gap-x-12">
                <Button
                    @click="close"
                    :text="'No cancelar'"
                ></Button>
                <Button
                    @click="cancel"
                    :text="'Sí, Cancelar'"
                    :color="'red'"
                ></Button>               
            </div>
        </div>
    </div>
</template>