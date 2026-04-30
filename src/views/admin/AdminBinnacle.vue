<script setup>
import { ref, onMounted, watch } from 'vue';
import { Paginator } from 'primevue';
import { useRoute, useRouter } from 'vue-router';
import { fetchData } from '@/utils/api';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import BinnacleRow from '@/components/admin/BinnacleRow.vue';

const route = useRoute()
const router = useRouter()

const entries = ref([])
const first = ref(0)
const totalItems = ref(0)
const pageSize = 10
const loading = ref(false)
const errorMessage = ref('')

async function fetchBinnacle(page) {
    loading.value = true
    errorMessage.value = ''

    try {
        const response = await fetchData(`admin/binnacle?page=${page}`, 'GET')
        entries.value = response.content
        totalItems.value = response.page.totalElements
    } catch (error) {
        errorMessage.value = error.message || 'No fue posible cargar la bitácora'
    } finally {
        loading.value = false
    }
}

watch(first, async (newFirst) => {
    const page = Math.floor(newFirst / pageSize)
    await fetchBinnacle(page)
    router.replace({ query: { ...route.query, page: `${page + 1}` } })
})

onMounted(async () => {
    const page = Math.max(parseInt(route.query.page || '1') - 1, 0)
    first.value = page * pageSize
    await fetchBinnacle(page)

    if (!route.query.page) {
        router.replace({ query: { ...route.query, page: '1' } })
    }
})
</script>

<template>
    <div class="flex flex-row">
        <AdminSidebar></AdminSidebar>

        <div class="flex flex-col flex-1 px-16 pt-12 gap-y-8 overflow-auto">
            <div class="flex flex-col gap-y-2">
                <div class="text-3xl font-semibold">Bitácora de Solicitudes</div>
                <div class="text-gray-600">Últimas 50 solicitudes registradas por el backend</div>
            </div>

            <div class="flex flex-col">
                <div class="flex flex-row mx-auto bg-sky-300 text-gray-800 font-semibold border border-sky-600 text-sm">
                    <div class="px-3 py-3 w-44 border-r border-sky-600 text-center">Fecha</div>
                    <div class="px-3 py-3 w-28 border-r border-sky-600 text-center">Método</div>
                    <div class="px-3 py-3 w-64 border-r border-sky-600 text-center">Endpoint</div>
                    <div class="px-3 py-3 w-72 border-r border-sky-600 text-center">Usuario</div>
                    <div class="px-3 py-3 w-36 border-r border-sky-600 text-center">IP</div>
                    <div class="px-3 py-3 w-28 text-center">Código</div>
                </div>

                <div v-if="loading" class="mx-auto px-4 py-6 text-gray-600">
                    Cargando bitácora...
                </div>

                <div v-else-if="errorMessage" class="mx-auto px-4 py-6 text-red-600 font-semibold">
                    {{ errorMessage }}
                </div>

                <div v-else-if="entries.length === 0" class="mx-auto px-4 py-6 text-gray-600">
                    No hay solicitudes registradas.
                </div>

                <BinnacleRow
                    v-else
                    v-for="(entry, index) in entries"
                    :key="entry.id"
                    :entry="entry"
                    :index="index"
                    class="mx-auto"
                />
            </div>

            <Paginator
                v-model:first="first"
                :rows="pageSize"
                :total-records="totalItems">
            </Paginator>
        </div>
    </div>
</template>
