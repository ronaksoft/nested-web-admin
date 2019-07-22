import * as React from 'react';
import moment from 'moment';
import SystemApi from '../../../../api/system/index';
import Loading from '../../../../components/Loading';
import { Paper, Button, Grid, Typography } from '@material-ui/core';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import Info from '@material-ui/icons/Info';

interface IHealthCheckProps {
  classes: any;
}

interface IHealthCheckState {
  isRunning: boolean;
  progress: boolean;
  loading: boolean;
  last: moment.Moment | null;
}

const LAST_HEALTH_CHECK_KEY: string = 'ronak.nested.admin.assistant.health_check';

class HealthCheck extends React.Component<IHealthCheckProps, IHealthCheckState> {
  private systemApi: SystemApi = new SystemApi();
  private checkStatusInterval: any | null = null;
  constructor(props: IHealthCheckProps) {
    super(props);
    this.state = {
      loading: false,
      progress: false,
      isRunning: false,
      last: null,
    };

    // this.run = this.run.bind(this);
  }

  componentDidMount() {
    this.setState({ last: this.getLast() });
    this.load().then(
      () => {
        this.setState({ loading: false });
        this.checkStatusInterval = setInterval(() => {
          this.load();
        }, 30000);
      },
      () => {
        this.setState({ loading: false });
      }
    );
  }

  componentWillUnmount() {
    if (this.checkStatusInterval) {
      clearInterval(this.checkStatusInterval);
    }
  }

  run() {
    this.setState({ progress: true });

    return this.systemApi.runHealthCheck().then(
      (response: any) => {
        const now: moment.Moment = moment();
        this.setState({ progress: false, isRunning: true, last: now });
        this.setLast(now);
      },
      (error: any) => {
        this.setState({ progress: false, isRunning: false });
      }
    );
  }
  render() {
    const {classes} = this.props;
    return (
      <Grid container={true}>
        <Grid item={true} xs={6}>
          <p>Health check is designed to fix any possible errors.</p>
          <Grid container={true}>
            <Grid item={true} xs={6}>
              <Loading active={this.state.isRunning} position="absolute" />
              <Button onClick={this.run.bind(this)} variant="contained" color="primary">
                Run
                <PlayIcon />
              </Button>
            </Grid>
            <Grid item={true} xs={6}>
              {this.state.last && (
                <p>
                  Last Run: <b>{this.state.last.format('dddd, MMMM Do YYYY, h:mm:ss a')}</b>
                </p>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item={true} xs={6}>
          <Paper className={classes.infoCard}>
              <Typography variant="h6" component="h6">
                <Info className={classes.infoIcon}/>
              Notes
              </Typography>
              <p>It is recommended to run this job during nights or while your server is not busy. Please note that it takes several minutes and you will be notified once the job has been completed.</p>
            </Paper>
        </Grid>
      </Grid>
    );
  }

  private load() {
    return this.systemApi.getHealthCheckState().then((response: any) => {
      this.setState({ isRunning: response.running_health_check });
    });
  }

  private setLast(date: moment.Moment) {
    window.localStorage.setItem(LAST_HEALTH_CHECK_KEY, date.format('x'));
  }

  private getLast(): moment.Moment | null {
    const last = window.localStorage.getItem(LAST_HEALTH_CHECK_KEY);
    if (!last) {
      return null;
    }

    const lastMoment = moment(+last);
    if (!lastMoment.isValid()) {
      return null;
    }

    return lastMoment;
  }
}

export default withStyles((theme: Theme) =>
  createStyles({
    infoCard: {
      padding: theme.spacing(2, 2, 7, 2),
      position: 'relative',
      borderRadius: '4px',
      marginBottom: '10px',
      color: 'rgba(0,0,0,.65)',
      lineHeight: 1.5,
      border: '1px solid #cff1e0',
      backgroundColor: 'rgba(235,240,237,.4)',
      fontSize: '12px',
    },
    infoIcon: {
      color: '#108ee9',
      margin: theme.spacing(0, 2, 0, 0),
      verticalAlign: 'middle',
    }
  })
)(HealthCheck);
