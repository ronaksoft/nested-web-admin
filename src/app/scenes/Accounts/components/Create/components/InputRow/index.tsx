import * as React from 'react';
import {Row, Col, Input, Icon, Button, Form} from 'antd';
import _ from 'lodash';
import IAccount from '../../../../interfaces/IAccount';
import PacketState from '../../../../PacketState';
import AccountApi from '../../../../../../api/account/account';
import Packet from '../../../../Packet';
import CONFIG from '../../../../../../../app.config';

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
}

class InputRow extends React.Component<IInputRowProps, IInputRowState> {
    constructor(props: IInputRowProps) {
        super(props);
        this.state = {
            packet: props.account,
            status: props.status
        };
    }

    handleFormChange = (changedFields) => {
        this.setState({
            fields: {...this.state.account, ...changedFields},
        });
    }

    componentWillReceiveProps(newProps: IInputRowProps) {
        this.state = {
            packet: newProps.account,
            status: newProps.status
        };
        // setTimeout(() => {
        //     this.props.onChange({
        //         key: this.props.refKey,
        //         modal: this.props.form.getFieldsValue(),
        //         status: this.props.form.getFieldsError()
        //     });
        // }, 200);
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

        if (!CONFIG.GRAND_PLACE_REGEX.test(value)) {
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

    render() {
        let self = this;
        const {getFieldDecorator} = this.props.form;
        const disabled = this.state.status === PacketState.Success || this.state.status === PacketState.Pending;
        const pending = this.state.status === PacketState.Pending;
        const success = this.state.status === PacketState.Success;
        return (
            <Form layout='inline' className='account-row'
                  onChange={() => {
                      this.props.onChange({
                          key: self.props.refKey,
                          model: self.props.form.getFieldsValue(),
                          status: null
                      });
                  }}>
                <Form.Item>
                    {getFieldDecorator('phone', {
                        initialValue: this.props.account.phone,
                        rules: [
                            {
                                required: true,
                                message: 'Phone number is required!'
                            },
                            _.debounce(this.checkPhoneAvailable, 100)
                        ]
                    })(
                        <Input
                            placeholder='+98 987 6543210'
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
                    {getFieldDecorator('pass', {
                        initialValue: this.props.account.pass,
                        rules: [
                            {
                                required: true,
                                message: 'Password is required!',
                            },
                            {
                                type: 'string',
                                min: 6,
                                message: 'Password must be at least 6 characters.'
                            }
                        ]
                    })(
                        <Input
                            placeholder='Password'
                            disabled={disabled}
                        />
                    )}

                </Form.Item>
                <Form.Item>
                    {
                        !(pending || success) &&
                        <Button shape='circle' type='delete-row' icon='delete' size='large'
                                onClick={() => this.props.onRemove(this.props.refKey)}/>
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
