import { React, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { DownloadOutlined, EditOutlined } from '@ant-design/icons';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Button, Tooltip, Card } from 'antd';
import moment from 'moment';
import {useAuth} from "../contexts/AuthContext"
import { Link } from 'react-router-dom';
// import ICalendarLink from 'react-icalendar-link';
import { createEvent } from "ics";
import * as ICS from 'ics-js';
import { saveAs } from "file-saver";
import TopNavBar from './TopNavBar';  

const PRODUCTS_KEY = 'care-cal.products';

function DashboardPage() {
  const [routineEventsDisplay, setRoutineEventsDisplay] = useState([]);
  const [sunscreenEvents, setSunscreenEvents] = useState([]);   // IMPORTANT FEATURE MUST IMPLEMENT
  const [products, setProducts] = useState([]);
  const [size, setSize] = useState('large');

  const {currentUser} = useAuth()
  const cal = new ICS.VCALENDAR();
  const routineEvents = [];

  // CHANGE THESE TO UPDATE AS PER USER SELECTION
  const wakeUpTime = ['08:00:00', '08:00:00', '08:00:00', '08:00:00', '08:00:00', '08:00:00', '08:00:00'];
  const sleepTime = ['21:00:00', '21:00:00', '21:00:00', '21:00:00', '21:00:00', '21:00:00', '21:00:00'];

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem(PRODUCTS_KEY));

    for (let i = 0; i < storedProducts.length; i++) {
      for (let j = 0; j < storedProducts[i].routine.length; j++) {
        addClickHandler(storedProducts[i].routine[j].meridian, storedProducts[i].routine[j].dayOfWeek, storedProducts[i].label, storedProducts[i].type);
      }
    }

    console.log("routine events here")
    console.log(routineEvents)

    setRoutineEventsDisplay(routineEvents);

    // try {
      // const weatherData = JSON.parse(localStorage.getItem('CARE_CAL_WEATHER_JSON'));
      const weatherData = localStorage.getItem('CARE_CAL_WEATHER_JSON');

      if (!weatherData)
        console.log("ASDJLFDAJKSLFD;OIS")
      
      else {
        // console.log(JSON.stringify(weatherData))
        console.log(weatherData)
      }

    // } catch (error) {
    //   console.log(error);
    // }

    // const weatherData = localStorage.getItem('CARE_CAL_WEATHER_JSON');
    
    if (weatherData) {
      console.log(weatherData)
      const keys = Object.keys(weatherData);

      console.log(keys);
      
      for (let key in JSON.parse(weatherData)) {
        console.log(key);
        console.log(weatherData[key]);
      }

      // const weatherDataParsed = JSON.parse(weatherData);
      // for (let i = 0; i < 7; i++) {
      //   console.log("in for loop")
      //   // if (weatherData.daily) {
      //     console.log("in if")
      //     console.log(weatherData.daily[i].sunrise)
        // }
        // wakeUpTime[i] = moment.unix(weatherData.daily[i].sunrise).format('HH:mm:ss');
        // console.log(wakeUpTime[i])
      // }
    }

  }, []);

  const updatedEvents = [...routineEvents, ...sunscreenEvents];

  const testEvents = {
    start: [2023, 5, 7, 2, 30],
    duration: { hours: 1, minutes: 0 },
    title: "Testing",
    description: "sussy mongoose",
  }

  function addClickHandler(meridian, dayOfWeek, productName, productType) {
    const dayNumber = moment(dayOfWeek, 'dddd').isoWeekday();
    const targetDate = moment().subtract(moment().day(), 'days').add(dayNumber, 'days').format('YYYY-MM-DD');
    const targetDateTime = meridian === 'am' ? targetDate +  'T' + wakeUpTime[0] : targetDate + 'T' + sleepTime[0];

    const result = routineEvents.find((item) => targetDateTime === item.start);

    if (result) {
      result.products.push({
        name: productName,
        type: productType
      })
    }

    else {
      routineEvents.push({
        title: meridian === 'am' ? 'AM skincare' : "PM skincare",
        start: targetDateTime,
        end: moment(targetDateTime).add(60, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
        products: [{
          name: productName,
          type: productType
        }]
      })
    }
  }

  function handleEventsRender(info) {
    const productsList = info.event.extendedProps.products.map((product) => (
      <li key={product.name}>
        {product.name}
      </li>
    ));
  
    return (
      <Tooltip title={<ol>{productsList}</ol>}>
        <div>
          <div>{info.timeText}</div>
          <div>{info.event.title}</div>
        </div>
      </Tooltip>
    );
  }

  function exportClickHandler() {
    // if (routineEvents.length !== 0) {
      const testEvents = {
        start: [2023, 5, 8, 8, 0],
        duration: { hours: 1, minutes: 0 },
        title: "AM skincare",
        description: "1. primary cleanser",
      }

      createEvent(testEvents, (error, value) => {
        const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "event-schedule.ics");
      });
    // }
  }

  // function exportClickHandler() {
  //   const event = new ICS.VEVENT();
  //   event.addProp('UID');
  //   event.addProp('DTSTART', new Date('2015-07-18 10:00:00'), { VALUE: 'DATE-TIME' });
  //   event.addProp('DTEND', new Date('2015-07-18 11:00:00'), { VALUE: 'DATE-TIME' });
  //   event.addProp('ATTENDEE', null, {
  //     CN: 'Sample Company',
  //     RSVP: 'FALSE:mailto:foo@example.com'
  //   })

  //   console.log(event)
    
  //   cal.addComponent(event);

  //   console.log(cal)

  //   saveAs(cal.toBlob(), 'calendar.ics');
  // }


  return (
    <div className='container'>
      <TopNavBar />
      <div style={{ backgroundColor: '#f2f2f2', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
          <h2>Welcome {localStorage.getItem('CARE_CAL_NAME')}</h2>
          <h>Update your location for weather updates and begin scheduling in the products tab</h>
        </div>
        <div style={{ width: '80%' }}>
          <Card 
            title='Week View' 
            bordered={true} 
            extra={
              <div>
                  {/* <Button type="primary" shape = "circle" icon={<PlusOutlined />} size='medium' style={{ marginRight: '10px' }}/> */}
                  <Link to="/products">
                    <Button type="primary" shape="circle" icon={<EditOutlined />} size='medium' style={{ marginRight: '10px' }} />
                  </Link>
                  <Button 
                    type="primary" 
                    shape="circle" 
                    icon={<DownloadOutlined />} 
                    size='medium'
                    onClick={exportClickHandler} 
                  >
                    {/* <ICalendarLink event={testEvents}>Hi</ICalendarLink> */}
                  </Button>
              </div>}>

            <FullCalendar
              plugins={[timeGridPlugin]}
              initialView="timeGridWeek"
              events={routineEventsDisplay}
              eventContent={handleEventsRender}
              aspectRatio={3.0}
              headerToolbar={{
                left: 'title',
                right: null,
              }}
            />
          </Card>
        </div>
      </div>
      {/* TEST BUTTONS BELOW, REMOVE THESE LATER */}
      {/* <Button onClick={() => addClickHandler("am", "Monday", "product1")}>AM add</Button>
      <Button onClick={() => addClickHandler("pm", "Tuesday", "product2")}>PM add</Button> */}
    </div>
  );
}

export default DashboardPage;