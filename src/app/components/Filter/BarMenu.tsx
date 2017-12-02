import * as React from 'react';
import {Menu, Dropdown, Icon, Row, Col} from 'antd';
import {PieChart, Pie, Legend, Tooltip, Cell} from 'recharts';
import {IcoN} from '../icon/index';
// import './filter.less';

export interface IMenuItem {
    key: string;
    name: string;
    icon: string;
    count?: number;
    chartColor?: string;
    bgChartColor?: string;
    style ?: string;
    class ?: string;
    disableChart ?: boolean;
}

export interface IFilterProps {
    menus: Array<IMenuItem>;
    onChange: any;
    label?: string;
    labelIcon?: string;
}

export interface IFilterState {
    selectedItem ?: IMenuItem;
    menus: Array<IMenuItem>;
}
class BarMenu extends React.Component<IFilterProps, IFilterState> {
    selectedMenuIndex: number;

    constructor(props: IFilterProps) {
        super(props);
        if (this.props.menus[0]) {
            this.selectedMenuIndex = 0;
            this.state = {
                selectedItem: this.props.menus[0],
                menus: this.props.menus
            };
        }
    }

    handleGroupChange(menu: any) {
        this.selectedMenuIndex = parseInt(menu.key, 0);
        this.setState({
            selectedItem: this.state.menus[this.selectedMenuIndex],
        });

        if (typeof this.props.onChange === 'function') {
            this.props.onChange(this.state.menus[this.selectedMenuIndex].key);
        }
    }

    componentWillReceiveProps(newProps: IFilterProps) {
        this.setState({
            selectedItem: newProps.menus[this.selectedMenuIndex],
            menus: newProps.menus
        });
    }


    render() {
        if(this.state.menus.length > 1) {
            const menus = [];
            this.state.menus.forEach((menu: IMenuItem, index: number) => {
                menus.push(
                    <Menu.Item key={index}>
                        <Row type='flex' align='middle' className='filterPopover'>
                            <IcoN size={16} name={menu.icon}/>
                            <p>{menu.name}</p>
                            <span>{menu.count}</span>
                        </Row>
                    </Menu.Item>
                );
            });
            let label = this.state.menus.map( menu => menu.name).join(' / ');
            return (
                <Dropdown overlay={<Menu onClick={this.handleGroupChange.bind(this)}>{menus}</Menu>}
                    trigger={['click']}>
                    <span className='bar-item'>
                        {label}
                        <div className='bar-icon'>
                            <IcoN size={16} name='arrow16'/>
                        </div>
                    </span>
                </Dropdown>
            );
        } else {
            return (
                <span className='bar-item' onClick={this.handleGroupChange.bind(this)}>
                    {this.state.menus[0].name}
                    <div className='bar-icon'>
                        <IcoN size={16} name={this.state.menus[0].icon}/>
                    </div>
                </span>
            );
        }
    }
}

export default BarMenu;
