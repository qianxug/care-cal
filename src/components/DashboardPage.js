import { React, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { DownloadOutlined, EditOutlined,PlusOutlined } from '@ant-design/icons';
import './DashboardPage.css';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Button, Tooltip, Card } from 'antd';
import moment from 'moment';
import {useAuth} from "../contexts/AuthContext"
import { Link } from 'react-router-dom';


const ROUTINE_EVENTS_KEY = 'care-cal.routine-events'
const PRODUCTS_KEY = 'care-cal.routine-events'


function DashboardPage() {
  const [routineEvents, setRoutineEvents] = useState([]);
  const [sunscreenEvents, setSunscreenEvents] = useState([]);
  const [products, setProducts] = useState([]);
  const [size, setSize] = useState('large');

  const {currentUser} = useAuth()

  // CHANGE THESE TO UPDATE AS PER USER SELECTION
  const wakeUpTime = '08:00:00';
  const sleepTime = '23:00:00';

  useEffect(() => {
    const storedRoutineEvents = JSON.parse(localStorage.getItem(ROUTINE_EVENTS_KEY));
    
    if (Array.isArray(storedRoutineEvents)) {
      setRoutineEvents(storedRoutineEvents);
    }

    setProducts([...JSON.parse(localStorage.getItem(PRODUCTS_KEY))])
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

  return (
    <div className='container'>
      
      <div style={{ backgroundColor: '#f2f2f2', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
                  <Button type="primary" shape="circle" icon={<DownloadOutlined />} size='medium' />
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

      {/* TEST BUTTONS BELOW, REMOVE THESE LATER */}
      <Button onClick={() => addClickHandler("am", "Monday", "product1")}>AM add</Button>
      <Button onClick={() => addClickHandler("pm", "Tuesday", "product2")}>PM add</Button>
    </div>
  );
}

export default DashboardPage;