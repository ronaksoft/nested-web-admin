import {IDispatch} from '~react-redux~redux';
import * as React from 'react';
import {connect} from 'react-redux';
import {IcoN} from '../../components/icon/index';

import {Row, Input, Button} from 'antd';
import GetStart from './steps/01-get-start';
import VerifyPhone from './steps/02-verify-phone';
import AccountDetails from './steps/03-account-details';
import CompanyInformation from './steps/04-company-information';
import SetupDomain from './steps/05-setup-domain';
import WarmUp from './steps/06-warm-up';
import PlatformReady from './steps/07-platform-ready';
import './nested-start.less';


export interface IStartProps {
}

export interface IStartState {
    step: number;
    phoneNumber: number;
    verifyCode: number;
    fname : string;
    lname : string;
    username : string;
    password : string;
    position : string;
    companyName : string;
    activityField : string;
    employeeSize : string;
    domain : string;
}

class Start extends React.Component<IStartProps, IStartState> {
    constructor(props: IStartProps) {
        super(props);
        this.state = {
            step: 1,
            phoneNumber: 0,
            verifyCode: 0,
            lname: '',
            fname: '',
            username: '',
            password: '',
            position: '',
            companyName: '',
            activityField: '',
            employeeSize: '',
            domain: '',
        };
        this.prevPage = this.prevPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.onChangePhoneNumber = this.onChangePhoneNumber.bind(this);
        this.onChangeVerifyCode = this.onChangePhoneNumber.bind(this);
        this.onChangeFirstName = this.onChangeFirstName.bind(this);
        this.onChangeUserName = this.onChangeUserName.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangePosition = this.onChangePosition.bind(this);
        this.onChangeCompanyName = this.onChangeCompanyName.bind(this);
        this.onChangeActivityField = this.onChangeActivityField.bind(this);
        this.onChangeEmploeeSize = this.onChangeEmploeeSize.bind(this);
        this.onChangeDomain = this.onChangeDomain.bind(this);
        this.finish = this.finish.bind(this);
        this.goIntro = this.goIntro.bind(this);
    }

    finish() {
        return 'finish';
    }

    goIntro() {
        return 'goIntro';
    }

    nextPage() {
        if (this.state.step === 8) {
            return 'finish';
        }
        this.setState({
            step: this.state.step + 1,
        });
    }

    prevPage() {
        if (this.state.step === 2) {
            return 'finish';
        }
        this.setState({
            step: this.state.step + 1,
        });
    }

    onChangePhoneNumber(num: number) {
        console.log(num);
        this.setState({
            phoneNumber: num
        });
    }

    onChangeVerifyCode(num: number) {
        console.log(num);
        this.setState({
            verifyCode: num
        });
    }

    onChangeFirstName(fname: string) {
        console.log(fname);
        this.setState({
            fname
        });
    }

    onChangeLastName(lname: string) {
        console.log(lname);
        this.setState({
            lname
        });
    }

    onChangeUserName(username: string) {
        console.log(username);
        this.setState({
            username
        });
    }

    onChangePassword(password: string) {
        console.log(password);
        this.setState({
            password
        });
    }

    onChangePosition(position: string) {
        console.log(position);
        this.setState({
            position
        });
    }

    onChangeCompanyName(companyName: string) {
        console.log(companyName);
        this.setState({
            companyName
        });
    }

    onChangeActivityField(activityField: string) {
        console.log(activityField);
        this.setState({
            activityField
        });
    }

    onChangeEmploeeSize(employeeSize: string) {
        console.log(employeeSize);
        this.setState({
            employeeSize
        });
    }

    onChangeDomain(domain: string) {
        console.log(domain);
        this.setState({
            domain
        });
    }

    // componentDidMount() {}

    render() {

        return (
            <div className='nested-start introduction'>
                <div className='boxPage-container'>
                    {this.state.step === 1 &&
                        <GetStart onChangePhoneNumber={this.onChangePhoneNumber} onComplete={this.nextPage}/>
                    }
                    {this.state.step === 2 &&
                        <VerifyPhone phone={this.state.phoneNumber} onChangeVerifyCode={this.onChangeVerifyCode} onComplete={this.nextPage} onBack={this.prevPage}/>
                    }
                    {this.state.step === 3 &&
                        <AccountDetails onChangeFirstName={this.onChangeFirstName} onComplete={this.nextPage}
                            onChangeLastName={this.onChangeLastName} onChangeUserName={this.onChangeUserName}
                            onChangePassword={this.onChangePassword} onChangePosition={this.onChangePosition}/>
                    }
                    {this.state.step === 4 &&
                        <CompanyInformation onBack={this.prevPage} onComplete={this.nextPage}
                            onChangeCompanyName={this.onChangeCompanyName} onChangeActivityField={this.onChangeActivityField}
                            onChangeEmploeeSize={this.onChangeEmploeeSize}/>
                    }
                    {this.state.step === 5 &&
                        <SetupDomain onBack={this.prevPage} onComplete={this.nextPage}
                        onChangeDomain={this.onChangeDomain}/>
                    }
                    {this.state.step === 6 &&
                        <WarmUp domain={this.state.domain}/>
                    }
                    {this.state.step === 7 &&
                        <PlatformReady onComplete={this.goIntro}
                            domain={this.state.domain}/>
                    }
                </div>
                { this.state.step === 7 && (
                    <div className='boxPage-note' onClick={this.finish}>
                        Skip this step, I’m a Nested Nerd!
                    </div>
                )}
            </div>
        );
    }
}

function mapStateToProps(state: any) {
    return {};
}

function mapDispatchToProps(dispatch: IDispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Start);
