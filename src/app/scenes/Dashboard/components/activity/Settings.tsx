import IResolutionSetting from './interfaces/IResolutionSetting';
import moment from 'moment';

export default class Settings {
  static Day: IResolutionSetting = {
      latestAreaLabel: 'Last 24 hours',
      latestAreaColor: '#00B45A',
      secondAreaLabel: 'Last 48 hours',
      secondAreaColor: '#FF6464',
      resolutionKey: 'h',
      ticksDateFormat: 'H',
      ticksCount: 24,
      ticksGapDuration: moment.duration(1, 'h')
  };

  static Week: IResolutionSetting = {
      latestAreaLabel: 'Last 7 days',
      latestAreaColor: '#00B45A',
      secondAreaLabel: 'Last 14 days',
      secondAreaColor: '#FF6464',
      resolutionKey: 'd',
      ticksDateFormat: 'dddd',
      ticksCount: 7,
      ticksGapDuration: moment.duration(1, 'd')
  };

  static Month: IResolutionSetting = {
      latestAreaLabel: 'Last 30 days',
      latestAreaColor: '#00B45A',
      secondAreaLabel: 'Last 60 days',
      secondAreaColor: '#FF6464',
      resolutionKey: 'd',
      ticksDateFormat: 'D',
      ticksCount: 30,
      ticksGapDuration: moment.duration(1, 'd')
  };
}
