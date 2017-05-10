import * as React from 'react';
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import {browserHistory, Link} from 'react-router';

import './style/style.less';

interface IHeaderProps { };

interface IHeaderState { };

export default class Sidebar extends React.Component<IHeaderProps, IHeaderState> {

  constructor(props: any) {
    super(props);
  }


  render() {
    return (
      <div
        className='main-menu'>
        <div className='logo'></div>
        <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode='inline'
          >
          <Menu.Item key='dashboard'>
            <Link to='/dashboard' activeClassName='active'><Icon type='compass' /><span>Dashboard</span></Link>
          </Menu.Item>
          <Menu.Item key='places'>
            <Link to='/places' activeClassName='active'><Icon type='database' /><span>Places</span></Link>
          </Menu.Item>
          <Menu.Item key='accounts'>
            <Link to='/accounts' activeClassName='active'><Icon type='team' /><span>Accounts</span></Link>
            
          </Menu.Item>
          
        </Menu>
      </div>
    );
  }
}

