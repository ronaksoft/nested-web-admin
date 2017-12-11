import {IDispatch} from '~react-redux~redux';
import * as React from 'react';
import {connect} from 'react-redux';
import {Row, Col, notification, Card} from 'antd';
import ReportType from '../../api/report/ReportType';
import ChartCard from './index';
import MeasureType from './MeasureType';
import TimePeriod from './TimePeriod';

export interface IRelatedChartCardsProps {
    title: string[];
    dataType: ReportType[][];
    color: string[];
    measure: MeasureType[];
    syncId?: string;
}

export interface IRelatedChartCardsState {
    period: TimePeriod;
}

class RelatedChartCards extends React.Component <IRelatedChartCardsProps,
    IRelatedChartCardsState> {
    constructor(props: IRelatedChartCardsProps) {
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
            <Row gutter={32} style={{marginBottom: 32, marginLeft: 0, marginRight: 0}}>
                <Col span={12}>
                    <ChartCard title={this.props.title[0]} measure={this.props.measure[0]} syncPeriod={this.updatePeriod.bind(this)}
                                dataType={this.props.dataType[0]} color={this.props.color[0]} syncId={this.props.syncId} period={this.state.period}/>
                </Col>
                <Col span={12}>
                    <ChartCard title={this.props.title[1]} measure={this.props.measure[1]} syncPeriod={this.updatePeriod.bind(this)}
                                dataType={this.props.dataType[1]} color={this.props.color[1]} syncId={this.props.syncId} period={this.state.period}/>
                </Col>
            </Row>
        );
    }
}

function mapStateToProps(state: any) {
    return {};
}

function mapDispatchToProps(dispatch: IDispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(RelatedChartCards);