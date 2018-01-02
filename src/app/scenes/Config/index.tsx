import {IDispatch} from '~react-redux~redux';
import * as React from 'react';
import {connect} from 'react-redux';

import Filter from './../../components/Filter/index';
import {Form, Row, Col, InputNumber, Button, Card, Input, Select, message, Upload} from 'antd';
import SystemApi from '../../api/system/index';
import MessageApi from '../../api/message/index';
import IGetConstantsResponse from '../../api/system/interfaces/IGetConstantsResponse';
import IGetStringConstantsResponse from '../../api/system/interfaces/IGetStringConstantsResponse';
import CPlaceFilterTypes from '../../api/consts/CPlaceFilterTypes';
import appConfig from '../../../app.config';
import HealthCheck from './components/HealthCheck/index';
import EditMessageModal from './components/EditMessageModal/index';
import AAA from '../../services/classes/aaa/index';
import CONFIG from 'src/app/config';
import AccountApi from '../../api/account/account';
import _ from 'lodash';
const { TextArea } = Input;
const Option = Select.Option;
const FormItem = Form.Item;

export interface IConfigProps {
}

export interface IConfigState {
    editMessageModal: boolean;
    data: any;
    stringConstants: any;
    company_logo_universal_id: string;
    token: string;
    disableBtn: boolean;
    imageIsUploading: boolean;
    uploadPercent: number;
    welcomeMessage: any;
}

class Config extends React.Component<IConfigProps, IConfigState> {
    submitForms: number = 0;
    constructor(props: IConfigProps) {
        super(props);
        this.state = {
            data: {},
            uploadPercent: 0,
            stringConstants: {},
            welcomeMessage: {
                subject: '',
                body: '',
            },
            token: '',
            company_logo_universal_id: '',
            disableBtn: true,
            imageIsUploading: false,
            editMessageModal: false
        };
    }

    componentDidMount() {
        this.SystemApi = new SystemApi();
        this.MessageApi = new MessageApi();
        this.accountApi = new AccountApi();
        this.GetData();
        this.loadUploadToken();
    }

    loadUploadToken() {
        this
            .accountApi
            .getUploadToken()
            .then((result) => {
                this.setState({token: result.token});
            }, (error) => {
                this.setState({token: null});
            });
    }
    GetData() {
        this.SystemApi.getConstants().then((result) => {
            this.setState({
                data: result
            });
        }).catch((error) => {
            console.log('error', error);
        });
        this.SystemApi.getStringConstants().then((result) => {
            this.setState({
                stringConstants: result
            });
        }).catch((error) => {
            console.log('error', error);
        });
        this.MessageApi.getMessageTemplate().then((result) => {
            if(result.WELCOME_MSG) {
                this.setState({
                    welcomeMessage: {
                        body: result.WELCOME_MSG.body,
                        subject: result.WELCOME_MSG.subject
                    }
                });
            }
        }).catch((error) => {
            console.log('error', error);
        });
    }

    SetData(req: any) {
        this.SystemApi.setConstants(req).then((result) => {
            this.saveRespons(true);
        }).catch((error) => {
            this.saveRespons(false, error);
        });
    }

    SetStringConstants(req: any) {
        this.SystemApi.setStringConstants(req).then((result) => {
            this.saveRespons(true);
        }).catch((error) => {
            this.saveRespons(false, error);
        });
    }

    saveRespons(successful: boolean, error?: string) {
        this.submitForms++;
        if(this.submitForms !== 2) {
            return;
        }
        if (successful) {
            message.success('Your new configs is set');
            this.setState({
                disableBtn: true
            });
            this.GetData();
        } else {
            console.log(error);
            message.error('Your config not updated !');
        }
        this.submitForms = 0;
    }

    beforeUpload() {
        this.setState({
            uploadPercent: 0,
            imageIsUploading: true,
        });
        if (!this.state.token) {
            return false;
        }
    }

