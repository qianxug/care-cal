import { React, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './DashboardPage.css';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Button, Tooltip } from 'antd';
import moment from 'moment';

const ROUTINE_EVENTS_KEY = 'care-cal.routine-events'

function DashboardPage() {
  const [routineEvents, setRoutineEvents] = useState([]);
  const [sunscreenEvents, setSunscreenEvents] = useState([]);

  // CHANGE THESE TO UPDATE AS PER USER SELECTION
  const wakeUpTime = '08:00:00';
  const sleepTime = '23:00:00';

  useEffect(() => {
    const storedRoutineEvents = JSON.parse(localStorage.getItem(ROUTINE_EVENTS_KEY));
    
    if (Array.isArray(storedRoutineEvents)) {
      setRoutineEvents(storedRoutineEvents);
    }
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
      result.products.push({
        name: productName,
        type: 'default'
      });
    }
    
    else {
      newRoutineEvents.push({
        title: 'bleh',
        start: targetDateTime,
        end: moment(targetDateTime).add(60, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
        products: [{
          name: productName,
          type: 'default'
        }]
      })
    }

    setRoutineEvents(newRoutineEvents);

    console.log(newRoutineEvents);
  }

  function handleEventsRender(info) {
    const productsList = info.event.extendedProps.products.map((product) => (
      <li key={product.name}>{product.name}</li>
    ));
  
    return (
      <Tooltip title={<ul>{productsList}</ul>}>
        <div>
          <div>{info.timeText}</div>
          <div>{info.event.title}</div>
        </div>
      </Tooltip>
    );
  }

  return (
    <div className='container'>
      {/* TEST BUTTONS BELOW, REMOVE THESE LATER */}
      <Button onClick={() => addClickHandler("am", "Monday", "product1")}>AM add</Button>
      <Button onClick={() => addClickHandler("pm", "Tuesday", "product2")}>PM add</Button>
      <FullCalendar
        plugins={[timeGridPlugin]}
        initialView="timeGridWeek"
        events={updatedEvents}
        eventContent={handleEventsRender}
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