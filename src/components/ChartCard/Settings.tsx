import _ from 'lodash';
import moment from 'moment';
import IResolutionSetting from './IResolutionSetting';

export default class Settings {
  public static Hour: IResolutionSetting = {
    latestAreaColor: '#00B45A',
    latestAreaLabel: 'Value',
    parser: (items: any[]) => {
      return _.flatMap(items, item => {
        return _.map(item.values, (value, hour) => {
          return {
            date: `${item.date}:${_.padStart(_.trim(hour), 2, '0')}`,
            value,
          };
        });
      });
    },
    resolutionKey: 'h',
    secondAreaColor: '#FF6464',
    secondAreaLabel: '1 hour ago',
    tickFormatter: (value: number) => {
      const date = moment.utc(value, 'YYYY-MM-DD:HH:mm').local();
      if (date.minutes() % 5 !== 0) {
        return '';
      }
      return date.minutes() === 0 ? date.format('h A') : date.format('mm');
    },
    ticksCount: 60,
    ticksGapDuration: moment.duration(1, 'm'),
    tooltipLabelFormatter: value => {
      const date = moment.utc(value, 'YYYY-MM-DD:HH:mm').local();
      return date.format('hh:mm');
    },
  };

  public static Day: IResolutionSetting = {
    latestAreaColor: '#00B45A',
    latestAreaLabel: 'Value',
    parser: items => {
      return _.map(items, item => {
        return {
          date: item.date,
          value: item.sum
        };
      });
    },
    resolutionKey: 'h',
    secondAreaColor: '#FF6464',
    secondAreaLabel: '24 hours ago',
    tickFormatter: value => {
      const date = moment.utc(value, 'YYYY-MM-DD:HH').local();
      return date.hours() === 12 ? date.format('h A') : date.format('h');
    },
    ticksCount: 24,
    ticksGapDuration: moment.duration(1, 'h'),
    tooltipLabelFormatter: value => {
      const date = moment.utc(value, 'YYYY-MM-DD:HH').local();
      return date.isBefore(moment()) ? date.format('[Yesterday], h:00 A') : date.format('[Today], h:00 A');
    },
  };

  public static Week: IResolutionSetting = {
    latestAreaColor: '#00B45A',
    latestAreaLabel: 'Value',
    parser: items => {
      return _.map(items, item => {
        return {
          date: item.date,
          value: item.sum
        };
      });
    },
    resolutionKey: 'd',
    secondAreaColor: '#FF6464',
    secondAreaLabel: '7 days ago',
    thirdAreaColor: '#ffc658',
    tickFormatter: value => {
      const date = moment.utc(value, 'YYYY-MM-DD:HH').local();
      return date.format('ddd');
    },
    ticksCount: 7,
    ticksGapDuration: moment.duration(1, 'd'),
    tooltipLabelFormatter: value => {
      const date = moment.utc(value, 'YYYY-MM-DD:HH').local();
      return date.format('dddd, DD MMMM');
    },
  };

  public static Month: IResolutionSetting ={
    latestAreaColor: '#00B45A',
    latestAreaLabel: 'Value',
    parser: items => {
      return _.map(items, item => {
        return {
          date: item.date,
          value: item.sum
        };
      });
    },
    resolutionKey: 'd',
    secondAreaColor: '#FF6464',
    secondAreaLabel: '30 days ago',
    tickFormatter: value => {
      const date = moment.utc(value, 'YYYY-MM-DD:HH').local();
      return date.date() === 1 ? date.format('D MMM') : date.format('D');
    },
    ticksCount: 30,
    ticksGapDuration: moment.duration(1, 'd'),
    tooltipLabelFormatter: value => {
      const date = moment.utc(value, 'YYYY-MM-DD:HH').local();
      return date.format('dddd, DD MMMM YYYY');
    },
  };
}
