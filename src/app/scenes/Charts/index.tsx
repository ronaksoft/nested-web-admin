import {IDispatch} from '~react-redux~redux';
import * as React from 'react';
import {connect} from 'react-redux';
import {Row, Col, notification, Card} from 'antd';
import ReportApi from '../../api/report/index';
import ReportType from '../../api/report/ReportType';
import MeasureType from '../../components/ChartCard/MeasureType';
import TimePeriod from '../../components/ChartCard/TimePeriod';
import moment from 'moment';
import ChartCard from '../../components/ChartCard/index';
import RelatedChartCards from '../../components/ChartCard/RelatedChartCards';


export interface IChartsProps {
}

export interface IChartsState {
    period: TimePeriod;
}

class Charts extends React.Component <IChartsProps,
    IChartsState> {
    constructor(props: IChartsProps) {
        super(props);
        this.state = {
            period: TimePeriod.Week,
        };
    }

    updatePeriod(period: TimePeriod) {
        this.setState({
            period
        });
    }

    render() {
        return (
            <div className='charts-scene'>
                <Row gutter={32} style={{marginBottom: 32, marginLeft: 0, marginRight: 0}}>
                    <Col span={8}>
                        <ChartCard title={['Comments', 'Emails', 'Posts']} measure={MeasureType.NUMBER} height={240}
                            dataType={[ReportType.AddComment, ReportType.AddEmail, ReportType.AddPost]}
                                   color={['#8884d8', '#82ca9d', '#ffc658']} syncId='nested' syncPeriod={this.updatePeriod.bind(this)}/>
                    </Col>
                    <Col span={8}>
                        <ChartCard title={['Logins', 'Session Recalls']} measure={MeasureType.NUMBER} dataType={[ReportType.Login, ReportType.SessionRecall]}
                                   color={['#8884d8', '#82ca9d']} syncId='nested' height={240} syncPeriod={this.updatePeriod.bind(this)}/>
                    </Col>
                    <Col span={8}>
                        <ChartCard title={['Traffic In', 'Out']} measure={MeasureType.FILE_SIZE} height={240} syncPeriod={this.updatePeriod.bind(this)}
                                   dataType={[ReportType.dataIn, ReportType.dataOut]} color={['#8884d8', '#82ca9d']} syncId='nested'/>
                    </Col>
                </Row>
                <Row gutter={32} style={{marginBottom: 32, marginLeft: 0, marginRight: 0}}>
                    <Col span={6}>
                        <ChartCard title={['Attachments Size']} measure={MeasureType.FILE_SIZE}
                            dataType={[ReportType.AttachmentSize]} height={152}
                                   color={['#8884d8']} syncId='nested' syncPeriod={this.updatePeriod.bind(this)}/>
                    </Col>
                    <Col span={6}>
                        <ChartCard title={['Attachments Count']} measure={MeasureType.NUMBER} dataType={[ReportType.AttachmentCount]}
                                   color={['#8884d8']} syncId='nested' height={152} syncPeriod={this.updatePeriod.bind(this)}/>
                    </Col>
                    <Col span={6}>
                        <ChartCard title={['All Requests']} measure={MeasureType.NUMBER} height={152} syncPeriod={this.updatePeriod.bind(this)}
                                   dataType={[ReportType.AllRequests]} color={['#8884d8']} syncId='nested'/>
                    </Col>
                    <Col span={6}>
                        <ChartCard title={['Average Response Time']} measure={MeasureType.TIME} height={152} syncPeriod={this.updatePeriod.bind(this)}
                                   dataType={[ReportType.processTime]} color={['#8884d8']} syncId='nested'/>
                    </Col>
                </Row>
                {/* <RelatedChartCards
                    title={['Attachments Size', 'Attachments Count']}
                    dataType={[[ReportType.AttachmentSize],[ReportType.AttachmentCount]]}
                    syncId='nested'
                    color={['#e74c3c', '#f1c40f']}
                    measure={[MeasureType.FILE_SIZE, MeasureType.NUMBER]}/> */}
                {/* <RelatedChartCards
                    title={['All Requests', 'Average Response Time']}
                    dataType={[[ReportType.AllRequests],[ReportType.processTime]]}
                    syncId='nested'
                    color={['#34495e', '#f1c40f']}
                    measure={[MeasureType.NUMBER, MeasureType.TIME]}/> */}
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
