import * as React from 'react';
import {Dropdown, Card, Menu, Icon, Button, ButtonGroup} from 'antd';
import TimePeriod from './TimePeriod';
import ActivityArea from './ActivityArea';
import ReportType from '../../api/report/ReportType';
import MeasureType from './MeasureType';

interface IChartCardProps {
    title: string;
    dataType: ReportType;
    color: string;
    measure: MeasureType;
}

interface IChartCardState {
    activities: Array;
}

class ChartCard extends React.Component<IChartCardProps, IChartCardState> {
    constructor(props: IChartCardProps) {
        super(props);

        this.state = {
            period: TimePeriod.Week
        };

        this.reload = this.reload.bind(this);
    }

    reload() {
        this.area.reload();
    }

    render() {
        return (
            <Card title={this.props.title} extra={
                <div>
                    <a rel='noopener noreferrer' onClick={this.reload}><Icon type='reload'/></a>
                    &nbsp;
                    &nbsp;
                    <Dropdown overlay={
                        <Menu>
                            <Menu.Item>
                                <a rel='noopener noreferrer' onClick={() => this.setState({period: TimePeriod.Hour})}>Last
                                    1 hour</a>
                            </Menu.Item>
                            <Menu.Item>
                                <a rel='noopener noreferrer' onClick={() => this.setState({period: TimePeriod.Day})}>Last
                                    24 hours</a>
                            </Menu.Item>
                            <Menu.Item>
                                <a rel='noopener noreferrer' onClick={() => this.setState({period: TimePeriod.Week})}>Last
                                    7 days</a>
                            </Menu.Item>
                            <Menu.Item>
                                <a rel='noopener noreferrer' onClick={() => this.setState({period: TimePeriod.Month})}>Last
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
                }} dataType={this.props.dataType} color={this.props.color} title={this.props.title}
                              period={this.state.period}/>
            </Card>
        );
    }
}

export default ChartCard;
