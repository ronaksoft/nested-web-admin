import * as React from 'react';
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

import './style/style.less';

interface IHeaderProps { };

interface IHeaderState { };

export default class Sidebar extends React.Component<IHeaderProps, IHeaderState> {

  constructor(props: any) {
    super(props);
  }

  handleClick = (e) => {
    console.log('click ', e);
  }

  render() {
    return (
      <div
        className='main-menu'>
        <div className='logo'></div>
        <Menu
          onClick={this.handleClick}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode='inline'
          >
          <Menu.Item key='dashboard'>
            <a href='./dashboard'><Icon type='mail' /><span>Dashboard</span></a>
          </Menu.Item>
          <Menu.Item key='places'>
            <a href='./places'><Icon type='mail' /><span>Places</span></a>
          </Menu.Item>
          <Menu.Item key='accounts'>
            <a href='./accounts'><Icon type='mail' /><span>Accounts</span></a>
          </Menu.Item>
          
        </Menu>
      </div>
    );
  }
}

