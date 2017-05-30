import * as React from 'react';
import {} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import {ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Line} from 'recharts';
import ReportApi from '../../../../api/report/index';
import ReportType from '../../../../api/report/ReportType';

interface IActivityProps {
}

interface IActivityState {
  activities: Array;
}

class Activity extends React.Component<IActivityProps, IActivityState> {
  constructor(props: IActivityProps) {
    super(props);

    this.state = {
      activities: []
    };
  }

  componentDidMount() {
    this.reportApi = new ReportApi();
    const now = moment.utc().format('YYYY-MM-DD:HH');
    const twoWeekAgo = moment().subtract(14, 'days').startOf('day').utc().format('YYYY-MM-DD:HH');

    this.reportApi.get({
      from: twoWeekAgo,
      to: now,
      type: ReportType.AllRequests
    }).then((response) => {
      this.setState({
        activities: response.result
      });
    }).catch((error) => {
      console.log('report error', error);
    });
  }

  render() {
    const activities = _(this.state.activities)
      .groupBy((item) => {
        return item.date.split(':')[0];
      })
      .value();


    const thisWeekStart = moment().subtract(6, 'days').startOf('day');
    const preWeekStart = moment().subtract(13, 'days').startOf('day');

    const days = _.times(7, (weekDay) => {
      const thisWeekDate = thisWeekStart.clone().add(weekDay, 'days');
      const preWeekDate = preWeekStart.clone().add(weekDay, 'days');
      const thisWeekDateString = thisWeekDate.format('YYYY-MM-DD');
      const preWeekDateString = preWeekDate.format('YYYY-MM-DD');

      return {
        label: thisWeekDate.format('dddd'),
        thisWeek: _.sumBy(activities[thisWeekDateString], 'sum'),
        preWeek: _.sumBy(activities[preWeekDateString], 'sum')
      };
    });

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
            <Area type='monotone' dataKey='preWeek' name='Last Week' stroke='#FF6464' fill='url(#colorPv)' />
            <Area type='monotone' dataKey='thisWeek' name='This Week' stroke='#00B45A' fill='url(#colorUv)' />
          </AreaChart>
        </ResponsiveContainer>
    );
  }
}

export default Activity;
