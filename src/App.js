import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {AuthProvider} from "./contexts/AuthContext"
import DashboardPage from './components/DashboardPage';
import ProductsPage from './components/ProductsPage';
import NoPage from './components/NoPage';
import RegisterPage from './components/RegisterPage';

const App = () => {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
};

export default App;