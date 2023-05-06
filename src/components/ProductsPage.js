import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { React, ReactDOM, useState, useEffect } from 'react';

const PRODUCTS_KEY = 'care-cal.products'
const { Header, Content, Footer, Sider } = Layout;

// const items1 = ['1', '2', '3'].map((key) => ({
//   key,
//   label: `nav ${key}`,
// }));

// const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map((icon, index) => {
//   const key = String(index + 1);
//   return {
//     key: `sub${key}`,
//     icon: React.createElement(icon),
//     label: `subnav ${key}`,
//     children: new Array(4).fill(null).map((_, j) => {
//       const subKey = index * 4 + j + 1;
//       return {
//         key: subKey,
//         label: `option${subKey}`,
//       };
//     }),
//   };
// });

function ProductsPage() {
  const [products, setProducts] = useState([{label: "test1"}, {label: "test2"}]);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem(PRODUCTS_KEY));
    
    if (Array.isArray(storedProducts)) {
      setProducts(storedProducts);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
  }, [products]);

  return (
    <Layout 
      style={{
        flexDirection: "row"
      }}
    >
      <p>Hello World!</p>
      <Sider>
        <Menu
          items={products}></Menu>
      </Sider>
      <Content></Content>
    </Layout>
  );
};

export default ProductsPage;