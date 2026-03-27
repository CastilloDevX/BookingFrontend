<script setup>
import { ref, onMounted, computed } from 'vue';
import { fetchData } from '@/utils/api';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import SpaceRow from '@/components/admin/SpaceRow.vue';
import Button from '@/components/Button.vue';

// Spaces we're gonna be fetching
const spaces = ref([])

// For opening/closing our 'add space' modal
const openAddSpace = ref(false)

// For opening/closing our 'delete space' modal
const openDeleteSpace = ref(false)

// Selected space for its deletion
const selectedSpaceId = ref(null)

const toggleAddModal = () => {
    openAddSpace.value = true
}

const closeAddModal = () => {
    openAddSpace.value = false
}

const toggleDeleteModal = (id) => {
    selectedSpaceId.value = id
    openDeleteSpace.value = true
}

const closeDeleteModal = () => {
    openDeleteSpace.value = false
    selectedSpaceId.value = null
}


// Generates lists for disponibility hours 
const selectedStartHour = ref(0)
const availableStartHours = ref(Array.from({length: 14}, (_, i) => `${String(i + 7).padStart(2, '0')}:00`))
const availableEndHours = ref(Array.from({length: 14 - selectedStartHour.value}, (_, i) => `${String(i + selectedStartHour.value + 8).padStart(2, '0')}:00`))
const updateSelectedStartHour = (event) => { 
    selectedStartHour.value = event.target.selectedIndex
    availableEndHours.value = Array.from({length: 14 - selectedStartHour.value}, (_, i) => `${String(i + selectedStartHour.value + 8).padStart(2, '0')}:00`)
    form.value.disponibility.to = availableEndHours.value[0]
}


const form = ref({
    name: '',
    description: '',
    capacity: 1,
    disponibility: {
        from: availableStartHours.value[0],
        to: availableEndHours.value[0]
    }
})

const handleSubmit = async () => {
    const newSpace = {
        name: form.value.name,
        description: form.value.description,
        capacity: form.value.capacity,
        disponibility_start: form.value.disponibility.from,
        disponibility_end: form.value.disponibility.to
    }

    try {
        const response = await fetchData('spaces', 'POST', newSpace)
        
        await fetchSpaces() // Refresh the list after adding a space
        closeAddModal() // Close the modal
    } catch (error) {
        console.error('Error posting new space', error);
    }
}

const deleteSpace = async (id) => {
    try {
        const response = await fetchData(`spaces/${id}`, 'DELETE')

        // Close the modal
        closeDeleteModal()

        // Fetch updated spaces list
        await fetchSpaces();
    } catch (error) {
        console.error(`Error deleting space with id ${id}`, error)
    }
}

const fetchSpaces = async () => {
    try {
        spaces.value = await fetchData('spaces', 'GET')
    } catch (error) {
        console.error('Error fetching spaces', error)
    }
}

// Fetch spaces when the component is mounted
onMounted(fetchSpaces);
</script>

<template>
    <div class="flex flex-row h-[calc(100vh-10rem)]">
        <!-- Sidebar -->
        <AdminSidebar></AdminSidebar>

        <!-- Main view -->
        <div class="flex flex-col flex-1 px-16 pt-12 gap-y-8 overflow-auto">
            <!-- Title -->
            <div class="text-3xl font-semibold">Espacios</div>

            <!-- Table -->
            <div class="flex flex-col mx-auto relative">
                <!-- Table header -->
                <div class="flex flex-row bg-sky-300 text-gray-800 font-semibold border border-sky-600">
                    <div class="px-4 py-3 w-44 border-r border-sky-600 text-center">Nombre</div>
                    <div class="px-4 py-3 w-60 border-r border-sky-600 text-center">Descripción</div>
                    <div class="px-4 py-3 w-32 border-r border-sky-600 text-center">Capacidad</div>
                    <div class="px-4 py-3 w-48 border-r border-sky-600 text-center">Disponibilidad</div>
                </div>

                <!-- Table contents -->
                <div
                    v-for="(space, index) in spaces"
                    :key="space.id"
                    class="flex flex-row gap-x-8 relative"
                >
                    <SpaceRow
                        :space-name="space.name"
                        :space-description="space.description"
                        :space-capacity="space.capacity"
                        :space-disponibility="`${space.disponibility.start} - ${space.disponibility.end}`"
                        :index="index"
                        class="relative"
                    />
                    <button
                        @click="toggleDeleteModal(space.id)"
                        class="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-2
                        rounded-lg shadow-md transition-all duration-200 flex items-center gap-2 
                        absolute -right-12"
                    >
                        <i class="pi pi-trash text-white text-lg"></i>
                    </button>
                </div>

                <!-- Add button outside the loop -->
                <div v-if="spaces.length > 0" class="mt-4 flex justify-end">
                    <Button @click="toggleAddModal" text="Añadir"></Button>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Space modal -->
    <div v-if="openAddSpace" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" @click="closeAddModal">
        <div class="bg-white rounded-lg shadow-lg px-8 py-6 w-96 relative" @click.stop>
            <!-- Close button -->
            <button @click="closeAddModal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
                ✖
            </button>

            <!-- Title -->
            <div class="text-2xl font-semibold text-center mb-4">Añadir un espacio</div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="flex flex-col gap-y-4">
                <div class="flex flex-col">
                    <label for="name" class="font-medium">Nombre:</label>
                    <input v-model="form.name" type="text" id="name" name="name" class="bg-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none" required>
                </div>

                <div class="flex flex-col">
                    <label for="description" class="font-medium">Descripción:</label>
                    <input v-model="form.description" type="text" id="description" name="description" class="bg-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none" required>
                </div>

                <div class="flex flex-col">
                    <label for="capacity" class="font-medium">Capacidad:</label>
                    <input v-model="form.capacity" type="number" id="capacity" name="capacity" min="1" max="200" class="bg-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none" required>
                </div>

                <div class="flex flex-col">
                    <span class="font-medium">Disponibilidad:</span>
                    <div class="flex items-center gap-x-2">
                        <label for="from">De:</label>
                        <select v-model="form.disponibility.from" @change="updateSelectedStartHour" id="from" name="from" class="bg-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none">
                            <option v-for="(hour, index) in availableStartHours" :key="index">{{ hour }}</option>
                        </select>
                        <label for="to">A:</label>
                        <select v-model="form.disponibility.to" id="to" name="to" class="bg-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none">
                            <option v-for="(hour, index) in availableEndHours" :key="index">{{ hour }}</option>
                        </select>
                    </div>
                </div>

                <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all duration-200">
                    Añadir espacio
                </button>
            </form>
        </div>
    </div>

    <!-- Delete Space modal -->
    <div v-if="openDeleteSpace" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" @click="closeDeleteModal">
        <div class="bg-white rounded-lg shadow-lg px-8 py-6 w-96 relative" @click.stop>
            <!-- Title -->
            <div class="text-2xl font-semibold text-center mb-4">Eliminar espacio</div>

            <!-- Description -->
            <div class="text-lg text-center mb-8">¿Estás seguro que quieres eliminar este espacio?</div>

            <!-- Cancel and OK buttons -->
            <div class="flex flex-row justify-center gap-x-12">
                <Button
                    @click="closeDeleteModal"
                    :text="'Cancelar'"
                ></Button>
                <Button
                    @click="deleteSpace(selectedSpaceId)"
                    :text="'Aceptar'"
                    :color="'red'"
                ></Button>
            </div>
        </div>
    </div>
</template>