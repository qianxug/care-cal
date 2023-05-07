import { React, ReactDOM, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button, Form, Card, Layout, Menu, Input, List, Typography, Tag, Select } from 'antd';
import TopNavBar from './TopNavBar';
import { Link } from 'react-router-dom';
import { DeleteOutlined, SaveOutlined, PlusOutlined } from '@ant-design/icons';

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

      // if (hasAm && hasPm)
      //   return <Tag key={item} bordered={false} style={{ background: 'linear-gradient(to right, pink 50%, cyan 50%)'}}>{dayAcronym}</Tag>
      
      // else if (hasAm)
      //   return <Tag key={item} bordered={false} style={{ background: 'pink'}}>{dayAcronym}</Tag>

      // else if (hasPm)
      //   return <Tag key={item} bordered={false} style={{ background: 'cyan'}}>{dayAcronym}</Tag>
      
      // else
      //   return <Tag>{dayAcronym}</Tag>
      if (hasAm && hasPm)
        return <Tag key={item} bordered={false} color="green">{dayAcronym}</Tag>
      
      else if (hasAm)
        return <Tag key={item} bordered={false} color="yellow">{dayAcronym}</Tag>

      else if (hasPm)
        return <Tag key={item} bordered={false} color="geekblue">{dayAcronym}</Tag>
      
      else
        return <Tag bordered={false}>{dayAcronym}</Tag>
    })
  }

  return (
    <Card 
      style={{backgroundColor: "white" }}
      bordered={false}
    >
      
      {product && (
        <>
          <div style={{
            backgroundColor: "white",
            display: "flex",
            justifyContent: "flex-end"
          }}>
            <Button type="primary" shape="circle" icon={<DeleteOutlined />} size='medium' onClick={() => deleteClickHandler(product)} />
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
                {/* <Tag color='pink'>AM</Tag>
                <Tag color='cyan'>PM</Tag> */}
              <div style={{display: 'block'}}>
                {displayDaysOfWeek()}
              </div>
            </List.Item>
            <List.Item>
              <b>Notes:</b>
              <p>{product.notes}</p>
            </List.Item>
          </List>
        </>)}
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
    
      <Card
        bordered={false}
      >
        <Form onFinish={submitHandler}>
          <Form.Item
            name="name"
            label="Name"
            labelCol={{ span: 4 }} 
            wrapperCol={{ span: 22 }}
            rules={[{required:true}]}
            hasFeedback
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            labelCol={{ span: 4 }} 
            wrapperCol={{ span: 22 }}
            rules={[{required:true}]}
            hasFeedback
          >
            <Select>
              <Option value='Primary cleanser'>Primary cleanser</Option>
              <Option value='Secondary cleanser'>Secondary cleanser</Option>
              <Option value='Exfoliant'>Exfoliant</Option>
              <Option value='Retinol'>Retinol</Option>
              <Option value='Moisturizer'>Moisturizer</Option>
              <Option value='Sunscreen'>Sunscreen</Option>
              <Option value='Serum'>Serum</Option>
            </Select>          
          </Form.Item>
          <Form.Item
            name="routine"
            label="Routine"
            labelCol={{ span: 4 }} 
            wrapperCol={{ span: 22 }}
            rules={[{required:true}]}
            hasFeedback
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
            labelCol={{ span: 4 }} 
            wrapperCol={{ span: 22 }}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType = 'Submit' disabled={loading}>Save</Button>
          </Form.Item>
        </Form>
      </Card>

  );
}


function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [currProduct, setCurrProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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

  async function updateProducts(products) {
    console.log("in update")
    const url = 'http://localhost:8000/api/products/load';
    const data = {
      Email: localStorage.getItem('CARE_CAL_EMAIL'),
      Prods: products,
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
        const result = await response.json();
        return result.product
      } else {
        console.error('Error:', response.status);
        
      }
    } catch (error) {
      console.error('Error:', error);
    }
    return null
  }


  useEffect(() => {
    const prods = retrieveProducts()
    prods.then((res)=> {
      console.log("final:", res)
      if (Array.isArray(res)) {
        setProducts(res);
      }
    })

    // console.log("prods:", prods)
    // const storedProducts = JSON.parse(localStorage.getItem(PRODUCTS_KEY));
  }, []);

  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
   
  }, [products]);

  function menuItemClickHandler(id) {
    setIsEditing(false);
    const clickedProduct = products.find((item) => id === item.id);
    setCurrProduct(clickedProduct);
  }

  function deleteClickHandler(product) {
    const newProducts = products.filter((item) => item.label !== product.label);

    setProducts(newProducts);
    setCurrProduct(null);

    updateProducts(newProducts)
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

    updateProducts([...newProducts, newProduct])
  }

  return (
    <>
      <TopNavBar />
      
      <div style={{ backgroundColor: '#f2f2f2', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
        <div style={{  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px'}}>
          <div style={{ aspectRatio: '1/1' }}>
            <Card 
              title="Products" 
              style={{ height: '600px', width: '500px'}} 
              hoverable 
              extra = {
                    <div>
                        <Button type="primary" shape="circle" icon={<PlusOutlined />} size='medium' onClick={() => setIsEditing(true)} />
                    </div>
                  }>
              <Menu 
                mode='inline'
                defaultSelectedKeys={['1']}
                
              >
                {products.map((product) => (
                  <Menu.Item key={product.id} onClick={() => menuItemClickHandler(product.id)}>
                    {product.label}
                  </Menu.Item>
                ))}
              </Menu>
            </Card>
          </div>
          <div style={{ aspectRatio: '1/1' }}>
            <Card style={{ height: '600px', width: '500px' }} hoverable>
              {!isEditing && <ProductDisplay product={currProduct} deleteClickHandler={deleteClickHandler}/>}
              {isEditing && (
                <>
                <h3>Add a product</h3>
                <ProductEntry product={currProduct} submitHandler={submitHandler}/>
                </>)}
            </Card>
          </div>
        </div>
      </div>
      
      
    </>
  );
};

export default ProductsPage;