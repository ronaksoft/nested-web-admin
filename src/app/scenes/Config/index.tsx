import {IDispatch} from '~react-redux~redux';
import * as React from 'react';
import {connect} from 'react-redux';

import Filter from './../../components/Filter/index';
import {Form, Row, Col, Icon, Button, Card, Input, Select} from 'antd';
import ConfigApi from '../../api/config/index';
import IGetConstantsResponse from '../../api/config/interfaces/IGetConstantsResponse';
import CPlaceFilterTypes from '../../api/consts/CPlaceFilterTypes';
import appConfig from '../../../app.config';

const FormItem = Form.Item;

export interface IConfigProps {
}

export interface IConfigState {}

class Config extends React.Component<IConfigProps, IConfigState> {
  constructor(props: IConfigProps) {
    super(props);
    this.state = {data : {}};
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
    console.log('aaa');
    const model = this.form.getFieldsValue();
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
    const CreateForm = Form.create({
      onFieldsChange: (e) => {
        const model = this.form.getFieldsValue();
        this.setState({data : model});
        // this.SetData(model);
      },
      mapPropsToFields: (props: any) => {
        return {
          account_grandplaces_limit: {
            value: props.account_grandplaces_limit
          },
          place_max_keyholders: {
            value: props.place_max_keyholders
          },
          place_max_creators: {
            value: props.place_max_creators
          },
          place_max_children: {
            value: props.place_max_children
          },
          post_max_attachments: {
            value: props.post_max_attachments
          },
          post_max_targets: {
            value: props.post_max_targets
          },
          post_retract_time: {
            value: props.post_retract_time
          }
        };
      }
    })((props: any) => {
      const { getFieldDecorator } = props.form;
      return (
        <Form onSubmit={this.handleSubmit}>
          <Row className='toolbar' type='flex' align='center'>
            <Col span={6}>
              <h3>System Limits</h3>
            </Col>
            <Col span={18}>
              <Button type='discard' size='large' onClick={this.handleReset}>Discard</Button>
              <Button type='apply' size='large' onClick={this.handleSubmit.bind(this)} htmlType='submit'>Apply & Restart Server</Button>
            </Col>
          </Row>
          <Row gutter={24} className='dashboardRow' type='flex' align='center'>
            <Col span={12}>
              <Card className='optionCard' loading={false} title='Account Policies'>
                <ul>
                  <FormItem>
                    {getFieldDecorator('account_grandplaces_limit', {
                      rules: [
                        {},
                        {
                          min: appConfig.DEFAULT_ACCOUNT_MIN_GRAND_PLACES,
                          max: appConfig.DEFAULT_ACCOUNT_MAX_GRAND_PLACES,
                          message: 'Not acceptable'
                        }
                      ]
                    })(
                      <li>
                        <div className='option'>
                          <label>Max. Create Grand Places</label>
                          <Input value={this.state.data.account_grandplaces_limit}/>
                        </div>
                        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut.</p>
                      </li>
                    )}

                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('account_grandplaces_limit', {
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
                      <li>
                        <div className='option'>
                          <label>Account Register Mode</label>
                          <Select labelInValue defaultValue={{ key: this.state.data.register_mode }} onChange={this.handleChange}>
                            <Option value='0'>Admin only</Option>
                            <Option value='1'>Anyone</Option>
                          </Select>
                        </div>
                        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut.</p>
                      </li>
                    )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('account_grandplaces_limit', {
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
                      <li>
                        <div className='option'>
                          <label>Password Policy</label>
                          <Select>
                            <Option value='0'>Modrate</Option>
                          </Select>
                        </div>
                        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut.</p>
                      </li>
                    )}
                  </FormItem>
                </ul>
              </Card>
              <Card className='optionCard' loading={false} title='Place Policies'>
                <ul>
                  <li>
                    <div className='option'>
                      <label>Max. Place Levels</label>
                      <Select>
                        <option value='admin'>3 Levels</option>
                      </Select>
                    </div>
                    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut.</p>
                  </li>
                  <FormItem>
                    {getFieldDecorator('place_max_keyholders', {
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
                      <li>
                        <div className='option'>
                          <label>Max. Place Keyholders</label>
                          
                          <Input value={this.state.data.place_max_keyholders}/>
                        </div>
                        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut.</p>
                      </li>
                    )}

                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('place_max_creators', {
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
                      <li>
                        <div className='option'>
                          <label>Max. Place Creators</label>
                          
                          <Input value={this.state.data.place_max_creators}/>
                        </div>
                        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut.</p>
                      </li>
                    )}

                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('place_max_children', {
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
                      <li>
                        <div className='option'>
                          <label>Max. Place Childrens</label>
                          
                          <Input value={this.state.data.place_max_children}/>
                        </div>
                        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut.</p>
                      </li>
                    )}

                  </FormItem>
                </ul>
              </Card>
            </Col>
            <Col span={12}>
              <Card className='optionCard' loading={false} title='Post Limits'>
                <ul>
                  <FormItem>
                    {getFieldDecorator('post_max_attachments', {
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
                      <li>
                        <div className='option'>
                          <label>Max. Attachments per Post</label>
                          
                          <Input value={this.state.data.post_max_attachments}/>
                        </div>
                        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut.</p>
                      </li>
                    )}

                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('post_max_attachment_size', {
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
                      <li>
                        <div className='option'>
                          <label>Max. Attachments Size (Megabytes)</label>
                          
                          <Input/>
                        </div>
                        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut.</p>
                      </li>
                    )}

                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('post_max_targets', {
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
                      <li>
                        <div className='option'>
                          <label>Max. Post Destinations</label>
                          
                          <Input value={this.state.data.post_max_targets}/>
                        </div>
                        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut.</p>
                      </li>
                    )}

                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('post_retract_time', {
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
                      <li>
                        <div className='option'>
                          <label>Max. Post Retract Time</label>
                          
                          <Input value={this.state.data.post_retract_time}/>
                        </div>
                        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut.</p>
                      </li>
                    )}

                  </FormItem>
                </ul>
              </Card>
            </Col>
          </Row>
        </Form>
      );
    });

    return (
      <CreateForm ref={this.saveForm} onChange={this.handleFormChange} />
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
