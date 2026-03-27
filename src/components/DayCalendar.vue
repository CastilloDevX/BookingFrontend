<script>
import FullCalendar from '@fullcalendar/vue3'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import esLocale from '@fullcalendar/core/locales/es';

export default {
    props: {
        initialDate: {
            type: String,
            required: true
        },
        spaceDisponibility: {
            type: Object,
            required: true,
            default : ['07:00', '21:00']
        },
        events: {
            type: Object,
            required: true,
            default: []
        }
    }, 
    components: {
        FullCalendar // make the <FullCalendar> tag available
    },
    data() {
        return {
            calendarOptions: {
                plugins: [timeGridPlugin, interactionPlugin],
                initialView: 'timeGridDay',
                locale: esLocale,
                selectable: true,
                initialDate: this.initialDate,
                dateClick: this.handleDateClick,
                select: this.handleSelect,
                unselect: this.handleUnselect,
                weekends: false,
                headerToolbar: false,
                allDaySlot: false,
                // slotMinTime: this.minSlotTime,
                slotMaxTime: this.spaceDisponibility[1],
                slotDuration: '01:00:00',
                slotEventOverlap: false,
                events: this.events,
                unselectAuto: false,    // Prevents unselection if clicked outside of the calendar
                selectOverlap: false, // Prevents selection over unavailableHours
                expandRows: true
            }
        }
    },
    methods: {
        handleDateClick: function(arg) {
            this.$emit('dateClick', arg.dateStr)
        },
        handleSelect: function(selectionInfo) {
            const start = selectionInfo.startStr.substring(11, 16)
            const end = selectionInfo.endStr.substring(11, 16)
            this.$emit('select', start, end)
        },
        handleUnselct: function(jsEvent, view) {
            this.$emit('unselect')
        }
    },
    computed: {
        minSlotTime() {
            const todayDate = new Date()
            const year = todayDate.getFullYear()
            const month = (todayDate.getMonth() + 1).toString().padStart(2, '0')
            const day = todayDate.getDate().toString().padStart(2, '0')
            const hours = todayDate.getHours().toString().padStart(2, '0')
            const today = `${year}-${month}-${day}`

            let minTime = this.spaceDisponibility[0]

            if (this.initialDate === today) {
                const currentTime = `${hours}:00:00`
                minTime = currentTime > minTime ? currentTime : minTime
            }

            return minTime > this.spaceDisponibility[1] ? this.spaceDisponibility[1] : minTime
        }
    },
    watch: {
        // Observa el cambio en initialDate y actualiza la opción de fecha
        initialDate(newDate) {
            this.calendarOptions.initialDate = newDate
        }
    },
    emits: ['dateClick', 'select', 'unselect'],
    mounted() {
        this.calendarOptions.slotMinTime = this.minSlotTime
    }
}
</script>

<template>
  <FullCalendar :options="calendarOptions" />
</template>
