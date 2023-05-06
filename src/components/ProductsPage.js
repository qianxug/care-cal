import { React, ReactDOM, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button, Breadcrumb, Card, Layout, Menu, Typography } from 'antd';
import TopNavBar from './TopNavBar';

const PRODUCTS_KEY = 'care-cal.products';

function ProductDisplay({ product }) {
  return (
    <Card>
      {product && (
        <Layout>
          <p>Amogus with {product.label}</p>
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
          dayOfWeek: 'Wednesday'
        },
        {
          meridian: 'pm',
          dayOfWeek: 'Friday'
        },
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