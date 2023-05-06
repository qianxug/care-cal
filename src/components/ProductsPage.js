import { React, ReactDOM, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button, Form, Card, Layout, Menu, Input, List, Typography, Tag } from 'antd';
import TopNavBar from './TopNavBar';

const PRODUCTS_KEY = 'care-cal.products';

function ProductDisplay({ product }) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  function displayDaysOfWeek() {
    if (product.routine.length === 0) {
      return days.map((item) => <Tag>{item}</Tag>);
    }  

    return days.map((item) => {
      const hasAm = product.routine.some((occurrence) => occurrence.meridian === 'am' && occurrence.dayOfWeek === item)
      const hasPm = product.routine.some((occurrence) => occurrence.meridian === 'pm' && occurrence.dayOfWeek === item)

      if (hasAm && hasPm)
        return <Tag style={{ background: 'linear-gradient(to right, pink 50%, cyan 50%)'}}>{item}</Tag>
      
      else if (hasAm)
        return <Tag style={{ background: 'pink'}}>{item}</Tag>

      else if (hasPm)
        return <Tag style={{ background: 'cyan'}}>{item}</Tag>
      
      else
        return <Tag>{item}</Tag>
    })

    // for (var i = 0; i < days.length; i++) {
    //   const hasAm = product.routine.some((item) => item.meridian === 'am' && item.dayOfWeek === days[i])
    //   const hasPm = product.routine.some((item) => item.meridian === 'pm' && item.dayOfWeek === days[i])
      

    // }
  }

  return (
    <Card style={{
      backgroundColor: "lightgray"
    }}>
      {product && (
        <Layout>
          <div style={{
            backgroundColor: "lightgray",
            display: "flex",
            justifyContent: "flex-end"
          }}>
            <Button>Edit</Button>
            <Button>Delete</Button>
          </div>
          <List>
            <List.Item>
              <b>Name:</b> {product.label}
            </List.Item>
            <List.Item>
              <b>Type:</b> {product.type}
            </List.Item>
            <List.Item>
              <b>Routine:</b>
                <br />
                <Tag color='pink'>AM</Tag>
                <Tag color='cyan'>PM</Tag>
              <div style={{display: 'block'}}>
                {displayDaysOfWeek()}
              </div>
            </List.Item>
          </List>
        </Layout>)}
    </Card>
  );
} 

function ProductsPage() {
  const [products, setProducts] = useState([
    {
      id: uuidv4(),
      label: 'thing #1',
      type: 'cleanser',
      notes: 'amogusamogusamogusamogusamogusamogusamogusamogusamogusamogusamogusamogusamogus',
      routine: [
        {
          meridian: 'am',
          dayOfWeek: 'Monday'
        },
        {
          meridian: 'pm',
          dayOfWeek: 'Monday'
        },
        {
          meridian: 'pm',
          dayOfWeek: 'Wednesday'
        }
      ]
    },
    {
      id: uuidv4(),
      label: 'thing #2',
      type: 'moisturizer',
      notes: 'sugomasugomasugomasugomasugomasugomasugomasugomasugomasugomasugomasugomasugoma',
      routine: []
    },
  ]);
  const [currProduct, setCurrProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // useEffect(() => {
  //   const storedProducts = JSON.parse(localStorage.getItem(PRODUCTS_KEY));
    
  //   if (Array.isArray(storedProducts)) {
  //     setProducts(storedProducts);
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
  // }, [products]);

  function menuItemClickHandler(id) {
    const clickedProduct = products.find((item) => id === item.id);
    setCurrProduct(clickedProduct);
  }

  return (
    <Layout>
      <TopNavBar />
      <Button onClick={() => setIsEditing(true)}>Add</Button>
      <Menu mode='inline'>
        {products.map((product) => (
          <Menu.Item key={product.id} onClick={() => menuItemClickHandler(product.id)}>
            {product.label}
          </Menu.Item>
        ))}
      </Menu>
      {!isEditing && <ProductDisplay product={currProduct} />}
    </Layout>
  );
};

export default ProductsPage;