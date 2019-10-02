import * as React from 'react';
import SystemApi from '../../api/system/index';
import ReportType from '../../consts/ReportType';
import Loading from '../../components/Loading';
import MeasureType from '../../components/ChartCard/MeasureType';
import OnlineUsers from '../../components/onlineUsers/index';
import appLoader from '../../components/Loading/app-loading';
import Licence from '../../components/licenseHandler/index';
import ChartCard from '../../components/ChartCard/index';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

import { Link } from 'react-router-dom';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Grid, Paper, Typography } from '@material-ui/core';

declare global {
  interface Window {
    companyName: string;
  }
}
const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
];
const COLORS = ['#FF3344', '#323D47'];
const RED_COLORS = ['#323D47', '#ADB1B5'];

const RADIAN = Math.PI / 180;

export interface IDashboardProps {
  classes: any;
}

export interface IDashboardState {
  data: any;
  loading: boolean;
  activeIndex: number;
  activityPeriod: string;
  companyName: string;
}

const card3Title = (
  <h2>
    <Link to="/places">Places</Link>
  </h2>
);
const card4Title = (
  <h2>
    <Link to="/accounts">Accounts</Link>
  </h2>
);


const renderCustomizedLabel = ({ cx, cy, midAngle, name, outerRadius, percent, index }: any) => {
  const radius = outerRadius * 1.3;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      key={`label-${index}-${name}`}
    >
      <tspan x={x} textAnchor={x > cx ? 'start' : 'end'}>
        {`${(percent * 100).toFixed(0)}%`}
      </tspan>
      <tspan x={x} dy="1.2em" textAnchor={x > cx ? 'start' : 'end'}>
        {name}
      </tspan>
    </text>
  );
};

class DashboardComponent extends React.Component<IDashboardProps, IDashboardState> {
  private SystemApi: SystemApi = new SystemApi();
  constructor(props: IDashboardProps) {
    super(props);
    this.state = {
      loading: true,
      data: {
        accounts: [],
        places: [],
      },
      activeIndex: 0,
      activityPeriod: 'week',
      companyName: window.companyName ? window.companyName : 'Company Name',
    };
  }

  componentDidMount() {
    if (!window.companyName) {
      this.SystemApi.getCompanyInfo().then((data: any) => {
        window.companyName = data.companyName;
        this.setState({
          companyName: data.company_name,
        });
      });
    }
    this.GetData();
    appLoader.hide();
  }

  GetData() {
    this.SystemApi.getSystemCounters()
      .then((result: any) => {
        this.setState({
          data: {
            places: [
              {
                name: 'Shared Places',
                value: result.unlocked_places + result.locked_places + result.grand_places,
              },
              { name: 'Individual Places', value: result.personal_places },
            ],
            accounts: [
              { name: 'Inactive Accounts', value: result.disabled_accounts },
              { name: 'Active Accounts', value: result.enabled_accounts },
            ],
          },
          loading: false,
        });
      })
      .catch((error: any) => {
        console.log('error', error);
      });
  }

  render() {
    return (
      <div>
        <div className="scene-head">
          <Typography className="page-head" variant="h5" component="h2">
            {this.state.companyName} Dashboard
          </Typography>
        </div>
        <Grid container={true} className="dashboardRow" spacing={4}>
          <Grid item={true} xs={4}>
            <OnlineUsers />
          </Grid>
          <Grid item={true} xs={8}>
            <ChartCard
              title={['System Activities']}
              measure={MeasureType.NUMBER}
              height={320}
              dataType={[ReportType.AllRequests]}
              color={['#8884d8']}
              syncId="nested"
            />
          </Grid>
        </Grid>
        <Grid container={true} className="dashboardRow" spacing={4}>
          <Grid item={true} xs={4}>
            <Licence />
          </Grid>
          <Grid item={true} xs={4}>
            {this.state.data.accounts && (
              <Paper>
                <Loading active={this.state.loading} position="absolute" />
                <div className="card-head">{card4Title}</div>
                <div className="card-body">
                  {this.state.data.accounts[1] && (
                    <span className="chart-info" style={{ color: COLORS[1] }}>
                      <abbr>Active Accounts: </abbr>
                      <span>{this.state.data.accounts[1].value}</span>
                    </span>
                  )}
                  {this.state.data.accounts[0] && (
                    <span className="chart-info" style={{ color: COLORS[0] }}>
                      <abbr>Inactive Accounts: </abbr>
                      <span>{this.state.data.accounts[0].value}</span>
                    </span>
                  )}
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        dataKey={'value'}
                        data={this.state.data.accounts}
                        activeIndex={this.state.activeIndex}
                        label={renderCustomizedLabel}
                        fill="#FFDFDF"
                        innerRadius={40}
                        outerRadius={66}
                        paddingAngle={0}
                      >
                        {data.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Paper>
            )}
          </Grid>
          <Grid item={true} xs={4}>
            <Paper>
              <Loading active={this.state.loading} position="absolute" />
              <div className="card-head">{card3Title}</div>
              <div className="card-body">
                {this.state.data.places[0] && (
                  <span className="chart-info" style={{ color: RED_COLORS[0] }}>
                    <abbr>Shared Places: </abbr>
                    <span>{this.state.data.places[0].value}</span>
                  </span>
                )}
                {this.state.data.places[1] && (
                  <span className="chart-info" style={{ color: RED_COLORS[1] }}>
                    <abbr>Individual Places: </abbr>
                    <span>{this.state.data.places[1].value}</span>
                  </span>
                )}
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      dataKey={'value'}
                      data={this.state.data.places}
                      activeIndex={this.state.activeIndex}
                      label={renderCustomizedLabel}
                      fill="#8884d8"
                      innerRadius={40}
                      outerRadius={66}
                      paddingAngle={0}
                    >
                      {data.map((entry, index) => (
                        <Cell key={index} fill={RED_COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles((theme: Theme) =>
  createStyles({
    head: {},
  })
)(DashboardComponent);
