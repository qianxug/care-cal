import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import { Link } from 'react-router-dom';
import { LogoutOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';

const { Header } = Layout;

function TopNavBar() {
  const navigate = useNavigate();
  const userMenu = (
    <Menu>
      <Menu.Item><b>Name:</b> INSERT</Menu.Item>
      <Menu.Item><b>ID:</b> INSERT</Menu.Item>
      <Menu.Item><b>Email:</b> INSERT</Menu.Item>
      <Menu.Item><b>Default wake up time:</b> 8:00 AM</Menu.Item>
      <Menu.Item><b>Default sleep time:</b> 11:00 PM</Menu.Item>
      <Menu.Divider />
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

  function logoutHandler() {
    console.log("logged out")
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