import IResolutionSetting from './IResolutionSetting';
import moment from 'moment';
import _ from 'lodash';

export default class Settings {
    static Hour : IResolutionSetting = {
        latestAreaLabel: 'Value',
        latestAreaColor: '#00B45A',
        secondAreaLabel: '1 hour ago',
        secondAreaColor: '#FF6464',
        resolutionKey: 'h',
        tickFormatter: (value) => {
            const date = moment.utc(value, 'YYYY-MM-DD:HH:mm').local();
            if (date.minutes() % 5 !== 0) {
                return;
            }
            return date.minutes() === 0
                ? date.format('h A')
                : date.format('mm');
        },
        ticksCount: 60,
        ticksGapDuration: moment.duration(1, 'm'),
        tooltipLabelFormatter: (value) => {
            const date = moment.utc(value, 'YYYY-MM-DD:HH:mm').local();
            return date.format('hh:mm');
        },
        parser: (items) => {
            return _.flatMap(items, (item) => {
                return _.map(item.values, (value, hour) => {
                    return {
                        date: `${item.date}:${_.padStart(_.trim(hour), 2, '0')}`,
                        value: value
                    };
                });
            });
        }
    };

    static Day : IResolutionSetting = {
        latestAreaLabel: 'Value',
        latestAreaColor: '#00B45A',
        secondAreaLabel: '24 hours ago',
        secondAreaColor: '#FF6464',
        resolutionKey: 'h',
        tickFormatter: (value) => {
            const date = moment.utc(value, 'YYYY-MM-DD:HH').local();
            return date.hours() === 12
                ? date.format('h A')
                : date.format('h');
        },
        ticksCount: 24,
        ticksGapDuration: moment.duration(1, 'h'),
        tooltipLabelFormatter: (value) => {
            const date = moment.utc(value, 'YYYY-MM-DD:HH').local();
            return date.isBefore(moment())
                ? date.format('[Yesterday], h:00 A')
                : date.format('[Today], h:00 A');
        },
        parser: (items) => {
            return _.map(items, (item) => {
                return {
                    date: item.date,
                    value: item.sum
                };
            });
        }
    };

    static Week : IResolutionSetting = {
        latestAreaLabel: 'Value',
        latestAreaColor: '#00B45A',
        secondAreaLabel: '7 days ago',
        secondAreaColor: '#FF6464',
        resolutionKey: 'd',
        tickFormatter: (value) => {
            const date = moment.utc(value, 'YYYY-MM-DD:HH').local();
            return date.format('ddd');
        },
        ticksCount: 7,
        ticksGapDuration: moment.duration(1, 'd'),
        tooltipLabelFormatter: (value) => {
            const date = moment.utc(value, 'YYYY-MM-DD:HH').local();
            return date.format('dddd, DD MMMM');
        },
        parser: (items) => {
            return _.map(items, (item) => {
                return {
                    date: item.date,
                    value: item.sum
                };
            });
        }
    };

    static Month : IResolutionSetting = {
        latestAreaLabel: 'Value',
        latestAreaColor: '#00B45A',
        secondAreaLabel: '30 days ago',
        secondAreaColor: '#FF6464',
        resolutionKey: 'd',
        tickFormatter: (value) => {
            const date = moment.utc(value, 'YYYY-MM-DD:HH').local();
            return date.date() === 1
                ? date.format('D MMM')
                : date.format('D');
        },
        ticksCount: 30,
        ticksGapDuration: moment.duration(1, 'd'),
        tooltipLabelFormatter: (value) => {
            const date = moment.utc(value, 'YYYY-MM-DD:HH').local();
            return date.format('dddd, DD MMMM YYYY');
        },
        parser: (items) => {
            return _.map(items, (item) => {
                return {
                    date: item.date,
                    value: item.sum
                };
            });
        }
    };
}
