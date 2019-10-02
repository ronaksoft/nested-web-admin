import * as React from 'react';

import _ from 'lodash';
import moment from 'moment';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import MeasureType, { MeasureTypeValues } from './MeasureType';
import ReportApi from '../../api/report/index';
import ReportType from '../../consts/ReportType';
import ReportTypeLabel from '../../consts/ReportTypeLabels';
import Loading from '../Loading/index';
import IResolutionSetting from './IResolutionSetting';
import Settings from './Settings';
import TimePeriod from './TimePeriod';

interface IActivityAreaProps {
  color: string[];
  height: number;
  dataType: ReportType[];
  period: TimePeriod;
  measure: MeasureType;
  comparePreviousPeriod?: boolean;
  syncId?: string;
  params?: any;
}

interface IActivityAreaState {
  activities: any[];
  color: string[];
  period: TimePeriod;
  loading: boolean;
  dataType: ReportType[];
  comparePreviousPeriod: boolean;
}

class ActivityArea extends React.Component<IActivityAreaProps, IActivityAreaState> {
  private reportApi: ReportApi = new ReportApi();
  constructor(props: IActivityAreaProps) {
    super(props);

    this.state = {
      activities: [],
      color: this.props.color,
      comparePreviousPeriod: false,
      dataType: this.props.dataType,
      loading: false,
      period: this.props.period,
    };
  }

  public componentDidMount() {
    this.load(this.state.period);
  }

  public componentWillReceiveProps(newProps: IActivityAreaProps) {
    if (newProps.comparePreviousPeriod !== this.props.comparePreviousPeriod) {
      this.setState({
        comparePreviousPeriod: newProps.comparePreviousPeriod || false,
      });
    } else if (newProps.dataType !== this.props.dataType) {
      this.setState(
        {
          dataType: newProps.dataType,
          color: newProps.color,
        },
        () => {
          this.load(newProps.period);
        }
      );
    } else {
      this.load(newProps.period);
    }
  }

  public reload() {
    this.load(this.state.period);
  }

  info = (e: any) => {
    // console.log(e);
  };

