import _ from 'lodash';
import * as React from 'react';
import PlaceApi from '../../api/place/index';
import IPlace from '../../interfaces/IPlace';
import {
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  LinearProgress,
} from '@material-ui/core';

import { IcoN } from '../icon/index';
import AAA from '../../services/classes/aaa/index';
import AccountApi from '../../api/account';
import AddMemberModal from '../AddMember/index';
import C_PLACE_POST_POLICY from '../../consts/CPlacePostPolicy';
import CONFIG from '../../config';
import IUser from '../../interfaces/IUser';
import NstCrop from '../Crop/index';
import PlaceAvatar from './../PlaceAvatar/index';
import SelectLevel from '../SelectLevel/index';
import UserAvatar from '../avatar/index';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withSnackbar } from 'notistack';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

interface IProps {
  place?: IPlace;
  visible?: boolean;
  grandPlaceId?: string;
  onClose: (v: boolean) => void;
  onChange?: (place: IPlace) => void;
  classes: any;
  enqueueSnackbar: (
    message: React.ReactNode | string,
    options?: any
  ) => string | number | null | undefined;
  closeSnackbar: () => void;
}

interface IStates {
  visible: boolean;
  visibleAddMemberModal: boolean;
  place: IPlace | undefined;
  model: any;
  token: string;
  idValidation: any;
  formValid: boolean;
  showError: boolean;
  uploadPercent: number;
  imageIsUploading: boolean;
  grandPlaceId: string | undefined;
  pickedImage: any;
}

class CreatePlaceModal extends React.Component<IProps, IStates> {
  private currentUser: IUser;
  private accountApi: any;
  private placeApi: any;
  private placeIdRegex: any;
  constructor(props: any) {
    super(props);
    this.placeIdRegex = new RegExp(
      /^[a-zA-Z](?!.*([-_])\1{1})(?!.*-_)(?!.*_-)[a-zA-Z0-9-_]{0,30}[a-zA-Z0-9]$/
    );
    this.state = {
      formValid: false,
      grandPlaceId: this.props.grandPlaceId,
      idValidation: {
        reason: 0,
        valid: false,
      },
      imageIsUploading: false,
      model: {
        addMemberPolicy: C_PLACE_POST_POLICY.CREATOR,
        addPlacePolicy: C_PLACE_POST_POLICY.CREATOR,
        addPostPolicy: C_PLACE_POST_POLICY.MANAGER,
        description: '',
        id: '',
        managerLimit: 10,
        memberLimit: 10,
        members: [],
        name: '',
        picture: '',
        pictureData: '',
        placeSearchPolicy: false,
        storageLimit: 10,
        subPlaceLimit: 10,
      },
      pickedImage: null,
      place: props.place,
      showError: false,
      token: '',
      uploadPercent: 0,
      visible: false,
      visibleAddMemberModal: false,
    };
    this.currentUser = AAA.getInstance().getUser();
  }

  public componentWillReceiveProps(props: any) {
    this.setState({
      grandPlaceId: props.grandPlaceId,
      visible: props.visible,
    });
  }

  componentWillMount() {
    ValidatorForm.addValidationRule('checkIdAvailable', this.checkIdAvailable);
  }

  componentWillUnmount() {
    ValidatorForm.removeValidationRule('checkIdAvailable');
  }

  public componentDidMount() {
    this.accountApi = new AccountApi();
    this.placeApi = new PlaceApi();
    if (this.props.place) {
      this.setState({
        visible: this.props.visible || false,
      });
    }
    this.loadUploadToken();
  }

  checkIdAvailable = (value: string) => {
    let id = value.toLowerCase();
    if (this.placeIdRegex.test(id) && id.length > 2) {
      if (this.state.grandPlaceId !== '') {
        id = this.state.grandPlaceId + '.' + id;
      }
      return this.placeApi
        .isIdAvailable(id)
        .then((data: any) => {
          if (data.err_code) {
            return false;
          } else {
            return true;
          }
        })
        .catch(() => {
          return false;
        });
    } else {
      return false;
    }
  };

  handleCancel = () => {
    this.props.onClose(true);
    this.setState({ visible: false });
  };

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

  loadUploadToken() {
    this.accountApi.getUploadToken().then(
      (result: any) => {
        this.setState({ token: result.token });
      },
      (error: any) => {
        this.setState({ token: '' });
      }
    );
  }

