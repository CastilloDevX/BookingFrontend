<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
    bookNumber: Number,
    bookSpace: String,
    bookUser: String,
    bookDate: String,
    bookSchedule: String,
    index: Number // For alternating row colors
})

const isEven = computed(() => props.index % 2 === 0)
</script>

<template>
    <div 
        class="flex flex-row border border-gray-300"
        :class="isEven ? 'bg-gray-100' : 'bg-white'"
    >
        <div class="px-4 py-2 w-24 border-r border-gray-300 text-center">{{ props.bookNumber }}</div>
        <div class="px-4 py-2 w-28 border-r border-gray-300 text-center">{{ props.bookSpace }}</div>
        <div class="px-4 py-2 w-32 border-r border-gray-300 text-center">{{ props.bookUser }}</div>
        <div class="px-4 py-2 w-32 border-r border-gray-300 text-center">{{ props.bookDate }}</div>
        <div class="px-4 py-2 w-36 text-center">{{ props.bookSchedule }}</div>
    </div>
</template>