  render() {
    const settings = this.getSettings(this.state.period);
    const days = this.getDays(settings);
    // const stroke = ['#8884d8', '#82ca9d', '#ffc658', '#000000', '#000000', '#000000'];
    const fills = this.state.color || [
      '#8884d8',
      '#82ca9d',
      '#ffc658',
      '#ff2215',
      '#ffcc58',
      '#ffbb58',
    ];
    const dataTypes = this.state.dataType || [];
    if (dataTypes.length === 0) {
      return;
    }
    const Areas = dataTypes.map((dType, i) => {
      return (
        <Area
          key={i + 'a'}
          type="monotone"
          dataKey={dType}
          name={ReportTypeLabel[ReportType[dType]]}
          stroke={fills[i]}
          stackId="1"
          fill={fills[i]}
        />
      );
    });
    if (this.state.comparePreviousPeriod) {
      dataTypes.forEach((dType, i) => {
        Areas.push(
          <Area
            key={i + 'b'}
            type="monotone"
            dataKey={'previous' + dType}
            name={'Previous ' + ReportType[dType]}
            stroke={fills[i]}
            stackId="2"
            fill={fills[i]}
            fillOpacity={0.16}
            strokeOpacity={0.32}
          />
        );
      });
    }
    return (
      <div>
        <ResponsiveContainer width="100%" height={this.props.height}>
          <AreaChart
            data={days}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            onMouseMove={this.info}
            syncId={this.props.syncId}
          >
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickFormatter={settings.tickFormatter}
              minTickGap={1}
            />
            <YAxis tickFormatter={value => this.formatValue(value, 1)} />
            <CartesianGrid strokeDasharray="1 1" stroke="#eee" />
            <Tooltip
              formatter={value => this.formatValue(parseInt(value + '', 10), 3)}
              labelFormatter={settings.tooltipLabelFormatter}
            />
            {/* <Area type='monotone' dataKey='latest' name={settings.latestAreaLabel}
                            stroke={settings.latestAreaColor} fill='url(#colorUv)'/>
                        <Area type='monotone' dataKey='second' name={settings.secondAreaLabel}
                            stroke={settings.secondAreaColor} fill='url(#colorPv)'/> */}
            {Areas}
          </AreaChart>
        </ResponsiveContainer>
        <Loading active={this.state.loading} position="absolute" />
      </div>
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

  private formatValue(value: number, precision: number = 0): React.ReactNode {
    switch (this.props.measure) {
      case MeasureType.FILE_SIZE:
        if (value < MeasureTypeValues.FILE_SIZE.KB) {
          return `${value} Bytes`;
        } else if (value < MeasureTypeValues.FILE_SIZE.MB) {
          return `${_.round(value / MeasureTypeValues.FILE_SIZE.KB, precision)} KB`;
        } else if (value < MeasureTypeValues.FILE_SIZE.GB) {
          return `${_.round(value / MeasureTypeValues.FILE_SIZE.MB, precision)} MB`;
        } else if (value < MeasureTypeValues.FILE_SIZE.TB) {
          return `${_.round(value / MeasureTypeValues.FILE_SIZE.GB, precision)} GB`;
        } else if (value < MeasureTypeValues.FILE_SIZE.PB) {
          return `${_.round(value / MeasureTypeValues.FILE_SIZE.TB, precision)} TB`;
        } else {
          return `${_.round(value / Math.pow(1024, 5), precision)} PB`;
        }

      case MeasureType.TIME:
        if (value < 1000) {
          return `${value} ms`;
        } else if (value < 60 * 1000) {
          return `${_.round(value / 1000, precision)} sec`;
        } else if (value < 60 * 60 * 1000) {
          return `${_.round(value / (60 * 1000), precision)} min`;
        } else {
          return `${_.round(value / (60 * 60 * 1000), precision)} h`;
        }

      case MeasureType.NUMBER:
      default:
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
  }

  private load(period: TimePeriod) {
    const settings = this.getSettings(period);
    const end = moment.utc().format('YYYY-MM-DD:HH');
    const start = this.getStartDate(settings.ticksGapDuration * settings.ticksCount * 2);
    this.setState({
      loading: true,
      activities: [],
    });
    if (!Array.isArray(this.state.dataType) || this.state.dataType.length === 0) {
      return;
    }
    const id = this.props.params && this.props.params.id ? this.props.params.id : '';
    Promise.all(
      this.state.dataType.map(dataType => {
        return this.reportApi.get({
          from: start,
          to: end,
          type: dataType,
          res: settings.resolutionKey,
          id,
        });
      })
    )
      .then(values => {
        const parsedActivities = values.map(val => settings.parser(val.result));
        this.setState({
          activities: parsedActivities,
          period: period,
          loading: false,
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
        });
        console.log('report error', error);
      });
  }

  private getStartDate(duration: any) {
    return moment
      .utc()
      .subtract(duration)
      .format('YYYY-MM-DD:HH');
  }

  private getDays(settings: IResolutionSetting) {
    const latestHalfDuration = settings.ticksGapDuration * (settings.ticksCount - 1);
    const secondHalfDuration = settings.ticksGapDuration * (settings.ticksCount * 2 - 1);
    const latestHalfStart = moment()
      .utc()
      .subtract(latestHalfDuration);
    const secondHalfStart = moment()
      .utc()
      .subtract(secondHalfDuration);

    return _.times(settings.ticksCount, num => {
      const duration = settings.ticksGapDuration * num;
      const latestHalfDay = latestHalfStart.clone().add(duration);
      const secondHalfDay = secondHalfStart.clone().add(duration);
      var res = {
        label: latestHalfDay.format('YYYY-MM-DD:HH:mm'),
        latest: this.findSumByDate(
          this.state.activities[0],
          latestHalfDay.format('YYYY-MM-DD:HH:mm')
        ),
        second: this.findSumByDate(
          this.state.activities[0],
          secondHalfDay.format('YYYY-MM-DD:HH:mm')
        ),
      };
      this.state.dataType.forEach((dType, i) => {
        res[dType] = this.findSumByDate(
          this.state.activities[i],
          latestHalfDay.format('YYYY-MM-DD:HH:mm')
        );
      });
      if (this.state.comparePreviousPeriod) {
        this.state.dataType.forEach((dType, i) => {
          res['previous' + dType] = this.findSumByDate(
            this.state.activities[i],
            secondHalfDay.format('YYYY-MM-DD:HH:mm')
          );
        });
      }
      return res;
    });
  }

  private findSumByDate(activities: [], day: string) {
    const isInDay = (activity: any) => _.startsWith(day, activity.date);

    return _.sumBy(_.filter(activities, isInDay), 'value');
  }
}

export default ActivityArea;