  getPostPolicyItem() {
    let placeId = this.state ? this.state.model.id : '';
    if (placeId !== '') {
      placeId = placeId + '@' + CONFIG().DOMAIN;
    }
    const sharePostItems = [
      {
        index: C_PLACE_POST_POLICY.MANAGER,
        label: 'manager',
        description: 'Managers Only',
        searchProperty: false,
      },
      {
        index: C_PLACE_POST_POLICY.MANGER_MEMBER,
        label: 'managerMember',
        description: 'This Place Managers & Members',
        searchProperty: false,
      },
      {
        index: C_PLACE_POST_POLICY.TEAM,
        label: 'team',
        description: 'All Grand Place Members',
        searchProperty: true,
      },
      {
        index: C_PLACE_POST_POLICY.COMPANY,
        label: 'building',
        description: 'All Company Members',
        searchProperty: true,
      },
      {
        index: C_PLACE_POST_POLICY.EMAIL,
        label: 'atsign',
        description: `All Company Members + Everyone via Email: <br> <a href="mailto:${placeId}">${placeId}</a>`,
        searchProperty: true,
        searchText: 'Searchable for Company Accounts',
      },
    ];
    return sharePostItems;
  }

  getPolicyItem() {
    const createPlaceItems = [
      {
        index: C_PLACE_POST_POLICY.CREATOR,
        label: 'manager',
        description: 'Managers Only',
        searchProperty: false,
      },
      {
        index: C_PLACE_POST_POLICY.EVERYONE,
        label: 'managerMember',
        description: 'This Place Managers & Members',
        searchProperty: false,
      },
    ];
    return createPlaceItems;
  }

  updateModel(params: any, callback?: any) {
    let model = this.state.model;
    _.forEach(params, (val, index) => {
      model[index] = val;
    });
    this.setState({ model }, () => {
      if (_.isFunction(callback)) {
        callback();
      }
    });
  }

  extractNumber(text: any) {
    return parseInt(text.replace(/[^0-9]/g, ''), 0);
  }

  updatePlaceId = (event: any) => {
    const id = event.currentTarget.value;
    this.checkIdAvailable(id);
    this.updateModel({
      id,
    });
  };

  updatePlaceName = (event: any) => {
    const name = event.currentTarget.value;
    const id = this.generateId(name);
    this.updateModel(
      {
        name,
        id,
      },
      () => {
        this.checkIdAvailable(this.state.model.id);
      }
    );
  };

  updatePlaceDescription = (event: any) => {
    this.updateModel({
      description: event.currentTarget.value,
    });
  };

  updatePlacePostPolicy = (index: any) => this.updateModel({ addPostPolicy: index });

  updatePlaceSearchPolicy = (check: any) => {
    this.updateModel({ placeSearchPolicy: check });
  };

  updatePlaceCreateSubPlacePolicy = (index: any) => {
    this.updateModel({ addPlacePolicy: index });
  };

  updatePlaceAddMemberPolicy = (index: any) => {
    this.updateModel({ addMemberPolicy: index });
  };

  updatePlaceMangerLimit = (event: any) => {
    this.updateModel({
      managerLimit: this.extractNumber(event.currentTarget.value),
    });
  };

  updatePlaceMemberLimit = (event: any) => {
    this.updateModel({
      memberLimit: this.extractNumber(event.currentTarget.value),
    });
  };

  updatePlaceSubPlaceLimit = (event: any) => {
    this.updateModel({
      subPlaceLimit: this.extractNumber(event.currentTarget.value),
    });
  };

  updatePlaceStorageLimit = (event: any) => {
    this.updateModel({
      storageLimit: this.extractNumber(event.currentTarget.value),
    });
  };

  toggleAddMemberModal = () => {
    this.setState({
      visibleAddMemberModal: !this.state.visibleAddMemberModal,
    });
  };

  addMembers = (members: any) => {
    let currentMembers = this.state.model.members;
    const list = _.differenceBy(members, currentMembers, '_id');
    currentMembers = currentMembers.concat(list);
    const adminCount = _.filter(currentMembers, item => {
      return item.admin === true;
    }).length;
    if (currentMembers.length > 0 && adminCount === 0) {
      currentMembers[0].admin = true;
    }
    if (currentMembers.length > this.state.model.memberLimit) {
      this.props.enqueueSnackbar(
        `You cannot have more than ${this.state.model.memberLimit} members`,
        {
          variant: 'warning',
        }
      );
      return;
    }
    this.updateModel({
      members: currentMembers,
    });
  };

