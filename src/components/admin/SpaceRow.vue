<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
    spaceName: String,
    spaceDescription: String,
    spaceCapacity: Number,
    spaceDisponibility: String,
    index: Number // For alternating row colors
})

const isEven = computed(() => props.index % 2 === 0)
</script>

<template>
    <div 
        class="flex flex-row border border-gray-300"
        :class="isEven ? 'bg-gray-100' : 'bg-white'"
    >
        <div class="px-4 py-2 w-44 border-r border-gray-300 text-center">{{ props.spaceName }}</div>
        <div class="px-4 py-2 w-60 border-r border-gray-300 text-center">{{ props.spaceDescription }}</div>
        <div class="px-4 py-2 w-32 border-r border-gray-300 text-center">{{ props.spaceCapacity }}</div>
        <div class="px-4 py-2 w-48 text-center">{{ props.spaceDisponibility }}</div>
    </div>
</template>