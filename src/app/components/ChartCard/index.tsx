import * as React from 'react';
import {Dropdown, Card, Menu, Icon, Button, ButtonGroup} from 'antd';
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

    this.reload = this.reload.bind(this);
  }

  reload() {
    this.area.reload();
  }

  render() {
      return (
          <Card title={this.props.title} extra={
              <div>
                <Icon type='reload' onClick={this.reload}/>
                &nbsp;
                &nbsp;
                <Dropdown overlay={
                        <Menu>
                            <Menu.Item>
                                <a rel='noopener noreferrer' onClick={() => this.setState({ period: TimePeriod.Hour })}>Last 1 hour</a>
                            </Menu.Item>
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
              </div>
              }>
              <ActivityArea ref={(area) => { this.area = area; }} dataType={this.props.dataType} color={this.props.color} title={this.props.title} period={this.state.period} />
          </Card>
      );
    }
}

export default ChartCard;
