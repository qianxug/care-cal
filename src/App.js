import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import DashboardPage from './components/DashboardPage';
import ProductsPage from './components/ProductsPage';

const { Header, Content, Footer } = Layout;

const App = () => {
  return (
    <div>
      <p>HELLO</p>
      <BrowserRouter>
      <Routes>
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/products" component={ProductsPage} />
      </Routes>
    </BrowserRouter>
    </div>

  );
};

export default App;