<script setup>
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import SelectButton from 'primevue/selectbutton';

const router = useRouter()
const route = useRoute()

const options = ref([
  { label: "Reservaciones", value: "user-bookings-table" },
  { label: "Calendario", value: "user-bookings-calendar" },
]);

const selectedOption = ref(options.value[0]);

const navigate = () => {
  router.push({ name: selectedOption.value.value});
};

watch(route, () => {
  if (route.path == "/user/bookings") {
    selectedOption.value = options.value[0]
  }
})

onMounted(() => {
  if (route.path == "/user/bookings/calendar") {
    selectedOption.value = options.value[1]
  }
})
</script>

<template>
  <div class="self-end top-4 right-4">
    <SelectButton
      v-model="selectedOption"
      :options="options"
      optionLabel="label"
      @change="navigate"
      class="shadow-lg"
      :allowEmpty="false"
    />
  </div>
</template>