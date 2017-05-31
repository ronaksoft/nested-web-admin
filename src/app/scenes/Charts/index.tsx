import {IDispatch} from '~react-redux~redux';
import * as React from 'react';
import {connect} from 'react-redux';
import {Row, Col, notification, Card} from 'antd';
import ReportApi from '../../api/report/index';
import ReportType from '../../api/report/ReportType';
import moment from 'moment';
import ChartCard from '../../components/ChartCard/index';

export interface IChartsProps {}

export interface IChartsState {}

class Charts extends React.Component < IChartsProps,
IChartsState > {
    constructor(props : IChartsProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <Row gutter={32} style={{marginBottom: 32, marginLeft: 0, marginRight: 0}}>
                    <Col span={12}>
                        <ChartCard title='Posts' dataType={ReportType.AddPost} color='#1abc9c' />
                    </Col>
                    <Col span={12}>
                        <ChartCard title='Emails' dataType={ReportType.AddEmail} color='#2ecc71' />
                    </Col>
                </Row>
                <Row gutter={32} style={{marginBottom: 32, marginLeft: 0, marginRight: 0}}>
                    <Col span={12}>
                        <ChartCard title='Comments' dataType={ReportType.AddComment} color='#3498db' />
                    </Col>
                    <Col span={12}>
                        <ChartCard title='Logins' dataType={ReportType.Login} color='#9b59b6' />
                    </Col>
                </Row>
                <Row gutter={32} style={{marginBottom: 32, marginLeft: 0, marginRight: 0}}>
                    <Col span={12}>
                        <ChartCard title='Attachments Size' dataType={ReportType.AttachmentSize} color='#e74c3c' />
                    </Col>
                    <Col span={12}>
                        <ChartCard title='Session Recalls' dataType={ReportType.SessionRecall} color='#e67e22' />
                    </Col>
                </Row>
                <Row gutter={32} style={{marginBottom: 32, marginLeft: 0, marginRight: 0}}>
                    <Col span={12}>
                        <ChartCard title='Attachments Count' dataType={ReportType.AttachmentCount} color='#f1c40f' />
                    </Col>
                    <Col span={12}>
                        <ChartCard title='All Requests' dataType={ReportType.AllRequests} color='#34495e' />
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

export default connect(mapStateToProps, mapDispatchToProps)(Charts);
