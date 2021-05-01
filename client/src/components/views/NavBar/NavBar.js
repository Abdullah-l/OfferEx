// Navbar 

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'
import LeftMenu from './Sections/LeftMenu';
import logo from './Sections/logo.png';
import RightMenu from './Sections/RightMenu';
import { Drawer, Button, Icon } from 'antd';
import './Sections/Navbar.css';


function NavBar() {
  const [visible, setVisible] = useState(false)

  const showDrawer = () => {
    setVisible(true)
  };

  const onClose = () => {
    setVisible(false)
  };

  const location = useLocation()

  const selectedKey= [location.pathname];


  return (
    <nav className="menu" style={{ position: 'fixed', zIndex: 5, width: '100%' }}>
      <div className="menu__logo">
      <a href='/'><img style={{width: '156px'}} src={logo} alt="logo" /></a>
      </div>
      <div className="menu__container">
        <div className="menu_left">
          <LeftMenu selectedKey={selectedKey} mode="horizontal" />
        </div>
        <div className="menu_rigth">
          <RightMenu selectedKey={selectedKey} mode="horizontal" />
        </div>
        <Button
          className="menu__mobile-button"
          type="primary"
          onClick={showDrawer}
        >
          <Icon type="align-right" />
        </Button>
        <Drawer
          placement="right"
          className="menu_drawer"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <LeftMenu selectedKey={selectedKey} mode="inline" />
          <RightMenu selectedKey={selectedKey} mode="inline" />
        </Drawer>
      </div>
    </nav>
  )
}

export default NavBar