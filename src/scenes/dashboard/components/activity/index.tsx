import _ from 'lodash';
import * as React from 'react';
import moment from 'moment';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
} from 'recharts';
import ReportApi from '../../../../api/report/index';
import ReportType from '../../../../consts/ReportType';
import Settings from '../../../../components/ChartCard/Settings';
import IResolutionSetting from '../../../../components/ChartCard/IResolutionSetting';

interface IActivityProps {
  period: string;
}

interface IActivityState {
  activities: any[];
  period: string;
}

class Activity extends React.Component<IActivityProps, IActivityState> {
  private reportApi: ReportApi = new ReportApi();
  constructor(props: IActivityProps) {
    super(props);

    this.state = {
      activities: [],
      period: props.period,
    };
  }

  componentDidMount() {
    this.load(this.state.period);
  }

  componentWillReceiveProps(newProps: IActivityProps) {
    this.load(newProps.period);
  }

  render() {
    const settings = this.getSettings(this.state.period);
    const days = this.getDays(settings);
    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={days} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={settings.latestAreaColor} stopOpacity={0.5} />
              <stop offset="95%" stopColor={settings.latestAreaColor} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={settings.secondAreaColor} stopOpacity={0.5} />
              <stop offset="95%" stopColor={settings.secondAreaColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis tickFormatter={value => this.formatValue(value, 1)} />
          <CartesianGrid strokeDasharray="1 1" stroke="#eee" />
          <Tooltip formatter={value => this.formatValue(value, 3)} />
          <Area
            type="monotone"
            dataKey="second"
            name={settings.secondAreaLabel}
            stroke={settings.secondAreaColor}
            fill="url(#colorPv)"
          />
          <Area
            type="monotone"
            dataKey="latest"
            name={settings.latestAreaLabel}
            stroke={settings.latestAreaColor}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  private getSettings(period: string): IResolutionSetting {
    if (period === 'day') {
      return Settings.Day;
    } else if (period === 'week') {
      return Settings.Week;
    } else {
      return Settings.Month;
    }
  }

  private formatValue(value: string | number | (string | number)[], precision: number = 0) {
    if (typeof value !== 'number') {
      return;
    }
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

  private load(period: string) {
    const settings = this.getSettings(period);
    const end = moment()
      .endOf('day')
      .utc()
      .format('YYYY-MM-DD:HH');
    const start = this.getStartDate(settings.ticksGapDuration * settings.ticksCount * 2);

    this.reportApi
      .get({
        from: start,
        to: end,
        type: ReportType.AllRequests,
        res: settings.resolutionKey,
      })
      .then((response: any) => {
        this.setState({
          activities: response.result,
          period: period,
        });
      })
      .catch((error: any) => {
        console.log('report error', error);
      });
  }

  private getStartDate(duration: any) {
    return moment()
      .subtract(duration + moment.duration(1, 'd'))
      .utc()
      .format('YYYY-MM-DD:HH');
  }

  private getDays(settings: IResolutionSetting) {
    const latestHalfDuration = settings.ticksGapDuration * (settings.ticksCount - 1);
    const secondHalfDuration = settings.ticksGapDuration * (settings.ticksCount * 2 - 1);
    const latestHalfStart = moment().subtract(latestHalfDuration);
    const secondHalfStart = moment().subtract(secondHalfDuration);

    return _.times(settings.ticksCount, number => {
      const duration = settings.ticksGapDuration * number;
      const latestHalfDay = latestHalfStart.clone().add(duration);
      const secondHalfDay = secondHalfStart.clone().add(duration);

      return {
        label: latestHalfDay.format(settings.ticksDateFormat),
        latest: this.findSumByDate(
          this.state.activities,
          latestHalfDay.utc().format('YYYY-MM-DD:HH')
        ),
        second: this.findSumByDate(
          this.state.activities,
          secondHalfDay.utc().format('YYYY-MM-DD:HH')
        ),
      };
    });
  }

  private findSumByDate(activities: any[], day: string) {
    const isInDay = (activity: any) => _.startsWith(day, activity.date);

    return _.sumBy(_.filter(activities, isInDay), 'sum');
  }
}

export default Activity;
