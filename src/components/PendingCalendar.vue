<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es';

export default {
    props: {
        // initialDate: {
        //     type: String,
        //     required: true
        // },
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
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
        initialView: 'timeGridWeek',
        locale: esLocale,
        eventClick: this.handleEventClick,
        weekends: false,
        allDaySlot: false,
        slotDuration: '01:00:00',
        slotMinTime: '07:00:00',
        slotMaxTime: '22:00:00',
        expandRows: true,
        events: this.events,
        headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: 'timeGridWeek,timeGridDay' // user can switch between the two
        },
        validRange: { start: new Date() }
      }
    }
  },
  methods: {
    handleEventClick: function(info) {
      this.$emit('eventClick', info.event.id)
    }
  },
  emits: ['eventClick']
}
</script>

<template>
  <FullCalendar :options="calendarOptions" />
</template>
