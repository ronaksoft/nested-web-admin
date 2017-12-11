import {IDispatch} from '~react-redux~redux';
import * as React from 'react';
import {connect} from 'react-redux';
import {Row, Col, notification, Card} from 'antd';
import ReportApi from '../../api/report/index';
import ReportType from '../../api/report/ReportType';
import moment from 'moment';
import ChartCard from '../../components/ChartCard/index';
import RelatedChartCards from '../../components/ChartCard/RelatedChartCards';
import MeasureType from '../../components/ChartCard/MeasureType';
import TimePeriod from '../../components/ChartCard/TimePeriod';

export interface IChartsProps {
}

export interface IChartsState {}

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
                    <Col span={12}>
                        <ChartCard title='Logins / Session Recalls' measure={MeasureType.NUMBER} dataType={[ReportType.Login, ReportType.SessionRecall]}
                                   color='#9b59b6' syncId='session'/>
                    </Col>
                </Row>
                <RelatedChartCards
                    title={['Attachments Size', 'Attachments Count']}
                    dataType={[[ReportType.AttachmentSize],[ReportType.AttachmentCount]]}
                    syncId='attachment'
                    color={['#e74c3c', '#f1c40f']}
                    measure={[MeasureType.FILE_SIZE, MeasureType.NUMBER]}/>
                <RelatedChartCards
                    title={['All Requests', 'Average Response Time']}
                    dataType={[[ReportType.AllRequests],[ReportType.processTime]]}
                    syncId='request'
                    color={['#34495e', '#f1c40f']}
                    measure={[MeasureType.NUMBER, MeasureType.TIME]}/>
                <Row gutter={32} style={{marginBottom: 32, marginLeft: 0, marginRight: 0}}>
                    <Col span={12}>
                        <ChartCard title='Traffic In / Out' measure={MeasureType.FILE_SIZE}
                                   dataType={[ReportType.dataIn, ReportType.dataOut]} color='#f1c40f' syncId='terrafic'/>
                    </Col>
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
