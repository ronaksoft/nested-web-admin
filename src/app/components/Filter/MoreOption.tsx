import * as React from 'react';
import {Menu, Dropdown, Icon, Row, Col, Switch} from 'antd';
import {IcoN} from '../icon/index';
// import './filter.less';

export interface IMenuItem {
    key: string;
    name: string;
    icon: string;
    action: any;
    class?: string;
    switch?: boolean;
}

export interface IFilterProps {
    menus: Array<IMenuItem>;
    deviders?: Array<number>;
}

export interface IFilterState {
    menus: Array<IMenuItem>;
}
class MoreOption extends React.Component<IFilterProps, IFilterState> {
    selectedMenuIndex: number;

    constructor(props: IFilterProps) {
        super(props);
        if (this.props.menus[0]) {
            this.selectedMenuIndex = 0;
            this.state = {
                menus: this.props.menus
            };
        }
    }

    handleGroupChange(menu: any) {
        this.selectedMenuIndex = parseInt(menu.key, 0);
        const item = this.state.menus[this.selectedMenuIndex];
        if (typeof item.action === 'function') {
            item.action(item);
        }
    }

    componentWillReceiveProps(newProps: IFilterProps) {
        this.setState({
            menus: newProps.menus
        });
    }


    render() {
        // console.log(this.state.menus);
        const menus = [];
        const classNames = ['filterPopover'];
        this.state.menus.forEach((menu: IMenuItem, index: number) => {
            const haveSwitch = menu.switch || menu.switch === false;
            if (menu.class) {
                classNames.push(menu.class);
            }
            menus.push(
                <Menu.Item key={index}>
                    <Row type='flex' align='middle' className={classNames.join(' ')}>
                        <IcoN size={16} name={menu.icon}/>
                        <p>{menu.name}</p>
                        {haveSwitch && (
                            <Switch
                                defaultChecked={menu.switch}
                                onChange={menu.action}
                            />)
                        }
                    </Row>
                </Menu.Item>
            );

            if (this.props.deviders && this.props.deviders.indexOf(index) > -1) {
                menus.push(<Menu.Divider  key={index + 'aaa'}/>);
            }
        });

        return (
            <Dropdown overlay={<Menu onClick={this.handleGroupChange.bind(this)} selectable={false}>{menus}</Menu>}
                trigger={['click']}>
                <a className='ant-dropdown-link' href='#'>
                    <IcoN size={24} name='more24'/>
                </a>
            </Dropdown>
        );
    }
}

export default MoreOption;
