import * as React from 'react';
import {Menu, Icon} from 'antd';
import CONFIG from 'src/app/config';

import {IcoN} from '../icon/index';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import {browserHistory, Link, withRouter} from 'react-router';

import './style/style.less';

interface IHeaderProps {
    location : any;
}

interface IHeaderState {}

class Sidebar extends React.Component < IHeaderProps,
IHeaderState > {

    constructor(props : any) {
        super(props);
    }

    render() {
        let location = this.props.location.pathname;
        if (location === '/') {
            location = '/dashboard';
        }
        return (
            <div className='main-menu'>
                <Link to='/dashboard' activeClassName='active center'>
                    <div className='logo'></div>
                </Link>
                <Menu
                    defaultSelectedKeys={[location]}
                    defaultOpenKeys={[location]}
                    mode='inline'>
                    <Menu.Item key='/dashboard'>
                        <Link to='/dashboard' activeClassName='active'>
                            <IcoN size={24} name={'dashbooard24'}/>
                            {/* <Icon type=' nst-ico ic_dashboard_solid_24'/> */}
                            {/* <span>Dashboard</span> */}
                        </Link>
                    </Menu.Item>
                    <Menu.Item key='/accounts'>
                        <Link to='/accounts' activeClassName='active'>
                            <IcoN size={24} name={'personWire24'}/>
                            {/* <span>Accounts</span> */}
                        </Link>
                    </Menu.Item>
                    <Menu.Item key='/places'>
                        <Link to='/places' activeClassName='active'>
                            <IcoN size={24} name={'placesRelationWire24'}/>
                            {/* <span>Places</span> */}
                        </Link>
                    </Menu.Item>
                    <Menu.Item key='/config'>
                        <Link to='/config' activeClassName='active'>
                            <IcoN size={24} name={'hdd24'}/>
                            {/* <span>System Limits</span> */}
                        </Link>
                    </Menu.Item>
                    <Menu.Item key='/charts'>
                        <Link to='/charts' activeClassName='active'>
                            <IcoN size={24} name={'pieChart24'}/>
                            {/* Charts */}
                        </Link>
                    </Menu.Item>
                    <Menu.Item key='/assistant'>
                        <Link to='/assistant' activeClassName='active'>
                            <IcoN size={24} name={'performances24'}/>
                            {/* Assistant */}
                        </Link>
                    </Menu.Item>
                </Menu>
                <small
                    style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 10
                }}>v.{CONFIG().VERSION}</small>
            </div>
        );
    }
}

export default withRouter(Sidebar);
