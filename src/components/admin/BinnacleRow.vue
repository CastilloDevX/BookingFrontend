<script setup>
import { computed } from 'vue';

const props = defineProps({
    entry: Object,
    index: Number
})

const isEven = computed(() => props.index % 2 === 0)
const responseClass = computed(() => {
    const code = props.entry?.response_code || 0
    if (code >= 500) return 'text-red-700 font-semibold'
    if (code >= 400) return 'text-orange-700 font-semibold'
    if (code >= 300) return 'text-sky-700 font-semibold'
    return 'text-green-700 font-semibold'
})
</script>

<template>
    <div
        class="flex flex-row border border-gray-300 text-sm"
        :class="isEven ? 'bg-gray-100' : 'bg-white'"
    >
        <div class="px-3 py-2 w-44 border-r border-gray-300 text-center">{{ props.entry.created_at_utc }}</div>
        <div class="px-3 py-2 w-28 border-r border-gray-300 text-center">{{ props.entry.method }}</div>
        <div class="px-3 py-2 w-64 border-r border-gray-300 break-words">{{ props.entry.endpoint }}</div>
        <div class="px-3 py-2 w-72 border-r border-gray-300 break-words">{{ props.entry.user_name }}</div>
        <div class="px-3 py-2 w-36 border-r border-gray-300 text-center">{{ props.entry.ip_address }}</div>
        <div class="px-3 py-2 w-28 text-center" :class="responseClass">{{ props.entry.response_code }}</div>
    </div>
</template>
