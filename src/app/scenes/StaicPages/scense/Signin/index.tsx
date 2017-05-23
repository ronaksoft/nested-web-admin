import {IDispatch} from '~react-redux~redux';
import * as React from 'react';
import {connect} from 'react-redux';
import md5 from 'md5';
import AAA from './../../../../services/classes/aaa/index';
import AccountApi from './../../../../api/account/account';
import {browserHistory} from 'react-router';

import {Layout, Card, Form, InputNumber, Button, Input, message} from 'antd';

const FormItem = Form.Item;

interface ISignInProps {
}

interface ISignInState {
}
const loginStyle = {
    width : '100%',
    height : '100%',
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
            this.login(model);
        }
        });
    }

    handleChange = (e) => {
        this.setState({
            disableBtn: false
        });
    }

    login = (data) => {
        data.pass = md5(data.pass);
        this.accountApi.login(data)
            .then((data) => {
            if (data.account && data.account.admin) {
                AAA.getInstance().setCredentials(data);
                // fixme : data or data.account ?
                AAA.getInstance().setUser(data.account);
                browserHistory.push('/dashboard');
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
                    <Card title='Sign in Nested admin panel'>
                        <Form.Item>
                            {getFieldDecorator('uid', {
                                rules: [
                                {
                                    required: true,
                                    message: 'Required'
                                }
                                ]
                            })(
                                <Input placeholder='Username' />
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
                                <Input placeholder='password' type='password' />
                            )}
                        </Form.Item>
                        <Button disabled={this.state.disableBtn} type='primary' size='large' htmlType='submit' onClick={this.handleSubmit}>Sign in</Button>
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
