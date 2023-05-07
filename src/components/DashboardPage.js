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
import { saveAs } from "file-saver";
import TopNavBar from './TopNavBar';  

const PRODUCTS_KEY = 'care-cal.products';

function DashboardPage() {
  const [routineEventsDisplay, setRoutineEventsDisplay] = useState([]);
  const [sunscreenEventsDisplay, setSunscreenEventsDisplay] = useState([]);
  const [weatherEventsDisplay, setWeatherEventsDisplay] = useState([]);
  // const [products, setProducts] = useState([]);
  const [size, setSize] = useState('large');

  const {currentUser} = useAuth()
  // const cal = new ICS.VCALENDAR();
  const routineEvents = [];
  const sunscreenEvents = [];
  const weatherEvents = [];

  // CHANGE THESE TO UPDATE AS PER USER SELECTION
  const wakeUpTime = ['06:02:00', '06:00:00', '05:59:00', '05:58:00', '05:57:00', '05:56:00', '05:54:00'];
  const sleepTime = ['20:26:00', '20:27:00', '20:29:00', '20:30:00', '20:31:00', '20:32:00', '20:33:00'];
  const weatherData = [
    {
      date: '2023-05-07',
      weather: 'light rain',
      humidity: 65,
      uvi: 2
    },
    {
      date: '2023-05-08',
      weather: 'few clouds',
      humidity: 45,
      uvi: 7
    },
    {
      date: '2023-05-09',
      weather: 'light rain',
      humidity: 42,
      uvi: 7
    },
    {
      date: '2023-05-10',
      weather: 'clear skies',
      humidity: 35,
      uvi: 7
    },
    {
      date: '2023-05-11',
      weather: 'few clouds',
      humidity: 43,
      uvi: 1
    },
    {
      date: '2023-05-12',
      weather: 'overcast clouds',
      humidity: 48,
      uvi: 1
    },
    {
      date: '2023-05-13',
      weather: 'light rain',
      humidity: 54,
      uvi: 1
    }
  ]

  async function retrieveProducts() {
    console.log('retrieving on startup')
    const url = 'http://localhost:8000/api/products/request';
    const data = {
      Email: localStorage.getItem('CARE_CAL_EMAIL'),
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      if (response) {
        const res = await response.json()
        return res
      } else {
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  

  useEffect(() => {
    console.log('startup')
    const prods = retrieveProducts()
    prods.then((storedProducts)=> {
      console.log("storedProducts:", storedProducts)
      if (Array.isArray(storedProducts)) {
        // setProducts(storedProducts);
        console.log('create cal events')
        for (let i = 0; i < storedProducts.length; i++) {
          for (let j = 0; j < storedProducts[i].routine.length; j++) {
            addClickHandler(storedProducts[i].routine[j].meridian, storedProducts[i].routine[j].dayOfWeek, storedProducts[i].label, storedProducts[i].type);
          }
        }
        setRoutineEventsDisplay(routineEvents);
      }
      remindSunscreenHandler();
      displayWeatherHandler();
    })    
  }, []);

  const updatedEvents = [...routineEventsDisplay, ...sunscreenEventsDisplay, ...weatherEventsDisplay];

  function displayWeatherHandler() {
    for (let i = 0; i < 7; i++) {
      weatherEvents.push(
        {
          title: "Weather: " + weatherData[i].weather,
          start: weatherData[i].date,
          allDay: true,
        },
        {
          title: "Humidity: " + weatherData[i].humidity + '%',
          start: weatherData[i].date,
          allDay: true,
        },
        {
          title: "UV index: " + weatherData[i].uvi,
          start: weatherData[i].date,
          allDay: true,
        },
      )
    }

    setWeatherEventsDisplay(weatherEvents);
  }

  function remindSunscreenHandler() {
    for (let i = 0; i < 7; i++) {
      const targetDate = moment().subtract(moment().day(), 'days').add(i, 'days').format('YYYY-MM-DD');
        
      let startTime = moment(wakeUpTime[i], 'HH:mm:ss').add(3.5, 'hours').format('HH:mm:ss');
      let endTime = moment(startTime, 'HH:mm:ss').add(3.5, 'hours').format('HH:mm:ss');
      
      if (moment(startTime, 'HH:mm:ss').isBefore(moment(sleepTime[i], 'HH:mm:ss'))) {
        sunscreenEvents.push({
          title: "(Re)apply sunscreen",
          start: targetDate + 'T' + startTime,
          end: moment(targetDate + 'T' + startTime, 'YYYY-MM-DDTHH:mm:ss').add(1, 'hours')
        })
      }

      while (moment(endTime, 'HH:mm:ss').isBefore(moment(sleepTime[i], 'HH:mm:ss'))) {
        startTime = endTime;
        endTime = moment(startTime, 'HH:mm:ss').add(3.5, 'hours').format('HH:mm:ss');

        sunscreenEvents.push({
          title: "(Re)apply sunscreen",
          start: targetDate + 'T' + startTime,
          end: moment(targetDate + 'T' + startTime, 'YYYY-MM-DDTHH:mm:ss').add(1, 'hours')
        })
      }
    }

    setSunscreenEventsDisplay(sunscreenEvents)
  }

  function addClickHandler(meridian, dayOfWeek, productName, productType) {
    const dayNumber = dayOfWeek === 'Sunday'? 0 : moment(dayOfWeek, 'dddd').isoWeekday();
    const targetDate = moment().subtract(moment().day(), 'days').add(dayNumber, 'days').format('YYYY-MM-DD');
    const targetDateTime = meridian === 'am' ? targetDate +  'T' + wakeUpTime[dayNumber] : targetDate + 'T' + sleepTime[dayNumber];

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
    if (info.event.extendedProps.products) {
      const productsList = info.event.extendedProps.products.map((product) => (
        <li key={product.name}>
          {product.name}
        </li>
      ));

      return (
        <Tooltip 
          title={<ol>{productsList}</ol>}
        >
          <div>
            <div>{info.timeText}</div>
            <div>{info.event.title}</div>
          </div>
        </Tooltip>
      )
    }

    else if (info.event.title === '(Re)apply sunscreen') {
      function random_item(items){
        return items[Math.floor(Math.random()*items.length)]
      }
      let messages = ["I hate skin cancer and I don't think you'd like it much either. Consider reapplying your sunscreen",
                      "Dying to the sun isn't fun. It sunscreen time.",
                      "Two americans die to UV related chronic conditions per hour. Lest you not be one of them.",
                      "Don't wear your sunscreen. I don't care. It'll be you who'll look splotchy and aged.",
                      "SPF = BFF",
                      "SSSSSUUUUUUNNNNNNSSSSCCCRRRREEEEEEEEEEEENNNNNNNNNN"] 
      return (
        <div>
          <Tooltip 
            title={random_item(messages)}> 
            {/* info.event.extendedProps. */}
            <div>
              <div>{info.timeText}</div>
              <div>{info.event.title}</div>
            </div>
          </Tooltip>
        </div>
      );
    }

    else {
      return (
        <Tooltip> 
        <div>
          <div>{info.timeText}</div>
          <div>{info.event.title}</div>
        </div>
      </Tooltip>
      )
    }
  }

  function exportClickHandler() {
    const testEvents = {
      start: [2023, 5, 8, 8, 0],
      duration: { hours: 1, minutes: 0 },
      title: "AM skincare",
      description: "1. primary cleanser",
    }
    // {
    //   start: [2023, 5, 9, 8, 0],
    //   duration: { hours: 1, minutes: 0 },
    //   title: "AM skincare",
    //   description: "1. primary cleanser",
    // },

  }

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
            hoverable
            title='Week View' 
            bordered={true} 
            extra={
              <div>
                  <Button 
                    type="primary" 
                    shape="circle" 
                    icon={<DownloadOutlined />} 
                    size='medium'
                    onClick={exportClickHandler} 
                  >
                  </Button>
              </div>}>

            <FullCalendar
              plugins={[timeGridPlugin]}
              initialView="timeGridWeek"
              events={updatedEvents}
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
    </div>
  );
}

export default DashboardPage;