import {IDispatch} from '~react-redux~redux';
import * as React from 'react';
import {connect} from 'react-redux';
import {Row, Col, notification, Card} from 'antd';
import ReportType from '../../api/report/ReportType';
import ChartCard from './index';
import MeasureType from './MeasureType';
import TimePeriod from './TimePeriod';

export interface IRelatedChartCardsProps {
    title: string[] | string[][];
    dataType: ReportType[][];
    color: string[][];
    measure: MeasureType[];
    syncId?: string;
    direction?: string;
    params?: any;
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
        var DOMS = this.props.dataType.map((t, index) =>
            <ChartCard title={this.props.title[index]} measure={this.props.measure[index]} syncPeriod={this.updatePeriod.bind(this)} params={this.props.params}
                dataType={this.props.dataType[index]} color={this.props.color[index]} syncId={this.props.syncId} period={this.state.period} height={300}/>
        );

        if (this.props.direction === 'vertical') {
            return (
                <Row style={{marginBottom: 32, marginLeft: 0, marginRight: 0}}>
                    {DOMS.map(DOM => <Col span={24} style={{marginBottom: 24}}>{DOM}</Col>)}
                </Row>
            );
        } else {
            return (
                <Row gutter={32} style={{marginBottom: 32, marginLeft: 0, marginRight: 0}}>
                    <Col span={12}>{ch1}</Col>
                    <Col span={12}>{ch2}</Col>
                </Row>
            );
        }
    }
}

function mapStateToProps(state: any) {
    return {};
}

function mapDispatchToProps(dispatch: IDispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(RelatedChartCards);
