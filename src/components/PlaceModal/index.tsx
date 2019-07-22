import _ from 'lodash';
import * as React from 'react';
import PlaceApi from '../../api/place/index';
import IPlace from '../../interfaces/IPlace';
import {
  TextField,
  MenuItem,
  FormControl,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  Grid,
  Select,
  Typography,
} from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';

import PlaceView from './../placeview/index';
import AccountApi from '../../api/account';
import View from '../../scenes/accounts/components/View/index';
import IPerson from '../../interfaces/IPerson';
import AAA from '../../services/classes/aaa/index';
import C_PLACE_TYPE from '../../consts/CPlaceType';
import EditableFields from './EditableFields';
import { IcoN } from '../icon/index';
import UserAvatar from '../avatar/index';
import PlacePolicy from '../PlacePolicy/index';
import RelatedChartCards from '../ChartCard/RelatedChartCards';
import ReportType from '../../consts/ReportType';
import MeasureType from '../ChartCard/MeasureType';
import SelectLevel from '../SelectLevel/index';
import C_PLACE_POST_POLICY from '../../consts/CPlacePostPolicy';
import CONFIG from '../../config';
import PlaceAvatar from '../PlaceAvatar/index';
import AddMemberModal from '../AddMember/index';
import NstCrop from '../Crop/index';
import { withSnackbar } from 'notistack';
import SendMessageModal from '../SendMessageModal/index';

interface IProps {
  place: IPlace;
  visible?: boolean;
  onClose?: any;
  onChange?: (place: IPlace) => void;
  classes: any;
  enqueueSnackbar: (
    message: React.ReactNode | string,
    options?: any
  ) => string | number | null | undefined;
  closeSnackbar: () => void;
}

interface IStates {
  editTarget: EditableFields | null;
  visible: boolean;
  sendMessageVisible: boolean;
  visibleAddMemberModal: boolean;
  place: IPlace;
  members?: any;
  chosen?: IPerson;
  viewAccount: boolean;
  creators: string[];
  isGrandPlace: boolean;
  showEdit: boolean;
  updateProgress: boolean;
  imageIsUploading: boolean;
  editMode: boolean;
  reportTab: boolean;
  sidebarTab: number;
  uploadPercent: number;
  token: string;
  model: any;
  pickedImage: any;
  visibleRemoveMember: boolean;
  removeMemberUserRef: any;
  formData: any;
}

class PlaceModal extends React.Component<IProps, IStates> {
  private DATE_FORMAT: string = 'YYYY-MM-DD';
  private updated: boolean = false;
  private accountApi: AccountApi = new AccountApi();
  private placeApi: PlaceApi = new PlaceApi();
  private currentUser: IPerson = AAA.getInstance().getUser();
  private form = React.createRef<HTMLFormElement>();

  constructor(props: any) {
    super(props);
    this.state = {
      editTarget: null,
      visibleAddMemberModal: false,
      sendMessageVisible: false,
      uploadPercent: 0,
      sidebarTab: 0,
      updateProgress: false,
      showEdit: false,
      visible: false,
      place: this.props.place,
      members: [],
      reportTab: false,
      editMode: false,
      viewAccount: false,
      pickedImage: null,
      token: '',
      creators: this.props.place.creators,
      isGrandPlace: true,
      model: this.getModelFromProps(this.props),
      imageIsUploading: false,
      visibleRemoveMember: false,
      removeMemberUserRef: null,
      formData: {},
    };
  }

  getModelFromProps(props: any) {
    return {
      addMemberPolicy: props.place.policy.add_member,
      addPlacePolicy: props.place.policy.add_place,
      addPostPolicy: this.transformAddPostPolicy(
        props.place.policy.add_post,
        props.place.privacy.receptive
      ),
      description: props.place.description,
      id: props.place._id,
      managerLimit: props.place.limits.creators,
      memberLimit: props.place.limits.key_holders,
      members: [],
      name: props.place.name,
      picture: '',
      pictureData: props.place.picture,
      placeSearchPolicy: props.place.privacy.search,
      storageLimit: props.place.limits.size / (1024 * 1024),
      subPlaceLimit: props.place.limits.childs,
    };
  }

