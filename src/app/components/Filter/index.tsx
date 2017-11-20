import * as React from 'react';
import {Menu, Dropdown, Icon, Row, Col} from 'antd';
import {PieChart, Pie, Legend, Tooltip, Cell} from 'recharts';
import {IcoN} from '../icon/index';
// import './filter.less';

export interface IMenuItem {
    key: string;
    name: string;
    icon: string;
    count: number;
    chartColor: string;
    bgChartColor: string;
    style ?: string;
    class ?: string;
    disableChart ?: boolean;
}

export interface IFilterProps {
    menus: Array<IMenuItem>;
    totalCount: number;
    onChange: any;
    counters: any;
}

export interface IFilterState {
    selectedItem ?: IMenuItem;
    menus: Array<IMenuItem>;
}
class Filter extends React.Component<IFilterProps, IFilterState> {
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

        const iconStyle = {
            width: '24px',
            height: '24px',
            verticalAlign: 'middle'
        };

        const menus = [];
        this.state.menus.forEach((menu: IMenuItem, index: number) => {

            // console.log(this);
            menus.push(
                <Menu.Item key={index}>
                    <div>
                        <IcoN size={16} name={menu.icon}/>
                        <p>{menu.name}</p>
                        {
                            this.state.selectedItem.key === menu.key &&
                            <Icon type='check'/>
                        }
                    </div>
                </Menu.Item>
            );

            // if (index + 1  !== menus.length) {
            menus.push(<Menu.Divider/>);
            // }
        });

        return (
            <h2>
                <Dropdown overlay={<Menu onClick={this.handleGroupChange.bind(this)}>{menus}</Menu>}
                    trigger={['click']}>
                    <a className='ant-dropdown-link' href='#'>
                        <span>{this.state.selectedItem.name}</span>
                        <IcoN size={16} name='sort16'/>
                    </a>
                </Dropdown>
            </h2>
        );
    }
}

export default Filter;
