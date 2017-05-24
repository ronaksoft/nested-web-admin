import * as React from 'react';
import {Menu, Dropdown, Icon, Row, Col} from 'antd';
import {PieChart, Pie, Legend, Tooltip, Cell} from 'recharts';

export interface IMenuItem {
    key: string;
    name: string;
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
}


export interface IFilterState {
    selectedItem ?: IMenuItem;
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

    handleGroupChange(menu: IMenuItem, index: number) {
        console.log(arguments);
        this.selectedMenuIndex = index;
        this.setState({
            selectedItem: menu,
        });

        if (typeof this.props.onChange === 'function') {
            this.props.onChange(menu.key);
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
            const data = [
                {name: menu.name, value: menu.count},
                {name: 'total', value: this.props.totalCount - menu.count}
            ];

            const COLORS = [menu.chartColor, menu.bgChartColor];

            menus.push(
                <Menu.Item key={menu.key}>
                    <Row style={{width: 300}} onClick={() => this.handleGroupChange(menu, index)}>
                        <Col span={2}>
                            {
                                this.state.selectedItem.key === menu.key &&
                                <Icon type='check'/>
                            }
                        </Col>
                        <Col span={18}>
                            <div>
                                <p>{menu.name}</p>
                                <span>{menu.count}</span>
                            </div>
                        </Col>
                        <Col span={4}>
                            { !menu.disableChart &&
                            <PieChart width={40} height={40}>
                                <Pie data={data} cx={20} cy={20} innerRadius={12} outerRadius={17} fill='#82ca9d'>
                                    {
                                        data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
                                    }
                                </Pie>
                            </PieChart>
                            }
                        </Col>
                    </Row>
                </Menu.Item>
            );

            // if (index + 1  !== menus.length) {
            menus.push(<Menu.Divider />);
            // }
        });

        return (
            <Row>
                <Col>
                    <h2>
                        <Dropdown overlay={<Menu>{ menus }</Menu>} trigger={['click']}>
                            <a className='ant-dropdown-link' href='#'>
                                <b>{this.state.selectedItem.count} </b>
                                { this.state.selectedItem.name }
                                <Icon type=' nst-ico ic_heavy_arrow_down_solid_24' style={iconStyle}/>
                            </a>
                        </Dropdown>
                    </h2>
                </Col>
            </Row>
        );
    }
}

export default Filter;
