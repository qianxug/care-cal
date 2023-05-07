import { React, ReactDOM, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button, Form, Card, Layout, Menu, Input, List, Typography, Tag, Select } from 'antd';
import TopNavBar from './TopNavBar';

const {Option} = Select;
const PRODUCTS_KEY = 'care-cal.products';

function ProductDisplay({ product, deleteClickHandler }) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  function displayDaysOfWeek() {
    if (product.routine.length === 0) {
      return days.map((item) => <Tag key={item}>{item.substring(0, 3)}</Tag>);
    }  

    return days.map((item) => {
      const hasAm = product.routine.some((occurrence) => occurrence.meridian === 'am' && occurrence.dayOfWeek === item)
      const hasPm = product.routine.some((occurrence) => occurrence.meridian === 'pm' && occurrence.dayOfWeek === item)

      const dayAcronym = item.substring(0, 3);

      if (hasAm && hasPm)
        return <Tag key={item} style={{ background: 'linear-gradient(to right, pink 50%, cyan 50%)'}}>{dayAcronym}</Tag>
      
      else if (hasAm)
        return <Tag key={item} style={{ background: 'pink'}}>{dayAcronym}</Tag>

      else if (hasPm)
        return <Tag key={item} style={{ background: 'cyan'}}>{dayAcronym}</Tag>
      
      else
        return <Tag>{dayAcronym}</Tag>
    })
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
            <Button onClick={() => deleteClickHandler(product)}>Delete</Button>
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
            <List.Item>
              <b>Notes:</b>
              <p>{product.notes}</p>
            </List.Item>
          </List>
        </Layout>)}
    </Card>
  );
}

function ProductEntry({ product, submitHandler }) {
  const [loading, setLoading] = useState(false);

  const routineOptions = ["Monday AM", "Monday PM", 
                          "Tuesday AM", "Tuesday PM", 
                          "Wednesday AM", "Wednesday PM", 
                          "Thursday AM", "Thursday PM", 
                          "Friday AM", "Friday PM", 
                          "Saturday AM", "Saturday PM", 
                          "Sunday AM", "Sunday PM"];
  
  return (
    <Form onFinish={submitHandler}>
      <Form.Item
        name="name"
        label="Name"
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="type"
        label="Type"
      >
        <Select>
          <Option value='primary cleanser'>Primary cleanser</Option>
          <Option value='secondary cleanser'>Secondary cleanser</Option>
          <Option value='exfoliant'>Exfoliant</Option>
          <Option value='retinol'>Retinol</Option>
          <Option value='moisturizer'>Moisturizer</Option>
          <Option value='sunscreen'>Sunscreen</Option>
          <Option value='serum'>Serum</Option>
        </Select>          
      </Form.Item>
      <Form.Item
        name="routine"
        label="Routine"
      >
        <Select mode="multiple">
        {routineOptions.map((item) => (
          <Option key={item} value={item}>
            {item}
          </Option>
        ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="notes"
        label="Notes"
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button 
          type="primary" 
          htmlType='submit' 
          disabled={loading}
        >
          Save
        </Button>
      </Form.Item>
    </Form>
  );
}

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [currProduct, setCurrProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem(PRODUCTS_KEY));
    
    if (Array.isArray(storedProducts)) {
      setProducts(storedProducts);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
  }, [products]);

  function menuItemClickHandler(id) {
    setIsEditing(false);
    const clickedProduct = products.find((item) => id === item.id);
    setCurrProduct(clickedProduct);
  }

  function addChangeProductHandler(id) {
    // TO DO AT SOME POINT
  }

  function deleteClickHandler(product) {
    const newProducts = products.filter((item) => item.label !== product.label);

    setProducts(newProducts);
    setCurrProduct(null);
  }

  function submitHandler(values) {
    const newProducts = products.filter((item) => item.label !== values.name);

    const newProduct = {
      id: uuidv4(),
      label: values.name,
      type: values.type,
      notes: values.notes,
      routine: []
    };

    values.routine.forEach((item) => {
      const [dayOfWeek, meridian] = item.split(' ');
      newProduct.routine.push({
        meridian: meridian.toLowerCase(), 
        dayOfWeek: dayOfWeek
      });
    });

    setProducts([...newProducts, newProduct]);
    setIsEditing(false);
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
      {!isEditing && <ProductDisplay product={currProduct} deleteClickHandler={deleteClickHandler}/>}
      {isEditing && <ProductEntry product={currProduct} submitHandler={submitHandler}/>}
    </Layout>
  );
};

export default ProductsPage;