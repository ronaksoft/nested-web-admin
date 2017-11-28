import * as React from 'react';
import {Row, Input, Button} from 'antd';

interface IActivityProps {
    onChangeDomain : (str : string) => void;
    onComplete : () => void;
    onBack : () => void;
}

interface IActivityState {
    domain : string;
}

class SetupDomain extends React.Component < IActivityProps,
IActivityState > {
    constructor(props : IActivityProps) {
        super(props);

        this.state = {
            domain: ''
        };
    }

    changeNDomain(e: any) {
        console.log(e);
        this.setState({ domain: e.target.value });
        this.props.onChangeDomain(e.target.value);
    }

    render() {
        return (
            <div className='boxPage-content'>
                <h2>Setup a Domain</h2>
                <p>Create a unique domain to identify your team. you can link your specific domain later in admin panel.</p>
                <Row className='input-row'>
                    <label htmlFor='domain'>Company Domain</label>
                    <Input
                        id='domain'
                        size='large'
                        className='nst-input'
                        value={this.state.domain}
                        placeholder=''
                        suffix={<span>.nested.me</span>}
                        onChange={this.changeNDomain.bind(this)}
                        onPressEnter={this.props.onComplete}/>
                </Row>
                <p>
                    Accounts & Places email address will be like this:.<br/>
                    <a>Ex.: admin@layen.nested.me</a><br/>
                    <a>Ex.: hello@layen.nested.me</a><br/>
                    <a>Ex.: technical.feedback@layen.nested.me</a><br/>
                </p>
                <Row justify='end'>
                    <Button onClick={this.props.onComplete} type=' butn butn-green'>Create Company</Button>
                </Row>
            </div>
        );
    }

}

export default SetupDomain;
