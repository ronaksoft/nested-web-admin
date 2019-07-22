import _ from 'lodash';
import * as React from 'react';
import moment from 'moment';
import md5 from 'md5';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withSnackbar } from 'notistack';

import PlaceItem from '../../../../components/PlaceItem/index';
import IPerson from '../../../../interfaces/IPerson';
import PlaceApi from '../../../../api/place/index';
import AccountApi from '../../../../api/account';
import UserAvatar from '../../../../components/avatar/index';
import { IcoN } from '../../../../components/icon/index';
import MoreOption from '../../../../components/Filter/MoreOption';
import CONFIG from '../../../../config';
import AAA from './../../../../services/classes/aaa/index';
import PlaceModal from '../../../../components/PlaceModal/index';
import IPlace from '../../../../interfaces/IPlace';
import SendMessageModal from '../../../../components/SendMessageModal/index';
import NstCrop from '../../../../components/Crop/index';

import RelatedChartCards from '../../../../components/ChartCard/RelatedChartCards';
import ReportType from '../../../../consts/ReportType';
import MeasureType from '../../../../components/ChartCard/MeasureType';
import Button from '@material-ui/core/Button';
import { Grid, Typography, Tooltip } from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

interface IViewProps {
  visible: boolean;
  account: IPerson;
  onChange: (user: IPerson) => void;
  onClose: () => void;
  classes: any;
  enqueueSnackbar: (
    message: React.ReactNode | string,
    options?: any
  ) => string | number | null | undefined;
  closeSnackbar: () => void;
}

interface IViewState {
  loading: boolean;
  showEdit: boolean;
  updateProgress: boolean;
  setEmail: boolean;
  setDateOfBirth: boolean;
  account: IPerson;
  visiblePlaceModal: boolean;
  maskClosable: boolean;
  visible: boolean;
  reportTab: boolean;
  editMode: boolean;
  model: IPerson;
  imageIsUploading: boolean;
  sendMessageVisible: boolean;
  visibleChangePassword: boolean;
  newPassword: string;
  uploadPercent: number;
  visibleRemoveMember: boolean;
  places: IPlace[];
  pickedImage?: any;
  token?: string;
  removeMemberPlaceRef?: any;
}

class View extends React.Component<IViewProps, IViewState> {
  private DATE_FORMAT: string = 'YYYY-MM-DD';
  private updated: boolean = false;
  private selectedPlace: IPlace | undefined;
  private placeApi = new PlaceApi();
  private accountApi = new AccountApi();
  constructor(props: IViewProps) {
    super(props);
    this.state = {
      loading: false,
      showEdit: false,
      updateProgress: false,
      setEmail: false,
      editMode: false,
      reportTab: false,
      setDateOfBirth: false,
      account: props.account,
      sendMessageVisible: false,
      visiblePlaceModal: false,
      imageIsUploading: false,
      maskClosable: true,
      visible: true,
      uploadPercent: 0,
      visibleChangePassword: false,
      newPassword: '',
      model: this.props.account,
      places: [],
      visibleRemoveMember: false,
    };
    this.updated = false;
  }

  componentDidMount() {
    if (this.state.account && this.state.account._id) {
      this.loadPlaces(this.state.account._id);
    }

    this.loadUploadToken();
  }

  componentWillReceiveProps(nextProps: IViewProps) {
    if (
      nextProps.account &&
      nextProps.account._id &&
      nextProps.account._id !== this.state.account._id
    ) {
      this.setState({
        visible: nextProps.visible,
        account: nextProps.account,
        places: [],
      });
      this.loadPlaces(nextProps.account._id);
    }
  }

  showPlaceModal = (record: IPlace, index: number) => {
    this.selectedPlace = record;
    this.setState({
      visiblePlaceModal: true,
      visible: false,
    });
  };

  sendMessageToggle = () => {
    this.setState({
      sendMessageVisible: !this.state.sendMessageVisible,
    });
  };

  closePlaceModal = () => {
    this.setState({
      visiblePlaceModal: false,
      visible: true,
    });
  };

  loadPlaces = (accountId: string) => {
    this.setState({
      loading: true,
    });

    this.placeApi
      .getAccountPlaces({
        account_id: accountId,
      })
      .then((result: any) => {
        this.setState({
          places: result.places,
          loading: false,
        });
      })
      .catch((error: any) => {
        this.setState({
          places: [],
          loading: false,
        });
      });
  };

  loadUploadToken = () => {
    this.accountApi.getUploadToken().then(
      (result: any) => {
        this.setState({
          token: result.token,
        });
      },
      (error: any) => {
        this.setState({
          token: '',
        });
      }
    );
  };

  getGenderStr(gender: string) {
    switch (gender) {
      case 'm':
        return 'Male';
      case 'f':
        return 'Female';
      case 'o':
      default:
        return 'Other';
    }
  }
  toggleChangePasswordModal = () => {
    this.setState({
      newPassword: '',
      visibleChangePassword: !this.state.visibleChangePassword,
    });
  };

