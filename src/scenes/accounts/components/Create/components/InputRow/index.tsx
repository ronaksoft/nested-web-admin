import * as React from 'react';
import IAccount from '../../../../../../interfaces/IUser';
import PacketState from '../../../../PacketState';
import AccountApi from '../../../../../../api/account';
import Packet from '../../../../Packet';
import CONFIG from '../../../../../../config';
import { IcoN } from '../../../../../../components/icon/index';
import HourGlass from '@material-ui/icons/HourglassFull';
import Done from '@material-ui/icons/Done';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { FormControl, InputAdornment, Button } from '@material-ui/core';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';

interface IInputRowProps {
  account: IAccount;
  onRemove: (k: string) => void;
  onChange: (p: Packet) => void;
  refKey: any;
  classes: any;
  status: PacketState;
  ref: any;
}

interface IInputRowState {
  status: PacketState;
  manualPassword: boolean;
  formData: any;
}

class InputRow extends React.Component<IInputRowProps, IInputRowState> {
  // private checkPhoneAvailableDebounce: (
  //   rule: any,
  //   value: string,
  //   callback: any
  // ) => void = _.debounce(this.checkPhoneAvailable, 512);
  // private checkUsernameAvailableDebounce: (
  //   rule: any,
  //   value: string,
  //   callback: any
  // ) => void = _.debounce(this.checkUsernameAvailable, 512);
  private form: React.RefObject<ValidatorForm> = React.createRef();
  private isValid: boolean = false;

  constructor(props: IInputRowProps) {
    super(props);
    this.state = {
      status: props.status,
      manualPassword: false,
      formData: this.props.account,
    };
  }
  checkValidation() {
    this.form.current
      .isFormValid()
      .then(v => (this.isValid = v))
      .catch(console.log);

    this.submit();
  }
  componentWillMount() {
    ValidatorForm.addValidationRule('checkPhoneAvailable', this.checkPhoneAvailable);
    ValidatorForm.addValidationRule('checkIdAvailable', this.checkUsernameAvailable);
  }

  componentDidMount() {
    this.checkValidation();
    if (this.state.status !== PacketState.New) {
      // this.state.packet.status = PacketState.Invalid;
    }
  }

  componentWillUnmount() {
    ValidatorForm.removeValidationRule('checkPhoneAvailable');
    ValidatorForm.removeValidationRule('checkIdAvailable');
  }
  componentWillReceiveProps(newProps: IInputRowProps) {
    this.setState({
      status: newProps.status,
      manualPassword:
        this.state.manualPassword ||
        (newProps.account.pass !== newProps.account._id && newProps.account.pass !== ''),
    });
  }

  handleFormChange = (prop: string) => (event: any) => {
    const { formData } = this.state;
    const { value } = event.target;
    formData[prop] = value;
    this.setState({ formData }, () => this.checkValidation());
  };

  extractNumber(text: any) {
    return parseInt(text.replace(/[^0-9]/g, ''), 0);
  }

  checkPhoneAvailable = (value: string) => {
    const accountApi = new AccountApi();
    return accountApi
      .phoneAvailable({ phone: value })
      .then(() => true)
      .catch(() => false);
  };

  checkUsernameAvailable = (value: string) => {
    if (!CONFIG().GRAND_PLACE_REGEX.test(value)) {
      return false;
    } else {
      const accountApi = new AccountApi();
      return accountApi
        .usernameAvailable({ account_id: value })
        .then(isAvailable => {
          return isAvailable;
        })
        .catch(() => {
          return false;
        });
    }
  };

  insertManualPassword = () => {
    this.setState(
      {
        manualPassword: true,
      },
      () => {
        const model: any = this.state.formData;
        model.pass = '';
        this.props.onChange({
          key: this.props.refKey,
          model,
          password: true,
          status: 0,
        });
      }
    );
  };

  submit = () => {
    this.props.onChange({
      key: this.props.refKey,
      model: this.state.formData,
      password: this.state.manualPassword,
      status: this.props.status,
    });
  };

  getStatus = () => this.form.current.isFormValid();

  render() {
    const disabled =
      this.state.status === PacketState.Success || this.state.status === PacketState.Pending;
    const pending = this.state.status === PacketState.Pending;
    const success = this.state.status === PacketState.Success;
    const { manualPassword } = this.state;
    const { classes } = this.props;
    return (
      <ValidatorForm className={classes.accountRow} onSubmit={this.submit} ref={this.form}>
        {!(pending || success) && (
          <div
            className={classes.removeBtn + ' red-svg'}
            onClick={() => this.props.onRemove(this.props.refKey)}
          >
            <IcoN size={16} name={'bin16'} />
          </div>
        )}
        {pending && (
          <div className={classes.removeBtn + ' red-svg'}>
            <HourGlass />
          </div>
        )}
        {success && (
          <div className={classes.removeBtn + ' red-svg'}>
            <Done color="primary" />
          </div>
        )}
        <FormControl className={classes.formItem} required={true}>
          <TextValidator
            disabled={disabled}
            type="number"
            placeholder="989876543210"
            value={this.state.formData.phone}
            validators={[
              'required',
              'minStringLength:6',
              'matchRegexp:^[0-9]*$',
              'checkPhoneAvailable',
            ]}
            errorMessages={[
              'Phone number is required!',
              'Phone number is too short!',
              'It is not a number',
              'Not available!',
            ]}
            onChange={this.handleFormChange('phone')}
            InputProps={{
              startAdornment: <InputAdornment position="start">+</InputAdornment>,
            }}
          />
        </FormControl>
        <FormControl className={classes.formItem} required={true}>
          <TextValidator
            disabled={disabled}
            placeholder="John"
            validators={['required']}
            errorMessages={['First name is required!']}
            value={this.state.formData.fname}
            onChange={this.handleFormChange('fname')}
          />
        </FormControl>
        <FormControl className={classes.formItem} required={true}>
          <TextValidator
            disabled={disabled}
            placeholder="Doe"
            validators={['required']}
            errorMessages={['Last name is required!']}
            value={this.state.formData.lname}
            onChange={this.handleFormChange('lname')}
          />
        </FormControl>
        <FormControl className={classes.formItem} required={true}>
          <TextValidator
            disabled={disabled}
            placeholder="john-doe"
            validators={['required', 'minStringLength:3', 'checkIdAvailable']}
            errorMessages={['User ID is required!', 'The user ID is too short!', 'Is Not Valid!']}
            value={this.state.formData._id}
            onChange={this.handleFormChange('_id')}
          />
        </FormControl>
        {!manualPassword && (
          <FormControl className={classes.formItem}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={this.insertManualPassword}
              disabled={disabled}
            >
              - same as username -
            </Button>
          </FormControl>
        )}
        {manualPassword && (
          <FormControl className={classes.formItem} required={true}>
            <TextValidator
              disabled={disabled}
              placeholder="Password"
              validators={['required', 'minStringLength:6']}
              errorMessages={['Password is required!', 'Password must be at least 6 characters.']}
              value={this.state.formData.pass}
              onChange={this.handleFormChange('pass')}
            />
          </FormControl>
        )}
      </ValidatorForm>
    );
  }
}

export default withStyles((theme: Theme) =>
  createStyles({
    accountRow: {
      marginBottom: '16px',
      position: 'relative',
      display: 'flex',
    },
    removeBtn: {
      left: '-18px',
      top: '5px',
      position: 'absolute',
    },
    formItem: {
      display: 'inline-flex',
      fontSize: '14px',
      flex: 1,
      margin: theme.spacing(0, 1),
    },
  })
)(InputRow);
