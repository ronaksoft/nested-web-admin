import * as React from 'react';
import {Menu, Icon, Tooltip, Button} from 'antd';
import CONFIG from 'src/app/config';

import {IcoN} from '../icon/index';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import {Link, withRouter, hashHistory} from 'react-router';

import './style/style.less';

interface IHeaderProps {
    location : any;
}

interface IHeaderState {
    location:any;
}

class Sidebar extends React.Component < IHeaderProps,
IHeaderState > {

    constructor(props : any) {
        super(props);
        this.state = {
            location: null,
        };
    }

    componentDidMount() {
        hashHistory.listen((location, action) => {
            this.setState({
                location: location.pathname
            });
          });
    }

    render() {
        let location = this.state.location || this.props.location.pathname;
        if (location === '/') {
            location = '/dashboard';
        }
        return (
            <div className='main-menu'>
                <Link to='/dashboard' activeClassName='active center'>
                    <div className='logo'></div>
                </Link>
                <Menu
                    selectedKeys={[location]}
                    openKeys={[location]}
                    mode='inline'>
                    <Menu.Item key='/dashboard'>
                        <Tooltip placement='right' title={'Dashboard'}>
                            <Link to='/dashboard' activeClassName='active'>
                                <IcoN size={24} name={'dashbooard24'}/>
                            </Link>
                        </Tooltip>
                    </Menu.Item>
                    <Menu.Item key='/accounts'>
                        <Tooltip placement='right' title={'Accounts'}>
                            <Link to='/accounts' activeClassName='active'>
                                <IcoN size={24} name={'personWire24'}/>
                            </Link>
                        </Tooltip>
                    </Menu.Item>
                    <Menu.Item key='/places'>
                        <Tooltip placement='right' title={'Places'}>
                            <Link to='/places' activeClassName='active'>
                                <IcoN size={24} name={'placesRelationWire24'}/>
                            </Link>
                        </Tooltip>
                    </Menu.Item>
                    <Menu.Item key='/charts'>
                        <Tooltip placement='right' title={'Charts'}>
                            <Link to='/charts' activeClassName='active'>
                                <IcoN size={24} name={'pieChart24'}/>
                            </Link>
                        </Tooltip>
                    </Menu.Item>
                    <Menu.Item key='/config'>
                        <Tooltip placement='right' title={'Settings'}>
                            <Link to='/config' activeClassName='active'>
                                <IcoN size={24} name={'performances24'}/>
                            </Link>
                        </Tooltip>
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
