import * as React from 'react';
import {Dropdown, Card, Menu, Icon} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import TimePeriod from './TimePeriod';
import ActivityArea from './ActivityArea';

interface IChartCardProps {
  title: string;
  dataType: ReportType;
  color: string;
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
  }

  render() {
      return (
          <Card title={this.props.title} extra={
              <Dropdown overlay={
                      <Menu>
                          <Menu.Item>
                              <a rel='noopener noreferrer' onClick={() => this.setState({ period: TimePeriod.Day })}>Last 24 hours</a>
                          </Menu.Item>
                          <Menu.Item>
                              <a rel='noopener noreferrer' onClick={() => this.setState({ period: TimePeriod.Week })}>Last 7 days</a>
                          </Menu.Item>
                          <Menu.Item>
                              <a rel='noopener noreferrer' onClick={() => this.setState({ period: TimePeriod.Month })}>Last 30 days</a>
                          </Menu.Item>
                      </Menu>
                    }>
                    <Icon type='setting'/>
                </Dropdown>
              }>
              <ActivityArea dataType={this.props.dataType} color={this.props.color} title={this.props.title} period={this.state.period} />
          </Card>
      );
    }
}

export default ChartCard;
