import * as React from 'react';
import {Spin} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import {ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Line} from 'recharts';
import ReportApi from '../../api/report/index';
import ReportType from '../../api/report/ReportType';
import TimePeriod from './TimePeriod';
import Settings from './Settings';
import IResolutionSetting from './IResolutionSetting';

interface IActivityAreaProps {
  color: string;
  dataType: ReportType;
  period: TimePeriod;
  title: string;
}

interface IActivityAreaState {
  activities: Array;
}

class ActivityArea extends React.Component<IActivityAreaProps, IActivityAreaState> {
  constructor(props: IActivityAreaProps) {
    super(props);

    this.state = {
      activities: [],
      period: this.props.period,
      loading: false
    };
  }

  componentDidMount() {
    this.reportApi = new ReportApi();
    this.load(this.state.period);
  }

  componentWillReceiveProps(newProps: IFilterProps) {
      this.load(newProps.period);
  }

  reload() {
      this.load(this.state.period);
  }

  render() {
      const settings = this.getSettings(this.state.period);
      const days = this.getDays(settings);
      const content = (
        <ResponsiveContainer width='100%' height={300}>
          <AreaChart data={days} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
            <defs>
              <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor={settings.latestAreaColor} stopOpacity={0.5}/>
                <stop offset='95%' stopColor={settings.latestAreaColor} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id='colorPv' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor={settings.secondAreaColor} stopOpacity={0.5}/>
                <stop offset='95%' stopColor={settings.secondAreaColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey='label' tickLine={false} axisLine={false} tickFormatter={settings.tickFormatter} minTickGap={1}/>
            <YAxis tickFormatter={(value) => this.formatValue(value, 1)}/>
            <CartesianGrid strokeDasharray='1 1' stroke='#eee'/>
            <Tooltip formatter={(value) => this.formatValue(value, 3)} labelFormatter={settings.tooltipLabelFormatter}/>
            <Area type='monotone' dataKey='latest' name={settings.latestAreaLabel} stroke={settings.latestAreaColor} fill='url(#colorUv)' />
            <Area type='monotone' dataKey='second' name={settings.secondAreaLabel} stroke={settings.secondAreaColor} fill='url(#colorPv)' />
          </AreaChart>
        </ResponsiveContainer>
      );
      return (
          <Spin spinning={this.state.loading} >
                {content}
          </Spin>
      );
  }

  private getSettings(period: TimePeriod): IResolutionSetting {
    if (period === TimePeriod.Hour) {
        return Settings.Hour;
    } else if (period === TimePeriod.Day) {
      return Settings.Day;
    } else if (period === TimePeriod.Week) {
      return Settings.Week;
    } else {
      return Settings.Month;
    }
  }

  private formatValue(value: number, precision: number = 0) {
      if (value < 1000) {
          return value;
      } else if (value < 1000000) {
          return `${_.round(value / 1000, precision)} K`;
      } else if (value < 1000000000) {
          return `${_.round(value / 1000000, precision)} M`;
      } else {
          return `${_.round(value / 1000000000, precision)} B`;
      }
  }

  private load(period: TimePeriod) {
    const settings = this.getSettings(period);
    const end = moment.utc().format('YYYY-MM-DD:HH');
    const start = this.getStartDate(settings.ticksGapDuration * settings.ticksCount * 2);
    this.setState({
      loading: true,
      activities: []
    });

    this.reportApi.get({
      from: start,
      to: end,
      type: this.props.dataType,
      res: settings.resolutionKey
    }).then((response) => {
        const parsedActivities = settings.parser(response.result);
        this.setState({
          activities: parsedActivities,
          period: period,
          loading: false
        });
    }, (error) => {
      this.setState({
        loading: false
      });
      console.log('report error', error);
    });
  }

  private getStartDate(duration: any) {
      return moment.utc().subtract(duration).format('YYYY-MM-DD:HH');
  }

  private getDays(settings: Settings) {
    const latestHalfDuration = settings.ticksGapDuration * (settings.ticksCount - 1);
    const secondHalfDuration = settings.ticksGapDuration * ((settings.ticksCount * 2) - 1);
    const latestHalfStart = moment().utc().subtract(latestHalfDuration);
    const secondHalfStart = moment().utc().subtract(secondHalfDuration);

    return _.times(settings.ticksCount, (number) => {
        const duration = settings.ticksGapDuration * number;
        const latestHalfDay = latestHalfStart.clone().add(duration);
        const secondHalfDay = secondHalfStart.clone().add(duration);

        return {
            label: latestHalfDay.format('YYYY-MM-DD:HH:mm'),
            latest: this.findSumByDate(this.state.activities, latestHalfDay.format('YYYY-MM-DD:HH:mm')),
            second: this.findSumByDate(this.state.activities, secondHalfDay.format('YYYY-MM-DD:HH:mm'))
        };
    });
  }

  private findSumByDate(activities: [], day: string) {
    const isInDay = (activity) => _.startsWith(day, activity.date);

    return _.sumBy(_.filter(activities, isInDay), 'value');
  }

}

export default ActivityArea;
