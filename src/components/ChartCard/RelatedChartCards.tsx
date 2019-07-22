import * as React from 'react';
import ReportType from '../../consts/ReportType';
import ChartCard from './index';
import MeasureType from './MeasureType';
import TimePeriod from './TimePeriod';
import Grid from '@material-ui/core/Grid';

export interface IProps {
  title: string[][];
  dataType: ReportType[][];
  color: string[][];
  measure: MeasureType[];
  syncId?: string;
  direction?: string;
  params?: any;
}

export interface IState {
  period: TimePeriod;
}

export default class extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      period: TimePeriod.Week,
    };
  }

  updatePeriod = (period: TimePeriod) => {
    this.setState({
      period,
    });
  };

  render() {
    const DOMS = this.props.dataType.map((t, index) => (
      <ChartCard
        key={index}
        title={this.props.title[index]}
        measure={this.props.measure[index]}
        syncPeriod={this.updatePeriod}
        params={this.props.params}
        dataType={this.props.dataType[index]}
        color={this.props.color[index]}
        syncId={this.props.syncId}
        period={this.state.period}
        height={300}
      />
    ));

    if (this.props.direction === 'vertical') {
      return (
        <Grid container={true} spacing={3}>
          {DOMS.map(DOM => (
            <Grid xs={12} item={true}>
              {DOM}
            </Grid>
          ))}
        </Grid>
      );
    }
  }
}

