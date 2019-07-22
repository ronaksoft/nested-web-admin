import _ from 'lodash';
import * as React from 'react';
import md5 from 'md5';
import InputRow from './components/InputRow/index';
import CSV from '../../CSV';
import AccountApi from '../../../../api/account';
import IPacket from '../../Packet';
import PacketState from '../../PacketState';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { IcoN } from '../../../../components/icon/index';
import PlusIcon from '@material-ui/icons/Add';
import { withSnackbar } from 'notistack';

import {
  Switch,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
} from '@material-ui/core';

interface ICreateProps {
  visible: boolean;
  handleClose: any;
  classes: any;
  enqueueSnackbar: (
    message: React.ReactNode | string,
    options?: any
  ) => string | number | null | undefined;
  closeSnackbar: () => void;
}

interface ICreateState {
  accounts: IPacket[];
  sendSms: boolean;
}

class Create extends React.Component<ICreateProps, ICreateState> {
  private accountApi: AccountApi = new AccountApi();
  private rowsRefs = {};

  constructor(props: ICreateProps) {
    super(props);
    this.state = {
      accounts: [],
      sendSms: true,
    };
  }

  componentDidMount() {
    this.initModal();
  }

  initModal() {
    this.rowsRefs = {};
    this.setState({
      accounts: [],
    });
  }

  validatePockets() {
    this.state.accounts.forEach(row => {
      if (row.status === PacketState.Success || row.status === PacketState.Pending) {
        return;
      }

      let inputRowForm = this.rowsRefs[row.key];
      if (!inputRowForm.isValid) {
        row.status = PacketState.Failure;
      } else {
        row.status = PacketState.Valid;
      }

      this.handleChange({
        key: row.key,
        model: row.model,
        status: row.status,
      });
    });
  }

  handleChange = (params: any) => {
    const packetIndex = _.findIndex(this.state.accounts, pocket => {
      return pocket.key === params.key + '';
    });
    const { model, password, status } = _.clone(params);
    if (!model) {
      return;
    }
    let { accounts } = this.state;
    model.pass = password === false ? model._id : model.pass;
    accounts[packetIndex].status = status;
    accounts[packetIndex].model = model;
    accounts[packetIndex].password = password;
    this.setState({
      accounts,
    });
  };

  handleRemove = (key: string) => {
    let accounts = this.state.accounts;

    _.remove(accounts, (pocket: IPacket) => {
      return pocket.key === key + '';
    });

    this.setState({
      accounts,
    });
  };

  handleUpload(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();
    const uploader: HTMLInputElement | null = document.querySelector('#upload');
    if (uploader) {
      uploader.click();
    }
  }

  readFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.onload = (_: any) => this.import(reader.result ? reader.result.toString() : '');
    if (e.target && e.target.files && e.target.files[0]) {
      reader.readAsText(e.target.files[0]);
    }
  };

  saveRowsReference = (row: any) => {
    if (row) {
      this.rowsRefs[row.props.refKey] = row;
    }
  };

  validRowsCount() {
    let validRows: number = 0;
    this.state.accounts.forEach(row => {
      if (row.status === PacketState.Valid) {
        validRows++;
      }
    });
    return validRows;
  }

  addNewRow = () => {
    const newRow = {
      key: _.uniqueId(),
      status: PacketState.New,
      model: {
        pass: '',
        _id: '',
        lname: '',
        fname: '',
        phone: '',
      },
      password: false,
      messages: [],
    };
    const { accounts } = this.state;
    accounts.push(newRow);
    this.setState({ accounts });
  };

  switchSms = (event: React.ChangeEvent<HTMLInputElement>): void =>
    this.setState({
      sendSms: (event.currentTarget as HTMLInputElement).checked,
    });

  public render() {
    const { classes } = this.props;
    return (
      <Dialog
        open={this.props.visible}
        className="create-accounts"
        onClose={this.handleClose}
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle>Create Accounts</DialogTitle>
        <DialogContent>
          <div className={classes.createAccountHead}>
            <div className={classes.formItem}>
              <b>Phone Number</b>
            </div>
            <div className={classes.formItem}>
              <b>First Name</b>
            </div>
            <div className={classes.formItem}>
              <b>Last Name</b>
            </div>
            <div className={classes.formItem}>
              <b>Username</b>
            </div>
            <div className={classes.formItem}>
              <b>First Login Password</b>
            </div>
          </div>
          {this.state.accounts.map(pocket => (
            <InputRow
              key={pocket.key}
              onChange={this.handleChange}
              onRemove={this.handleRemove}
              ref={this.saveRowsReference}
              account={pocket.model}
              status={pocket.status}
              refKey={pocket.key}
            />
          ))}
          <Paper className={classes.addCard}>
            <a onClick={this.addNewRow} className={classes.addRow}>
              <PlusIcon />
              <b>Add more fields...</b>
            </a>
            <div className="filler" />
            <input
              id="upload"
              type="file"
              hidden={true}
              accept="*.csv"
              onChange={this.readFile}
              onClick={(event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
                if (event.target) {
                  (event.target as HTMLInputElement).value = '';
                }
              }}
              className="hidden"
            />
            <a type="primary" onClick={this.handleUpload}>
              <b>Import from a file</b>
            </a>
            <span className={classes.example}>
              for download template &nbsp;
              <a onClick={this.downloadListCSV.bind(this)} type="warning">
                click here.
              </a>
            </span>
          </Paper>
        </DialogContent>
        <DialogActions>
          <div className={classes.footer}>
            <IcoN size={16} name={'gear16'} />
            <label>Send a login link to Phone Numbers via SMS?</label>
            <Switch checked={this.state.sendSms} onChange={this.switchSms} />
            <div className="filler" />
            <Button
              className="button-margin"
              onClick={this.handleClose}
              variant="outlined"
              color="secondary"
            >
              Discard
            </Button>
            <Button
              disabled={this.state.accounts.length === 0}
              onClick={this.create}
              variant="contained"
              color="primary"
            >
              Create {this.state.accounts.length} Accounts
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    );
  }

  private create = () => {
    this.validatePockets();
    if (this.validRowsCount() > this.state.accounts.length) {
      this.props.enqueueSnackbar('Please verify all accounts data is valid.', {
        variant: 'error',
      });
      return;
    }

    const accounts = this.state.accounts;
    let registerUser = (index: any) => {
      if (this.state.accounts[index].status !== PacketState.Pending) {
        if (index < this.state.accounts.length - 1) {
          registerUser(index + 1);
        }
        return;
      }
      this.accountApi
        .register({
          uid: this.state.accounts[index].model._id,
          fname: this.state.accounts[index].model.fname,
          lname: this.state.accounts[index].model.lname,
          phone: this.state.accounts[index].model.phone,
          pass:
            this.state.accounts[index].model.pass !== ''
              ? md5(this.state.accounts[index].model.pass || '')
              : '',
          send_sms: this.state.sendSms,
        })
        .then((data: any) => {
          const account = this.state.accounts[index];
          if (this.state.accounts[index].model.pass !== this.state.accounts[index].model._id) {
            this.accountApi.edit({
              account_id: this.state.accounts[index].model._id,
              force_password: false,
            });
          }
          this.handleChange({
            key: account.key,
            model: account.model,
            status: PacketState.Success,
          });
        })
        .then(() => {
          if (this.state.accounts.length === index + 1) {
            this.props.enqueueSnackbar('User creation process finished successfully.', {
              variant: 'success',
            });
          }
        })
        .catch((err: any) => {
          console.log(err);
          const account = this.state.accounts[index];
          this.handleChange({
            key: account.key,
            model: account.model,
            status: PacketState.Failure,
          });
        });
    };

    setTimeout(() => {
      accounts.forEach((account, index) => {
        if (account.status === PacketState.Valid) {
          this.handleChange({
            key: account.key,
            model: account.model,
            status: PacketState.Pending,
          });
          registerUser(index);
        }
      });
    }, 200);

    // setTimeout(() => {
    //     registerUser(0);
    // }, 1000);
  };

  private downloadExample() {
    let data = [
      ['+989123456789', 'username1', 'First Name 1', 'Last Name 1', 'password1'],
      ['+989123456788', 'username2', 'First Name 2', 'Last Name 2', 'password2`'],
    ];
    let csvContent = 'data:text/csv;charset=utf-8,';
    data.forEach(function(infoArray: string[], index: any) {
      let dataString = infoArray.join(',');
      csvContent += index < data.length ? dataString + '\n' : dataString;
    });
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'create-account-example.csv');
    document.body.appendChild(link);
    link.click();
  }

  private downloadListCSV() {
    const data: any[] = [
      {
        model: {
          phone: '989123456789',
          _id: 'username1',
          fname: 'First Name 1',
          lname: 'Last Name 1',
          pass: 'password1',
        },
      },
      {
        model: {
          phone: '989123456788',
          _id: 'username2',
          fname: 'First Name 2',
          lname: 'Last Name 2',
          pass: 'password2',
        },
      },
    ].map(row => [
      row.model.phone,
      row.model._id,
      row.model.fname,
      row.model.lname,
      row.model.pass,
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,';
    data.forEach((infoArray: string[], index: number) => {
      const dataString = infoArray.join(',');
      csvContent += index < data.length ? dataString + '\n' : dataString;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'create-account-example.csv');
    document.body.appendChild(link);
    link.click();
  }

  private handleClose = () => {
    this.props.handleClose();
    this.initModal();
  };

  private import = (text: string) => {
    const CSV_ROW_ITEMS_COUNT = 5;
    const MAX_ITEMS_IN_FILE = 100;
    const SKIP_LINE_START = '#';
    const NEW_LINE = '\n';

    if (!(_.isString(text) && text.length > 0)) {
      this.props.enqueueSnackbar('The file is empty!', {
        variant: 'warning',
      });
      return;
    }

    const lines = _.split(text, NEW_LINE);
    const clearedText = _(lines)
      .reject(line => _.startsWith(line, SKIP_LINE_START))
      .value()
      .join(NEW_LINE);
    const data = CSV.parse(clearedText, ',');

    if (_.size(data) > MAX_ITEMS_IN_FILE) {
      this.props.enqueueSnackbar(
        'There are more than 100 items in the file. Please sparate the items into smaller files.',
        {
          variant: 'warning',
        }
      );
      return;
    }

    this.setState({ accounts: [] });
    this.rowsRefs = {};
    const packets = _(data)
      .filter(row => row.length === CSV_ROW_ITEMS_COUNT || row.length === CSV_ROW_ITEMS_COUNT - 1)
      .map(row => {
        const packet: IPacket = {
          key: _.uniqueId(),
          status: PacketState.Filled,
          model: {
            phone: row[0],
            _id: row[1],
            fname: row[2],
            lname: row[3],
            pass: row[4] ? row[4] : row[1],
          },
          password: !!row[4],
          messages: [],
        };
        return packet;
      })
      .value();

    this.setState({
      accounts: packets,
    });

    this.props.enqueueSnackbar(
      `All ${packets.length} account(s) have been imported successfully.`,
      {
        variant: 'success',
      }
    );
  };
}
export default withStyles((theme: Theme) =>
  createStyles({
    createAccountHead: {
      margin: '16px 0 6px',
      fontSize: '13px',
      display: 'flex',
      color: fade(theme.palette.text.primary, 0.8),
    },
    addCard: {
      height: '48px',
      marginTop: '20px',
      padding: '0 16px',
      marginBottom: '24px',
      backgroundColor: 'rgba(0,180,90,.08)',
      border: '1px solid rgba(0,180,90,.16)',
      fontSize: '13px',
      borderRadius: '4px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all .3s',
      display: 'flex',
      alignItems: 'center',
    },
    addRow: {
      display: 'flex',
      alignItems: 'center',
    },
    example: {
      fontSize: '12px',
      marginLeft: '24px',
    },
    footer: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      padding: '10px 16px 10px 10px',
      textAlign: 'right',
      '& label': {
        lineHeight: '40px',
        marginLeft: '14px',
        fontSize: '14px',
        marginright: '8px',
      },
    },
    formItem: {
      display: 'inline-flex',
      fontSize: '14px',
      flex: 1,
      margin: theme.spacing(0, 1),
    },
  })
)(withSnackbar(Create));
