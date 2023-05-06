import React from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Button, Layout, Grid, div } from 'antd';

function DashboardPage() {
  return (
    <div classname='container'>
      <FullCalendar
        plugins = {[timeGridPlugin]}
        initialView = "timeGridWeek"
        events = {[
          {
            title: 'Event 1',
            start: '2023-05-01T10:00:00',
            end: '2023-05-01T12:00:00',
            allDay: false,
          },
          {
            title: 'Event 2',
            start: '2023-05-03T14:00:00',
            end: '2023-05-03T16:00:00',
            allDay: false,
          },
          {
            title: 'Event 3',
            start: '2023-05-05T08:00:00',
            end: '2023-05-05T10:00:00',
            allDay: false,
          },
        ]}
      />
    </div>
  );
}

export default DashboardPage;