import * as React from 'react';
import {Menu, Icon} from 'antd';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import {browserHistory, Link, withRouter} from 'react-router';

import './style/style.less';

interface IHeaderProps {
};

interface IHeaderState {
};

class Sidebar extends React.Component<IHeaderProps, IHeaderState> {

    constructor(props: any) {
        super(props);
    }


    render() {
        console.log(this.props);
        return (
            <div
                className='main-menu'>
                <Link to='/dashboard' activeClassName='active'>
                    <div className='logo'></div>
                </Link>
                <Menu
                    defaultSelectedKeys={['dahboard']}
                    defaultOpenKeys={['dahboard']}
                    mode='inline'
                >
                    <Menu.Item key='dashboard' key='dahboard'>
                        <Link to='/dashboard' activeClassName='active'><Icon
                            type=' nst-ico ic_dashboard_solid_24'/><span>Dashboard</span></Link>
                    </Menu.Item>
                    <Menu.Item key='places' key='places'>
                        <Link to='/places' activeClassName='active'><Icon type=' nst-ico ic_places_solid_24'/><span>Places</span></Link>
                    </Menu.Item>
                    <Menu.Item key='accounts' key='accounts'>
                        <Link to='/accounts' activeClassName='active'><Icon type=' nst-ico ic_account_solid_24'/><span>Accounts</span></Link>
                    </Menu.Item>
                    <Menu.Item key='config' key='config'>
                        <Link to='/config' activeClassName='active'><Icon type=' nst-ico ic_access_solid_24'/><span>System Limits</span></Link>
                    </Menu.Item>
                </Menu>
            </div>
        );
    }
}

export default withRouter(Sidebar);
