import * as React from 'react';
import {IDispatch} from '~react-redux~redux';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Row, Col, Popover, Button, Card} from 'antd';

export interface IDashboardProps {}

export interface IDashboardState {}


const headline = <h1>Title</h1>;
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
const content = (
  <div>
    <p>Content</p>
    <p>Content</p>
  </div>
);

class DashboardComponent extends React.Component<IDashboardProps, IDashboardState> {
    constructor(props: IDashboardProps) {

        super(props);
        // this.setState({server: new server('nststaging') })
    };



    render() {
        return (
          <div>
              <Row>
                  <Col span={24}>
                    <Popover placement='rightTop' title={headline} content={content} arrowPointAtCenter>
                        <h1>Company Name Dashboard</h1>
                    </Popover>
                  </Col>
              </Row>
              <Row gutter={24} className='dashboardRow'>
                    <Col span={16}>
                      <Card loading title={card1Title} extra={card1Extra}>
                            Whatever content
                        </Card>
                    </Col>
                    <Col span={8}>
                      <Card loading title={card2Title} extra={card2Extra}>
                            Whatever content
                        </Card>
                    </Col>
              </Row>
              <Row gutter={24} className='dashboardRow'>
                    <Col span={8}>
                      <Card loading title={card3Title} extra={card3Extra}>
                            Whatever content
                        </Card>
                    </Col>
                    <Col span={8}>
                      <Card loading title={card4Title} extra={card4Extra}>
                            Whatever content
                        </Card>
                    </Col>
                    <Col span={8}>
                      <Card loading title={card5Title} extra={card5Extra}>
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