  generateId(name: string) {
    const camelCaseName = _.camelCase(name);
    // only accepts en numbers and alphabets
    if (this.placeIdRegex.test(camelCaseName)) {
      return _.kebabCase(name.substr(0, 36));
    } else {
      return '';
    }
  }

  discard = () => {
    this.props.onClose(true);
  };

  getAddPostPolicy(policy: any) {
    let addPost: any;
    let receptive: any;
    switch (policy) {
      case C_PLACE_POST_POLICY.MANAGER:
        receptive = 'off';
        addPost = 'creators';
        break;
      case C_PLACE_POST_POLICY.MANGER_MEMBER:
        receptive = 'off';
        addPost = 'everyone';
        break;
      case C_PLACE_POST_POLICY.TEAM:
        receptive = 'internal';
        addPost = 'everyone';
        break;
      case C_PLACE_POST_POLICY.COMPANY:
        receptive = 'external';
        addPost = 'everyone';
        break;
      case C_PLACE_POST_POLICY.EMAIL:
        receptive = 'external';
        addPost = 'everyone';
        break;
      default:
        receptive = 'off';
        addPost = 'creators';
        break;
    }
    return {
      addPost: addPost,
      receptive: receptive,
    };
  }

  validate() {
    const model = this.state.model;
    if (this.state.imageIsUploading) {
      this.props.enqueueSnackbar('Wait till image uploads completely!', {
        variant: 'warning',
      });
      return false;
    } else if (_.trim(model.name).length === 0) {
      this.props.enqueueSnackbar('Choose a name!', {
        variant: 'warning',
      });
      return false;
    } else if (model.id.length < 3) {
      this.props.enqueueSnackbar('Id must be more than 3 characters!', {
        variant: 'warning',
      });
      return false;
    } else if (!this.state.idValidation.valid) {
      this.props.enqueueSnackbar('Id is not valid!', {
        variant: 'warning',
      });
      return false;
    } else if (model.members.length === 0) {
      this.props.enqueueSnackbar('Add a member!', {
        variant: 'warning',
      });
      return false;
    }
    return true;
  }

  create = () => {
    if (!this.validate()) {
      return;
    }
    let model = this.state.model;
    const addPostPolicy = this.getAddPostPolicy(model.addPostPolicy);
    if (this.state.grandPlaceId !== '') {
      model.id = this.state.grandPlaceId + '.' + model.id;
    }
    let params = {
      place_id: model.id,
      place_name: model.name,
      place_description: model.description,
      picture: model.picture,
      'policy.add_post': addPostPolicy.addPost,
      'policy.add_place': model.addPlacePolicy,
      'policy.add_member': model.addMemberPolicy,
      'privacy.locked': true,
      'privacy.search': model.placeSearchPolicy,
      'privacy.receptive': addPostPolicy.receptive,
    };
    let members = _.map(model.members, user => {
      return user._id;
    }).join(',');

    let promise: Promise<any>;
    if (this.state.grandPlaceId === '') {
      promise = this.placeApi.placeCreate(params);
    } else {
      promise = this.placeApi.placeSubCreate(params);
    }
    let placeId = '';
    promise.then((data: any) => {
      placeId = data._id;
      const promises: Promise<any>[] = [];
      promises.push(
        this.placeApi.placeAddMember({
          account_id: members,
          place_id: placeId,
        })
      );
      if (model.picture && model.picture !== '') {
        promises.push(
          this.placeApi.setPicture({
            place_id: placeId,
            universal_id: model.pictureData,
          })
        );
      }
      if (this.state.grandPlaceId === '') {
        promises.push(
          this.placeApi.placeLimitEdit({
            'limits.childs': model.subPlaceLimit,
            'limits.creators': model.managerLimit,
            'limits.key_holders': model.memberLimit,
            'limits.size': model.storageLimit * (1024 * 1024),
            place_id: placeId,
          })
        );
      }
      Promise.all(promises).then((data: any) => {
        const admins = _.map(
          _.filter(model.members, (item: any) => {
            return item.admin === true;
          }),
          (item: any) => {
            return item._id;
          }
        );
        if (admins.length > 0) {
          const adminPromises: Promise<any>[] = admins.map((item: string) =>
            this.placeApi.promoteMember({
              account_id: item,
              place_id: placeId,
            })
          );
          Promise.all(adminPromises).then(data => {
            this.props.enqueueSnackbar('Place successfully created!', {
              variant: 'success',
            });
            this.props.onClose(true);
          });
        } else {
          this.props.enqueueSnackbar('Place successfully created!', {
            variant: 'success',
          });
          this.props.onClose(true);
        }
      });
    });
  };

