import * as React from 'react';
import ReportType from '../../consts/ReportType';
import MeasureType from '../../components/ChartCard/MeasureType';
import TimePeriod from '../../components/ChartCard/TimePeriod';
import appLoader from '../../components/Loading/app-loading';
import { Grid, Typography } from '@material-ui/core';
import ChartCard from '../../components/ChartCard/index';

export interface IChartsProps {}

export interface IChartsState {
  period: TimePeriod;
}

class Charts extends React.Component<IChartsProps, IChartsState> {
  constructor(props: IChartsProps) {
    super(props);
    this.state = {
      period: TimePeriod.Week,
    };
  }
  componentDidMount() {
    appLoader.hide();
  }
  updatePeriod = (period: TimePeriod) => {
    this.setState({
      period,
    });
  };

  render() {
    return (
      <div className="charts-scene">
        <div className="scene-head">
          <Typography className="page-head" variant="h5" component="h2">
            Charts
          </Typography>
        </div>
        <Grid container={true} direction="row" justify="center" alignItems="center" spacing={3}>
          <Grid item={true} xs={6}>
            <ChartCard
              title={['Comments', 'Emails', 'Posts']}
              measure={MeasureType.NUMBER}
              height={240}
              dataType={[ReportType.AddComment, ReportType.AddEmail, ReportType.AddPost]}
              period={this.state.period}
              color={['#8884d8', '#82ca9d', '#ffc658']}
              syncId="nested"
              syncPeriod={this.updatePeriod}
            />
          </Grid>
          <Grid item={true} xs={6}>
            <ChartCard
              title={['New Tasks', 'Commnets', 'Completed Tasks']}
              measure={MeasureType.NUMBER}
              dataType={[ReportType.taskAdd, ReportType.taskComment, ReportType.taskCompleted]}
              height={240}
              period={this.state.period}
              color={['#8884d8', '#82ca9d', '#ffc658']}
              syncId="nested"
              syncPeriod={this.updatePeriod}
            />
          </Grid>
          <Grid item={true} xs={6}>
            <ChartCard
              title={['Logins', 'Session Recalls']}
              measure={MeasureType.NUMBER}
              dataType={[ReportType.Login, ReportType.SessionRecall]}
              color={['#8884d8', '#82ca9d']}
              syncId="nested"
              height={224}
              syncPeriod={this.updatePeriod}
              period={this.state.period}
            />
          </Grid>
          <Grid item={true} xs={6}>
            <ChartCard
              title={['Traffic Out']}
              measure={MeasureType.FILE_SIZE}
              height={224}
              syncPeriod={this.updatePeriod}
              dataType={[ReportType.dataOut]}
              color={['#82ca9d']}
              syncId="nested"
              period={this.state.period}
            />
            {/* <ChartCard title={['Traffic In', 'Out']} measure={MeasureType.FILE_SIZE} height={224} syncPeriod={this.updatePeriod}
                                dataType={[ReportType.dataIn, ReportType.dataOut]} color={['#8884d8', '#82ca9d']} syncId='nested' period={this.state.period}/> */}
          </Grid>
          <Grid item={true} xs={3}>
            <ChartCard
              title={['Attachments Size']}
              measure={MeasureType.FILE_SIZE}
              dataType={[ReportType.AttachmentSize]}
              height={152}
              period={this.state.period}
              color={['#8884d8']}
              syncId="nested"
              syncPeriod={this.updatePeriod}
            />
          </Grid>
          <Grid item={true} xs={3}>
            <ChartCard
              title={['Attachments Count']}
              measure={MeasureType.NUMBER}
              dataType={[ReportType.AttachmentCount]}
              color={['#8884d8']}
              syncId="nested"
              height={152}
              syncPeriod={this.updatePeriod}
              period={this.state.period}
            />
          </Grid>
          <Grid item={true} xs={3}>
            <ChartCard
              title={['All Requests']}
              measure={MeasureType.NUMBER}
              height={152}
              syncPeriod={this.updatePeriod}
              dataType={[ReportType.AllRequests]}
              color={['#8884d8']}
              syncId="nested"
              period={this.state.period}
            />
          </Grid>
          <Grid item={true} xs={3}>
            <ChartCard
              title={['Average Response Time']}
              measure={MeasureType.TIME}
              height={152}
              syncPeriod={this.updatePeriod}
              dataType={[ReportType.processTime]}
              color={['#8884d8']}
              syncId="nested"
              period={this.state.period}
            />
          </Grid>
        </Grid>
        {/* <RelatedChartCards
            title={['Attachments Size', 'Attachments Count']}
            dataType={[[ReportType.AttachmentSize],[ReportType.AttachmentCount]]}
            syncId='nested'
            color={['#e74c3c', '#f1c40f']}
            measure={[MeasureType.FILE_SIZE, MeasureType.NUMBER]}/> */}
        {/* <RelatedChartCards
            title={['All Requests', 'Average Response Time']}
            dataType={[[ReportType.AllRequests],[ReportType.processTime]]}
            syncId='nested'
            color={['#34495e', '#f1c40f']}
            measure={[MeasureType.NUMBER, MeasureType.TIME]}/> */}
      </div>
    );
  }
}

export default Charts;
