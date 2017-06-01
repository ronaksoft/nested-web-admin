import IResolutionSetting from './IResolutionSetting';
import moment from 'moment';

export default class Settings {
  static Day: IResolutionSetting = {
      latestAreaLabel: 'Value',
      latestAreaColor: '#00B45A',
      secondAreaLabel: '24 hours ago',
      secondAreaColor: '#FF6464',
      resolutionKey: 'h',
      tickFormatter: (value) => {
        const date = moment.utc(value, 'YYYY-MM-DD:HH');
        return date.hours() === 12 ? date.format('h A') : date.format('h');
      },
      ticksCount: 24,
      ticksGapDuration: moment.duration(1, 'h'),
      tooltipLabelFormatter: (value) => {
        const date = moment.utc(value, 'YYYY-MM-DD:HH');
        return date.isBefore(moment.utc()) ? date.format('[Yesterday], h:00 A') : date.format('[Today], h:00 A');
      }
  };

  static Week: IResolutionSetting = {
      latestAreaLabel: 'Value',
      latestAreaColor: '#00B45A',
      secondAreaLabel: '7 days ago',
      secondAreaColor: '#FF6464',
      resolutionKey: 'd',
      tickFormatter: (value) => {
          const date = moment.utc(value, 'YYYY-MM-DD:HH');
          return date.format('ddd');
      },
      ticksCount: 7,
      ticksGapDuration: moment.duration(1, 'd'),
      tooltipLabelFormatter: (value) => {
          const date = moment.utc(value, 'YYYY-MM-DD:HH');
          return date.format('dddd, DD MMMM');
      }
  };

  static Month: IResolutionSetting = {
      latestAreaLabel: 'Value',
      latestAreaColor: '#00B45A',
      secondAreaLabel: '30 days ago',
      secondAreaColor: '#FF6464',
      resolutionKey: 'd',
      tickFormatter: (value) => {
          const date = moment.utc(value, 'YYYY-MM-DD:HH');
          return date.date() === 1 ? date.format('D MMM') : date.format('D');
      },
      ticksCount: 30,
      ticksGapDuration: moment.duration(1, 'd'),
      tooltipLabelFormatter: (value) => {
        const date = moment.utc(value, 'YYYY-MM-DD:HH');
        return date.format('dddd, DD MMMM YYYY');
      }
  };
}
