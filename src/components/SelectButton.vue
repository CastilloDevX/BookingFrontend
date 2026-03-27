<script setup>
import { ref, defineEmits } from "vue";
import SelectButton from 'primevue/selectbutton';

const options = ref([
  { label: "Reservaciones", value: "table" },
  { label: "Calendario", value: "calendar" },
]);

const emit = defineEmits(['change'])

const change = () => emit('change', selectedOption.value.value)

const selectedOption = ref(options.value[0])

</script>
<template>
    <SelectButton
      v-model="selectedOption"
      :options="options"
      optionLabel="label"
      class="shadow-lg"
      @change="change"
      :allowEmpty="false"
    />
</template>