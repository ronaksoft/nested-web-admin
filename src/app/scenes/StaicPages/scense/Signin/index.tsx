import {IDispatch} from '~react-redux~redux';
import * as React from 'react';
import {connect} from 'react-redux';
import md5 from 'md5';
import AAA from './../../../../services/classes/aaa/index';
import AccountApi from './../../../../api/account/account';
import {hashHistory} from 'react-router';
import Api from './../../../../api/index';

import {Layout, Card, Form, InputNumber, Button, Input, message} from 'antd';

import Client from './../../../../services/classes/client/index';

const FormItem = Form.Item;

interface ISignInProps {
}

interface ISignInState {
}

const loginStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

class SignIn extends React.Component<ISignInProps, ISignInState> {

    constructor(props: any) {
        super(props);
        this.state = {username: '', password: '', disableBtn: true};
    }

    componentDidMount() {
        this.accountApi = new AccountApi();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const model = this.props.form.getFieldsValue();
                this.beforeLogin(model);
            }
        });
    }

    handleChange = (e) => {
        this.setState({
            disableBtn: false
        });
    }

    beforeLogin(data: any) {
        if (data.uid.indexOf('@') > -1) {
            const usernameSplits = data.uid.split('@');
            const api = Api.getInstance();
            data.uid = usernameSplits[0];
            api.reconfigEndPoints(usernameSplits[1])
                .then(() => {
                    this.login(data);
                });/*
                .catch((r) => {
                    console.log(r);
                    message.warning(`Something wen't wrong`);
                });*/
        } else {
            this.login(data);
        }
    }

    login = (data) => {
        const did = Client.getDid();
        const dt = Client.getDt();

        this.accountApi.login({
            uid: data.uid,
            pass: md5(data.pass),
            _did: did,
            _dt: dt,
            _do: 'android',
        }).then((data) => {
            if (data.account && data.account.admin) {
                AAA.getInstance().setCredentials(data);
                // fixme : data or data.account ?
                AAA.getInstance().setUser(data.account);
                Client.setDid(did);
                Client.setDt(dt);
                hashHistory.push('/dashboard');
            } else {
                message.warning('You are not administrator');
            }
        }).catch((error) => {
            console.log(error);
            message.error('Not approved');
        });
    }

    saveForm = (form) => this.form = form;

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form className='signin' onSubmit={this.handleSubmit.bind(this)} onChange={this.handleChange.bind(this)}>
                <div style={loginStyle}>
                    <Card title='Sign in to Admin Panel'>
                        <Form.Item>
                            {getFieldDecorator('uid', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Required'
                                    }
                                ]
                            })(
                                <Input placeholder='Username'/>
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('pass', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Required'
                                    }
                                ]
                            })(
                                <Input placeholder='password' type='password'/>
                            )}
                        </Form.Item>
                        <Button disabled={this.state.disableBtn} type='primary' size='large' htmlType='submit'
                                onClick={this.handleSubmit}>Sign in</Button>
                    </Card>
                </div>
            </Form>
        );
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
)(SignIn));

export default WrappedTimeRelatedForm;
