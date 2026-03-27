<script setup>
import { computed } from 'vue';

defineEmits(['click'])

const props = defineProps({
    text: String,
    to: String,
    fontSize: {
        type: String,
        default: 'xl'
    },
    color: {
        type: String,
        default: 'sky'
    }
})

const colorClasses = {
    sky: 'from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 focus:ring-sky-300 border-sky-600',
    blue: 'from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 focus:ring-blue-300 border-blue-600',
    red: 'from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 focus:ring-red-300 border-red-600',
    green: 'from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 focus:ring-green-300 border-green-600',
}

const buttonClasses = computed(() => [
    `bg-gradient-to-r ${colorClasses[props.color] || colorClasses.sky}`,
    `focus:ring-4 focus:outline-none rounded-xl sm:px-5 px-4 py-2`,
    `text-white text-center me-2 mb-2 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105`,
    `text-${props.fontSize}`
])
</script>

<template>
    <button v-if="!to" @click="$emit('click')" :class="buttonClasses">
        {{ text }}
    </button>

    <RouterLink v-else @click="$emit('click')" :to="to" :class="buttonClasses">
        {{ text }}
    </RouterLink>
</template>