  componentWillReceiveProps(props: any) {
    this.setState({
      place: props.place,
      creators: props.place.creators,
      visible: props.visible,
      model: this.getModelFromProps(props),
    });
    this.fetchUsers();
    this.updated = false;
  }

  fetchUsers() {
    this.placeApi
      .getPlaceListMemebers({
        place_id: this.props.place._id,
      })
      .then((accounts: any) => {
        const admins = _.map(this.state.place.creators, item => {
          return { _id: item };
        });
        let managers = _.intersectionBy(accounts, admins, '_id');
        managers = _.map(managers, item => {
          return _.merge(item, {
            admin: true,
          });
        });
        let members = _.differenceBy(accounts, admins, '_id');
        members = _.map(members, item => {
          return _.merge(item, {
            admin: false,
          });
        });
        accounts = _.concat(managers, members);
        this.setState({
          members: accounts,
        });
        this.updateModel({
          members: accounts,
        });
      });
  }

  componentDidMount() {
    if (this.props.place) {
      this.setState({
        creators: this.props.place.creators,
        place: this.props.place,
        visible: !!this.props.visible,
      });
    }
    this.fetchUsers();
    this.loadUploadToken();
  }

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

  onCloseView = () => {
    this.setState({ chosen: undefined, viewAccount: false, visible: true });
  };

  handleChange = (account: IPerson) => {
    const accounts = _.clone(this.state.members);
    const index = _.findIndex(accounts, { _id: account._id });
    if (index === -1) {
      return;
    }

    accounts.splice(index, 1, account);
    this.setState({
      members: accounts,
    });
  };

  handleCancel = () => {
    if (this.updated) {
      this.broadcastUpdate();
    }
    this.setState({
      visible: false,
    });
    if (this.props.onClose && typeof this.props.onClose === 'function') {
      this.props.onClose();
    }
  };

