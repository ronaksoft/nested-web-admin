import * as React from 'react';
import {Row, Input, Button, Col, Select} from 'antd';

interface IActivityProps {
    onChangeFirstName : (str : string) => void;
    onChangeLastName : (str : string) => void;
    onChangeUserName : (str : string) => void;
    onChangePassword : (str : string) => void;
    onChangePosition : (str : string) => void;
    onComplete : () => void;
}

interface IActivityState {
    fname : string;
    lname : string;
    username : string;
    password : string;
    position : string;
}

class AccountDetails extends React.Component < IActivityProps,
IActivityState > {
    constructor(props : IActivityProps) {
        super(props);

        this.state = {
            lname: '',
            fname: '',
            username: '',
            password: '',
            position: 'CEO',
        };
    }

    changeFirstName(e : any) {
        this.setState({fname: e.target.value});
        this
            .props
            .onChangeFirstName(e.target.value);
    }

    changeLastName(e : any) {
        this.setState({lname: e.target.value});
        this
            .props
            .onChangeLastName(e.target.value);
    }

    changeUsername(e : any) {
        this.setState({username: e.target.value});
        this
            .props
            .onChangeUserName(e.target.value);
    }

    changePassword(e : any) {
        this.setState({password: e.target.value});
        this
            .props
            .onChangePassword(e.target.value);
    }

    changePosition(e : any) {
        this.setState({position: e.target.value});
        this
            .props
            .onChangePosition(e.target.value);
    }

    render() {
        return (
            <div className='boxPage-content'>
                <h2>Account Details</h2>
                <p>Compelte youre details to create an admin account.</p>
                <Row gutter={16}>
                    <Col span={12}>
                        <Row className='input-row'>
                            <label htmlFor='fname'>First Name</label>
                            <Input
                                id='fname'
                                size='large'
                                className='nst-input'
                                value={this.state.fname}
                                placeholder='912 XXX XX XX'
                                onChange={this
                                .changeFirstName
                                .bind(this)}/>
                        </Row>
                    </Col>
                    <Col span={12}>
                        <Row className='input-row'>
                            <label htmlFor='lname'>Surename</label>
                            <Input
                                id='lname'
                                size='large'
                                className='nst-input'
                                value={this.state.lname}
                                placeholder='912 XXX XX XX'
                                onChange={this
                                .changeLastName
                                .bind(this)}/>
                        </Row>
                    </Col>
                </Row>
                <Row className='input-row'>
                    <label htmlFor='username'>Choose a username</label>
                    <Input
                        id='username'
                        size='large'
                        className='nst-input'
                        value={this.state.username}
                        placeholder='912 XXX XX XX'
                        onChange={this
                        .changeUsername
                        .bind(this)}/>
                </Row>
                <Row className='input-row'>
                    <label htmlFor='password'>Set a Password</label>
                    <Input
                        id='password'
                        size='large'
                        className='nst-input'
                        value={this.state.password}
                        placeholder='912 XXX XX XX'
                        onChange={this
                        .changePassword
                        .bind(this)}/>
                </Row>
                <Row className='input-row'>
                    <label htmlFor='position'>Whats your position on Company? (Optional)</label>
                        <Select style={{ width: '100%' }} onChange={this.changeLastName.bind(this)}
                            id='position' value={this.state.position}>
                            <Option value={'CEO'}>CEO</Option>
                            <Option value={'CTO'}>CTO</Option>
                        </Select>
                </Row>
                <Row justify='end'>
                    <Button onClick={this.props.onComplete} type=' butn butn-green'>Next</Button>
                </Row>
            </div>
        );
    }

}

export default AccountDetails;
