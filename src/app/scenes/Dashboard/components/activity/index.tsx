import * as React from 'react';
import {} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import {ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Line} from 'recharts';
import ReportApi from '../../../../api/report/index';
import ReportType from '../../../../api/report/ReportType';

interface IActivityProps {
    period: string;
}

interface IActivityState {
  activities: Array;
}

class Activity extends React.Component<IActivityProps, IActivityState> {
  constructor(props: IActivityProps) {
    super(props);

    this.state = {
      activities: [],
      period: props.period || 'week'
    };
  }

  componentDidMount() {
    this.reportApi = new ReportApi();
    this.load(this.state.period);
  }

  componentWillReceiveProps(newProps: IFilterProps) {
      this.load(newProps.period);
  }

  render() {

    const days = this.getDays(this.state.period);
    return (
          <ResponsiveContainer width='100%' height={300}>
            <AreaChart data={days} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
              <defs>
                <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#00B45A' stopOpacity={0.5}/>
                  <stop offset='95%' stopColor='#00B45A' stopOpacity={0}/>
                </linearGradient>
                <linearGradient id='colorPv' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#FF6464' stopOpacity={0.5}/>
                  <stop offset='95%' stopColor='#FF6464' stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey='label' tickLine={false} axisLine={false}/>
              <YAxis/>
              <CartesianGrid strokeDasharray='1 1' stroke='#eee'/>
              <Tooltip/>
              <Area type='monotone' dataKey='second' name={this.state.period === 'week' ? 'Last Week' : 'Last Month'} stroke='#FF6464' fill='url(#colorPv)' />
              <Area type='monotone' dataKey='latest' name={this.state.period === 'week' ? 'This Week' : 'This Month'} stroke='#00B45A' fill='url(#colorUv)' />
            </AreaChart>
          </ResponsiveContainer>
    );
  }

  private load(period: string) {
    const end = moment().endOf('day').utc().format('YYYY-MM-DD:HH');
    const start = this.getStartDate(period);

    this.reportApi.get({
      from: start,
      to: end,
      type: ReportType.AllRequests
    }).then((response) => {
      this.setState({
        activities: response.result,
        period: period
      });
    }).catch((error) => {
      console.log('report error', error);
    });
  }

  private getStartDate(period: string) {
      return moment().subtract(this.getDaysInPeriod(period), 'days').startOf('day').utc().format('YYYY-MM-DD:HH');
  }

  private getDaysInPeriod(period: string) {
    return period === 'week' ? 14
                             : 60;
  }

  private getDays(period: string) {
    const daysInPeriod = this.getDaysInPeriod(period);

    const latestHalfStart = moment().subtract((daysInPeriod / 2) - 1, 'days').startOf('day');
    const secondHalfStart = moment().subtract(daysInPeriod - 1, 'days').startOf('day');

    return _.times((daysInPeriod / 2), (weekDay) => {
      const latestHalfDay = latestHalfStart.clone().add(weekDay, 'days');
      const secondHalfDay = secondHalfStart.clone().add(weekDay, 'days');

      return {
        label: latestHalfDay.format(this.getDayFormat(period)),
        latest: this.findSumByDate(this.state.activities, latestHalfDay.format('YYYY-MM-DD')),
        second: this.findSumByDate(this.state.activities, secondHalfDay.format('YYYY-MM-DD'))
      };
    });
  }

  private findSumByDate(activities: [], day: string) {
    const isInDay = (activity) => _.startsWith(activity.date, day);

    return _.sumBy(_.filter(activities, isInDay), 'sum');
  }

  private getDayFormat(period: string) {
    return period === 'week' ? 'dddd'
                             : 'D';
  }
}

export default Activity;
