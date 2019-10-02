import * as React from 'react';
import moment from 'moment';
import SystemApi from '../../api/system/index';
import { IcoN } from '../icon/index';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import Loading from '../Loading';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';

interface ILicenceProps {
  classes: any;
  enqueueSnackbar: (
    message: React.ReactNode | string,
    options?: any
  ) => string | number | null | undefined;
  closeSnackbar: () => void;
}

interface ILicenceState {
  license: any;
  loading: boolean;
  hash: string;
  licenseModal: boolean;
}

class Licence extends React.Component<ILicenceProps, ILicenceState> {
  private SystemApi: SystemApi = new SystemApi();
  constructor(props: ILicenceProps) {
    super(props);

    this.state = {
      loading: true,
      hash: '',
      licenseModal: false,
      license: {},
    };
  }

  componentDidMount() {
    this.GetLicense();
  }

  GetLicense() {
    this.SystemApi.getLicense()
      .then((result: any) => {
        this.setState({
          license: result.license,
          loading: false,
        });
      })
      .catch((error: any) => {
        console.log('error', error);
      });
  }

  setLicense = () => {
    if (!this.state.hash) {
      return;
    }
    this.SystemApi.setLicense(this.state.hash)
      .then((result: any) => {
        this.props.enqueueSnackbar(`Congratulations, your license is updated.`, {
          variant: 'success',
        });
        this.GetLicense();
        this.toggleSetLicenseModal();
      })
      .catch((error: any) => {
        if (error.err_code === 4 || error.err_code === 3) {
          this.props.enqueueSnackbar(`You hash code is wrong!`, {
            variant: 'error',
          });
        } else {
          console.log('error', error);
        }
      });
  };

  toggleSetLicenseModal = () => {
    this.setState({
      licenseModal: !this.state.licenseModal,
    });
  };

  updateHash = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      hash: e.currentTarget.value,
    });
  };

  render() {
    const { classes } = this.props;
    const { license } = this.state;
    const remainLicense = license.expire_date
      ? moment
          .duration(moment(license.expire_date).diff(moment(new Date())))
          .asDays()
          .toFixed()
      : 0;
    return (
      <Paper className={classes.licenseCard}>
        <Loading active={this.state.loading} position="absolute" />
        <div className="card-head">
          <h2>Nested Service License</h2>
          <Tooltip placement="top" title="Set License">
            <div className="_cp" onClick={this.toggleSetLicenseModal}>
              <IcoN size={16} name="cross16" />
            </div>
          </Tooltip>
        </div>
        <div className="card-body">
          <span className={remainLicense < 30 ? classes.warn : classes.good}>
            <b>Remaining License Time: </b>
            {remainLicense} days
          </span>
          <span>
            <b>License organization: </b>
            {license.owner_organization}
          </span>
          <span>
            <b>License Owner: </b>
            {license.owner_name} {'<' + license.owner_email + '>'}
          </span>
          <span>
            <b>License id: </b>
            {license.license_id}
          </span>
          <span>
            <b>License signature: </b>
            {license.signature}
          </span>
          <span>
            <b>Max active users: </b>
            {license.max_active_users ? license.max_active_users : 'unlimited'}
          </span>
        </div>
        <Dialog
          open={this.state.licenseModal}
          onClose={() => this.setState({ licenseModal: false })}
          fullWidth={true}
          maxWidth="xs"
        >
          <DialogTitle>Set License</DialogTitle>
          <DialogContent>
            <label>Put your license hash string here and press save buton</label>
            <br />
            <TextField
              value={this.state.hash}
              className={classes.hashInsert}
              onChange={this.updateHash}
              fullWidth={true}
              label="License hash code."
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => this.setState({ licenseModal: false })}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={this.setLicense}
              disabled={this.state.hash.length === 0}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }
}

export default withStyles((theme: Theme) =>
  createStyles({
    licenseCard: {
      '& span': {
        margin: '4px 0',
        wordWrap: 'break-word',
        wordBreak: 'break-word',
      },
    },
    good: {
      color: theme.palette.secondary.main,
    },
    warn: {
      color: theme.palette.error.dark,
    },
    hashInsert: {
      margin: theme.spacing(2, 0, 1),
    },
  })
)(withSnackbar(Licence));
