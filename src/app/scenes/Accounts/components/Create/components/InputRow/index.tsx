import * as React from 'react';
import {Row, Col, Input, Icon, Button, Form} from 'antd';
import _ from 'lodash';
import IAccount from '../../../../interfaces/IAccount';
import PacketState from '../../../../PacketState';
import AccountApi from '../../../../../../api/account/account';
import Packet from '../../../../Packet';
import CONFIG from 'src/app/config';
import {IcoN} from '../../../../../../components/icon/index';

interface IInputRowProps {
    account: Packet<IAccount>;
    onRemove: Handler;
    onChange: Handler;
    index: number;
    refKey: any;
    status: PacketState;
}

interface IInputRowState {
    packet: Packet<IAccount>;
    status: PacketState;
    manualPassword: boolean;
}

class InputRow extends React.Component<IInputRowProps, IInputRowState> {
    constructor(props: IInputRowProps) {
        console.log('constructor');
        super(props);
        this.state = {
            packet: props.account,
            status: props.status,
            manualPassword: false,
        };
        this.insertManualPassword = this.insertManualPassword.bind(this);
    }

    handleFormChange = (changedFields) => {
        this.setState({
            fields: {...this.state.account, ...changedFields},
        });
    }

    componentWillReceiveProps(newProps: IInputRowProps) {
        this.state = {
            packet: newProps.account,
            status: newProps.status,
            manualPassword: this.state.manualPassword,
        };
        // setTimeout(() => {
        //     this.props.onChange({
        //         key: this.props.refKey,
        //         modal: this.props.form.getFieldsValue(),
        //         status: this.props.form.getFieldsError()
        //     });
        // }, 200);
    }

    extractNumber(text: any) {
        return parseInt(text.replace(/[^0-9]/g, ''), 0);
    }

    checkPhoneAvailable(rule: any, value: string, callback: any) {
        // callback();
        let accountApi = new AccountApi();
        accountApi.phoneAvailable({phone: value})
            .then((isAvailable) => {
                if (isAvailable) {
                    callback();
                } else {
                    callback(new Error('Not available!'));
                }
            })
            .catch(() => {
                callback(new Error('Not available!'));
            });
    }

    checkUsernameAvailable(rule: any, value: string, callback: any) {

        if (!CONFIG().GRAND_PLACE_REGEX.test(value)) {
            callback(new Error('Is Not Valid!'));
            return;
        }

        let accountApi = new AccountApi();
        // callback();
        accountApi.usernameAvailable({account_id: value})
            .then((isAvailable) => {
                if (isAvailable) {
                    callback();
                } else {
                    callback(new Error('Not available!'));
                }
            })
            .catch(() => {
                callback(new Error('Not available!'));
            });
    }

    saveForm = (form) => this.form = form;

    insertManualPassword () {
        this.setState({
            manualPassword: true,
        });
    }

    fromChange () {
        this.props.onChange({
            key: this.props.refKey,
            model: this.props.form.getFieldsValue(),
            password: this.state.manualPassword,
            status: null
        });
    }

    render() {
        let self = this;
        const {getFieldDecorator} = this.props.form;
        const disabled = this.state.status === PacketState.Success || this.state.status === PacketState.Pending;
        const pending = this.state.status === PacketState.Pending;
        const success = this.state.status === PacketState.Success;
        const manualPassword = this.state.manualPassword;
        console.log('manualPassword', manualPassword);
        return (
            <Form layout='inline' className='account-row'
                  onChange={self.fromChange.bind(self)}>
                <Form.Item className='row-controls'>
                    {
                        !(pending || success) &&
                        <div className='remove-butn' onClick={() => this.props.onRemove(this.props.refKey)}><IcoN size={16} name={'bin16'}/></div>
                    }
                    {
                        pending &&
                        <Icon type='loading'/>
                    }
                    {
                        success &&
                        <Icon type='check-circle-o' className='account-success-icon'/>
                    }
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('phone', {
                        initialValue: this.props.account.phone || 98,
                        validateFirst: false,
                        rules: [
                            {
                                required: true,
                                message: 'Phone number is required!'
                            },
                            {
                                min: 6,
                                message: 'Phone number is too short!'
                            },
                            {
                                pattern: /^[0-9]*$/g,
                                message: 'It is not a number'
                            },
                            _.debounce(this.checkPhoneAvailable, 100)
                        ]
                    })(
                        <Input
                            prefix='+'
                            placeholder='98 987 6543210'
                            disabled={disabled}
                        />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('fname', {
                        initialValue: this.props.account.fname,
                        rules: [
                            {
                                required: true,
                                message: 'First name is required!'
                            }
                        ]
                    })(
                        <Input
                            placeholder='John'
                            disabled={disabled}
                        />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('lname', {
                        initialValue: this.props.account.lname,
                        rules: [
                            {
                                required: true,
                                message: 'Last name is required!'
                            }
                        ]
                    })(
                        <Input
                            placeholder='Doe'
                            disabled={disabled}
                        />
                    )}

                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('_id', {
                        initialValue: this.props.account._id,
                        rules: [
                            {
                                required: true,
                                message: 'User ID is required!'
                            },
                            {
                                min: 5,
                                message: 'The user ID is too short!'
                            },
                            _.debounce(this.checkUsernameAvailable, 1000)
                        ]
                    })(
                        <Input
                            placeholder='john-doe'
                            disabled={disabled}
                        />
                    )}

                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('pass', {
                        initialValue: this.props.account.pass,
                        rules: [
                            {
                                required: manualPassword,
                                message: 'Password is required!',
                            },
                            {
                                type: 'string',
                                min: 6,
                                message: 'Password must be at least 6 characters.'
                            }
                        ]
                    })(
                        <div>
                            {!manualPassword &&
                                (<Button type=' form-input-button' onClick={this.insertManualPassword}
                                    disabled={disabled}>- same as username -</Button>)
                            }
                            {manualPassword && (<Input
                                placeholder='Password'
                                disabled={disabled}
                            />)}
                        </div>
                    )}

                </Form.Item>
            </Form>
        );
    }

    componentDidMount() {
        if (this.state.packet.state !== PacketState.New) {
            this.props.form.validateFields((errors, values) => {
                const fieldErrors = _(errors).map((value, key) => value.errors).flatten().value();
                if (_.size(fieldErrors) > 0) {
                    this.state.packet.state = PacketState.Invalid;
                }
            });
        }
    }
}

export default Form.create()(InputRow);
