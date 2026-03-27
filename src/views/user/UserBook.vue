<script setup>
import { ref, onMounted, computed } from 'vue';
import { DatePicker } from 'primevue';
import { fetchData } from '@/utils/api';
import UserSidebar from '@/components/user/UserSidebar.vue';
import DayCalendar from '@/components/DayCalendar.vue';

// Spaces for our select element
const spaces = ref([])

const disabledDates = ref([0, 6])

// Returns an object with space.id as keys and an array of disponibility as values
const spacesDisponibility = computed(() => {
    return spaces.value.reduce((acc, space) => {
        acc[space.id] = [space.disponibility.start, space.disponibility.end]
        return acc
    },{})
})

// Values for the request
const selectedSpace = ref(0) // Holds the id of the space
const selectedDay = ref('')
const selectedSchedule = ref([])

const unavailableHours = ref([])

// Since we store selectedSpace as the index, a computed variable for the name is needed
const spaceName = computed(() => {
    const index = spaces.value.findIndex((space) => space.id === selectedSpace.value)
    return spaces.value[index].name
})

// Format the Date object obtained to String date
const selectedDayFormatted = computed(() => {
    const year = selectedDay.value.getFullYear();
    const month = (selectedDay.value.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-based
    const day = selectedDay.value.getDate().toString().padStart(2, '0'); // getDate() for the actual day

    const string = `${year}-${month}-${day}`;
    console.log(string);
    return string;
})

const showDayPicker = computed(() => selectedSpace.value !== 0) // True if a space has been selected
const showTimeCalendar = ref(false)
const showSubmitButton = ref(false)

const onSpaceChanged = () => {
    showTimeCalendar.value = false
    showSubmitButton.value = false
    selectedDay.value = ''
    selectedSchedule.value = []
    unavailableHours.value = []
}

const onDayChanged = async () => {
    showSubmitButton.value = false
    showTimeCalendar.value = false
    
    unavailableHours.value = []

    console.log(selectedDay.value)
    
    await fetchUnavailableHours()

    showTimeCalendar.value = true
}

const fetchUnavailableHours = async () => {
    try {
        const response = await fetchData(`bookings/hours?idSpace=${selectedSpace.value}&day=${selectedDayFormatted.value}`)
        
        // Converting to the event format that FullCalendar expects
        unavailableHours.value = Array.from(response, (element) => {
            return {
                title: '', 
                start: `${selectedDayFormatted.value}T${element.start_hour}`, 
                end: `${selectedDayFormatted.value}T${element.end_hour}`
            }
        })
    } catch (error) {

    }
}

const getHourSelection = (start, end) => {
    selectedSchedule.value = [start, end]
    showSubmitButton.value = true
}

const handleUnselection = () => {
    showSubmitButton.value = false
    selectedSchedule.value = []
}

const showSuccessModal = ref(false)


const fetchSpaces = async () => {
    try {
        spaces.value = await fetchData('spaces', 'GET')
    } catch (error) {
        console.error('Error fetching spaces', error)
    }
}

const closeShowSuccessModal = () => {
    showSubmitButton.value = false
    showTimeCalendar.value = false
    selectedSpace.value = 0
    showSuccessModal.value = false
}

const handleSubmit = async () => {
    const body = {
        id_space: selectedSpace.value,
        day: selectedDayFormatted.value,
        start_hour: selectedSchedule.value[0],
        end_hour: selectedSchedule.value[1]
    }

    try {
        const response = await fetchData('bookings', 'POST', body)

        showSuccessModal.value = true
    } catch (error) {
        console.log(error)
    }
}

onMounted( async () => {
    await fetchSpaces()
})
</script>

<template>
    <div class="flex flex-row">
        <!-- Sidebar -->
        <UserSidebar></UserSidebar>

        <!-- Main view -->
        <div class="flex flex-col pl-16 pt-12 gap-y-8 flex-1">
            <!-- Title -->
            <div class="text-3xl font-semibold">Reservar</div>

            <div class="flex justify-center w-full">
                <form @submit.prevent="handleSubmit" class="flex flex-row justify-center gap-x-20">
                    <!-- Choose a space -->
                    <div class="flex flex-col justify-around">
                        <div class="flex flex-col gap-y-8">
                            <div class="flex flex-col gap-y-4">
                                <span class="text-lg font-semibold">Espacio a reservar:</span>
                                <select v-model="selectedSpace" @change="onSpaceChanged"
                                    class="bg-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                                    required>
                                    <option value="" disabled selected hidden>Seleccionar</option>
                                    <option v-for="space in spaces" :key="space.id" :value="space.id">
                                        {{ space.name }}
                                    </option>
                                </select>
                            </div>
    
                            <!-- Date -->
                            <div v-if="showDayPicker" class="flex flex-row justify-between items-center gap-x-4">
                                <label class="text-md font-semibold">Fecha:</label>
                                <DatePicker
                                    v-model="selectedDay" 
                                    @update:modelValue="onDayChanged" 
                                    :min-date="new Date()" 
                                    :disabled-days="disabledDates"
                                    :manual-input="false"
                                />
                            </div>
                        </div>

                        <!-- Submit button -->
                        <button v-if="showSubmitButton" type="submit"
                            class="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all duration-200">
                            Reservar espacio
                        </button>
                    </div>

                    <!-- Calendar (hours) and the rest of components -->
                    <div v-if="showTimeCalendar" class="flex flex-col">
                        <div class="flex flex-col gap-y-4 max-w-fit">
                            <!-- Descriptive text -->
                            <span class="text-xl text-sky-600 font-semibold">
                                Arrastre el puntero para elegir el horario:
                            </span>

                            <!-- Calendar (hours) -->
                            <div class="w-[30vw] mx-auto">
                                <!-- :key attribute forces this component to re-renderize when the value changes -->
                                <DayCalendar 
                                    @select="getHourSelection"
                                    @unselect="handleUnselection"
                                    :key="selectedDayFormatted"
                                    :initial-date="selectedDayFormatted"
                                    :space-disponibility="spacesDisponibility[selectedSpace]"
                                    :events="unavailableHours"></DayCalendar>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Success submitting booking modal -->
    <div v-if="showSuccessModal" class="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50"
        @click="closeShowSuccessModal">
        <div class="flex flex-col gap-y-6 justify-stretch bg-white rounded-lg shadow-lg px-8 py-6 w-96 relative"
            @click.stop>
            <div class="flex flex-row items-center justify-center gap-x-4">
                <span class="pi pi-info-circle text-sky-600 font-semibold"></span>
                <span class="text-sky-600 text-lg font-semibold">Reserva exitosa</span>
            </div>
            <div class="text-md text-justify">
                Su reservación en el espacio {{ spaceName }} a las
                {{ selectedSchedule[0] }} horas con fecha {{ selectedDayFormatted }}
                ha sido agregada exitosamente.
            </div>
            <button @click="closeShowSuccessModal"
                class="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all duration-200">
                Aceptar
            </button>
        </div>
    </div>
</template>
