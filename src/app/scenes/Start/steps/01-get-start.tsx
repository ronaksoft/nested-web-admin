import { eventNames } from 'cluster';
import * as React from 'react';
import {Row, Input, Button} from 'antd';

interface IActivityProps {
    onChangePhoneNumber : (num : number) => void;
    onComplete : () => void;
}

interface IActivityState {
    phone : number;
}

class GetStart extends React.Component < IActivityProps,
IActivityState > {
    constructor(props : IActivityProps) {
        super(props);

        this.state = {
            phone: 0
        };
    }

    changeNumber(e: any) {
        this.setState({ phone: e.target.value });
        this.props.onChangePhoneNumber(e.target.value);
    }

    render() {
        return (
            <div className='boxPage-content'>
                <h2>Get Starting</h2>
                <Row className='input-row'>
                    <label htmlFor='phone'>Phone Number</label>
                    <Input
                        id='phone'
                        size='large'
                        className='nst-input'
                        value={this.state.phone}
                        placeholder='912 XXX XX XX'
                        onChange={this.changeNumber.bind(this)}
                        onPressEnter={this.props.onComplete}/>
                </Row>
                <p>
                    Country: Islamic Republic of Iran.<br/>
                    <a>Change Country</a>
                </p>
                <Row justify='end'>
                    <Button onClick={this.props.onComplete} type=' butn butn-green'>Next</Button>
                </Row>
            </div>
        );
    }

}

export default GetStart;
