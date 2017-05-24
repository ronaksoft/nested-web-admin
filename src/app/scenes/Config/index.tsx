import {IDispatch} from '~react-redux~redux';
import * as React from 'react';
import {connect} from 'react-redux';

import Filter from './../../components/Filter/index';
import {Form, Row, Col, InputNumber, Button, Card, Input, Select, message} from 'antd';
import SystemApi from '../../api/system/index';
import IGetConstantsResponse from '../../api/system/interfaces/IGetConstantsResponse';
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
    this.state = {data: {}, disableBtn: true};
  }

  componentDidMount() {
    this.SystemApi = new SystemApi();
    this.GetData();
  }

  GetData() {
    this.SystemApi.getConstants().then((result) => {
      this.setState({
        data: result
      });
    }).catch((error) => {
      console.log('error', error);
    });
  }

  SetData(req: IGetConstantsResponse) {
    this.SystemApi.setConstants(req).then((result) => {
      message.success('Your new configs is set');
      this.setState({
        disableBtn: true
      });
      this.GetData();
    }).catch((error) => {
      console.log(error);
      message.error('Your config not updated !');
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const model = this.props.form.getFieldsValue();
        this.SetData(model);
      }
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.setState({
      disableBtn: true
    });
  }

  handleChange = (value) => {
    this.setState({
      disableBtn: false
    });
  }

  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    switch (rule.field) {
      case 'account_grandplaces_limit':
        if (value >= appConfig.DEFAULT_ACCOUNT_MIN_GRAND_PLACES && value <= appConfig.DEFAULT_ACCOUNT_MAX_GRAND_PLACES) {
          callback();
        } else {
          callback('it must be grather than ' + appConfig.DEFAULT_ACCOUNT_MIN_GRAND_PLACES + ' and lower than ' + appConfig.DEFAULT_ACCOUNT_MAX_GRAND_PLACES);
        }
      break;
      case 'register_mode':
        if (value >= appConfig.DEFAULT_ACCOUNT_MIN_REGISTER_MODE && value <= appConfig.DEFAULT_ACCOUNT_MAX_REGISTER_MODE ) {
          callback();
        } else {
          callback('it wrong selection');
        }
      break;
      case 'place_max_keyholders':
        if (value >= appConfig.DEFAULT_PLACE_MIN_KEYHOLDERS && value <= appConfig.DEFAULT_PLACE_MAX_KEYHOLDERS ) {
          callback();
        } else {
          callback('it must be grather than ' + appConfig.DEFAULT_PLACE_MIN_KEYHOLDERS + ' and lower than ' + appConfig.DEFAULT_PLACE_MAX_KEYHOLDERS);
        }
      break;
      case 'place_max_creators':
        if (value >= appConfig.DEFAULT_PLACE_MIN_CREATORS && value <= appConfig.DEFAULT_PLACE_MAX_CREATORS ) {
          callback();
        } else {
          callback('it must be grather than ' + appConfig.DEFAULT_PLACE_MIN_CREATORS + ' and lower than ' + appConfig.DEFAULT_PLACE_MAX_CREATORS);
        }
      break;
      case 'place_max_children':
        if (value >= appConfig.DEFAULT_PLACE_MIN_CHILDREN && value <= appConfig.DEFAULT_PLACE_MAX_CHILDREN ) {
          callback();
        } else {
          callback('it must be grather than ' + appConfig.DEFAULT_PLACE_MIN_CHILDREN + ' and lower than ' + appConfig.DEFAULT_PLACE_MAX_CHILDREN);
        }
      break;
      case 'place_max_level':
        if (value >= appConfig.DEFAULT_PLACE_MIN_LEVELS && value <= appConfig.DEFAULT_PLACE_MAX_LEVELS ) {
          callback();
        } else {
          callback('it must be grather than ' + appConfig.DEFAULT_PLACE_MIN_LEVELS + ' and lower than ' + appConfig.DEFAULT_PLACE_MAX_LEVELS);
        }
      break;
      case 'post_max_attachments':
        if (value >= appConfig.DEFAULT_POST_MIN_ATTACHMENTS && value <= appConfig.DEFAULT_POST_MAX_ATTACHMENTS ) {
          callback();
        } else {
          callback('it must be grather than ' + appConfig.DEFAULT_POST_MIN_ATTACHMENTS + ' and lower than ' + appConfig.DEFAULT_POST_MAX_ATTACHMENTS);
        }
      break;
      case 'post_max_targets':
        if (value >= appConfig.DEFAULT_POST_MIN_TARGETS && value <= appConfig.DEFAULT_POST_MAX_TARGETS ) {
          callback();
        } else {
          callback('it must be grather than ' + appConfig.DEFAULT_POST_MIN_TARGETS + ' and lower than ' + appConfig.DEFAULT_POST_MAX_TARGETS);
        }
      break;
      case 'post_retract_time':
        if (value >= appConfig.DEFAULT_POST_MIN_RETRACT_TIME && value <= appConfig.DEFAULT_POST_MAX_RETRACT_TIME ) {
          callback();
        } else {
          callback('it must be grather than ' + appConfig.DEFAULT_POST_MIN_RETRACT_TIME + ' and lower than ' + appConfig.DEFAULT_POST_MAX_RETRACT_TIME);
        }
      break;
      default:
        callback();
    }
  }

  saveForm = (form) => this.form = form;

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit.bind(this)} onChange={this.handleChange.bind(this)}>
        <Row className='toolbar' type='flex' align='center'>
          <Col span={6}>
            <h2>System Limits</h2>
          </Col>
          <Col span={18}>{this.state.activeBtn}
            <Button disabled={this.state.disableBtn} type='discard' size='large' onClick={this.handleReset}>Discard</Button>
            <Button disabled={this.state.disableBtn} type='apply' size='large' onClick={this.handleSubmit.bind(this)} htmlType='submit'>Apply</Button>
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
                            required: true,
                            message: 'Required'
                          },
                          {
                            validator: this.checkConfirm,
                          }
                        ]
                      })(
                        <Input />
                      )}
                    </FormItem>
                  </div>
                  {/*<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
                    tincidunt ut.</p>*/}
                </li>
                <li>
                  <div className='option'>
                    <label>Account Register Mode</label>
                    <FormItem>
                      {getFieldDecorator('register_mode', {
                        initialValue: this.state.data.register_mode,
                        rules: [
                          {
                            required: true,
                            message: 'Required'
                          },
                          {
                            validator: this.checkConfirm,
                          }
                        ]
                      })(
                        <Select placeholder={this.state.data.register_mode === 1 ? 'Admin only' : 'Everyone'} style={{ width: 88 }} onChange={this.handleChange}>
                          <Option value={1}>Admin only</Option>
                          <Option value={2}>Everyone</Option>
                        </Select>
                      )}
                    </FormItem>
                  </div>
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
                            message: 'Required'
                          },
                          {
                            validator: this.checkConfirm,
                          }
                        ]
                      })(
                        <Input />
                      )}
                    </FormItem>
                  </div>
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
                            message: 'Required'
                          },
                          {
                            validator: this.checkConfirm,
                          }
                        ]
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </div>
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
                            message: 'Required'
                          },
                          {
                            validator: this.checkConfirm,
                          }
                        ]
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </div>
                </li>
                <li>
                  <div className='option'>
                    <label>Max. Place Childrens Level</label>
                    <FormItem>
                      {getFieldDecorator('place_max_level', {
                        initialValue: this.state.data.place_max_level,
                        rules: [
                          {
                            required: true,
                            message: 'Required'
                          },
                          {
                            validator: this.checkConfirm,
                          }
                        ]
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </div>
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
                            message: 'Required!'
                          },
                          {
                            validator: this.checkConfirm,
                          }
                        ]
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </div>
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
                            message: 'Required'
                          },
                          {
                            validator: this.checkConfirm,
                          }
                        ]
                      })(
                        <Input />
                      )}
                    </FormItem>
                  </div>
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
                            message: 'Required'
                          },
                          {
                            validator: this.checkConfirm,
                          }
                        ]
                      })(
                        <Input />
                      )}
                    </FormItem>
                  </div>
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
