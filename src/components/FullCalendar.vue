<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es';

export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        locale: esLocale,
        dateClick: this.handleDateClick,
        weekends: false,
      }
    }
  },
  methods: {
    handleDateClick: function(arg) {
      this.$emit('dateClick', arg.dateStr)
    }
  },
  emits: ['dateClick']
}
</script>

<template>
  <FullCalendar :options="calendarOptions" />
</template>
