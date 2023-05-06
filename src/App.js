import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {AuthProvider} from "./contexts/AuthContext"
import DashboardPage from './components/DashboardPage';
import ProductsPage from './components/ProductsPage';
import NoPage from './components/NoPage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import PrivateRoutes from './components/PrivateRoute'

const App = () => {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NoPage />} />

            <Route element={<PrivateRoutes />}>
              <Route path="/dashboard" element={<DashboardPage />}></Route>
              <Route path="/products" element={<ProductsPage />} ></Route>
            </Route>
            
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
};

export default App;