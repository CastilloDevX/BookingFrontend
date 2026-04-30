<script setup>
import { computed, onMounted, ref } from 'vue';
import { fetchData } from '@/utils/api';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import Button from '@/components/Button.vue';

const users = ref([])
const selectedUserId = ref('')
const loadingUsers = ref(false)
const submitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const selectedUser = computed(() => {
    return users.value.find((user) => user.id === parseInt(selectedUserId.value))
})

async function fetchUsers() {
    loadingUsers.value = true
    errorMessage.value = ''

    try {
        users.value = await fetchData('admin/users', 'GET')
    } catch (error) {
        errorMessage.value = error.message || 'No fue posible cargar los usuarios'
    } finally {
        loadingUsers.value = false
    }
}

async function seedBookings() {
    if (!selectedUserId.value || submitting.value) {
        return
    }

    submitting.value = true
    errorMessage.value = ''
    successMessage.value = ''

    try {
        const response = await fetchData('admin/seed/bookings', 'POST', {
            user_id: parseInt(selectedUserId.value)
        })
        successMessage.value = response.message
    } catch (error) {
        errorMessage.value = error.message || 'No fue posible crear las reservaciones falsas'
    } finally {
        submitting.value = false
    }
}

onMounted(fetchUsers)
</script>

<template>
    <div class="flex flex-row">
        <AdminSidebar></AdminSidebar>

        <div class="flex flex-col flex-1 px-16 pt-12 gap-y-8">
            <div class="flex flex-col gap-y-2">
                <div class="text-3xl font-semibold">Seed de Reservaciones</div>
                <div class="text-gray-600">Crear 100 reservaciones falsas para un usuario seleccionado</div>
            </div>

            <div class="flex flex-col gap-y-6 max-w-3xl">
                <div class="flex flex-col gap-y-2">
                    <label for="seed-user" class="font-semibold text-gray-800">Usuario</label>
                    <select
                        id="seed-user"
                        v-model="selectedUserId"
                        class="border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-4 focus:ring-sky-200"
                        :disabled="loadingUsers || submitting"
                    >
                        <option value="" disabled>Selecciona un usuario</option>
                        <option
                            v-for="user in users"
                            :key="user.id"
                            :value="user.id"
                        >
                            {{ user.name }} - {{ user.email }} ({{ user.role }})
                        </option>
                    </select>
                </div>

                <div v-if="selectedUser" class="flex flex-col bg-gray-100 border border-gray-300 rounded-xl px-5 py-4 gap-y-1">
                    <div class="font-semibold text-gray-800">{{ selectedUser.name }}</div>
                    <div class="text-gray-600">{{ selectedUser.email }}</div>
                    <div class="text-gray-600">Rol: {{ selectedUser.role }}</div>
                </div>

                <div class="flex items-center gap-x-4">
                    <Button
                        :text="submitting ? 'Creando...' : 'Crear 100 Reservaciones'"
                        :color="'green'"
                        :font-size="'xl'"
                        @click="seedBookings"
                    ></Button>

                    <div v-if="loadingUsers" class="text-gray-600">Cargando usuarios...</div>
                </div>

                <div v-if="errorMessage" class="text-red-600 font-semibold">
                    {{ errorMessage }}
                </div>

                <div v-if="successMessage" class="text-green-700 font-semibold">
                    {{ successMessage }}
                </div>
            </div>
        </div>
    </div>
</template>
