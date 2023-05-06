import { React, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Button, Layout, Grid, div } from 'antd';
import moment from 'moment';

const ROUTINE_EVENTS_KEY = 'care-cal.routine-events'

function DashboardPage() {
  const [routineEvents, setRoutineEvents] = useState([]);
  const [sunscreenEvents, setSunscreenEvents] = useState([]);


  // CHANGE THESE TO UPDATE AS PER USER SELECTION
  const wakeUpTime = '8:00:00';
  const sleepTime = '23:00:00';

  useEffect(() => {
    setRoutineEvents(JSON.parse(localStorage.getItem(ROUTINE_EVENTS_KEY)))
  }, []);

  useEffect(() => {
    localStorage.setItem(ROUTINE_EVENTS_KEY, JSON.stringify(routineEvents))
  }, [routineEvents]);

  const updatedEvents = [...routineEvents, ...sunscreenEvents];

  function addClickHandler(meridian, dayOfWeek, productName) {
    const dayNumber = moment(dayOfWeek, 'dddd').isoWeekday();
    const targetDate = moment().subtract(moment().day(), 'days').add(dayNumber, 'days').format('YYYY-MM-DD');
    const targetDateTime = meridian === 'am' ? targetDate +  'T' + wakeUpTime : targetDate + 'T' + sleepTime;
    
    const newRoutineEvents = [...routineEvents];
    const result = newRoutineEvents.find((item) => targetDateTime === item.start)

    if (result) { 
      result.notes += '- ' + productName + '\n';
    }
    
    else {
      newRoutineEvents.push({
        title: 'bleh',
        start: targetDateTime,
        end: moment(targetDateTime).add(30, 'minutes'),
        notes: '-' + productName + '\n'
      })
    }

    setRoutineEvents(newRoutineEvents);

    console.log(newRoutineEvents);
  }

  return (
    <div className='container'>
      <Button onClick={() => addClickHandler("am", "Monday", "product1")}>AM add</Button>
      <Button onClick={() => addClickHandler("pm", "Tuesday", "product2")}>PM add</Button>
      <FullCalendar
        plugins = {[timeGridPlugin]}
        initialView = "timeGridWeek"
        events={updatedEvents}
      />
    </div>
  );
}

export default DashboardPage;

// {
//   title: 'AM skincare',
//   start: '2023-05-01T8:00:00',
//   end: '2023-05-01T8:30:00',
//   notes: '...'
// },