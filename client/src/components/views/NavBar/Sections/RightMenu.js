/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Menu, Icon, Badge } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";

function RightMenu(props) {
  const user = useSelector(state => state.user)

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        alert('Log Out Failed')
      }
    });
  };

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode} selectedKeys={props.selectedKey}>
        <Menu.Item key="/login">
          <a href="/login">Log In</a>
        </Menu.Item>
        <Menu.Item key="/register">
          <a href="/register">Sign Up</a>
        </Menu.Item>
      </Menu>
    )
  } else {
    return (
      <Menu mode={props.mode} selectedKeys={props.selectedKey}>

        {/* <Menu.Item key="history">
          <a href="/history">History</a>
        </Menu.Item> */}

        <Menu.Item key="/sell">
          <a href="/sell">Sell Your Item</a>
        </Menu.Item>
        <Menu.Item key="/mylistings">
          <a href="/mylistings">My Listings</a>
        </Menu.Item>
        <Menu.Item key="/offers">
          <a href="/offers">Offer History</a>
        </Menu.Item>

        {/* <Menu.Item key="cart" style={{ paddingBottom: 3 }}>
          <Badge count={user.userData && user.userData.cart.length}>
            <a href="/user/cart" style={{ marginRight: -22 , color:'#667777'}}>
              <Icon type="shopping-cart" style={{ fontSize: 30, marginBottom: 3 }} />
            </a>
          </Badge>
        </Menu.Item> */}

        <Menu.SubMenu style={{color: '#ab6b0d'}} title={user.userData && user.userData.name}>
        <Menu.Item key="changePassword">
        <a href="/changePassword">Change Password</a>
        </Menu.Item>
        <Menu.Item key="logout">
          <a onClick={logoutHandler}>Log Out</a>
        </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    )
  }
}

export default withRouter(RightMenu);

