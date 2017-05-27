import {IDispatch} from '~react-redux~redux';
import * as React from 'react';
import {connect} from 'react-redux';
import {Row, Col, notification, Card} from 'antd';
import ReportApi from '../../api/report/index';
import ReportType from '../../api/report/ReportType';
import Area from './components/Area/index';
import moment from 'moment';

export interface IAccountsProps {}

export interface IAccountsState {}

class Accounts extends React.Component < IAccountsProps,
IAccountsState > {
    constructor(props : IAccountsProps) {
        super(props);
        this.state = {
            posts: [],
            comments: [],
            attachmentSizes: [],
            attachmentCounts: [],
            emails: [],
            logins: [],
            sessionRecalls: [],
            requests: []
        };
        this.load = this.load.bind(this);
    }

    componentDidMount() {
        this.reportApi = new ReportApi();
        this.load();
    }

    load() {
        const from = moment().subtract(7, 'days').startOf('day').utc().format('YYYY-MM-DD');
        const to = moment.utc().format('YYYY-MM-DD');
        this.reportApi.get({
            from: from,
            to: to,
            type: ReportType.AddPost
        }).then((response) => {
            this.setState({
                posts: response.result
            });
        });

        this.reportApi.get({
            from: from,
            to: to,
            type: ReportType.AddEmail
        }).then((response) => {
            this.setState({
                emails: response.result
            });
        });

        this.reportApi.get({
            from: from,
            to: to,
            type: ReportType.AddComment
        }).then((response) => {
            this.setState({
                comments: response.result
            });
        });

        this.reportApi.get({
            from: from,
            to: to,
            type: ReportType.AttachmentCount
        }).then((response) => {
            this.setState({
                attachmentCounts: response.result
            });
        });

        this.reportApi.get({
            from: from,
            to: to,
            type: ReportType.AttachmentSize
        }).then((response) => {
            this.setState({
                attachmentSizes: response.result
            });
        });

        this.reportApi.get({
            from: from,
            to: to,
            type: ReportType.Login
        }).then((response) => {
            this.setState({
                logins: response.result
            });
        });

        this.reportApi.get({
            from: from,
            to: to,
            type: ReportType.SessionRecall
        }).then((response) => {
            this.setState({
                sessionRecalls: response.result
            });
        });

        this.reportApi.get({
            from: from,
            to: to,
            type: ReportType.AllRequests
        }).then((response) => {
            this.setState({
                requests: response.result
            });
        });
    }

    render() {
        return (
            <div>
                <Row gutter={32} style={{marginBottom: 32}}>
                    <Col span={12}>
                        <Card title='Posts' extra={null}>
                            <Area activities={this.state.posts} color='#1abc9c' title='Posts'/>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title='Emails' extra={null}>
                            <Area activities={this.state.emails} color='#2ecc71' title='Emails'/>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={32} style={{marginBottom: 32}}>
                    <Col span={12}>
                        <Card title='Comments' extra={null}>
                            <Area activities={this.state.comments} color='#3498db' title='Comments'/>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title='Logins' extra={null}>
                            <Area activities={this.state.logins} color='#9b59b6' title='Logins'/>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={32} style={{marginBottom: 32}}>
                    <Col span={12}>
                        <Card title='Attachments Size' extra={null}>
                            <Area activities={this.state.attachmentSizes} color='#e74c3c' title='Attachments Size' />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title='Session Recalls' extra={null}>
                            <Area activities={this.state.sessionRecalls} color='#e67e22' title='Session Recalls'/>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={32} style={{marginBottom: 32}}>
                    <Col span={12}>
                        <Card title='Attachments Count' extra={null}>
                            <Area activities={this.state.attachmentCounts} color='#f1c40f' title='Attachments Count'/>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title='All Requests' extra={null}>
                            <Area activities={this.state.requests} color='#34495e' title='All Requests'/>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

function mapStateToProps(state : any) {
    return {};
}

function mapDispatchToProps(dispatch : IDispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);
