import * as React from 'react';
import {Row, Input, Button, Select} from 'antd';
import {IcoN} from '../../../components/icon/index';

interface IActivityProps {
    onChangeCompanyName : (str : string) => void;
    onChangeActivityField : (str : string) => void;
    onChangeEmploeeSize : (str : string) => void;
    onComplete : () => void;
    onBack : () => void;
}

interface IActivityState {
    companyName : string;
    activityField : string;
    employeeSize : string;
}

class CompanyInformation extends React.Component < IActivityProps,
IActivityState > {
    constructor(props : IActivityProps) {
        super(props);

        this.state = {
            companyName: '',
            activityField: '',
            employeeSize: '',
        };
    }

    changeCompanyName(e: any) {
        this.setState({ companyName: e.target.value });
        this.props.onChangeCompanyName(e.target.value);
    }

    changeActivityField(e: any) {
        this.setState({ activityField: e.target.value });
        this.props.onChangeCompanyName(e.target.value);
    }

    changeEmployeeSize(e: any) {
        this.setState({ employeeSize: e.target.value });
        this.props.onChangeEmploeeSize(e.target.value);
    }

    render() {
        return (
            <div className='boxPage-content'>
                <Row type='flex' align='middle' className='step-back' onClick={this.props.onBack}>
                    <IcoN size={16} name={'cross16'}/>Account Details
                </Row>
                <h2>Company Information</h2>
                <p>Enter your company details.</p>
                <Row className='input-row'>
                    <label htmlFor='companyName'>Company Name</label>
                    <Input
                        id='companyName'
                        size='large'
                        className='nst-input'
                        value={this.state.companyName}
                        placeholder='912 XXX XX XX'
                        onChange={this.changeCompanyName.bind(this)}
                        onPressEnter={this.props.onComplete}/>
                </Row>
                <Row className='input-row'>
                    <label>Activity Field</label>
                        <Select style={{ width: '100%' }} onChange={this.changeActivityField.bind(this)}
                            value={this.state.activityField}>
                            <Option value={'Programming'}>Programming</Option>
                            <Option value={'Marketing'}>Marketing</Option>
                        </Select>
                </Row>
                <Row className='input-row'>
                    <label>Employee Size</label>
                        <Select style={{ width: '100%' }} onChange={this.changeEmployeeSize.bind(this)}
                             value={this.state.employeeSize}>
                            <Option value={50}>50</Option>
                            <Option value={100}>100</Option>
                        </Select>
                </Row>
                <Row justify='end'>
                    <Button onClick={this.props.onComplete} type=' butn butn-green'>Next</Button>
                </Row>
            </div>
        );
    }

}

export default CompanyInformation;
