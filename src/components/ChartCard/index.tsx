import * as React from 'react';
import _ from 'lodash';
import ActivityArea from './ActivityArea';
import { Card } from '@material-ui/core';
import MeasureType from './MeasureType';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import RefreshIcon from '@material-ui/icons/Refresh';
import ReportType from '../../consts/ReportType';
import SettingsIcon from '@material-ui/icons/Settings';
import Switch from '@material-ui/core/Switch';
import TimePeriod from './TimePeriod';
import Tooltip from '@material-ui/core/Tooltip';
import ChartCardHead from './ChartCardHead';

interface IChartCardProps {
  title: string[];
  height: number;
  dataType: ReportType[];
  color: string[];
  measure: MeasureType;
  period?: TimePeriod;
  syncId?: string;
  params?: any;
  syncPeriod?: (period: TimePeriod) => void;
}

interface IChartCardState {
  activities: any[];
  dataType: ReportType[];
  openMenu: Element | null;
  comparePreviousPeriod: boolean;
  period: any;
  reloadLoop: boolean;
  titles: any[];
}

class ChartCard extends React.Component<IChartCardProps, IChartCardState> {
  private inteval: any;
  private area = React.createRef<ActivityArea>();

  constructor(props: IChartCardProps) {
    super(props);

    this.state = {
      activities: [],
      openMenu: null,
      comparePreviousPeriod: false,
      dataType: this.props.dataType,
      period: TimePeriod.Week,
      reloadLoop: false,
      titles: this.props.title.map((title, index) => {
        return {
          active: true,
          title,
        };
      }),
    };
  }

  public reload = () => {
    this.setState(
      {
        reloadLoop: !this.state.reloadLoop,
      },
      () => {
        if (this.state.reloadLoop) {
          this.area.current && this.area.current.reload();
          this.inteval = setInterval(() => {
            this.area.current && this.area.current.reload();
          }, 60000);
        } else {
          clearInterval(this.inteval);
        }
      }
    );
  };

  changeCompare = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      comparePreviousPeriod: e.target.checked,
    });
  };

  toggleItem = (ind: number) => (e: React.MouseEvent) => {
    const titles = this.state.titles.slice();
    titles[ind].active = !titles[ind].active;
    if (_.some(titles, t => t.active)) {
      this.setState({
        titles,
      });
    }
    // todo array is not cloned properly !
    // console.log(titles, this.state.titles);
  };

  componentWillReceiveProps(newProps: IChartCardProps) {
    if (newProps.period !== this.state.period) {
      this.setState({
        period: newProps.period,
      });
    }
  }

  componentWillUnmount() {
    if (this.state.reloadLoop) {
      clearInterval(this.inteval);
    }
  }

  updatePeriod = (period: TimePeriod) => (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    this.setState({ period });
    if (_.isFunction(this.props.syncPeriod)) {
      this.props.syncPeriod(period);
    }
  };

  handleOpenMenu = (e: React.MouseEvent) => {
    this.setState({
      openMenu: this.state.openMenu ? null : (e.currentTarget as Element),
    });
  };

  render() {
    const titleDom = this.state.titles.map((title, index) => {
      return (
        <span
          key={index}
          className={title.active ? 'multi-chart-title' : 'multi-chart-title deactive'}
          onClick={this.toggleItem(index)}
        >
          {title.title}
        </span>
      );
    });
    const activePropTypes = this.state.dataType.filter(
      (dataType, index) => this.state.titles[index].active
    );
    const activeColors = this.props.color.filter((color, index) => this.state.titles[index].active);
    return (
      <Card className="chart-card">
        <ChartCardHead
          titles={this.state.titles}
          period={this.state.period}
          reload={this.reload}
          toggleItem={this.toggleItem}
          updatePeriod={this.updatePeriod}
          comparePreviousPeriod={this.state.comparePreviousPeriod}
          changeCompare={this.changeCompare}
          reloadLoop={this.state.reloadLoop}
        />
        <div className="card-body">
          <ActivityArea
            measure={this.props.measure}
            height={this.props.height}
            ref={this.area}
            syncId={this.props.syncId}
            dataType={activePropTypes}
            color={activeColors}
            period={this.state.period}
            comparePreviousPeriod={this.state.comparePreviousPeriod}
            params={this.props.params}
          />
        </div>
      </Card>
    );
  }
}

export default ChartCard;
