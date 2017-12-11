import * as React from 'react';
import {Dropdown, Card, Menu, Icon, Button, Switch} from 'antd';
import TimePeriod from './TimePeriod';
import ActivityArea from './ActivityArea';
import ReportType from '../../api/report/ReportType';
import MeasureType from './MeasureType';
import _ from 'lodash';

interface IChartCardProps {
    title: string;
    dataType: ReportType[];
    color: string;
    measure: MeasureType;
    period?: TimePeriod;
    syncId?: string;
    syncPeriod?: (period: TimePeriod) => {};
}

interface IChartCardState {
    activities: Array<any>;
    comparePreviousPeriod: boolean;
    period: any;
}

class ChartCard extends React.Component<IChartCardProps, IChartCardState> {
    constructor(props: IChartCardProps) {
        super(props);

        this.state = {
            activities: [],
            comparePreviousPeriod: false,
            period: TimePeriod.Week
        };

        this.reload = this.reload.bind(this);
        this.updatePeriod = this.updatePeriod.bind(this);
    }

    reload() {
        this.area.reload();
    }

    changeCompare(checked: boolean) {
        this.setState({
            comparePreviousPeriod: checked,
        });
    }

    componentWillReceiveProps(newProps: IChartCardProps) {
        if(newProps.period && newProps.period !== this.state.period) {
            this.setState({
                period: newProps.period,
            });
        }
    }

    updatePeriod(period: TimePeriod) {
        this.setState({period});
        if (_.isFunction(this.props.syncPeriod)) {
            this.props.syncPeriod(period);
        }
    }

    render() {
        return (
            <Card title={this.props.title} extra={
                <div>
                    Compare with previous period ?!
                    &nbsp;
                    <Switch defaultChecked={this.state.comparePreviousPeriod}
                    onChange={this.changeCompare.bind(this)} />
                    &nbsp;
                    &nbsp;
                    <a rel='noopener noreferrer' onClick={this.reload}><Icon type='reload'/></a>
                    &nbsp;
                    &nbsp;
                    <Dropdown overlay={
                        <Menu>
                            <Menu.Item>
                                <a rel='noopener noreferrer' onClick={() => this.updatePeriod(TimePeriod.Hour)}>Last
                                    1 hour</a>
                            </Menu.Item>
                            <Menu.Item>
                                <a rel='noopener noreferrer' onClick={() => this.updatePeriod(TimePeriod.Day)}>Last
                                    24 hours</a>
                            </Menu.Item>
                            <Menu.Item>
                                <a rel='noopener noreferrer' onClick={() => this.updatePeriod(TimePeriod.Week)}>Last
                                    7 days</a>
                            </Menu.Item>
                            <Menu.Item>
                                <a rel='noopener noreferrer' onClick={() => this.updatePeriod(TimePeriod.Month)}>Last
                                    30 days</a>
                            </Menu.Item>
                        </Menu>
                    }>
                        <a rel='noopener noreferrer'><Icon type='setting'/></a>
                    </Dropdown>
                </div>
            }>
                <ActivityArea measure={this.props.measure} ref={(area) => {
                    this.area = area;
                }} syncId={this.props.syncId} dataType={this.props.dataType} color={this.props.color} title={this.props.title}
                              period={this.state.period} comparePreviousPeriod={this.state.comparePreviousPeriod}/>
            </Card>
        );
    }
}

export default ChartCard;
