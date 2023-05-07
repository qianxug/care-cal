import React, { Component, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import { Link } from 'react-router-dom';
import { LogoutOutlined, ShoppingCartOutlined, UserOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext'
import WEATHER_API_KEY from './env';

const { Header } = Layout;

function TopNavBar() {
  const navigate = useNavigate();
  const {currentUser, logout } = useAuth()

  const id = localStorage.getItem('CARE_CAL_ID'); 
  const email = localStorage.getItem('CARE_CAL_EMAIL');  
  const name = localStorage.getItem('CARE_CAL_NAME');  

  const userMenu = (
    <Menu>
      <Menu.Item><b>Name:</b> {name} </Menu.Item>
      <Menu.Item><b>ID:</b> {id} </Menu.Item>
      <Menu.Item><b>Email:</b> {email}</Menu.Item>
      <Menu.Item><b>Default wake up time:</b> 8:00 AM</Menu.Item>
      <Menu.Item><b>Default sleep time:</b> 11:00 PM</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="weather" icon={<EnvironmentOutlined />} onClick={() => weatherHandler()}>Update Weather Data</Menu.Item>
      <Menu.Item key="signout" icon={<LogoutOutlined />} onClick={() => logoutHandler()}>Sign Out</Menu.Item>
    </Menu>
  );

  function profileClickedHandler() {
    return (
      <Dropdown placement="bottomRight">
        <Avatar icon={<UserOutlined />} />
      </Dropdown>
    );
  }

  function weatherHandler() {
    function getLocation() {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => resolve([position.coords.latitude, position.coords.longitude]),
            error => reject(error)
          );
        } else {
          reject(new Error('Geolocation is not supported by this browser.'));
        }
      });
    }

    getLocation()
    .then(([latitude, longitude]) => {
      console.log(latitude, longitude);
      const key = WEATHER_API_KEY;//'b60264b2d8dfd43f08aa74f0f695daeb'
      const endPoint = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&appid=${key}`;
  
      fetch(endPoint)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        return data
      })
    })



    // [latitude, longitude] = getLocation()
    
  }
  

  async function logoutHandler() {
    await logout()
    navigate('/login');
  }
  
  return (
    <Header style={{
      backgroundColor: "white", 
      display: "flex", 
      justifyContent: "start"
    }}>
      {/* <Layout > */}
        <img src='public\icons\navbar-topleft-logo.png' alt='logo'></img>
        <Menu 
          theme="light" 
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={{flexGrow: 1}}
        >
          <Menu.Item 
            key="1" 
            icon={<UserOutlined />}
          >
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item 
            key="2" 
            icon={<ShoppingCartOutlined />}
          >
            <Link to="/products">My Products</Link>
          </Menu.Item>
        </Menu>
        <Layout style={{
          float: 'right', 
          backgroundColor: "white", 
          display: "flex", 
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center"
          }}>
        <Dropdown overlay={userMenu} placement="bottomRight">
            <Avatar style={{ cursor: 'pointer' }} icon={<UserOutlined />} />
        </Dropdown>
        </Layout>
      {/* </Layout> */}
    </Header>
  );
}

export default TopNavBar;