  toggleAdmin(user: any) {
    const index = _.findIndex(this.state.model.members, {
      _id: user._id,
    });
    if (index > -1) {
      let members = JSON.parse(JSON.stringify(this.state.model.members));
      members[index].admin = !members[index].admin;
      const adminCount = _.filter(members, item => {
        return item.admin === true;
      }).length;
      if (adminCount > this.state.model.managerLimit) {
        this.props.enqueueSnackbar(
          `You cannot have more than ${this.state.model.memberLimit} admins`,
          {
            variant: 'warning',
          }
        );
        return;
      }
      this.updateModel({
        members,
      });
    }
  }

  removeMember = (user: any) => {
    const index = _.findIndex(this.state.model.members, {
      _id: user._id,
    });
    if (index > -1) {
      const members = this.state.model.members;
      members.splice(index, 1);
      this.updateModel({
        members,
      });
    }
  };

  getMembersItems() {
    const list = this.state.model.members.map((u: any) => {
      return (
        <li key={u._id} className="nst-opacity-hover-parent">
          <UserAvatar user={u} borderRadius={'16'} size={24} avatar={true} />
          <UserAvatar user={u} name={true} size={22} className="uname" />
          <span
            className={['nst-opacity-hover', 'red-svg'].join(' ')}
            onClick={() => this.removeMember(u)}
          >
            <IcoN size={16} name={'bin16'} />
          </span>
          <span
            className={['nst-opacity-hover', u.admin ? 'no-hover' : ''].join(' ')}
            onClick={this.toggleAdmin.bind(this, u)}
          >
            <IcoN size={24} name={u.admin ? 'crown24' : 'crownWire24'} />
          </span>
        </li>
      );
    });
    return (
      <ul>
        {list}
        <li
          key="addmember"
          className={this.props.classes.addMember}
          onClick={this.toggleAddMemberModal}
        >
          <IcoN size={16} name={'cross16'} />
          Add member...
        </li>
      </ul>
    );
  }

  stopPropagate = (e: any) => {
    e.stopPropagation();
  };

