<script setup>
import { ref, onMounted } from 'vue';
import { fetchData } from '@/utils/api';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import FullCalendar from '@/components/FullCalendar.vue';
import BookRow from '@/components/admin/BookRow.vue';

const selectedDate = ref('')
const bookings = ref([])

async function fetchBookings(day){
    if (day == selectedDate.value) {
        return
    }

    try {
        bookings.value = await fetchData(`bookings/day/${day}`, 'GET')
        selectedDate.value = day
    } catch(error) {

    }
}

onMounted(async () => {
    const now = new Date();  
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const date = `${year}-${month}-${day}`

    await fetchBookings(date) 
})

</script>
    <template>
        <div class="flex flex-row h-[calc(100vh-10rem)]">
            <!-- Sidebar -->
            <AdminSidebar></AdminSidebar>

            <!-- Main view -->
            <div class="flex flex-col flex-1 px-16 pt-12 gap-y-8 overflow-auto">

                <!-- Title -->
                <div class="text-3xl font-semibold">Reservaciones</div>

                <div class="flex flex-row flex-1 justify-center gap-x-20">
                    
                    <!-- Bookings calendar -->
                    <div class="flex-2 min-w-[500px] max-w-[800px]">
                        <FullCalendar @date-click="fetchBookings"></FullCalendar>
                    </div>

                    <!-- Table showing the bookings of the date selected -->
                    <div class="flex flex-col">

                        <!-- Table header -->
                        <div class="flex flex-row bg-sky-300 text-gray-800 font-semibold border border-sky-600">
                            <div class="px-4 py-3 w-24 border-r border-sky-600 text-center">No. Reserva</div>
                            <div class="px-4 py-3 w-28 border-r border-sky-600 text-center">Espacio</div>
                            <div class="px-4 py-3 w-32 border-r border-sky-600 text-center">Usuario</div>
                            <div class="px-4 py-3 w-32 border-r border-sky-600 text-center">Fecha</div>
                            <div class="px-4 py-3 w-36 text-center">Horario</div>
                        </div>


                        <!-- Table contents -->
                        <BookRow
                            v-for="(booking, index) in bookings"
                            :key="booking.id"
                            :book-number="booking.id"
                            :book-space="booking.space_name"
                            :book-user="booking.user_name"
                            :book-date="booking.day"
                            :book-schedule="`${booking.start_hour} - ${booking.end_hour}`"
                            :cell-width="32"
                            :index="index"
                        />
                    </div>
                </div>
            </div>
        </div>
    </template>