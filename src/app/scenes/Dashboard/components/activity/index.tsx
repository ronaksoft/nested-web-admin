import * as React from 'react';
import {} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import {ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Line} from 'recharts';
import ReportApi from '../../../../api/report/index';

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
    const aWeekAgo = moment().subtract(7, 'days').startOf('day').utc().format('YYYY-MM-DD:HH');

    this.reportApi.getRequests({
      from: aWeekAgo,
      to: now
    }).then((response) => {
      console.log('res', response);
      this.setState({
        activities: response.result
      });
    }).catch((error) => {
      console.log('report error', error);
    });
  }

  render() {
    const data = _(this.state.activities)
      .groupBy((item) => {
        return moment.utc(item.date, 'YYYY-MM-DD:HH').format('ddd');
      })
      .map((items, key) => {
        return {
          day: key,
          count: _.sumBy(items, 'sum')
        };
      })
      .value();

    console.log('data', data);

    return (
        <ResponsiveContainer width='100%' height={300}>
          <AreaChart data={data} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
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
            <XAxis dataKey='day' tickLine={false} axisLine={false}/>
            <CartesianGrid strokeDasharray='1 1'/>
            <Tooltip/>
            <Area type='monotone' dataKey='count' stroke='#00B45A' fill='url(#colorUv)' />
            <Line name='This week' type='monotone' dataKey='count' stroke='#00B45A' />
          </AreaChart>
        </ResponsiveContainer>
    );
  }

}

export default Activity;