  changePassword = () => {
    if (this.state.newPassword.length < 6) {
      this.props.enqueueSnackbar('User password must be at least 6 characters!', {
        variant: 'warning',
      });
      return;
    }
    this.accountApi
      .setPassword({
        account_id: this.state.model._id,
        new_pass: md5(this.state.newPassword),
      })
      .then(() => {
        this.props.enqueueSnackbar('User password has been changed!', {
          variant: 'success',
        });
        this.toggleChangePasswordModal();
      })
      .catch(() => {
        this.props.enqueueSnackbar('User password has not been changed!', {
          variant: 'error',
        });
        this.toggleChangePasswordModal();
      });
  };

  changePasswordHandler = (event: any) => {
    this.setState({
      newPassword: event.target.value,
    });
  };

  extractNumber(text: any) {
    return parseInt(text.replace(/[^0-9]/g, ''), 0);
  }
  toggleReportTab = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.setState({
      reportTab: !this.state.reportTab,
    });
  };

  applyChanges = (values: any) => {
    let changedProps: any = _.mapValues(values, (value, key) => {
      if (key === 'dob') {
        return value.format(this.DATE_FORMAT);
      }

      return value;
    });

    if (_.has(changedProps, 'grand_places')) {
      changedProps = {
        'limits.grand_places': parseInt(values.grand_places, 0),
      };
    }

    if (_.has(changedProps, 'pass')) {
      this.accountApi
        .setPassword({
          account_id: this.state.account._id,
          new_pass: md5(changedProps.pass),
        })
        .then(
          (result: any) => {
            this.setState({
              updateProgress: false,
              showEdit: false,
            });

            this.props.enqueueSnackbar('The account password has been changed successfully.', {
              variant: 'success',
            });
          },
          (error: any) => {
            this.setState({
              updateProgress: false,
            });

            this.props.enqueueSnackbar('An error happened while trying to set a new password.', {
              variant: 'error',
            });
          }
        );
    } else {
      const editedAccount = _.clone(this.state.account);

      let changedLimitProps: any = null;
      if (_.has(changedProps, 'limits.grand_places')) {
        changedLimitProps = {
          limits: { grand_places: parseInt(values.grand_places, 0) },
        };
      }

      this.setState({
        updateProgress: true,
        account: _.merge(editedAccount, changedLimitProps ? changedLimitProps : changedProps),
      });

      this.accountApi.edit(_.merge(changedProps, { account_id: this.state.account._id })).then(
        (result: any) => {
          this.setState({
            updateProgress: false,
            showEdit: false,
          });
          if (this.props.onChange) {
            this.props.onChange(editedAccount);
          }
        },
        (error: any) => {
          this.setState({
            updateProgress: false,
          });
          this.props.enqueueSnackbar('We were not able to update the field!', {
            variant: 'error',
          });
        }
      );
    }
  };

  removePicture = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.accountApi
      .removePicture({
        account_id: this.state.account._id,
      })
      .then((result: any) => {
        let editedAccount = _.clone(this.state.account);
        editedAccount.picture = {
          orginal: '',
          x128: '',
          x32: '',
          x64: '',
          x256: '',
        };
        this.setState({
          account: editedAccount,
        });
        if (this.props.onChange) {
          this.props.onChange(editedAccount);
        }
      })
      .catch((error: any) => {
        this.props.enqueueSnackbar('An error has occured while removing the account picture.', {
          variant: 'error',
        });
      });
  };

  pictureChange = (info: any) => {
    if (info.file.status === 'error') {
      this.props.enqueueSnackbar(`${info.file.name} file upload failed.`, {
        variant: 'error',
      });
      return;
    }

    if (info.file.status === 'done') {
      this.props.enqueueSnackbar(`${info.file.name} file uploaded successfully`, {
        variant: 'success',
      });

      this.accountApi
        .setPicture({
          account_id: this.state.account._id,
          universal_id: info.file.response.data.files[0].universal_id,
        })
        .then(
          (result: any) => {
            let editedAccount = _.clone(this.state.account);
            editedAccount.picture = info.file.response.data.files[0].thumbs;
            this.setState({
              account: editedAccount,
            });
            if (this.props.onChange) {
              this.props.onChange(editedAccount);
            }
          },
          (error: any) => {
            this.props.enqueueSnackbar('We were not able to set the picture!', {
              variant: 'error',
            });
          }
        );
    }
  };

  beforeUpload = (file: any) => {
    if (!this.state.token) {
      this.props.enqueueSnackbar('We are not able to upload the picture.', {
        variant: 'error',
      });
      return false;
    }
  };

  onClose = () => {
    if (this.updated) {
      this.broadcastUpdate();
    }
    this.props.onClose();
    this.setState({
      visible: false,
    });
  };

  updateAdmin(checked: boolean) {
    let editedAccount = _.clone(this.state.account);
    _.merge(editedAccount.authority, { admin: checked });

    const action = checked
      ? this.accountApi.promote({ account_id: editedAccount._id })
      : this.accountApi.demote({ account_id: editedAccount._id });

    action.then(
      (result: any) => {
        if (this.props.onChange) {
          this.props.onChange(editedAccount);
        }
        if (checked) {
          this.props.enqueueSnackbar(`"${editedAccount._id}" can access Nested Administrator.`, {
            variant: 'success',
          });
        } else {
          this.props.enqueueSnackbar(
            `"${editedAccount._id}" would not be longer able to access Nested Administrator.`,
            {
              variant: 'success',
            }
          );
        }
        this.setState({
          account: editedAccount,
        });
        this.updated = true;
      },
      (error: any) => {
        this.props.enqueueSnackbar('We were not able to update the field!', {
          variant: 'error',
        });
      }
    );
  }

  updateLabelManager(value: boolean) {
    let editedAccount = _.clone(this.state.account);
    _.merge(editedAccount.authority, { label_editor: value });

    this.accountApi.edit({ account_id: editedAccount._id, 'authority.label_editor': value }).then(
      (result: any) => {
        if (this.props.onChange) {
          this.props.onChange(editedAccount);
        }
        this.updated = true;
        this.setState({
          account: editedAccount,
        });
        this.props.enqueueSnackbar('The field has been updated.', {
          variant: 'success',
        });
      },
      (error: any) => {
        this.props.enqueueSnackbar('We were not able to update the field!', {
          variant: 'error',
        });
      }
    );
  }

  onPrivacyChange = (props: any) => {
    let editedAccount = _.clone(this.state.account);
    _.merge(editedAccount.privacy, props);

    this.accountApi.edit(_.merge(props, { account_id: editedAccount._id })).then(
      (result: any) => {
        if (this.props.onChange) {
          this.props.onChange(editedAccount);
        }
        this.props.enqueueSnackbar('The field has been updated.', {
          variant: 'success',
        });
      },
      (error: any) => {
        this.props.enqueueSnackbar('We were not able to update the field!', {
          variant: 'error',
        });
      }
    );
  };

  onActiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const editedAccount = _.clone(this.state.account);
    const { checked } = event.target;
    _.merge(editedAccount, { disabled: !checked });
    const action = event.target.value
      ? this.accountApi.enable({ account_id: editedAccount._id })
      : this.accountApi.disable({ account_id: editedAccount._id });

    action.then(
      (result: any) => {
        this.setState({
          account: editedAccount,
        });
        if (this.props.onChange) {
          this.props.onChange(editedAccount);
        }

        if (checked) {
          this.props.enqueueSnackbar(`"${editedAccount._id}" is active now.`, {
            variant: 'success',
          });
        } else {
          this.props.enqueueSnackbar(`"${editedAccount._id}" is not active now.`, {
            variant: 'success',
          });
        }
      },
      (error: any) => {
        let unEditedAccount = _.clone(this.state.account);
        _.merge(unEditedAccount, { disabled: checked });
        this.setState({
          account: unEditedAccount,
        });
        if (error.err_code === 6) {
          this.props.enqueueSnackbar(
            'You have reached the active members of nested service limit!',
            {
              variant: 'error',
            }
          );
        } else {
          this.props.enqueueSnackbar('We were not able to update the field!', {
            variant: 'error',
          });
        }
      }
    );
  };

  toggleEditMode = (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.setState({
      editMode: !this.state.editMode,
    });
  };

  updateModel(params: any, callback?: any) {
    const model = this.state.model;
    _.forEach(params, (val, index) => {
      model[index] = val;
    });
    this.setState({ model: model }, () => {
      if (_.isFunction(callback)) {
        callback();
      }
    });
  }

  updateFName = (event: any) => {
    this.updateModel({
      fname: event.currentTarget.value,
    });
  };

  updateLName = (event: any) => {
    this.updateModel({
      lname: event.currentTarget.value,
    });
  };

  updatePhone = (event: any) => {
    this.updateModel({
      phone: event.currentTarget.value,
    });
  };

  updateEmail = (event: any) => {
    this.updateModel({
      email: event.currentTarget.value,
    });
  };

  updateDOB = (data: any) => {
    this.updateModel({
      dob: moment(data).format(this.DATE_FORMAT),
    });
  };

  updateGender = (event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>) => {
    this.updateModel({
      gender: event.target.value,
    });
  };

  updateGrandPlaceLimit = (event: any) => {
    this.updateModel({
      grand_places_limit: this.extractNumber(event.currentTarget.value || 0),
    });
  };

  updateEditProfile(event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>) {
    this.updateModel({
      change_profile: event.target ? !!event.target.value : true,
    });
  }

  updateSearchable = (data: any) => {
    this.updateModel({
      searchable: data,
    });
  };

  resetModel() {
    this.updateModel(this.state.account);
  }

  updateViewModel() {
    this.setState({
      account: this.state.model,
    });
  }

  broadcastUpdate() {
    const event = new Event('account_updated');
    window.dispatchEvent(event);
  }

  pickFile = (e: any) => {
    const file = e.target.files.item(0);
    const imageType = /^image\//;

    if (!file || !imageType.test(file.type)) {
      return;
    }
    this.setState({
      pickedImage: file,
    });
  };

  saveForm = () => {
    // return this.form = form;
    const editModel: any = {
      account_id: this.state.model._id,
      fname: this.state.model.fname,
      lname: this.state.model.lname,
      gender: this.state.model.gender,
      dob: this.state.model.dob,
      email: this.state.model.email,
      phone: this.state.model.phone,
      searchable: this.state.model.searchable,
    };
    if (this.state.model.flags) {
      editModel.force_password = this.state.model.flags.force_password;
    }
    if (this.state.model.privacy) {
      editModel.change_profile = this.state.model.privacy.change_profile;
      editModel.change_picture = this.state.model.privacy.change_picture;
    }
    if (this.state.model.limits) {
      editModel['limits.grand_places'] = this.state.model.limits.grand_places;
    }
    if (this.state.model.authority) {
      editModel['authority.label_editor'] = this.state.model.authority.label_editor;
    }
    this.accountApi.edit(editModel).then(data => {
      this.updateViewModel();
      this.toggleEditMode();
      this.updated = true;
    });
  };

  stopPropagate = (e: any) => {
    e.stopPropagation();
  };

  clearForm = () => {
    // this.form.resetFields();
    this.resetModel();
    this.toggleEditMode();
  };

  removeFromPlace = (id: string) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const index = _.findIndex(this.state.places, {
      _id: id,
    });
    if (index > -1) {
      this.placeApi
        .removeMember({
          place_id: id,
          account_id: this.state.account._id,
        })
        .then(data => {
          console.log(data);
          this.state.places.splice(index, 1);
          this.setState({
            places: this.state.places,
          });
        });
    }
    this.setState({
      visibleRemoveMember: false,
    });
  };

  demoteInPlace = (id: string) => (e: React.MouseEvent) => {
    const index = _.findIndex(this.state.places, {
      _id: id,
    });
    if (index > -1 && _.includes(this.state.places[index].access, 'C')) {
      this.placeApi
        .demoteMember({
          place_id: id,
          account_id: this.state.account._id,
        })
        .then(data => {
          _.remove(this.state.places[index].access, item => {
            return item === 'C';
          });
          this.setState({
            places: this.state.places,
          });
        });
    }
  };

  promoteInPlace = (id: string) => (e: React.MouseEvent) => {
    const index = _.findIndex(this.state.places, {
      _id: id,
    });
    if (index > -1 && !_.includes(this.state.places[index].access, 'C')) {
      this.placeApi
        .promoteMember({
          place_id: id,
          account_id: this.state.account._id,
        })
        .then(data => {
          if (_.isArray(this.state.places[index].access)) {
            this.state.places[index].access.push('C');
          } else {
            this.state.places[index].access = ['C'];
          }
          this.setState({
            places: this.state.places,
          });
        });
    }
  };

  onCropped = (file: any) => {
    const that = this;
    const formData = new FormData();
    formData.append('blob', file, file.name);
    const credentials = AAA.getInstance().getCredentials();
    var xhr = new XMLHttpRequest();
    xhr.open(
      'POST',
      `${CONFIG().STORE.URL}/upload/profile_pic/${credentials.sk}/${this.state.token}`,
      true
    );
    this.setState({
      uploadPercent: 0,
      imageIsUploading: true,
    });
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    // xhr.setRequestHeader('Access-Control-Allow-Origin', location.host);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        const resp = JSON.parse(xhr.response);

        that.props.enqueueSnackbar(`user avatar uploaded successfully`, {
          variant: 'success',
        });
        that.accountApi
          .setPicture({
            account_id: that.state.account._id,
            universal_id: resp.data.files[0].universal_id,
          })
          .then(
            (result: any) => {
              let editedAccount = _.clone(that.state.account);
              editedAccount.picture = resp.data.files[0].thumbs;
              that.setState({
                account: editedAccount,
                uploadPercent: 0,
                imageIsUploading: false,
              });
              if (that.props.onChange) {
                that.props.onChange(editedAccount);
              }
            },
            (error: any) => {
              that.props.enqueueSnackbar('We were not able to set the picture!', {
                variant: 'error',
              });
            }
          );
      }
    };
    xhr.send(formData);
  };

  toggleRemoveMemberModal = (ref: any) => (e: React.MouseEvent) => {
    if (ref) {
      this.setState({
        removeMemberPlaceRef: ref,
      });
    }
    this.setState({
      visibleRemoveMember: !this.state.visibleRemoveMember,
    });
  };

  onFlagChange(props: any) {
    let editedAccount = _.clone(this.state.account);
    _.merge(editedAccount.flags, props);
    this.accountApi.edit(_.merge(props, { account_id: editedAccount._id })).then(
      (result: any) => {
        if (this.props.onChange) {
          this.props.onChange(editedAccount);
        }

        this.updated = true;
        this.props.enqueueSnackbar('The field has been updated.', {
          variant: 'success',
        });
      },
      (error: any) => {
        this.props.enqueueSnackbar('We were not able to update the field!', {
          variant: 'error',
        });
      }
    );
  }
  render() {
    const { classes } = this.props;
    const { editMode, reportTab } = this.state;
    const managerInPlaces = _.filter(this.state.places, place => _.includes(place.access, 'C'));
    const memberInPlaces = _.differenceBy(this.state.places, managerInPlaces, '_id');

    const items = [
      {
        key: 'forcepassword',
        name: 'Force Change Password',
        icon: 'lock16',
        switch: this.state.model.flags.force_password,
        switchChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          this.onFlagChange({ force_password: e.target.checked }),
      },
      {
        key: 'label',
        name: 'Label Manager',
        icon: 'tag16',
        switch: this.state.model.authority ? this.state.model.authority.label_editor : false,
        switchChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target) {
            this.updateLabelManager(e.target.checked);
          }
        },
      },
      {
        key: 'admin',
        name: 'Admin',
        icon: 'gear16',
        switch: this.state.model.authority ? this.state.model.authority.admin : false,
        switchChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          this.updateAdmin(e.target.checked),
      },
      {
        key: 'password',
        name: 'Change Password',
        icon: 'lock16',
        action: (e: React.ChangeEvent<HTMLInputElement>) => this.toggleChangePasswordModal(),
      },
    ];
    let header: JSX.Element = <div />;
    if (reportTab) {
      header = (
        <div className={classes.header}>
          {/* Top bar */}
          <div className="modal-close" onClick={this.toggleReportTab}>
            <IcoN size={24} name={'back24'} />
          </div>
          <h3>Reports</h3>
          <div className="filler"></div>
        </div>
      );
    } else {
      header = (
        <Grid className={classes.header} container={true}>
          {/* Top bar */}
          <div className={classes.close} onClick={this.onClose}>
            <IcoN size={24} name={'xcross24'} />
          </div>
          <Typography className={classes.head} variant="h6" component="h4">
            Accounts Details
          </Typography>
          <div className="filler" />
          {!editMode && (
            <div className={classes.modalBtn} onClick={this.toggleEditMode}>
              <IcoN size={16} name={'pencil16'} />
              <span>Edit</span>
            </div>
          )}
          {!editMode && (
            <div className={classes.modalBtn} onClick={this.toggleReportTab}>
              <IcoN size={16} name={'chart16'} />
              <span>Reports</span>
            </div>
          )}
          {!editMode && (
            <div className={classes.modalBtn} onClick={this.sendMessageToggle}>
              <IcoN size={16} name={'compose16'} />
              <span>Send a Message</span>
            </div>
          )}
          {!editMode && (
            <div className={classes.modalBtn}>
              <MoreOption menus={items} deviders={[0]} />
            </div>
          )}
          {editMode && (
            <Button onClick={this.clearForm} variant="outlined" color="secondary">
              Discard
            </Button>
          )}
          {editMode && (
            <Button onClick={this.saveForm} variant="contained" color="primary">
              Save Changes
            </Button>
          )}
        </Grid>
      );
    }

    return (
      <div>
        {this.state.visiblePlaceModal && this.selectedPlace && (
          <PlaceModal
            visible={this.state.visiblePlaceModal}
            place={this.selectedPlace}
            onClose={this.closePlaceModal}
          />
        )}
        <SendMessageModal
          onClose={this.sendMessageToggle}
          visible={this.state.sendMessageVisible}
          target={this.state.model._id}
        />
        <Dialog
          open={this.state.visible}
          onClose={this.onClose}
          fullWidth={true}
          classes={classes.MuiDialog}
          maxWidth="md"
          PaperProps={{
            classes: {
              root: reportTab ? classes.paper : '',
            },
          }}
          className={[
            'nst-modal',
            editMode ? 'edit-mode' : '',
            reportTab ? 'report-mode' : '',
          ].join(' ')}
        >
          <DialogTitle>{header}</DialogTitle>
          <DialogContent>
            {!reportTab && (
              <Grid container={true} spacing={2}>
                <Grid item={true} xs={8}>
                  <div className={classes.formBody}>
                    <div className={classes.accountInfo}>
                      <div className={classes.accountInfoTop}>
                        <div className={classes.accountAvatar}>
                          <UserAvatar avatar={true} size={64} user={this.state.account} />
                        </div>
                        <input
                          onChange={this.pickFile}
                          style={{ display: 'none' }}
                          id="file"
                          type="file"
                        />
                        {this.state.token && editMode && (
                          <>
                            <Button variant="contained" color="primary">
                              <label onClick={this.stopPropagate} htmlFor="file">
                                Upload a Photo
                              </label>
                            </Button>
                            {this.state.account.picture && this.state.account.picture.x32 && (
                              <Button
                                className="button-margin"
                                onClick={this.removePicture}
                                variant="outlined"
                                color="secondary"
                              >
                                Remove Photo
                              </Button>
                            )}
                          </>
                        )}
                        {!editMode && (
                          <div className={classes.accountName}>
                            <span>
                              <b>
                                {this.state.account.fname} {this.state.account.lname}
                              </b>
                            </span>
                            <span>@{this.state.account._id}</span>
                          </div>
                        )}
                        <div className="filler" />
                        {!editMode && (
                          <Tooltip title={this.state.account.disabled ? 'Deactive' : 'Active'}>
                            <Switch
                              onChange={this.onActiveChange}
                              checked={!this.state.account.disabled}
                              className="large-switch"
                            />
                          </Tooltip>
                        )}
                      </div>
                      {!editMode && this.state.account.authority && (
                        <div className={classes.accountInfoBot}>
                          <div className={classes.accountAvatar}>
                            {this.state.account.authority.admin && (
                              <IcoN size={16} name={'gearWire16'} />
                            )}
                            {this.state.account.authority.label_editor && (
                              <IcoN size={16} name={'tagWire16'} />
                            )}
                          </div>
                          {this.state.account.authority.admin &&
                            this.state.account.authority.label_editor && (
                              <h5>Admin and Label Manager</h5>
                            )}
                          {this.state.account.authority.admin &&
                            !this.state.account.authority.label_editor && <h5>Admin</h5>}
                          {!this.state.account.authority.admin &&
                            this.state.account.authority.label_editor && <h5>Label Manager</h5>}
                          <div className="filler" />
                        </div>
                      )}
                    </div>
                    {!editMode && <hr className={classes.inputRow} />}
                    {editMode && (
                      <Grid container={true} className={classes.inputRow} spacing={2}>
                        <Grid item={true} xs={6}>
                          <TextField
                            fullWidth={true}
                            label="First Name"
                            className="nst-input"
                            value={this.state.model.fname}
                            onChange={this.updateFName}
                          />
                        </Grid>
                        <Grid item={true} xs={6}>
                          <TextField
                            fullWidth={true}
                            label="Last Name"
                            className="nst-input"
                            value={this.state.model.lname}
                            onChange={this.updateLName}
                          />
                        </Grid>
                      </Grid>
                    )}
                    {!editMode && (
                      <Grid container={true} className={classes.inputRow} spacing={2}>
                        <Grid item={true} xs={6}>
                          <label className={classes.formLabel}>Phone Number</label>
                          <span className={classes.value}>{this.state.account.phone}</span>
                        </Grid>
                        <Grid item={true} xs={6}>
                          <label className={classes.formLabel}>Email</label>
                          {this.state.account.email && (
                            <span className={classes.value}>{this.state.account.email}</span>
                          )}
                          {!this.state.account.email && (
                            <span className={classes.value + ' ' + classes.notAssigned}>
                              - Not Assigned -
                            </span>
                          )}
                        </Grid>
                      </Grid>
                    )}
                    {editMode && (
                      <Grid className={classes.inputRow} item={true} xs={12}>
                        <TextField
                          label="Phone Number"
                          fullWidth={true}
                          helperText="Enter phone number with country code."
                          value={this.state.model.phone}
                          onChange={this.updatePhone}
                        />
                      </Grid>
                    )}
                    {editMode && (
                      <Grid className={classes.inputRow} item={true} xs={12}>
                        <TextField
                          label="Email"
                          fullWidth={true}
                          value={this.state.model.email}
                          onChange={this.updateEmail}
                        />
                      </Grid>
                    )}
                    <Grid container={true} className={classes.inputRow} spacing={2}>
                      <Grid item={true} xs={editMode ? 8 : 6}>
                        <label className={classes.formLabel}>Birthday</label>
                        {!editMode && this.state.account.dob && (
                          <span className={classes.value}>{this.state.account.dob}</span>
                        )}
                        {!editMode && !this.state.account.dob && (
                          <span className={classes.value + ' ' + classes.notAssigned}>
                            - Not Assigned -
                          </span>
                        )}
                        {editMode && (
                          <TextField
                            fullWidth={true}
                            defaultValue={
                              this.state.model.dob && this.state.model.dob !== ''
                                ? moment(this.state.model.dob)
                                : null
                            }
                            type="date"
                            onChange={this.updateDOB}
                            className="nst-input"
                          />
                        )}
                      </Grid>
                      <Grid item={true} xs={editMode ? 4 : 6}>
                        <label className={classes.formLabel}>Gender</label>
                        {!editMode && (
                          <span className={classes.value}>
                            {this.state.account.gender &&
                              this.getGenderStr(this.state.account.gender)}
                          </span>
                        )}
                        {editMode && (
                          <Select
                            style={{ width: '100%' }}
                            value={this.state.model.gender}
                            onChange={this.updateGender}
                          >
                            <MenuItem value="" disabled={true}>
                              choose a gender
                            </MenuItem>
                            <MenuItem value={'m'}>Male</MenuItem>
                            <MenuItem value={'f'}>Female</MenuItem>
                            <MenuItem value={'x'}>Other</MenuItem>
                          </Select>
                        )}
                      </Grid>
                    </Grid>
                    {editMode && (
                      <Grid container={true} className={classes.inputRow} spacing={5}>
                        <Grid item={true} xs={6}>
                          <TextField
                            label="Max. Grand Place"
                            fullWidth={true}
                            className="nst-input"
                            type="number"
                            defaultValue={this.state.model.limits.grand_places}
                            onChange={this.updateGrandPlaceLimit}
                          />
                        </Grid>
                        <Grid item={true} xs={6}>
                          <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="profile-access">Edit Profile Access</InputLabel>
                            <Select
                              fullWidth={true}
                              value={this.state.model.privacy.change_profile}
                              onChange={this.updateEditProfile}
                              inputProps={{
                                name: 'age',
                                id: 'profile-access',
                              }}
                            >
                              <MenuItem value="true">Yes</MenuItem>
                              <MenuItem value="">No</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    )}
                    {editMode && (
                      <div className={classes.inputRow}>
                        <div className={classes.searchableField}>
                          <div>
                            <label className={classes.formLabel}>Searchable</label>
                            <aside className="field-description">
                              A short description about searchable feature.
                            </aside>
                          </div>
                          <div className="filler" />
                          <Switch
                            checked={this.state.model.searchable}
                            onChange={this.updateSearchable}
                          />
                        </div>
                      </div>
                    )}
                    {!editMode && <hr className={classes.inputRow} />}
                    {!editMode && (
                      <Grid container={true} spacing={2} className={classes.otherOption}>
                        <Grid item={true} xs={4}>
                          <label className={classes.formLabel}>Searchable</label>
                          <span className={classes.value}>
                            {this.state.account.privacy.searchable ? 'Yes' : 'No'}
                          </span>
                        </Grid>
                        <Grid item={true} xs={4}>
                          <label className={classes.formLabel}>Max. Grand Place</label>
                          <span className={classes.value}>
                            {this.state.account.limits.grand_places}
                          </span>
                        </Grid>
                        <Grid item={true} xs={4}>
                          <label className={classes.formLabel}>Edit Profile Access</label>
                          <span className={classes.value}>
                            {this.state.account.privacy.change_profile ? 'Yes' : 'No'}
                          </span>
                        </Grid>
                      </Grid>
                    )}
                  </div>
                </Grid>
                <Grid item={true} xs={4} className="modal-sidebar">
                  {managerInPlaces.length > 0 && (
                    <div className={classes.listHead}>
                      Manager of {managerInPlaces.length} place
                    </div>
                  )}
                  {managerInPlaces.length > 0 &&
                    managerInPlaces.map(place => (
                      <div key={place._id + '1'} className="user-in-place-item">
                        <PlaceItem onClick={this.showPlaceModal} place={place} />
                        {this.state.account._id !== place._id && (
                          <a
                            className="remove"
                            title={'Remove From Place'}
                            onClick={this.toggleRemoveMemberModal(place._id)}
                          >
                            <IcoN size={16} name={'bin16'} />
                          </a>
                        )}
                        {this.state.account._id !== place._id && (
                          <a
                            className="promote"
                            title={'Demote Member'}
                            onClick={this.demoteInPlace(place._id)}
                          >
                            <IcoN size={24} name={'crown24'} />
                          </a>
                        )}
                      </div>
                    ))}
                  {memberInPlaces.length > 0 && (
                    <div className={classes.listHead}>Member of {memberInPlaces.length} place</div>
                  )}
                  {memberInPlaces.length > 0 && (
                    <div className="remove-margin">
                      {memberInPlaces.map(place => {
                        return (
                          <div key={place._id + '2'} className="user-in-place-item">
                            <PlaceItem
                              onClick={this.showPlaceModal}
                              place={place}
                              key={place._id}
                            />
                            <a
                              className="remove"
                              title={'Remove From Place'}
                              onClick={this.toggleRemoveMemberModal(place._id)}
                            >
                              <IcoN size={16} name={'bin16'} />
                            </a>
                            <a
                              className="promote"
                              title={'Promote Member'}
                              onClick={this.promoteInPlace(place._id)}
                            >
                              <IcoN size={24} name={'crownWire24'} />
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Grid>
              </Grid>
            )}
            {reportTab && (
              <div className="reports">
                <RelatedChartCards
                  title={[
                    ['Posts', 'Comments'],
                    ['Created tasks', 'Assigned tasks', 'Comments', 'Completed tasks'],
                  ]}
                  direction="vertical"
                  params={{ id: this.state.model._id }}
                  dataType={[
                    [ReportType.AccountPost, ReportType.AccountComment],
                    [
                      ReportType.AccountTaskAdd,
                      ReportType.AccountTaskAssigned,
                      ReportType.AccountTaskComment,
                      ReportType.AccountTaskCommpleted,
                    ],
                  ]}
                  syncId="account"
                  color={[['#e74c3c', '#f1c40f'], ['#6494e0', '#3e337a', '#7c452e', '#1d6d54']]}
                  measure={[MeasureType.NUMBER, MeasureType.NUMBER]}
                />
              </div>
            )}
            <Dialog
              open={this.state.visibleChangePassword}
              onClose={this.toggleChangePasswordModal}
              fullWidth={true}
              maxWidth="xs"
            >
              <DialogTitle>Change Password</DialogTitle>
              <DialogContent>
                <TextField
                  label="New Password"
                  type="password"
                  fullWidth={true}
                  value={this.state.newPassword}
                  onChange={this.changePasswordHandler}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  variant="outlined"
                  color="secondary"
                  key="cancel"
                  size="large"
                  onClick={this.toggleChangePasswordModal}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  key="submit"
                  size="large"
                  onClick={this.changePassword}
                >
                  Change Password
                </Button>
              </DialogActions>
            </Dialog>
            <NstCrop avatar={this.state.pickedImage} onCropped={this.onCropped} />
            <Dialog
              open={this.state.visibleRemoveMember}
              onClose={this.toggleRemoveMemberModal(null)}
              fullWidth={true}
              maxWidth="md"
            >
              <DialogTitle>Remove Member</DialogTitle>
              <DialogContent>
                <DialogContentText>Remove member prompt</DialogContentText>
                Do you want to remove "<b>{this.state.account._id}</b>" from this Place?
              </DialogContent>
              <DialogActions>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={this.toggleRemoveMemberModal(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.removeFromPlace(this.state.removeMemberPlaceRef)}
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default withStyles((theme: Theme) =>
  createStyles({
    paper: {
      background: '#eeefef',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      color: fade(theme.palette.text.primary, 0.72),
      height: '72px',
      margin: 0,
      padding: '0 16px!important',
      borderBottom: `1px solid ${fade(theme.palette.text.primary, 0.08)}`,
    },
    head: {
      display: 'flex',
      flex: '1',
    },
    close: {
      width: '40px',
      margin: '0 2px',
      height: '40px',
      display: 'flex',
      cursor: 'pointer',
      justifyContent: 'center',
      alignItems: 'center',
      transition: 'opacity .2s',
      opacity: 0.64,
      '&:hover': {
        opacit: 1,
      },
    },
    modalBtn: {
      padding: theme.spacing(0, 1),
      marginRight: theme.spacing(2),
      display: 'flex',
      alignItems: 'center',
      marginBottom: 0,
      fontSize: '14px',
      fontWeight: 700,
      cursor: 'pointer',
      '& i': {
        marginRight: '4px',
        opacity: 0.64,
        display: 'flex',
      },
    },
    formBody: {
      border: `1px solid ${fade(theme.palette.text.primary, 0.08)}`,
      borderRadius: '4px',
      minHeight: '100%',
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      overflow: 'auto',
      padding: theme.spacing(0, 3, 8),
      background: fade(theme.palette.text.primary, 0.02),
      '& hr': {
        marginBottom: theme.spacing(3),
        width: '100%',
        borderColor: fade(theme.palette.text.primary, 0.08),
      },
    },
    formLabel: {
      opacity: 0.8,
      fontSize: '13px',
      lineHeight: '18px',
      marginBottom: '4px',
      display: 'flex',
      width: '100%',
    },
    accountInfo: {
      height: '132px',
      width: '100%',
    },
    accountInfoTop: {
      display: 'flex',
      height: '96px',
      alignItems: 'center',
    },
    accountInfoBot: {
      height: '36px',
      opacity: 0.8,
      display: 'flex',
      alignItems: 'center',
    },
    accountName: {
      display: 'flex',
      flexDirection: 'column',
      '& span:first-of-type': {
        fontXize: '20px',
        lineHeight: '28px',
        marginBottom: '4px',
      },
      '& span:first-of-type + span': {
        fontSize: '16px',
        opacity: 0.8,
        color: theme.palette.primary.main,
        lineHeight: '22px',
      },
    },
    accountAvatar: {
      display: 'flex',
      justifyContent: 'center',
      marginRight: theme.spacing(3),
      width: theme.spacing(8),
      '& i': {
        margin: '2px',
      },
    },
    inputRow: {
      marginBottom: theme.spacing(3),
    },
    value: {
      fontWeight: 700,
      fontSize: '16px',
      lineHeight: '22px',
      width: '100%',
    },
    notAssigned: {
      opacity: 0.24,
    },
    otherOption: {
      textAlign: 'center',
      '& label': {
        justifyContent: 'center',
      },
    },
    listHead: {
      height: '28px',
      lineHeight: '28px',
      padding: '0 6px!important',
      borderRadius: '6px',
      background: '#f6f6f7',
      fontSize: '13px',
      fontWeight: 700,
    },
    formControl: {
      width: '100%',
    },
    searchableField: {
      display: 'flex',
    },
  })
)(withSnackbar(View));
