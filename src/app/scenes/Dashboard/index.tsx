import * as React from 'react';
import {IDispatch} from '~react-redux~redux';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Row, Col, Popover, Button, Card} from 'antd';
import SystemApi from '../../api/system/index';
import {PieChart, Pie, Legend, Sector, Tooltip, Cell} from 'recharts';
const data = [{name: 'Group A', value: 400}, {name: 'Group B', value: 300},
                  {name: 'Group C', value: 300}];
const COLORS = ['#14D769', '#A9EFC7', '#CFF6E0'];

const RADIAN = Math.PI / 180;
export interface IDashboardProps {}

export interface IDashboardState {}


const card1Title = <h5>Last 7 Days Activity</h5>;
const card1Extra = <div>extra</div>;
const card2Title = <h5>Company Chart</h5>;
const card2Extra = <div>extra</div>;
const card3Title = <h5>Places</h5>;
const card3Extra = <div>extra</div>;
const card4Title = <h5>Accounts</h5>;
const card4Extra = <div>extra</div>;
const card5Title = <h5>Storage & Plan</h5>;
const card5Extra = <div>extra</div>;

const headline = <h1>Title</h1>;
const content = (
  <div>
    <p>Content</p>
    <p>Content</p>
  </div>
);

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
                data : {
                    places : [
                        {name : 'Grand places', value : result.grand_places},
                        {name : 'Locked places', value : result.locked_places},
                        {name : 'Unlocked places', value : result.unlocked_places}
                    ],
                    accounts : [
                        {name : 'Enabled accounts' , value : result.enabled_accounts},
                        {name : 'Disabled accounts' , value : result.disabled_accounts},
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
                    <Popover placement='rightTop' title={headline} content={content} arrowPointAtCenter>
                        <h1>Company Name Dashboard</h1>
                    </Popover>
                  </Col>
              </Row>
              <Row gutter={24} className='dashboardRow'>
                    <Col span={16}>
                      <Card loading={this.state.loading} title={card1Title} extra={card1Extra}>
                            Whatever content
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
                        <PieChart width={224} height={200} onMouseEnter={this.onPieEnter}>
                            <Pie data={this.state.data.places} activeIndex={this.state.activeIndex} label fill='#8884d8' cx={104} cy={104} innerRadius={40} outerRadius={66} paddingAngle={0}>
                            {
                                data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
                            }
                            </Pie>
                        </PieChart>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card loading={this.state.loading} title={card4Title} extra={card4Extra}>
                        <PieChart width={224} height={200} onMouseEnter={this.onPieEnter}>
                            <Pie data={this.state.data.accounts} activeIndex={this.state.activeIndex} label fill='#FFDFDF' cx={104} cy={104} innerRadius={40} outerRadius={66} paddingAngle={0}>
                            {
                                data.map((entry, index) => <Cell fill='#FF6464'/>)
                            }
                            </Pie>
                        </PieChart>
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
