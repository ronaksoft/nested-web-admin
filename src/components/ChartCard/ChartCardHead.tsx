import * as React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import RefreshIcon from '@material-ui/icons/Refresh';
import SettingsIcon from '@material-ui/icons/Settings';
import Switch from '@material-ui/core/Switch';
import TimePeriod from './TimePeriod';
import Tooltip from '@material-ui/core/Tooltip';

interface IChartCardProps {
  titles: any[];
  period: TimePeriod;
  toggleItem: (ind: number) => (e: React.MouseEvent<Element, MouseEvent>) => void;
  changeCompare: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updatePeriod: (
    period: TimePeriod
  ) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  reload: () => void;
  reloadLoop: boolean;
  comparePreviousPeriod: boolean;
}

interface IChartCardState {
  openMenu: Element | null;
  comparePreviousPeriod: boolean;
  period: TimePeriod;
  reloadLoop: boolean;
  titles: any[];
}

class ChartCardHead extends React.Component<IChartCardProps, IChartCardState> {
  constructor(props: IChartCardProps) {
    super(props);

    this.state = {
      openMenu: null,
      comparePreviousPeriod: props.comparePreviousPeriod,
      period: props.period,
      reloadLoop: false,
      titles: this.props.titles,
    };
  }

  componentWillReceiveProps(newProps: IChartCardProps) {
    this.setState({
      period: newProps.period,
      titles: newProps.titles,
      reloadLoop: newProps.reloadLoop,
      comparePreviousPeriod: newProps.comparePreviousPeriod,
    });
  }

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
          onClick={this.props.toggleItem(index)}
        >
          {title.title}
        </span>
      );
    });
    return (
      <div className="card-head">
        <h2>{titleDom}</h2>
        <Tooltip title="Compare with previous period ?!">
          <Switch
            checked={this.state.comparePreviousPeriod}
            onChange={this.props.changeCompare}
            value={this.state.comparePreviousPeriod}
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        </Tooltip>
        &nbsp; &nbsp;
        <Tooltip placement="top" title={this.state.reloadLoop ? 'Auto Reloading' : 'Reload'}>
          <div
            className={['_cp', '_df', this.state.reloadLoop ? 'reloading' : ''].join(' ')}
            onClick={this.props.reload}
          >
            <RefreshIcon />
          </div>
        </Tooltip>
        &nbsp; &nbsp;
        <div className="_cp _df" onClick={this.handleOpenMenu}>
          <SettingsIcon />
        </div>
        <Menu
          open={!!this.state.openMenu}
          anchorEl={this.state.openMenu}
          onClose={this.handleOpenMenu}
        >
          <MenuItem onClick={this.handleOpenMenu}>
            <div className="_cp" onClick={this.props.updatePeriod(TimePeriod.Hour)}>
              Last 1 hour
            </div>
          </MenuItem>
          <MenuItem onClick={this.handleOpenMenu}>
            <div className="_cp" onClick={this.props.updatePeriod(TimePeriod.Day)}>
              Last 24 hours
            </div>
          </MenuItem>
          <MenuItem onClick={this.handleOpenMenu}>
            <div className="_cp" onClick={this.props.updatePeriod(TimePeriod.Week)}>
              Last 7 days
            </div>
          </MenuItem>
          <MenuItem onClick={this.handleOpenMenu}>
            <div className="_cp" onClick={this.props.updatePeriod(TimePeriod.Month)}>
              Last 30 days
            </div>
          </MenuItem>
        </Menu>
      </div>
    );
  }
}
export default ChartCardHead;
