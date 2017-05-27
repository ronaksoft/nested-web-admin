import * as React from 'react';
import {} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import {ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Line} from 'recharts';
import ReportApi from '../../../../api/report/index';
import TimePeriod from './TimePeriod';

interface IAddCommentProps {
  color: string;
  activities: [];
  period: TimePeriod;
  title: string;
}

interface IAddCommentState {
  activities: Array;
}

class AddComment extends React.Component<IAddCommentProps, IAddCommentState> {
  constructor(props: IAddCommentProps) {
    super(props);

    this.state = {
      color: props.color || '#7f8c8d',
      period: props.period || TimePeriod.Week
    };
  }

  render() {
    const activities = _(this.props.activities)
      .groupBy((item) => {
        return item.date;
      })
      .value();
    let daysInPeriod = 7;
    let dayLabel = 'dddd';

    switch (this.state.period) {
      case TimePeriod.Month:
        daysInPeriod = 30;
        dayLabel = 'D';
        break;
      default:
        daysInPeriod = 7;
        dayLabel = 'dddd';
        break;
    }

    const start = moment().subtract(daysInPeriod, 'days').startOf('day');

    const days = _.times(daysInPeriod, (dayNumber) => {
      const day = start.clone().add(dayNumber, 'days');
      const dayString = day.format('YYYY-MM-DD');

      return {
        label: day.format(dayLabel),
        count: _.sumBy(activities[dayString], 'sum')
      };
    });
    const key = _.kebabCase(this.props.name) || _.uniqueId();
    const gradientKey = 'color-' + key;
    const gradientUrl = `url(#${gradientKey})`;
    return (
        <ResponsiveContainer width='100%' height={300}>
          <AreaChart data={days} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
            <defs>
              <linearGradient id={gradientKey} x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor={this.state.color} stopOpacity={0.5}/>
                <stop offset='95%' stopColor={this.state.color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey='label' tickLine={false} axisLine={false}/>
            <YAxis />
            <CartesianGrid strokeDasharray='1 1'/>
            <Tooltip/>
            <Area type='monotone' dataKey='count' name={this.props.title} stroke={this.state.color} fill={gradientUrl} />
          </AreaChart>
        </ResponsiveContainer>
    );
  }

}

export default AddComment;
