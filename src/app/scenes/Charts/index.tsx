import {IDispatch} from '~react-redux~redux';
import * as React from 'react';
import {connect} from 'react-redux';
import {Row, Col, notification, Card} from 'antd';
import ReportApi from '../../api/report/index';
import ReportType from '../../api/report/ReportType';
import moment from 'moment';
import ChartCard from '../../components/ChartCard/index';
import MeasureType from '../../components/ChartCard/MeasureType';

export interface IChartsProps {
}

export interface IChartsState {
}

class Charts extends React.Component <IChartsProps,
    IChartsState> {
    constructor(props: IChartsProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <Row gutter={32} style={{marginBottom: 32, marginLeft: 0, marginRight: 0}}>
                    <Col span={12}>
                        <ChartCard title='Comments / Emails / Posts' measure={MeasureType.NUMBER}
                            dataType={[ReportType.AddComment, ReportType.AddEmail, ReportType.AddPost]}
                                   color='#1abc9c' syncId='post'/>
                    </Col>
                    {/* <Col span={12}>
                        <ChartCard title='Emails' measure={MeasureType.NUMBER} dataType={}
                                   color='#2ecc71'/>
                    </Col> */}
                    <Col span={12}>
                        <ChartCard title='Logins / Session Recalls' measure={MeasureType.NUMBER} dataType={[ReportType.Login, ReportType.SessionRecall]}
                                   color='#9b59b6' syncId='session'/>
                    </Col>
                    {/* <Col span={12}>
                        <ChartCard title='Session Recalls' measure={MeasureType.NUMBER}
                                   dataType={[ReportType.SessionRecall]} color='#e67e22'/>
                    </Col> */}
                </Row>
                <Row gutter={32} style={{marginBottom: 32, marginLeft: 0, marginRight: 0}}>
                    <Col span={12}>
                        <ChartCard title='Attachments Size' measure={MeasureType.FILE_SIZE}
                                   dataType={[ReportType.AttachmentSize]} color='#e74c3c' syncId='attachment'/>
                    </Col>
                    <Col span={12}>
                        <ChartCard title='Attachments Count' measure={MeasureType.NUMBER}
                                   dataType={[ReportType.AttachmentCount]} color='#f1c40f' syncId='attachment'/>
                    </Col>
                </Row>
                <Row gutter={32} style={{marginBottom: 32, marginLeft: 0, marginRight: 0}}>
                    <Col span={12}>
                        <ChartCard title='All Requests' measure={MeasureType.NUMBER} dataType={[ReportType.AllRequests]}
                                   color='#34495e' syncId='request'/>
                    </Col>
                    <Col span={12}>
                        <ChartCard title='Average Response Time' measure={MeasureType.TIME}
                                   dataType={[ReportType.processTime]} color='#f1c40f' syncId='request'/>
                    </Col>
                </Row>
                <Row gutter={32} style={{marginBottom: 32, marginLeft: 0, marginRight: 0}}>
                    <Col span={12}>
                        <ChartCard title='Traffic In' measure={MeasureType.FILE_SIZE}
                                   dataType={[ReportType.dataIn, ReportType.dataOut]} color='#f1c40f' syncId='terrafic'/>
                    </Col>
                    {/* <Col span={12}>
                        <ChartCard title='Traffic Out' measure={MeasureType.FILE_SIZE}
                                   dataType={[ReportType.dataOut]} color='#34495e'/>
                    </Col> */}
                </Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(Charts);
