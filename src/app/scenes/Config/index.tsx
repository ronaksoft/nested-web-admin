import {IDispatch} from '~react-redux~redux';
import * as React from 'react';
import {connect} from 'react-redux';

import Filter from './../../components/Filter/index';
import {Row, Col, Icon, Button, Card} from 'antd';
import SystemApi from '../../api/system/index';
import IGetSystemCountersResponse from '../../api/system/interfaces/IGetSystemCountersResponse';
import CPlaceFilterTypes from '../../api/consts/CPlaceFilterTypes';


export interface IConfigProps {
}

export interface IConfigState {}

class Config extends React.Component<IConfigProps, IConfigState> {
  constructor(props: IConfigProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let systemApi = new SystemApi();
    systemApi.getSystemCounters()
      .then((data: IGetSystemCountersResponse) => {
        this.setState({
          counters: data,
          loadCounters: true
        });
      });
  }


  render() {


    return (
      <div>
        <Row className='toolbar' type='flex' align='center'>
          <Col span={6}>
            <h3>System Limits</h3>
          </Col>
          <Col span={18}>
            <Button type='discard' size='large' onClick={this.create}>Discard</Button>
            <Button type='apply' size='large' onClick={this.create}>Apply & Restart Server</Button>
          </Col>
        </Row>
        <Row gutter={24} className='dashboardRow' type='flex' align='center'>
          <Col span={12}>
            <Card className='optionCard' loading={false} title='Account Policies'>
                <ul>
                  <li>
                    <div className='option'>
                      <label>Account Register Mode</label>
                      <select>
                        <option value='admin'>Admin Only</option>
                      </select>
                    </div>
                    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut.</p>
                  </li>
                  <li>
                    <div className='option'>
                      <label>Password Policy</label>
                      <select>
                        <option value='admin'>Modrate</option>
                      </select>
                    </div>
                    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut.</p>
                  </li>
                </ul>
            </Card>

            <Card className='optionCard' loading={false} title='Place Policies'>
                <ul>
                  <li>
                    <div className='option'>
                      <label>Max. Place Levels</label>
                      <select>
                        <option value='admin'>3 Levels</option>
                      </select>
                    </div>
                    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut.</p>
                  </li>
                </ul>
            </Card>
          </Col>
          <Col span={12}>
          <Card className='optionCard' loading={false} title='Post Limits'>
              <ul>
                  <li>
                    <div className='option'>
                      <label>Max. Attachments per Post</label>
                      <input type='text'/>
                    </div>
                    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut.</p>
                  </li>
                  <li>
                    <div className='option'>
                      <label>Max. Attachments Size (Megabytes)</label>
                      <input type='text'/>
                    </div>
                    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut.</p>
                  </li>
                  <li>
                    <div className='option'>
                      <label>Max. Post Destinations</label>
                      <input type='text'/>
                    </div>
                    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut.</p>
                  </li>
                </ul>
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
)(Config);
