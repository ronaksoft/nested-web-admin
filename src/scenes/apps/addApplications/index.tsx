import * as React from 'react';
import AppApi from '../../../api/app/index';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { FormControl } from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';

interface ICreateProps {
  visible: boolean;
  classes: any;
  handleClose: () => void;
  handleCreate: (data: any) => void;
}

interface IAppFormData {
  id: string;
  name: string;
  developer: string;
  homepage: string;
  logoUrl: string;
  thumbnailUrl: string;
  FormData(): void;
}

interface ICreateState {
  formData: IAppFormData;
  sendSms: boolean;
}

class Create extends React.Component<ICreateProps, ICreateState> {
  private AppApi: AppApi = new AppApi();
  private form: React.RefObject<ValidatorForm> = React.createRef();

  constructor(props: ICreateProps) {
    super(props);
    this.state = {
      formData: {} as IAppFormData,
      sendSms: true,
    };
    ValidatorForm.addValidationRule('isUrlValid', this.isUrlValid);
    ValidatorForm.addValidationRule('isIdAvailable', this.checkIdAvailable);
  }

  componentWillUnmount() {
    ValidatorForm.removeValidationRule('isUrlValid');
    ValidatorForm.removeValidationRule('isIdAvailable');
  }
  checkIdAvailable = (value: string) => {
    return this.AppApi.exists(value)
      .then((res: any) => {
        return !!res.exists;
      })
      .catch(e => {
        if (e.err_code === 2) {
          return true;
        }
        return false;
      });
  };

  isUrlValid = (value: string): boolean => !!value && value.indexOf('http') === 0;

  handlechange = (field: string) => (e: React.ChangeEvent<{ value: any }>) => {
    const state = {};
    state[field] = e.target.value;
    this.setState(state);
    this.form.current.isFormValid().then(console.log).catch(console.log);
  };

  onSubmit = (e: React.ChangeEvent<{ value: any }>) => {};

  render() {
    const { classes } = this.props;
    return (
      <Dialog open={this.props.visible} onClose={this.handleClose} fullWidth={true} maxWidth="md">
        <DialogTitle>Create Applications</DialogTitle>
        <DialogContent>
          <ValidatorForm className={classes.form} onSubmit={this.onSubmit} ref={this.form}>
            <FormControl>
              <TextValidator
                label="ID:"
                fullWidth={true}
                value={this.state.formData.id}
                onChange={this.handlechange('id')}
                required={true}
                validators={['required', 'isIdAvailable']}
                errorMessages={['Required!', 'Not available!']}
              />
            </FormControl>
            <FormControl>
              <TextValidator
                label="Name:"
                fullWidth={true}
                value={this.state.formData.name}
                onChange={this.handlechange('name')}
                required={true}
                validators={['required']}
                errorMessages={['Required!']}
              />
            </FormControl>
            <FormControl>
              <TextValidator
                label="Homepage:"
                fullWidth={true}
                value={this.state.formData.homepage}
                onChange={this.handlechange('homepage')}
                required={true}
                validators={['required', 'isUrlValid']}
                errorMessages={['Required!', 'Invalid!']}
              />
            </FormControl>
            <FormControl>
              <TextValidator
                label="Developer:"
                fullWidth={true}
                value={this.state.formData.developer}
                onChange={this.handlechange('developer')}
                required={true}
                validators={['required']}
                errorMessages={['Required!']}
              />
            </FormControl>
            <FormControl>
              <TextValidator
                label="Logo url:"
                fullWidth={true}
                value={this.state.formData.logoUrl}
                onChange={this.handlechange('logoUrl')}
                required={true}
                validators={['required', 'isUrlValid']}
                errorMessages={['Required!', 'Invalid!']}
              />
            </FormControl>
            <FormControl>
              <TextValidator
                label="Thumbnail url:"
                fullWidth={true}
                value={this.state.formData.thumbnailUrl}
                onChange={this.handlechange('thumbnailUrl')}
                required={true}
                validators={['required', 'isUrlValid']}
                errorMessages={['Required!', 'Invalid!']}
              />
            </FormControl>
          </ValidatorForm>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="secondary" onClick={this.handleClose}>Discard</Button>
          <Button variant="contained" color="primary" onClick={this.create}>Create</Button>
        </DialogActions>
      </Dialog>
    );
  }

  private handleClose = () => {
    this.props.handleClose();
  };

  private create = () => this.props.handleCreate(this.state.formData);
}

export default withStyles((theme: Theme) =>
  createStyles({
    form: {
      display: 'flex',
      flexDirection: 'column',
      '& > *': {
        marginBottom: theme.spacing(2),
      },
    },
  })
)(Create);
