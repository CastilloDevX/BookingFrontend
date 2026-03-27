<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
    bookId: Number,
    bookSpace: String,
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
        <div class="px-4 py-2 w-40 border-r border-gray-300 text-center">{{ props.bookId }}</div>
        <div class="px-4 py-2 w-56 border-r border-gray-300 text-center">{{ props.bookSpace }}</div>
        <div class="px-4 py-2 w-52 border-r border-gray-300 text-center">{{ props.bookDate }}</div>
        <div class="px-4 py-2 w-52 text-center">{{ props.bookSchedule }}</div>
    </div>
</template>
