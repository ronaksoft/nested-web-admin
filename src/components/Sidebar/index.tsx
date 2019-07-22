import * as React from 'react';
import CONFIG from '../../config';
import { Paper, MenuItem, Tooltip } from '@material-ui/core';

import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import { IcoN } from '../icon/index';
import { NavLink } from 'react-router-dom';

import './style.less';

interface ISidebarProps {
  location: string;
  classes: any;
}

interface ISidebarState {
  location: string;
}

class Sidebar extends React.Component<ISidebarProps, ISidebarState> {
  constructor(props: any) {
    super(props);
    this.state = {
      location: props.location,
    };
  }

  componentWillReceiveProps(nProps: ISidebarProps) {
    this.setState({
      location: nProps.location,
    });
  }

  render() {
    const { classes } = this.props;
    let { location } = this.state;
    if (location === '/') {
      location = '/dashboard';
    }
    return (
      <Paper className={classes.container}>
        <NavLink to="/dashboard" activeClassName="active center">
          <div className={classes.logo}></div>
        </NavLink>
        <nav className={classes.nav}>
          <NavLink to="/dashboard" activeClassName="active">
            <MenuItem key="/dashboard" selected={'/dashboard' === location}>
              <Tooltip placement="right" title={'Dashboard'}>
                <IcoN size={24} name={'dashbooard24'} />
              </Tooltip>
            </MenuItem>
          </NavLink>
          <NavLink to="/accounts" activeClassName="active">
            <MenuItem key="/accounts" selected={'/accounts' === location}>
              <Tooltip placement="right" title={'Accounts'}>
                <IcoN size={24} name={'personWire24'} />
              </Tooltip>
            </MenuItem>
          </NavLink>
          <NavLink to="/places" activeClassName="active">
            <MenuItem key="/places" selected={'/places' === location}>
              <Tooltip placement="right" title={'Places'}>
                <IcoN size={24} name={'placesRelationWire24'} />
              </Tooltip>
            </MenuItem>
          </NavLink>
          <NavLink to="/charts" activeClassName="active">
            <MenuItem key="/charts" selected={'/charts' === location}>
              <Tooltip placement="right" title={'Charts'}>
                <IcoN size={24} name={'pieChart24'} />
              </Tooltip>
            </MenuItem>
          </NavLink>
          <NavLink to="/config" activeClassName="active">
            <MenuItem key="/config" selected={'/config' === location}>
              <Tooltip placement="right" title={'Settings'}>
                <IcoN size={24} name={'performances24'} />
              </Tooltip>
            </MenuItem>
          </NavLink>
          <NavLink to="/apps" activeClassName="active">
            <MenuItem key="/apps" selected={'/apps' === location}>
              <Tooltip placement="right" title={'Integrations'}>
                <IcoN size={24} name={'integrate24'} />
              </Tooltip>
            </MenuItem>
          </NavLink>
          <NavLink to="/default_places" activeClassName="active">
            <MenuItem key="/default_places" selected={'/default_places' === location}>
              <Tooltip placement="right" title={'Default Places'}>
                <IcoN size={24} name={'hdd24'} />
              </Tooltip>
            </MenuItem>
          </NavLink>
        </nav>
        <small
          style={{
            position: 'fixed',
            bottom: 0,
            left: 10,
          }}
        >
          v.{CONFIG().APP_VERSION}
        </small>
      </Paper>
    );
  }
}

export default withStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      width: '80px',
      zIndex: 2,
    },
    logo: {
      height: '88px',
      position: 'absolute',
      backgroundImage: 'url(/images/nested-logo-256.png)',
      backgroundPosition: '50%',
      backgroundRepeat: 'no-repeat',
      width: '100%',
    },
    nav: {
      flex: '1',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      '& li': {
        display: 'flex',
        justifyContent: 'center',
        lineHeight: '14px',
      },
    },
  })
)(Sidebar);
