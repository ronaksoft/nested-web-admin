import * as React from 'react';
import {IDispatch} from '~react-redux~redux';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Row, Col, Popover, Button, Card} from 'antd';
import SystemApi from '../../api/system/index';
import Activity from './components/activity/index';
import {PieChart, Pie, Legend, Sector, Tooltip, Cell, ResponsiveContainer} from 'recharts';

const data = [{name: 'Group A', value: 400}, {name: 'Group B', value: 300},
    {name: 'Group C', value: 300}];
const COLORS = ['#14D769', '#A9EFC7', '#CFF6E0'];

const RADIAN = Math.PI / 180;

export interface IDashboardProps {
}

export interface IDashboardState {
}


const card1Title = <h5>Last 7 Days Activity</h5>;
const card1Extra = <div></div>;
const card2Title = <h5>Company Chart</h5>;
const card2Extra = <div></div>;
const card3Title = <h5>Places</h5>;
const card3Extra = <div></div>;
const card4Title = <h5>Accounts</h5>;
const card4Extra = <div></div>;
const card5Title = <h5>Storage & Plan</h5>;
const card5Extra = <div></div>;

const headline = <h1>Title</h1>;
const content = (
    <div>
        <p>Content</p>
        <p>Content</p>
    </div>
);

const renderCustomizedLabel = ({cx, cy, midAngle, name, innerRadius, outerRadius, percent, index}) => {
    const radius = outerRadius * 1.3;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline='central'
              key={`label-${index}-${name}`}>
            <tspan x={x} textAnchor={x > cx ? 'start' : 'end'}>
                {`${(percent * 100).toFixed(0)}%`}
            </tspan>
            <tspan x={x} dy='1.2em' textAnchor={x > cx ? 'start' : 'end'}>
                {name}
            </tspan>
        </text>
    );
};

class DashboardComponent extends React.Component<IDashboardProps, IDashboardState> {
    constructor(props: IDashboardProps) {
        super(props);
        this.state = {loading: true, data: {}, activeIndex: 0};
    };

    componentDidMount() {
        if (this.props.place) {
            this.setState({
                place: this.props.place,
                visible: this.props.visible,
            });
        }
        this.SystemApi = new SystemApi();
        this.GetData();
    }

    GetData() {

        this.SystemApi.getSystemCounters().then((result) => {

            this.setState({
                system: result,
                data: {
                    places: [
                        {name: 'Grand', value: result.grand_places},
                        {name: 'Locked', value: result.locked_places},
                        {name: 'Unlocked', value: result.unlocked_places}
                    ],
                    accounts: [
                        {name: 'Enabled', value: result.enabled_accounts},
                        {name: 'Disabled', value: result.disabled_accounts},
                    ]
                },
                loading: false
            });
        }).catch((error) => {
            console.log('error', error);
        });
    }

    // onPieEnter (data : any, index : any) {
    //     this.setState({
    //         activeIndex : index,
    //     });
    // }

    render() {
        return (
            <div>
                <Row className='toolbar' type='flex' align='center'>
                    <Col span={6}>
                        <h1>Dashboard</h1>
                    </Col>
                </Row>
                <Row gutter={24} className='dashboardRow'>
                    <Col span={16}>
                        <Card loading={this.state.loading} title={card1Title} extra={card1Extra}>
                            <Activity />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card loading={this.state.loading} title={card2Title} extra={card2Extra}>
                            Whatever content
                        </Card>
                    </Col>
                </Row>
                <Row gutter={24} className='dashboardRow'>
                    <Col span={8}>
                        <Card loading={this.state.loading} title={card3Title} extra={card3Extra}>
                            <ResponsiveContainer width='100%' height={200}>
                                <PieChart onMouseEnter={this.onPieEnter}>
                                    <Pie data={this.state.data.places} activeIndex={this.state.activeIndex}
                                         label={renderCustomizedLabel} fill='#8884d8' innerRadius={40} outerRadius={66}
                                         paddingAngle={0}>
                                        {
                                            data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
                                        }
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card loading={this.state.loading} title={card4Title} extra={card4Extra}>
                            <ResponsiveContainer width='100%' height={200}>
                                <PieChart onMouseEnter={this.onPieEnter}>
                                    <Pie data={this.state.data.accounts} activeIndex={this.state.activeIndex}
                                         label={renderCustomizedLabel} fill='#FFDFDF' innerRadius={40} outerRadius={66}
                                         paddingAngle={0}>
                                        {
                                            data.map((entry, index) => <Cell fill='#FF6464'/>)
                                        }
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card loading={this.state.loading} title={card5Title} extra={card5Extra}>
                            Whatever content
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

function mapStateToProps(state: any) {
    return {};
}

function mapDispatchToProps(dispatch: IDispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DashboardComponent);