  onCropped = (file: any): void => {
    const that = this;
    const formData = new FormData();
    formData.append('blob', file, file.name);
    const credentials = AAA.getInstance().getCredentials();
    var xhr = new XMLHttpRequest();
    xhr.open(
      'POST',
      `${CONFIG().STORE.URL}/upload/place_pic/${credentials.sk}/${this.state.token}`,
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
        that.updateModel({
          picture: resp.data.files[0].universal_id,
          pictureData: resp.data.files[0].thumbs,
        });
        that.setState({
          uploadPercent: 0,
          imageIsUploading: false,
        });
      }
    };
    xhr.send(formData);
  };

  removePhoto = (e: any) => {
    // todo remove photo from model
    e.preventDefault();
    e.stopPropagation();
    this.updateModel({
      picture: '',
      pictureData: '',
    });
  };

  public render() {
    const sharePostItems = this.getPostPolicyItem();
    const createPlaceItems = this.getPolicyItem();

    const { model } = this.state;
    const { classes } = this.props;
    return (
      <Dialog
        classes={classes.MuiDialog}
        open={this.state.visible}
        onClose={this.handleCancel}
        className="nst-modal"
        aria-labelledby="simple-dialog-title"
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle>
          <Grid className={classes.header} container={true}>
            <div className={classes.close} onClick={this.handleCancel}>
              <IcoN size={24} name={'xcross24'} />
            </div>
            <Typography className={classes.head} variant="h6" component="h4">
              {this.props.grandPlaceId === '' ? 'Create Grand Place' : 'Create a Private Place'}
            </Typography>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <Grid container={true} spacing={2}>
            <Grid item={true} xs={8}>
              <ValidatorForm className={classes.formBody} onSubmit={() => {}}>
                <Grid item={true} className={classes.placePicture} xs={12}>
                  <PlaceAvatar avatar={model.pictureData} />
                  <input
                    name="avatar"
                    accept="image/*"
                    onChange={this.pickFile}
                    style={{ display: 'none' }}
                    id="file"
                    type="file"
                  />
                  <div>
                    <Button variant="contained" color="primary">
                      <label onClick={this.stopPropagate} className="butn secondary" htmlFor="file">
                        <span>Upload a Photo</span>
                      </label>
                    </Button>
                    {model.pictureData && (
                      <Button variant="outlined" color="secondary" onClick={this.removePhoto}>
                        Remove Photo
                      </Button>
                    )}
                    {this.state.uploadPercent < 100 && this.state.uploadPercent > 0 && (
                      <LinearProgress variant="determinate" value={this.state.uploadPercent} />
                    )}
                  </div>
                </Grid>
                <Grid className={classes.inputRow} item={true} xs={12}>
                  <TextField
                    fullWidth={true}
                    className="nst-input"
                    id="name"
                    label="Name"
                    value={model.name}
                    onChange={this.updatePlaceName}
                  />
                </Grid>
                <Grid className={classes.inputRow} item={true} xs={12}>
                  <TextValidator
                    label="Place ID"
                    fullWidth={true}
                    id="placeId"
                    value={model.id}
                    onChange={this.updatePlaceId}
                    validators={['required']}
                    errorMessages={['Required!']}
                  />
                  {!this.state.idValidation.valid && this.state.idValidation.reason === 1 && (
                    <p className="nst-error">Id Invalid</p>
                  )}
                  {!this.state.idValidation.valid && this.state.idValidation.reason === 2 && (
                    <p className="nst-error">Already Exist</p>
                  )}
                  <p>
                    Place will be identified by this unique address: grand-place.choosen-id You
                    can't change this afterwards, so choose wisely!
                  </p>
                </Grid>
                <Grid className={classes.inputRow} item={true} xs={12}>
                  <TextField
                    label="Description"
                    id="description"
                    multiline={true}
                    fullWidth={true}
                    className="nst-input"
                    value={model.description}
                    onChange={this.updatePlaceDescription}
                  />
                </Grid>
                <Grid className={classes.inputRow} item={true} xs={12}>
                  <label>Who can share posts with this Place?</label>
                  <SelectLevel
                    index={model.addPostPolicy}
                    searchable={model.placeSearchPolicy}
                    items={sharePostItems}
                    onChangeLevel={this.updatePlacePostPolicy}
                    onChangeSearch={this.updatePlaceSearchPolicy}
                  />
                </Grid>
                <Grid className={classes.inputRow} item={true} xs={12}>
                  <label>Who can create sub-places in this Place?</label>
                  <SelectLevel
                    index={model.addPlacePlicy}
                    items={createPlaceItems}
                    onChangeLevel={this.updatePlaceCreateSubPlacePolicy}
                  />
                </Grid>
                <Grid className={classes.inputRow} item={true} xs={12}>
                  <label>Who can add member to this Place?</label>
                  <SelectLevel
                    index={model.addMemberPolicy}
                    items={createPlaceItems}
                    onChangeLevel={this.updatePlaceAddMemberPolicy}
                  />
                </Grid>
                <Grid container={true} className={classes.inputRow} spacing={5}>
                  <Grid item={true} xs={6}>
                    <TextField
                      label="Max. Managers"
                      id="limitManager"
                      className="nst-input"
                      value={model.managerLimit}
                      fullWidth={true}
                      onChange={this.updatePlaceMangerLimit}
                    />
                  </Grid>
                  <Grid item={true} xs={6}>
                    <TextField
                      label="Max. Members"
                      id="limitMember"
                      className="nst-input"
                      value={model.memberLimit}
                      fullWidth={true}
                      onChange={this.updatePlaceMemberLimit}
                    />
                  </Grid>
                </Grid>
                <Grid container={true} className={classes.inputRow} spacing={5}>
                  <Grid item={true} xs={6}>
                    <TextField
                      label="Max. Sub-Places"
                      id="limitSubPlaces"
                      className="nst-input"
                      value={model.subPlaceLimit}
                      fullWidth={true}
                      onChange={this.updatePlaceSubPlaceLimit}
                    />
                  </Grid>
                  <Grid item={true} xs={6}>
                    <TextField
                      label="Max. Storage"
                      id="limitStorage"
                      className="nst-input"
                      fullWidth={true}
                      value={model.storageLimit}
                      onChange={this.updatePlaceStorageLimit}
                    />
                  </Grid>
                </Grid>
              </ValidatorForm>
            </Grid>
            <Grid item={true} xs={4}>
              <div className={classes.listHead}>Members</div>
              <div className="place-members">{this.getMembersItems()}</div>
            </Grid>
          </Grid>
          <AddMemberModal
            members={this.state.model.members}
            addMembers={this.addMembers}
            onClose={this.toggleAddMemberModal}
            visible={this.state.visibleAddMemberModal}
          />
          <NstCrop avatar={this.state.pickedImage} onCropped={this.onCropped} />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="secondary" onClick={this.discard}>
            Discard
          </Button>
          <Button variant="contained" color="primary" onClick={this.create}>
            Create Place
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  private pictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // if (info.event && info.event.percent) {
    //   this.setState({
    //     uploadPercent: parseInt(info.event.percent.toFixed(2)),
    //   });
    // }
    // if (info.file.status === 'done') {
    //   this.updateModel({
    //     picture: info.file.response.data.files[0].universal_id,
    //     pictureData: info.file.response.data.files[0].thumbs,
    //   });
    //   this.setState({
    //     imageIsUploading: false,
    //     uploadPercent: 0,
    //   });
    // } else if (info.file.status === 'error') {
    //   //   message.error(`${info.file.name} file upload failed.`);
    // }
  };

  fileUpload(file: File) {
    // return new Promise((resolve, reject) => {
    //   const req = new XMLHttpRequest();
    //   req.upload.addEventListener('progress', event => {
    //     if (event.lengthComputable) {
    //       const copy = { ...this.state.uploadProgress };
    //       copy[file.name] = {
    //         state: 'pending',
    //         percentage: (event.loaded / event.total) * 100,
    //       };
    //       this.setState({ uploadProgress: copy });
    //     }
    //   });
    //   req.upload.addEventListener('load', event => {
    //     const copy = { ...this.state.uploadProgress };
    //     copy[file.name] = { state: 'done', percentage: 100 };
    //     this.setState({ uploadProgress: copy });
    //     resolve(req.response);
    //   });
    //   req.upload.addEventListener('error', event => {
    //     const copy = { ...this.state.uploadProgress };
    //     copy[file.name] = { state: 'error', percentage: 0 };
    //     this.setState({ uploadProgress: copy });
    //     reject(req.response);
    //   });
    //   const formData = new FormData();
    //   formData.append('file', file, file.name);
    //   req.open('POST', 'http://localhost:8000/upload');
    //   req.send(formData);
    // });
  }
}

