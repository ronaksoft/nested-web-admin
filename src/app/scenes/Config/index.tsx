import {IDispatch} from '~react-redux~redux';
import * as React from 'react';
import {connect} from 'react-redux';

import Filter from './../../components/Filter/index';
import {Form, Row, Col, InputNumber, Button, Card, Input, Select} from 'antd';
import ConfigApi from '../../api/config/index';
import IGetConstantsResponse from '../../api/config/interfaces/IGetConstantsResponse';
import CPlaceFilterTypes from '../../api/consts/CPlaceFilterTypes';
import appConfig from '../../../app.config';

const FormItem = Form.Item;

export interface IConfigProps {
}

export interface IConfigState {
}

class Config extends React.Component<IConfigProps, IConfigState> {
  constructor(props: IConfigProps) {
    super(props);
    this.state = {data: {}};
  }

  componentDidMount() {
    this.ConfigApi = new ConfigApi();
    this.GetData();
  }

  GetData() {
    this.ConfigApi.getConstants().then((result) => {
      console.log(result);
      this.setState({
        data: result
      });
    }).catch((error) => {
      console.log('error', error);
    });
  }

  SetData(req: IGetConstantsResponse) {
    this.ConfigApi.setConstants(req).then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log('error', error);
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this);
    const model = this.props.form.getFieldsValue();
    console.log(model);
    this.SetData(model);
    // this.props.form.validateFields((err, values) => {
    //   console.log('Received values of form: ', values);
    // });
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  handleChange = (value) => {
    console.log(value);
  }

  saveForm = (form) => this.form = form;

  render() {
    const {getFieldDecorator} = this.props.form;
    console.log(this.state);
    return (
      <Form onSubmit={this.handleSubmit.bind(this)} onChange={this.handleChange.bind(this)}>
        <Row className='toolbar' type='flex' align='center'>
          <Col span={6}>
            <h3>System Limits</h3>
          </Col>
          <Col span={18}>
            <Button type='discard' size='large' onClick={this.handleReset}>Discard</Button>
            <Button type='apply' size='large' onClick={this.handleSubmit.bind(this)} htmlType='submit'>Apply & Restart
              Server</Button>
          </Col>
        </Row>
        <Row gutter={24} className='dashboardRow' type='flex' align='center'>
          <Col span={12}>
            <Card className='optionCard' loading={false} title='Account Policies'>
              <ul>
                <li>
                  <div className='option'>
                    <label>Max. Create Grand Places</label>
                    <FormItem>
                      {getFieldDecorator('account_grandplaces_limit', {
                        initialValue: this.state.data.account_grandplaces_limit,
                        rules: [
                          {
                            min: appConfig.DEFAULT_ACCOUNT_MIN_GRAND_PLACES,
                            max: appConfig.DEFAULT_ACCOUNT_MAX_GRAND_PLACES,
                            message: 'Not acceptable'
                          }
                        ]
                      })(
                        <Input />
                      )}
                    </FormItem>
                  </div>
                  <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
                    tincidunt ut.</p>
                </li>
                <li>
                  <div className='option'>
                    <label>Account Register Mode</label>
                    <FormItem>
                      {getFieldDecorator('account_register_mode', {
                        initialValue: this.state.data.register_mode,
                        rules: [
                          {
                            required: true,
                            message: 'User ID is required!'
                          },
                          {
                            min: 5,
                            message: 'The user ID is too short!'
                          }
                        ]
                      })(
                        <Select onChange={this.handleChange}>
                          <Option value='0'>Admin only</Option>
                          <Option value='1'>Anyone</Option>
                        </Select>
                      )}
                    </FormItem>
                  </div>
                  <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
                    tincidunt ut.</p>
                </li>
              </ul>
            </Card>
            <Card className='optionCard' loading={false} title='Place Policies'>
              <ul>
                <li>
                  <div className='option'>
                    <label>Max. Place Keyholders</label>

                    <FormItem>
                      {getFieldDecorator('place_max_keyholders', {
                        initialValue: this.state.data.place_max_keyholders,
                        rules: [
                          {
                            required: true,
                            message: 'User ID is required!'
                          },
                          {
                            min: 5,
                            message: 'The user ID is too short!'
                          }
                        ]
                      })(
                        <Input />
                      )}
                    </FormItem>
                  </div>
                  <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
                    tincidunt ut.</p>
                </li>
                <li>
                  <div className='option'>
                    <label>Max. Place Creators</label>

                    <FormItem>
                      {getFieldDecorator('place_max_creators', {
                        initialValue: this.state.data.place_max_creators,
                        rules: [
                          {
                            required: true,
                            message: 'User ID is required!'
                          },
                          {
                            min: 5,
                            message: 'The user ID is too short!'
                          }
                        ]
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </div>
                  <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
                    tincidunt ut.</p>
                </li>
                <li>
                  <div className='option'>
                    <label>Max. Place Childrens</label>
                    <FormItem>
                      {getFieldDecorator('place_max_children', {
                        initialValue: this.state.data.place_max_children,
                        rules: [
                          {
                            required: true,
                            message: 'User ID is required!'
                          },
                          {
                            min: 5,
                            message: 'The user ID is too short!'
                          }
                        ]
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </div>
                  <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
                    tincidunt ut.</p>
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

                    <FormItem>
                      {getFieldDecorator('post_max_attachments', {
                        initialValue: this.state.data.post_max_attachments,
                        rules: [
                          {
                            required: true,
                            message: 'User ID is required!'
                          },
                          {
                            min: 0,
                            message: 'The user ID is too short!'
                          }
                        ]
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </div>
                  <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
                    tincidunt ut.</p>
                </li>
                <li>
                  <div className='option'>
                    <label>Max. Post Destinations</label>

                    <FormItem>
                      {getFieldDecorator('post_max_targets', {
                        initialValue: this.state.data.post_max_targets,
                        rules: [
                          {
                            required: true,
                            message: 'User ID is required!'
                          },
                          {
                            min: 5,
                            message: 'The user ID is too short!'
                          }
                        ]
                      })(
                        <Input />
                      )}
                    </FormItem>
                  </div>
                  <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
                    tincidunt ut.</p>
                </li>
                <li>
                  <div className='option'>
                    <label>Max. Post Retract Time</label>


                    <FormItem>
                      {getFieldDecorator('post_retract_time', {
                        initialValue: this.state.data.post_retract_time,
                        rules: [
                          {
                            required: true,
                            message: 'User ID is required!'
                          },
                          {
                            min: 5,
                            message: 'The user ID is too short!'
                          }
                        ]
                      })(
                        <Input />
                      )}
                    </FormItem>
                  </div>
                  <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
                    tincidunt ut.</p>
                </li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Form>
    )
      ;
  }
}

function mapStateToProps(state: any) {
  return {};
}

function mapDispatchToProps(dispatch: IDispatch) {
  return {};
}


const WrappedTimeRelatedForm = Form.create()(connect(
  mapStateToProps,
  mapDispatchToProps
)(Config));

export default WrappedTimeRelatedForm;
