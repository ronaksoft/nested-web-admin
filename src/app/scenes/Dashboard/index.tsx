import * as React from 'react';
import {IDispatch} from '~react-redux~redux';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Row, Col, Popover, Button, Card, Dropdown, Menu, Icon} from 'antd';
import SystemApi from '../../api/system/index';
import ReportType from '../../api/report/ReportType';
import MeasureType from '../../components/ChartCard/MeasureType';
import OnlineUsers from '../../components/onlineUsers/index';
import ChartCard from '../../components/ChartCard/index';
import {PieChart, Pie, Legend, Sector, Tooltip, Cell, ResponsiveContainer} from 'recharts';
import {Link} from 'react-router';

const data = [{name: 'Group A', value: 400}, {name: 'Group B', value: 300},
    {name: 'Group C', value: 300}];
const COLORS = ['#FF3344', '#323D47'];
const RED_COLORS = ['#323D47', '#ADB1B5'];

const RADIAN = Math.PI / 180;

export interface IDashboardProps {
}

export interface IDashboardState {
    data: any;
    loading: boolean;
    activeIndex: number;
    activityPeriod: string;
    companyName: string;
}

const card2Title = <h5>Company Chart</h5>;
const card2Extra = <div></div>;
const card3Title = <h5><Link to='/places'>Places</Link></h5>;
const card3Extra = <div></div>;
const card4Title = <h5><Link to='/accounts'>Accounts</Link></h5>;
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
        this.state = {
            loading: true,
            data: {
                accounts: [],
                places: [],
            },
            activeIndex: 0,
            activityPeriod: 'week',
            companyName: 'Company Name',
        };
        if (window.companyDetails) {
            this.state.companyName = window.companyDetails.company_name;
        }
    }

    componentDidMount() {
        if (this.props.place) {
            this.setState({
                place: this.props.place,
                visible: this.props.visible,
                activityPeriod: 'week'
            });
        }
        this.SystemApi = new SystemApi();
        if (!window.companyDetails) {
            this.SystemApi.getCompanyInfo().then((data) => {
                window.companyDetails = data;
                this.setState({
                    companyName: data.company_name,
                });
            });
        }
        this.GetData();
    }

    GetData() {

        this.SystemApi.getSystemCounters().then((result) => {
            this.setState({
                system: result,
                data: {
                    places: [
                        {name: 'Shared Places', value: result.unlocked_places + result.locked_places + result.grand_places},
                        {name: 'Individual Places', value: result.personal_places}
                    ],
                    accounts: [
                        {name: 'Inactive Accounts', value: result.disabled_accounts},
                        {name: 'Active Accounts', value: result.enabled_accounts},
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
            <div className='dashboard'>
                <Row type='flex' className='scene-head'>
                    <h2>{this.state.companyName} Dashboard</h2>
                </Row>
                <Row gutter={24} className='dashboardRow'>
                    <Col span={8}>
                        <OnlineUsers/>
                    </Col>
                    <Col span={16}>
                        <ChartCard title={['System Activities']} measure={MeasureType.NUMBER} height={320}
                            dataType={[ReportType.AllRequests]}مخ
                                   color={['#8884d8']} syncId='nested'/>
                    </Col>
                    {/*<Col span={8}>
                        <Card loading={this.state.loading} title={card2Title} extra={card2Extra}>
                            Whatever content
                        </Card>
                    </Col>*/}
                </Row>
                <Row gutter={24} className='dashboardRow'>
                    <Col span={12}>
                        {this.state.data.accounts && <Card loading={this.state.loading} title={card4Title} extra={card4Extra}>
                            {this.state.data.accounts[1] && <p className='chart-info' style={{color: COLORS[1]}}>
                                <abbr>Active Accounts</abbr>
                                <span>{this.state.data.accounts[1].value}</span>
                            </p>}
                            {this.state.data.accounts[0] && <p className='chart-info' style={{color: COLORS[0]}}>
                                <abbr>Inactive Accounts</abbr>
                                <span>{this.state.data.accounts[0].value}</span>
                            </p>}
                            <ResponsiveContainer width='100%' height={200}>
                                <PieChart onMouseEnter={this.onPieEnter}>
                                    <Pie data={this.state.data.accounts} activeIndex={this.state.activeIndex}
                                        label={renderCustomizedLabel} fill='#FFDFDF' innerRadius={40} outerRadius={66}
                                        paddingAngle={0}>
                                        {
                                            data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)
                                        }
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </Card>}
                    </Col>
                    <Col span={12}>
                        <Card loading={this.state.loading} title={card3Title} extra={card3Extra}>
                            {this.state.data.places[0] && <p className='chart-info' style={{color: RED_COLORS[0]}}>
                                <abbr>Shared Places</abbr>
                                <span>{this.state.data.places[0].value}</span>
                            </p>}
                            {this.state.data.places[1] && <p className='chart-info' style={{color: RED_COLORS[1]}}>
                                <abbr>Individual Places</abbr>
                                <span>{this.state.data.places[1].value}</span>
                            </p>}
                            <ResponsiveContainer width='100%' height={200}>
                                <PieChart onMouseEnter={this.onPieEnter}>
                                    <Pie data={this.state.data.places} activeIndex={this.state.activeIndex}
                                        label={renderCustomizedLabel} fill='#8884d8' innerRadius={40} outerRadius={66}
                                        paddingAngle={0}>
                                        {
                                            data.map((entry, index) => <Cell key={index} fill={RED_COLORS[index % COLORS.length]}/>)
                                        }
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>
                    {/*<Col span={8}>
                        <Card loading={this.state.loading} title={card5Title} extra={card5Extra}>
                            Whatever content
                        </Card>
                    </Col>*/}
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
