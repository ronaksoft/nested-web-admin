import * as React from 'react';
import {Row, Input, Button} from 'antd';
import {IcoN} from '../../../components/icon/index';

interface IActivityProps {
    onChangeVerifyCode : (num : number) => void;
    onComplete : () => void;
    onBack : () => void;
    phone: number;
}

interface IActivityState {
    verify : number;
}

class GetStart extends React.Component < IActivityProps,
IActivityState > {
    constructor(props : IActivityProps) {
        super(props);

        this.state = {
            verify: 0
        };
    }

    change(e: any) {
        console.log(e);
        this.setState({ verify: e.target.value });
        this.props.onChangeVerifyCode(e.target.value);
    }

    render() {
        return (
            <div className='boxPage-content'>
                <Row type='flex' align='middle' className='step-back' onClick={this.props.onBack}>
                    <IcoN size={16} name={'cross16'}/>Change {this.props.phone}
                </Row>
                <h2>Verify Phone Number</h2>
                <Row className='input-row'>
                    <p>We’ve sent a verification code via SMS to your phone. Enter the code below.</p>
                    <label htmlFor='phone'>Verify Code</label>
                    <Input
                        id='phone'
                        size='large'
                        className='nst-input'
                        value={this.state.verify}
                        placeholder='123456'
                        onChange={this.change.bind(this)}
                        onPressEnter={this.props.onComplete}/>
                </Row>
                <p>
                    <a>Didn't receive a Code?</a>
                </p>
                <Row justify='end'>
                    <Button onClick={this.props.onComplete} type=' butn butn-green'>Next</Button>
                </Row>
            </div>
        );
    }

}

export default GetStart;