export default withStyles((theme: Theme) =>
  createStyles({
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
      padding: theme.spacing(3, 3, 8),
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
      marginTop: '32px',
      display: 'flex',
      width: '100%',
    },
    placeHead: {
      display: 'flex',
      img: {
        border: '3px solid white',
        borderRadius: '6px',
        boxShadow: '0 3px 8px rgba(0,0,0,.16)',
      },
    },
    placeDes: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      width: 'calc(100% - 88px)',
      marginLeft: theme.spacing(3),
      '& h2': {
        margin: '4px 0',
        fontSize: '20px',
        fontWeight: 'bold',
        lineHeight: 1.4,
      },
      '& h3': {
        margin: theme.spacing(0, 0, 3),
        fontSize: '16px',
        lineHeight: 1.4,
        color: '#00B45A',
        opacity: 0.8,
        fontWeight: 'normal',
      },
    },
    inputRow: {
      marginBottom: theme.spacing(3),
      '& p': {
        fontSize: '13px',
        opacity: 0.8,
        color: '#323d47',
        padding: '0 6px',
        marginTop: '10px',
      },
    },
    value: {
      fontWeight: 700,
      fontSize: '16px',
      lineHeight: '22px',
      width: '100%',
      '& i': {
        marginRight: theme.spacing(1),
        opacity: 0.64,
        transform: 'translateY(2px)',
      },
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
    power: {
      fontSize: '20px',
    },
    placePicture: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingBottom: theme.spacing(1),
      '& img': {
        width: '64px',
        border: '1px solid rgba(50,61,71,.08)',
        borderRadius: '4px',
        height: '64px',
        marginBottom: '6px',
      },
    },
    addMember: {
      opacity: 0.4,
      cursor: 'pointer',
    },
  })
)(withSnackbar(CreatePlaceModal));