    removeLogo() {
        const stringConstants = _.clone(this.state.stringConstants);
        stringConstants.company_logo = '';
        this.setState({
            disableBtn: false,
            stringConstants
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.imageIsUploading) {
            return message.warning('Wait for uploading finish');
        }
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const model = this.props.form.getFieldsValue();
                console.log(model);
                let intModel: any = {};
                let strModel: any = {};
                for (let k in this.state.data) {
                    if (model[k] !== null) {
                        intModel[k] = model[k];
                    }
                }
                for (const k in this.state.stringConstants) {
                    strModel[k] = model[k];
                }
                if (typeof strModel.company_logo === 'object') {
                    strModel.company_logo = this.state.company_logo_universal_id;
                } else {
                    strModel.company_logo = this.state.stringConstants.company_logo;
                }
                this.SetData(intModel);
                this.SetStringConstants(strModel);
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

    editWelcomeMessage = () => {
        this.setState({
            editMessageModal : !this.state.editMessageModal
        });
    }

    submitMessage = (msg: any) => {
        const req = {
            msg_id: 'WELCOME_MSG',
            msg_body: msg.body,
            msg_subject: msg.subject
        };
        this.MessageApi.setMessageTemplate(req).then((result) => {
            message.success('Welcome message template is set');
            this.setState({
                welcomeMessage: {
                    body: msg.body,
                    subject: msg.subject
                }
            });
            this.GetData();
        }).catch((error) => {
            console.log(error);
            message.error('Welcome message cant be set');
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
                if (value >= appConfig.DEFAULT_ACCOUNT_MIN_REGISTER_MODE && value <= appConfig.DEFAULT_ACCOUNT_MAX_REGISTER_MODE) {
                    callback();
                } else {
                    callback('it wrong selection');
                }
                break;
            case 'place_max_keyholders':
                if (value >= appConfig.DEFAULT_PLACE_MIN_KEYHOLDERS && value <= appConfig.DEFAULT_PLACE_MAX_KEYHOLDERS) {
                    callback();
                } else {
                    callback('it must be grather than ' + appConfig.DEFAULT_PLACE_MIN_KEYHOLDERS + ' and lower than ' + appConfig.DEFAULT_PLACE_MAX_KEYHOLDERS);
                }
                break;
            case 'place_max_creators':
                if (value >= appConfig.DEFAULT_PLACE_MIN_CREATORS && value <= appConfig.DEFAULT_PLACE_MAX_CREATORS) {
                    callback();
                } else {
                    callback('it must be grather than ' + appConfig.DEFAULT_PLACE_MIN_CREATORS + ' and lower than ' + appConfig.DEFAULT_PLACE_MAX_CREATORS);
                }
                break;
            case 'place_max_children':
                if (value >= appConfig.DEFAULT_PLACE_MIN_CHILDREN && value <= appConfig.DEFAULT_PLACE_MAX_CHILDREN) {
                    callback();
                } else {
                    callback('it must be grather than ' + appConfig.DEFAULT_PLACE_MIN_CHILDREN + ' and lower than ' + appConfig.DEFAULT_PLACE_MAX_CHILDREN);
                }
                break;
            case 'place_max_level':
                if (value >= appConfig.DEFAULT_PLACE_MIN_LEVELS && value <= appConfig.DEFAULT_PLACE_MAX_LEVELS) {
                    callback();
                } else {
                    callback('it must be grather than ' + appConfig.DEFAULT_PLACE_MIN_LEVELS + ' and lower than ' + appConfig.DEFAULT_PLACE_MAX_LEVELS);
                }
                break;
            case 'post_max_attachments':
                if (value >= appConfig.DEFAULT_POST_MIN_ATTACHMENTS && value <= appConfig.DEFAULT_POST_MAX_ATTACHMENTS) {
                    callback();
                } else {
                    callback('it must be grather than ' + appConfig.DEFAULT_POST_MIN_ATTACHMENTS + ' and lower than ' + appConfig.DEFAULT_POST_MAX_ATTACHMENTS);
                }
                break;
            case 'post_max_targets':
                if (value >= appConfig.DEFAULT_POST_MIN_TARGETS && value <= appConfig.DEFAULT_POST_MAX_TARGETS) {
                    callback();
                } else {
                    callback('it must be grather than ' + appConfig.DEFAULT_POST_MIN_TARGETS + ' and lower than ' + appConfig.DEFAULT_POST_MAX_TARGETS);
                }
                break;
            case 'post_retract_time':
                if (value >= appConfig.DEFAULT_POST_MIN_RETRACT_TIME && value <= appConfig.DEFAULT_POST_MAX_RETRACT_TIME) {
                    callback();
                } else {
                    callback('it must be grather than ' + appConfig.DEFAULT_POST_MIN_RETRACT_TIME + ' and lower than ' + appConfig.DEFAULT_POST_MAX_RETRACT_TIME);
                }
                break;
            case 'post_max_labels':
                if (value >= appConfig.DEFAULT_POST_MIN_LABELS && value <= appConfig.DEFAULT_POST_MAX_LABELS) {
                    callback();
                } else {
                    callback('it must be grather than ' + appConfig.DEFAULT_POST_MIN_LABELS + ' and lower than ' + appConfig.DEFAULT_POST_MAX_LABELS);
                }
                break;
            case 'attach_max_size':
                callback();
                break;
            default:
                callback();
        }
    }

    pictureChange(info: any) {
        if (info.event && info.event.percent) {
            this.setState({
                uploadPercent: parseInt(info.event.percent.toFixed(2)),
            });
        }
        if (info.file.status === 'done') {
            this.setState({
                company_logo_universal_id: info.file.response.data[0].universal_id,
                imageIsUploading: false,
                uploadPercent: 0,
            });
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }
    // saveForm = (form) => this.form = form;

    render() {
        const {getFieldDecorator} = this.props.form;
          const credentials = AAA.getInstance().getCredentials();
          const uploadUrl = `${CONFIG().STORE.URL}/upload/place_pic/${credentials.sk}/${this.state.token}`;
          const logo = this.state.company_logo_universal_id.length > 0 ? this.state.company_logo_universal_id : this.state.stringConstants.company_logo;
          const imageUrl = `${CONFIG().STORE.URL}/pic/${logo}`;
          // TOOD upload image
          const uploadProps = {
              action: uploadUrl,
              onChange: this.pictureChange.bind(this),
              beforeUpload: this.beforeUpload.bind(this),
              multiple: false,
              accept: 'image/*',
              showUploadList: false,
            };
        return (
            <Form onSubmit={this.handleSubmit.bind(this)} className='system-config' onChange={this.handleChange.bind(this)}>
                <EditMessageModal
                    messageChange={this.submitMessage.bind(this)}
                    onClose={this.editWelcomeMessage.bind(this)}
                    visible={this.state.editMessageModal}
                    message={this.state.welcomeMessage}/>
                <Row type='flex' className='scene-head' align='middle'>
                    <h2>System</h2>
                    <Button disabled={this.state.disableBtn} type='discard' size='large' onClick={this.handleReset}>Discard</Button>
                    <Button disabled={this.state.disableBtn} type='apply' size='large'
                        onClick={this.handleSubmit.bind(this)} htmlType='submit'>Apply</Button>
                </Row>
                <Row gutter={24} className='dashboardRow' type='flex' align='center'>
                    <Col span={12}>
                        <Card className='optionCard' loading={false} title='Account Policies'>
                            <ul>
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
                                                <Select
                                                    placeholder={this.state.data.register_mode === 2 ? 'Admin only' : 'Everyone'}
                                                    style={{width: 128}} onChange={this.handleChange}>
                                                    <Option value={2}>Admin only</Option>
                                                    <Option value={1}>Everyone</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </div>
                                    <p>In this mode only you or another admin could create accounts.</p>
                                </li>
                                <li>
                                    <div className='option'>
                                        <label>Default Maximum Grand Places that each account could create:</label>
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
                                    <p>Changes will be applied for new accounts only.</p>
                                </li>
                            </ul>
                        </Card>
                        <Card className='optionCard' loading={false} title='Place Policies'>
                            <ul>
                                <li>
                                    <div className='option'>
                                        <label>Maximum Place Members</label>

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
                                        <label>Maximum Place Managers</label>
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
                                        <label>Default Maximum Sub-Places:</label>
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
                                    <p>Changes will be applied for new places only. You can change it for each place seperatly in Place Settings.</p>
                                </li>
                                <li>
                                    <div className='option'>
                                        <label>Maximum Place Childrens Level</label>
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
                        <HealthCheck />
                    </Col>
                    <Col span={12}>
                        <Card className='optionCard' loading={false} title='System Messages'>
                            <ul>
                                <li>
                                    <div className='option'>
                                        <label>Welcome Message</label>
                                        <Button type=' butn butn-green' size='large'
                                        onClick={this.editWelcomeMessage.bind(this)}>Edit</Button>
                                    </div>
                                    <p>New accounts receive this message automatically at their first login.</p>
                                </li>
                            </ul>
                        </Card>
                        <Card className='optionCard' loading={false} title='Post Limits'>
                            <ul>
                                <li>
                                    <div className='option'>
                                        <label>Maximum Attachments per Post</label>

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
                                {/* <li>
                                    <div className='option'>
                                        <label>Maximum Attachment size</label>

                                        <FormItem>
                                            {getFieldDecorator('attach_max_size', {
                                                initialValue: this.state.data.attach_max_size,
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
                                                <Select
                                                    placeholder={this.state.data.attach_max_size}
                                                    style={{width: 128}} onChange={this.handleChange}>
                                                    <Option value={20}>20 MB</Option>
                                                    <Option value={50}>50 MB</Option>
                                                    <Option value={100}>100 MB</Option>
                                                    <Option value={200}>200 MB</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </div>
                                </li> */}
                                <li>
                                    <div className='option'>
                                        <label>Maximum Post Destinations</label>

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
                                        <label>Maximum Post Labels</label>

                                        <FormItem>
                                            {getFieldDecorator('post_max_labels', {
                                                initialValue: this.state.data.post_max_labels,
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
                                        <label>Maximum Post Retract Time (hours)</label>
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
                                                // <Input />
                                                <Select style={{ width: 128 }} onChange={this.handleChange}>
                                                  <Option value={3600000}>1</Option>
                                                  <Option value={21600000}>6</Option>
                                                  <Option value={43200000}>12</Option>
                                                  <Option value={86400000}>24</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </div>
                                </li>
                            </ul>
                        </Card>
                        <Card className='optionCard' title='Company information'>
                            <ul>
                                <li>
                                    <div className='option string'>
                                        <label>Name</label>

                                        <FormItem>
                                            {getFieldDecorator('company_name', {
                                                initialValue: this.state.stringConstants.company_name,
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </div>
                                </li>
                                <li>
                                    <div className='option string'>
                                        <label>Description</label>

                                        <FormItem>
                                            {getFieldDecorator('company_desc', {
                                                initialValue: this.state.stringConstants.company_desc,
                                                rules: [
                                                    {
                                                        validator: this.checkConfirm,
                                                    }
                                                ]
                                            })(
                                                <Input type='textarea' placeholder='Your Company Description'/>
                                            )}
                                        </FormItem>
                                    </div>
                                </li>
                                <li>
                                    <div className='option'>
                                        <label>Logo</label>
                                        {(this.state.stringConstants.company_logo && this.state.stringConstants.company_logo !== '') &&
                                            <Button type=' butn butn-red secondary' onClick={this.removeLogo.bind(this)}> remove image </Button>
                                        }
                                        {(this.state.stringConstants.company_logo && this.state.stringConstants.company_logo !== '') &&
                                        <img className='comapny-logo' src={imageUrl} width={40} height={40}/> }
                                        <FormItem>
                                            {getFieldDecorator('company_logo', {
                                                initialValue: this.state.stringConstants.company_logo,
                                                rules: [
                                                    {
                                                        validator: this.checkConfirm,
                                                    }
                                                ]
                                            })(
                                                <Upload {...uploadProps}>
                                                    <Button> Select image </Button>
                                                    <div className='progress-bar' style={{width: this.state.uploadPercent + '%'}}/>
                                                </Upload>
                                            )}
                                        </FormItem>
                                    </div>
                                </li>
                                <li>
                                    <div className='option'>
                                        <label>System default language</label>

                                        <FormItem>
                                            {getFieldDecorator('system_lang', {
                                                initialValue: this.state.stringConstants.system_lang,
                                            })(
                                                <Select
                                                    placeholder={this.state.stringConstants.system_lang}
                                                    style={{width: 128}} onChange={this.handleChange}>
                                                    <Option value='en'>EN</Option>
                                                    <Option value='fa'>FA</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </div>
                                </li>
                                <li>
                                    <div className='option'>
                                        <label>Magic number</label>
                                        <FormItem>
                                            {getFieldDecorator('magic_number', {
                                                initialValue: this.state.stringConstants.magic_number,
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </div>
                                    <p>You can register with this number more than once.</p>
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
