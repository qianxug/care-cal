import { React, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { DownloadOutlined, EditOutlined } from '@ant-design/icons';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Button, Tooltip, Card } from 'antd';
import moment from 'moment';
import {useAuth} from "../contexts/AuthContext"
import { Link } from 'react-router-dom';
import TopNavBar from './TopNavBar';


const ROUTINE_EVENTS_KEY = 'care-cal.routine-events';
const PRODUCTS_KEY = 'care-cal.products';

function DashboardPage() {
  const [routineEventsDisplay, setRoutineEventsDisplay] = useState([]);
  const [sunscreenEvents, setSunscreenEvents] = useState([]);   // IMPORTANT FEATURE MUST IMPLEMENT
  const [products, setProducts] = useState([]);
  const [size, setSize] = useState('large');

  const {currentUser} = useAuth()
  const routineEvents = [];

  // CHANGE THESE TO UPDATE AS PER USER SELECTION
  const wakeUpTime = '08:00:00';
  const sleepTime = '21:00:00';

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem(PRODUCTS_KEY));

    for (var i = 0; i < storedProducts.length; i++) {
      for (var j = 0; j < storedProducts[i].routine.length; j++) {
        console.log(storedProducts[i].routine[j].meridian + "    "   + storedProducts[i].routine[j].dayOfWeek + "    " + storedProducts[i].label + "   " + storedProducts[i].type);
        addClickHandler(storedProducts[i].routine[j].meridian, storedProducts[i].routine[j].dayOfWeek, storedProducts[i].label, storedProducts[i].type);
      }
    }

    setRoutineEventsDisplay(routineEvents);
  }, []);

  const updatedEvents = [...routineEvents, ...sunscreenEvents];

  function addClickHandler(meridian, dayOfWeek, productName, productType) {
    const dayNumber = moment(dayOfWeek, 'dddd').isoWeekday();
    const targetDate = moment().subtract(moment().day(), 'days').add(dayNumber, 'days').format('YYYY-MM-DD');
    const targetDateTime = meridian === 'am' ? targetDate +  'T' + wakeUpTime : targetDate + 'T' + sleepTime;

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
                  <Button type="primary" shape="circle" icon={<DownloadOutlined />} size='medium' />
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