  applyChanges(form: any) {
    form.validateFields((error: any, values: any) => {
      const errors = _(error)
        .map((value, key) => value.errors)
        .flatten()
        .value();
      if (_.size(errors) > 0) {
        return;
      }

      const changedProps = _.mapValues(values, (value, key) => {
        return value;
      });

      const editedPlace = _.clone(this.state.place);

      this.setState({
        updateProgress: true,
        place: _.merge(editedPlace, changedProps),
      });

      const limits = {
        place_id: this.props.place._id,
      };

      _.forEach(changedProps.limits, (val, key) => {
        limits[`limits.${key}`] = parseInt(val, 0);
      });

      this.placeApi.placeLimitEdit(limits).then(
        (result: any) => {
          this.setState({
            showEdit: false,
            updateProgress: false,
          });
          if (this.props.onChange) {
            this.props.onChange(editedPlace);
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
    });
  }

  saveForm = () => {};

  /**
   * convert byte to gig
   * @param {number} size
   */
  convertSize(size: number): number {
    return size / 1073741824;
  }

  changeSidebarTab = (sidebarTab: number) => {
    this.setState({
      sidebarTab,
    });
  };

  toggleEditMode = (editMode?: boolean) => {
    this.setState({
      editMode: editMode || !this.state.editMode,
    });
  };

  toggleReportTab = (_: any) => {
    this.setState({
      reportTab: !this.state.reportTab,
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

  toggleAdmin = (user: any) => (e: any) => {
    const index = _.findIndex(this.state.model.members, {
      _id: user._id,
    });
    const members = JSON.parse(JSON.stringify(this.state.model.members));
    if (!_.some(this.state.members, { _id: user._id })) {
      if (index > -1) {
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
    } else {
      if (!this.state.model.members[index].admin) {
        members[index].admin = true;
        this.placeApi
          .promoteMember({
            place_id: this.state.model.id,
            account_id: user._id,
          })
          .then(() => {
            this.updated = true;
            this.updateModel({
              members: members,
            });
          });
      } else {
        members[index].admin = false;
        this.placeApi
          .demoteMember({
            place_id: this.state.model.id,
            account_id: user._id,
          })
          .then(() => {
            this.updated = true;
            this.updateModel({
              members,
            });
          });
      }
    }
  };

  removeMember = (user: any) => {
    const index = _.findIndex(this.state.model.members, {
      _id: user._id,
    });
    let members = this.state.model.members;
    if (!_.some(this.state.members, { _id: user._id })) {
      members.splice(index, 1);
      this.updateModel({
        members: members,
      });
    } else {
      this.placeApi
        .removeMember({
          place_id: this.state.model.id,
          account_id: user._id,
        })
        .then(() => {
          this.updated = true;
          members.splice(index, 1);
          this.updateModel({
            members: members,
          });
        });
    }
    this.setState({
      visibleRemoveMember: false,
    });
  };

  clearForm = () => {
    // this.form.resetFields();
    this.resetModel();
    this.toggleEditMode(false);
  };

  broadcastUpdate() {
    const event = new Event('place_updated');
    window.dispatchEvent(event);
  }

  updateForm = () => {
    if (!this.validate()) {
      return;
    }
    const model = this.state.model;
    const addPostPolicy = this.getAddPostPolicy(model.addPostPolicy);
    const params = {
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
      'limits.key_holders': model.memberLimit,
      'limits.creators': model.managerLimit,
      'limits.size': model.storageLimit * (1024 * 1024),
      'limits.childs': model.subPlaceLimit,
    };
    const newMembers = _.differenceBy(model.members, this.state.members, '_id');
    const members = newMembers
      .map((user: any) => {
        return user._id;
      })
      .join(',');
    this.placeApi.placeUpdate(params).then(data => {
      this.toggleEditMode(false);
      this.importToModel();
      this.updated = true;
      this.props.enqueueSnackbar('Place updated!', {
        variant: 'success',
      });
      if (model.picture === '-') {
        this.placeApi
          .setPicture({
            place_id: model.id,
          })
          .then(() => {
            console.log('picture removed');
          });
      } else if (model.picture !== null && model.picture !== '') {
        this.placeApi
          .setPicture({
            place_id: model.id,
            universal_id: model.picture,
          })
          .then(() => {
            console.log('picture added');
          });
      }
      if (newMembers.length > 0) {
        this.placeApi
          .placeAddMember({
            place_id: model.id,
            account_id: members,
          })
          .then(data => {
            this.props.enqueueSnackbar('New Members have been added!', {
              variant: 'success',
            });
            this.updated = true;
            const admins = _.map(
              _.filter(newMembers, (item: any) => {
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
                  place_id: model.id,
                })
              );
              Promise.all(adminPromises).then(data => {
                this.props.enqueueSnackbar(`New Managers have been added!`, {
                  variant: 'success',
                });
              });
            }
          });
      }
    });
  };

  resetModel() {
    this.updateModel({
      addMemberPolicy: this.state.place.policy.add_member,
      addPlacePolicy: this.state.place.policy.add_place,
      addPostPolicy: this.transformAddPostPolicy(
        this.state.place.policy.add_post,
        this.state.place.privacy.receptive
      ),
      description: this.state.place.description,
      managerLimit: this.state.place.limits.creators,
      memberLimit: this.state.place.limits.key_holders,
      members: this.state.members,
      name: this.state.place.name,
      picture: '',
      pictureData: this.state.place.picture,
      placeSearchPolicy: this.state.place.privacy.search,
      storageLimit: this.state.place.limits.size / (1024 * 1024),
      subPlaceLimit: this.state.place.limits.childs,
    });
  }

  importToModel() {
    const model = this.state.model;
    const addPostPolicy = this.getAddPostPolicy(model.addPostPolicy);
    let place: IPlace = this.state.place;
    place.name = model.name;
    place.description = model.description;
    place.picture = model.pictureData;
    place.policy.add_post = addPostPolicy.addPost;
    place.policy.add_place = model.addPlacePolicy;
    place.policy.add_member = model.addMemberPolicy;
    place.privacy.search = model.placeSearchPolicy;
    place.privacy.search = addPostPolicy.receptive;
    place.limits.creators = model.managerLimit;
    place.limits.key_holders = model.memberLimit;
    place.limits.childs = model.subPlaceLimit;
    place.limits.size = model.storageLimit;
    this.setState({
      place: place,
      members: model.members,
    });
  }

  getMembersItems() {
    const isPersonal = this.state.place.type === C_PLACE_TYPE[C_PLACE_TYPE.personal];
    const list = this.state.model.members.map((u: any) => {
      return (
        <li key={u._id} className="nst-opacity-hover-parent">
          <UserAvatar user={u} borderRadius={'16px'} size={24} avatar={true} />
          <UserAvatar user={u} name={true} size={22} className="uname" />
          {!isPersonal && (
            <span
              className={['nst-opacity-hover', u.admin ? 'no-hover' : ''].join(' ')}
              onClick={this.toggleAdmin(u)}
            >
              <IcoN size={24} name={u.admin ? 'crown24' : 'crownWire24'} />
            </span>
          )}
          {!isPersonal && (
            <span
              className={['nst-opacity-hover', 'red-svg'].join(' ')}
              onClick={this.toggleRemoveMemberModal(u)}
            >
              <IcoN size={16} name={'bin16'} />
            </span>
          )}
        </li>
      );
    });
    return (
      <ul>
        {list}
        {this.state.editMode && (
          <li className={this.props.classes.addMember} onClick={this.toggleAddMemberModal}>
            <IcoN size={16} name={'cross16'} />
            Add member...
          </li>
        )}
      </ul>
    );
  }

  getPostPolicyItem() {
    let placeId = this.state ? this.state.place._id : '';
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
        //     index: C_PLACE_POST_POLICY.COMPANY,
        //     label: 'building',
        //     description: 'All Company Members',
        //     searchProperty: true
        // }, {
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
    }
    return true;
  }

  transformAddPostPolicy(addPost: any, receptive: any) {
    if (receptive === 'off' && addPost === 'creators') {
      return C_PLACE_POST_POLICY.MANAGER;
    } else if (receptive === 'off' && addPost === 'everyone') {
      return C_PLACE_POST_POLICY.MANGER_MEMBER;
    } else if (receptive === 'internal' && addPost === 'everyone') {
      return C_PLACE_POST_POLICY.TEAM;
    } else if (receptive === 'external' && addPost === 'everyone') {
      return C_PLACE_POST_POLICY.EMAIL;
    }
  }

  beforeUpload() {
    this.setState({
      uploadPercent: 0,
      imageIsUploading: true,
    });
    if (!this.state.token) {
      this.props.enqueueSnackbar('We are not able to upload the picture.', {
        variant: 'error',
      });
      return false;
    }
  }

  blobToFile(blob: Blob) {
    return new File([blob], 'name', { type: blob.type, lastModified: Date.now() });
  }

  onCropped = (file: any) => {
    const that = this;
    const formData = new FormData();
    formData.append('blob', file, file.name);
    const credentials = AAA.getInstance().getCredentials();
    const xhr = new XMLHttpRequest();
    xhr.open(
      'POST',
      `${CONFIG().STORE.URL}/upload/place_pic/${credentials.sk}/${this.state.token}`,
      true
    );

    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    // xhr.setRequestHeader('Access-Control-Allow-Origin', location.host);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        const resp = JSON.parse(xhr.response);
        that.updateModel({
          picture: resp.data.files[0].universal_id,
          pictureData: resp.data.files[0].thumbs,
        });
        that.setState({
          imageIsUploading: false,
          uploadPercent: 0,
        });
      }
    };
    xhr.send(formData);
  };

  removePhoto = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    this.updateModel({
      pictureData: '',
      picture: '-',
    });
  };

  pictureChange(info: any) {
    if (info.event && info.event.percent) {
      this.setState({
        uploadPercent: parseInt(info.event.percent.toFixed(2)),
      });
    }
    if (info.file.status === 'done') {
      this.updateModel({
        picture: info.file.response.data.files[0].universal_id,
        pictureData: info.file.response.data.files[0].thumbs,
      });
      this.setState({
        uploadPercent: 0,
        imageIsUploading: false,
      });
    } else if (info.file.status === 'error') {
      this.props.enqueueSnackbar(`${info.file.name} file upload failed.`, {
        variant: 'error',
      });
    }
  }

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

  extractNumber(text: any) {
    return parseInt(text.replace(/[^0-9]/g, ''), 0);
  }

  updatePlaceName = (event: any) => {
    const name = event.currentTarget.value;
    this.updateModel({
      name,
    });
  };

  updatePlaceDescription = (event: any) => {
    this.updateModel({
      description: event.currentTarget.value,
    });
  };

  updatePlacePostPolicy = (index: any) => {
    console.log(index);
    this.updateModel({ addPostPolicy: index });
  };

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
      managerLimit: this.extractNumber(event.currentTarget.value || 0),
    });
  };

  updatePlaceMemberLimit = (event: any) => {
    this.updateModel({
      memberLimit: this.extractNumber(event.currentTarget.value || 0),
    });
  };

  updatePlaceSubPlaceLimit = (event: any) => {
    this.updateModel({
      subPlaceLimit: this.extractNumber(event.currentTarget.value || 0),
    });
  };

  updatePlaceStorageLimit(event: any) {
    this.updateModel({
      storageLimit: this.extractNumber(event.currentTarget.value),
    });
  }

  sendMessageToggle = () => {
    this.setState({
      sendMessageVisible: !this.state.sendMessageVisible,
    });
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
    // const reader = new FileReader();

    // reader.onload = (e2) => {
    //     this.setState({
    //         pickedImage: file
    //     });
    // };

    // reader.readAsDataURL(file);
  };

  toggleRemoveMemberModal = (ref?: any) => (e: any) => {
    if (ref) {
      this.setState({
        removeMemberUserRef: ref,
      });
    }
    this.setState({
      visibleRemoveMember: !this.state.visibleRemoveMember,
    });
  };

  handleFormChange = (event: any) => {
    const { formData } = this.state;
    formData[event.target.name] = event.target.value;
    this.setState({ formData });
  };

  render() {
    const { place, editMode, model, reportTab } = this.state;
    const { classes } = this.props;
    const isPersonal = place.type === C_PLACE_TYPE[C_PLACE_TYPE.personal];
    const sharePostItems = this.getPostPolicyItem();
    const createPlaceItems = this.getPolicyItem();
    const placeClone: IPlace = _.clone(this.state.place);
    let header: JSX.Element = <div />;

    if (reportTab) {
      header = (
        <div className={classes.header}>
          {/* Top bar */}
          <div className="modal-close" onClick={this.toggleReportTab}>
            <IcoN size={24} name={'back24'} />
          </div>
          <h3>Reports</h3>
          <div className="filler" />
        </div>
      );
    } else {
      header = (
        <Grid className={classes.header} container={true}>
          {/* Top bar */}
          <div className={classes.close} onClick={this.handleCancel}>
            <IcoN size={24} name={'xcross24'} />
          </div>
          <Typography className={classes.head} variant="h6" component="h4">
            Place Info
          </Typography>
          <div className="filler" />
          {!editMode && (
            <div className={classes.modalBtn} onClick={() => this.toggleEditMode()}>
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
          {editMode && (
            <Button
              className="button-margin"
              variant="outlined"
              color="secondary"
              onClick={this.clearForm}
            >
              Discard
            </Button>
          )}
          {editMode && (
            <Button variant="contained" color="primary" onClick={this.updateForm}>
              Save Changes
            </Button>
          )}
        </Grid>
      );
    }
    return (
      <div>
        {this.state.viewAccount && this.state.chosen && (
          <View
            account={this.state.chosen}
            visible={this.state.viewAccount}
            onChange={this.handleChange}
            onClose={this.onCloseView}
          />
        )}
        <NstCrop avatar={this.state.pickedImage} onCropped={this.onCropped} />
        {place && (
          <Dialog
            maxWidth="md"
            fullWidth={true}
            classes={classes.MuiDialog}
            className={[
              'nst-modal',
              editMode ? 'edit-mode' : '',
              reportTab ? 'report-mode' : '',
            ].join(' ')}
            open={this.state.visible}
            onClose={this.handleCancel}
            PaperProps={{
              classes: {
                root: reportTab ? classes.paper : '',
              },
            }}
          >
            <DialogTitle>{header}</DialogTitle>
            <DialogContent>
              {!reportTab && (
                <Grid container={true} spacing={2}>
                  <Grid item={true} xs={8}>
                    <div className={classes.formBody}>
                      {!this.state.editMode && (
                        <div className={classes.placeHead}>
                          <PlaceView
                            className="placemodal"
                            avatar={true}
                            size={64}
                            place={place}
                            id={false}
                          />
                          <div className={classes.placeDes}>
                            <h2>{place.name}</h2>
                            <h3>{place._id}</h3>
                            <hr />
                            <p>{place.description}</p>
                            <label className={classes.formLabel}>Share Post Policy</label>
                            <span className={classes.value}>
                              <PlacePolicy place={place} text={true} receptive={true} />
                            </span>
                            {!isPersonal && (
                              <label className={classes.formLabel}>Create Sub-Place Policy</label>
                            )}
                            {!isPersonal && (
                              <span className={classes.value}>
                                <PlacePolicy place={place} text={true} create={true} />
                              </span>
                            )}
                            {!isPersonal && (
                              <label className={classes.formLabel}>Add Member Policy</label>
                            )}
                            {!isPersonal && (
                              <span className={classes.value}>
                                <PlacePolicy place={place} text={true} add={true} />
                              </span>
                            )}
                            {!isPersonal && (
                              <Grid container={true} className={classes.inputRow} spacing={2}>
                                <Grid item={true} xs={6}>
                                  <label className={classes.formLabel}>Max. Managers</label>
                                  <span className={classes.value}>{place.counters.creators}</span>
                                  <span className={classes.value + ' ' + classes.notAssigned}>
                                    /{model.managerLimit}
                                  </span>
                                </Grid>
                                <Grid item={true} xs={6}>
                                  <label className={classes.formLabel}>Max. Members</label>
                                  <span className={classes.value + ' ' + classes.power}>
                                    {place.counters.key_holders}
                                  </span>
                                  <span className={classes.value + ' ' + classes.notAssigned}>
                                    /{model.memberLimit}
                                  </span>
                                </Grid>
                                <Grid item={true} xs={6}>
                                  <label className={classes.formLabel}>Max. Sub-Places</label>
                                  <span className={classes.value + ' ' + classes.power}>
                                    {place.counters.childs}
                                  </span>
                                  <span className={classes.value + ' ' + classes.notAssigned}>
                                    /{model.subPlaceLimit}
                                  </span>
                                </Grid>
                              </Grid>
                            )}
                          </div>
                        </div>
                      )}
                      {this.state.editMode && (
                        <div>
                          <div className={classes.placePicture}>
                            <PlaceAvatar avatar={model.pictureData} />
                            <input
                              hidden={true}
                              onChange={this.pickFile}
                              style={{ display: 'none' }}
                              id="file"
                              type="file"
                            />
                            <div>
                              <Button variant="contained" color="primary" className="button-margin">
                                <label htmlFor="file">
                                  <span>Upload a Photo</span>
                                </label>
                              </Button>
                              {model.pictureData && (
                                <Button
                                  variant="outlined"
                                  color="secondary"
                                  onClick={this.removePhoto}
                                >
                                  Remove Photo
                                </Button>
                              )}
                              {this.state.uploadPercent < 100 && this.state.uploadPercent > 0 && (
                                <div
                                  className="progress-bar"
                                  style={{ width: this.state.uploadPercent + '%' }}
                                />
                              )}
                            </div>
                          </div>
                          <div className={classes.inputRow}>
                            <TextField
                              fullWidth={true}
                              className="nst-input"
                              id="name"
                              label="Name"
                              value={model.name}
                              onChange={this.updatePlaceName}
                            />
                          </div>
                          <div className={classes.inputRow}>
                            <TextField
                              fullWidth={true}
                              multiline={true}
                              id="description"
                              label="description"
                              className="nst-input"
                              value={model.description}
                              onChange={this.updatePlaceDescription}
                            />
                          </div>
                          <div className="input-row select-level">
                            <label>Who can share posts with this Place?</label>
                            <SelectLevel
                              index={model.addPostPolicy}
                              searchable={model.placeSearchPolicy}
                              items={sharePostItems}
                              onChangeLevel={this.updatePlacePostPolicy}
                              onChangeSearch={this.updatePlaceSearchPolicy}
                            />
                          </div>
                          {!isPersonal && (
                            <div className="input-row select-level">
                              <label>Who can create sub-places in this Place?</label>
                              <SelectLevel
                                index={model.addPlacePolicy}
                                items={createPlaceItems}
                                onChangeLevel={this.updatePlaceCreateSubPlacePolicy}
                              />
                            </div>
                          )}
                          {!isPersonal && (
                            <div className="input-row select-level">
                              <label>Who can add member to this Place?</label>
                              <SelectLevel
                                index={model.addMemberPolicy}
                                items={createPlaceItems}
                                onChangeLevel={this.updatePlaceAddMemberPolicy}
                              />
                            </div>
                          )}
                          {!isPersonal && (
                            <Grid container={true} className="input-row" spacing={2}>
                              <Grid item={true} xs={6} className={classes.formLabel}>
                                <TextField
                                  className="nst-input"
                                  id="limitManager"
                                  label="Max. Managers"
                                  type="number"
                                  value={model.managerLimit}
                                  onChange={this.updatePlaceMangerLimit}
                                />
                              </Grid>
                              <Grid item={true} xs={6} className={classes.formLabel}>
                                <TextField
                                  className="nst-input"
                                  id="limitManager"
                                  type="number"
                                  label="Max. Members"
                                  value={model.memberLimit}
                                  onChange={this.updatePlaceMemberLimit}
                                />
                              </Grid>
                            </Grid>
                          )}
                          <Grid container={true} className="input-row" spacing={2}>
                            <Grid item={true} xs={6} className={classes.formLabel}>
                              <TextField
                                className="nst-input"
                                id="limitSubPlaces"
                                type="number"
                                label="Max. Sub-Places"
                                value={model.subPlaceLimit}
                                onChange={this.updatePlaceSubPlaceLimit}
                              />
                            </Grid>
                            {/*<div span={12}>
                                <label htmlFor='limitStorage'>Max. Storage</label>
                                <Input
                                    id='limitStorage'
                                    size='large'
                                    className='nst-input'
                                    value={model.storageLimit}
                                    onChange={this
                                        .updatePlaceStorageLimit
                                        .bind(this)}/>
                              </div>*/}
                          </Grid>
                        </div>
                      )}
                    </div>
                  </Grid>

                  <Grid item={true} xs={4} className="modal-sidebar">
                    <div className={classes.listHead}>Members</div>
                    <div className="place-members">{this.getMembersItems()}</div>
                  </Grid>
                </Grid>
              )}
              {reportTab && (
                <div className="reports">
                  <RelatedChartCards
                    title={[['Posts'], ['Comments']]}
                    direction="vertical"
                    params={{ id: place._id }}
                    dataType={[[ReportType.PlacePost], [ReportType.PlaceComment]]}
                    syncId="place"
                    color={[['#e74c3c'], ['#f1c40f']]}
                    measure={[MeasureType.NUMBER, MeasureType.NUMBER]}
                  />
                </div>
              )}
              <Dialog open={this.state.showEdit} onClose={() => this.setState({ showEdit: false })}>
                <DialogTitle id="alert-dialog-title">Remove Member</DialogTitle>
                <DialogContent>
                  <form ref={this.form} onSubmit={this.applyChanges}>
                    {this.state.editTarget === EditableFields.creators && (
                      <TextField
                        label="Maximum Number of Managers "
                        placeholder="3"
                        type="number"
                        required={true}
                        onChange={this.handleFormChange}
                        value={placeClone.limits.creators}
                      />
                    )}
                    {this.state.editTarget === EditableFields.key_holders && (
                      <TextField
                        label="Maximum Number of Members "
                        placeholder="250"
                        type="number"
                        required={true}
                        onChange={this.handleFormChange}
                        value={placeClone.limits.key_holders}
                      />
                    )}
                    {this.state.editTarget === EditableFields.childs && (
                      <TextField
                        label="Maximum Number of Children "
                        placeholder="10"
                        type="number"
                        required={true}
                        onChange={this.handleFormChange}
                        value={placeClone.limits.childs}
                      />
                    )}
                    {this.state.editTarget === EditableFields.size && (
                      <FormControl required={true}>
                        <InputLabel htmlFor="limits.size">Place Storage Siz</InputLabel>
                        <Select
                          value={placeClone.limits.size}
                          onChange={this.handleFormChange}
                          inputProps={{
                            name: 'limits.size',
                            id: 'limits.size',
                          }}
                        >
                          <MenuItem value={0}>Unlimited</MenuItem>
                          <MenuItem value={536870912}>500 MB</MenuItem>
                          <MenuItem value={1073741824}>1 GB</MenuItem>
                          <MenuItem value={2147483648}>2 GB</MenuItem>
                          <MenuItem value={5368709120}>5 GB</MenuItem>
                          <MenuItem value={5368709120 * 2}>10 GB</MenuItem>
                          <MenuItem value={5368709120 * 4}>20 GB</MenuItem>
                          <MenuItem value={5368709120 * 10}>50 GB</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                    {/* 'Place storage size is required!' */}
                  </form>
                </DialogContent>
                <DialogActions>
                  <Button key="cancel" onClick={() => this.setState({ showEdit: false })}>
                    Cancel
                  </Button>
                  {!this.state.updateProgress && (
                    <Button variant="contained" color="primary" onClick={this.applyChanges}>
                      Save
                    </Button>
                  )}
                </DialogActions>
              </Dialog>
              <AddMemberModal
                members={this.state.model.members}
                addMembers={this.addMembers}
                onClose={this.toggleAddMemberModal}
                visible={this.state.visibleAddMemberModal}
              />
              <SendMessageModal
                onClose={this.sendMessageToggle}
                visible={this.state.sendMessageVisible}
                target={this.state.place._id}
              />
              <Dialog
                open={this.state.visibleRemoveMember}
                onClose={this.toggleRemoveMemberModal()}
              >
                <DialogTitle id="alert-dialog-title">Remove Member</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Do you want to remove this user from "<b>{this.state.place.name}</b>" Place?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={this.toggleRemoveMemberModal()}
                  >
                    Cancel
                  </Button>
                  ,
                  <Button variant="contained" color="primary" onClick={this.removeMember}>
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>
            </DialogContent>
          </Dialog>
        )}
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
      marginTop: theme.spacing(0),
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
)(withSnackbar(PlaceModal));
