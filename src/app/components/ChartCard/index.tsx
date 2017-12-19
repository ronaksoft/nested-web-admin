import * as React from 'react';
import {Dropdown, Card, Menu, Icon, Button, Switch, Tooltip} from 'antd';
import TimePeriod from './TimePeriod';
import ActivityArea from './ActivityArea';
import ReportType from '../../api/report/ReportType';
import MeasureType from './MeasureType';
import _ from 'lodash';

interface IChartCardProps {
    title: string[];
    height: number;
    dataType: ReportType[];
    color: string[];
    measure: MeasureType;
    period?: TimePeriod;
    syncId?: string;
    params?: any;
    syncPeriod?: (period: TimePeriod) => {};
}

interface IChartCardState {
    activities: Array<any>;
    dataType: ReportType[];
    comparePreviousPeriod: boolean;
    period: any;
    reloadLoop: boolean;
    titles: any[];
}

class ChartCard extends React.Component<IChartCardProps, IChartCardState> {
    inteval:any;
    constructor(props: IChartCardProps) {
        super(props);

        this.state = {
            activities: [],
            reloadLoop: false,
            comparePreviousPeriod: false,
            period: TimePeriod.Week,
            dataType: this.props.dataType,
            titles: this.props.title.map((title, index) => {
                return {
                    title,
                    active: true
                };
            })
        };

        this.reload = this.reload.bind(this);
        this.toggleItem = this.toggleItem.bind(this);
        this.updatePeriod = this.updatePeriod.bind(this);
    }

    reload() {
        this.setState({
            reloadLoop: !this.state.reloadLoop
        }, () => {
            if (this.state.reloadLoop) {
                this.area.reload();
                this.inteval = setInterval(() => {
                    this.area.reload();
                }, 8000);
            } else {
                clearInterval(this.inteval);
            }
        });
    }

    changeCompare(checked: boolean) {
        this.setState({
            comparePreviousPeriod: checked,
        });
    }

    toggleItem(ind: number) {
        let titles = this.state.titles.slice();
        titles[ind].active =! titles[ind].active;
        if (titles.some( t => t.active)) {
            this.setState({
                titles,
            });
        }
        // todo array is not cloned properly !
        // console.log(titles, this.state.titles);
    }

    componentWillReceiveProps(newProps: IChartCardProps) {
        if(newProps.period !== this.state.period) {
            this.setState({
                period: newProps.period,
            });
        }
    }

    componentWillUnmount() {
        if (this.state.reloadLoop) {
            clearInterval(this.inteval);
        }
    }

    updatePeriod(period: TimePeriod) {
        this.setState({period});
        if (_.isFunction(this.props.syncPeriod)) {
            this.props.syncPeriod(period);
        }
    }

    render() {
        var titleDom = this.state.titles.map((title, index) => {
            return <span key={index} className={title.active ? '' : 'deactive'}
                onClick={() => {
                    this.toggleItem(index);
                }}>{title.title}</span>;
        });
        const activePropTypes = this.state.dataType.filter((dataType, index) => this.state.titles[index].active);
        const activeColors = this.props.color.filter((color, index) => this.state.titles[index].active);
        return (
            <Card title={<div>{titleDom}</div>} extra={
                <div>
                    <Tooltip placement='top' title={'Compare with previous period ?!'}>
                        {/* <Link to='/dashboard' activeClassName='active'>
                            <IcoN size={24} name={'dashbooard24'}/>
                        </Link> */}
                        <Switch defaultChecked={this.state.comparePreviousPeriod}
                            onChange={this.changeCompare.bind(this)} />
                    </Tooltip>
                    &nbsp;
                    &nbsp;
                    <Tooltip placement='top' title={this.state.reloadLoop ? 'Auto Reloading' : 'Reload'}>
                        <a rel='noopener noreferrer' className={[this.state.reloadLoop ? 'reloading' : ''].join(' ')} onClick={this.reload}>
                            <Icon type='reload'/>
                        </a>
                    </Tooltip>
                    &nbsp;
                    &nbsp;
                    <Dropdown overlay={
                        <Menu>
                            <Menu.Item>
                                <a rel='noopener noreferrer' onClick={() => this.updatePeriod(TimePeriod.Hour)}>Last
                                    1 hour</a>
                            </Menu.Item>
                            <Menu.Item>
                                <a rel='noopener noreferrer' onClick={() => this.updatePeriod(TimePeriod.Day)}>Last
                                    24 hours</a>
                            </Menu.Item>
                            <Menu.Item>
                                <a rel='noopener noreferrer' onClick={() => this.updatePeriod(TimePeriod.Week)}>Last
                                    7 days</a>
                            </Menu.Item>
                            <Menu.Item>
                                <a rel='noopener noreferrer' onClick={() => this.updatePeriod(TimePeriod.Month)}>Last
                                    30 days</a>
                            </Menu.Item>
                        </Menu>
                    }>
                        <a rel='noopener noreferrer'><Icon type='setting'/></a>
                    </Dropdown>
                </div>
            } className='chart-card'>
                <ActivityArea measure={this.props.measure} height={this.props.height} ref={(area) => {
                    this.area = area;
                }} syncId={this.props.syncId} dataType={activePropTypes} color={activeColors} title={this.props.title}
                              period={this.state.period} comparePreviousPeriod={this.state.comparePreviousPeriod} params={this.props.params}/>
            </Card>
        );
    }
}

export default ChartCard;
