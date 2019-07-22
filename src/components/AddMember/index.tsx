import IUser from '../../interfaces/IUser';
import _ from 'lodash';
import * as React from 'react';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';

import { IcoN } from '../icon/index';
import UserAvatar from '../avatar/index';
import AccountApi from '../../api/account';
import C_USER_SEARCH_AREA from '../../consts/CUserSearchArea';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Dialog,
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

interface IProps {
  visible: boolean;
  classes: any;
  onClose?: () => void;
  addMembers: (members: IUser[]) => void;
  members?: IUser[];
}

interface IStates {
  visible: boolean;
  members: Array<IUser>;
  suggests: Array<IUser>;
  selectedUsers: Array<IUser>;
  query: string;
  hasMore: boolean;
}

class AddMemberModal extends React.Component<IProps, IStates> {
  private accountApi: AccountApi = new AccountApi();
  private searchIt: any = _.debounce(this.searchAccounts, 512);
  private searchSetting: any = {
    skip: 0,
    limit: 10,
    keyword: '',
  };
  constructor(props: any) {
    super(props);
    this.state = {
      visible: false,
      members: this.props.members || [],
      suggests: [],
      selectedUsers: [],
      query: '',
      hasMore: false,
    };
  }

  componentDidMount() {
    this.searchAccounts('');
  }

  updateSuggestions(users?: IUser[], callback?: any) {
    if (users === undefined) {
      users = this.state.suggests;
    }
    let list = _.differenceBy(users, this.state.selectedUsers, '_id');
    list = _.differenceBy(list, this.state.members, '_id');
    list = _.uniqBy(list, '_id');
    if (_.isFunction(callback)) {
      callback(list);
    }
    this.setState({
      suggests: list,
    });
  }

  fullFillList(accounts: any[], list: any[]) {
    if (accounts.length >= this.searchSetting.limit) {
      this.setState({
        hasMore: true,
      });
      if (list.length === 0) {
        this.loadEvenMore();
      }
    } else {
      this.setState({
        hasMore: false,
      });
    }
  }

  loadEvenMore = () => {
    this.searchSetting.skip += this.searchSetting.limit;
    this.accountApi
      .search(
        this.searchSetting.keyword,
        this.searchSetting.limit,
        C_USER_SEARCH_AREA.ADMIN,
        this.searchSetting.skip
      )
      .then((data: any) => {
        this.updateSuggestions(this.state.suggests.concat(data.accounts), (list: any) => {
          this.fullFillList(data.accounts, list);
        });
      });
  };

  searchAccounts(keyword: string) {
    this.searchSetting.skip = 0;
    this.accountApi
      .search(keyword, this.searchSetting.limit, C_USER_SEARCH_AREA.ADMIN, this.searchSetting.skip)
      .then((data: any) => {
        this.searchSetting.keyword = keyword;
        this.updateSuggestions(data.accounts, (list: any) => {
          this.fullFillList(data.accounts, list);
        });
      });
  }

  updateSearchQuery = (event: any) => {
    var keyword = event.currentTarget.value;
    this.setState(
      {
        query: keyword,
      },
      () => {
        this.searchIt(keyword);
      }
    );
  };

  componentWillReceiveProps(props: any) {
    this.setState({
      visible: props.visible,
      members: props.members,
    });
  }

  addThisMember(user: IUser) {
    const selectedUsers = this.state.selectedUsers;
    const index = _.findIndex(selectedUsers, {
      _id: user._id,
    });
    if (index === -1) {
      selectedUsers.push(user);
      this.setState(
        {
          selectedUsers: selectedUsers,
        },
        () => {
          this.updateSuggestions(this.state.suggests);
        }
      );
    }
  }

  removeThisMember(user: IUser | string) {
    let _id: string;
    if (_.isObject(user)) {
      _id = user._id;
    } else {
      _id = user;
    }
    const users = this.state.selectedUsers;
    const index = _.findIndex(users, {
      _id,
    });
    if (index > -1) {
      users.splice(index, 1);
      this.setState(
        {
          selectedUsers: users,
        },
        () => {
          this.searchAccounts(this.state.query);
        }
      );
    }
  }

  getSuggests() {
    const list = this.state.suggests.map((u: IUser) => {
      return (
        <li key={u._id + 'ss'}>
          <UserAvatar user={u} borderRadius="16px" size={32} avatar></UserAvatar>
          <div className="user-detail">
            <UserAvatar user={u} name size={22} className="uname"></UserAvatar>
            <UserAvatar user={u} id size={18} className="uid"></UserAvatar>
          </div>
          <div className="filler" />
          <div className="add-button" onClick={this.addThisMember.bind(this, u)}>
            Add
          </div>
        </li>
      );
    });
    return (
      <ul className="suggests">
        {list}
        <li key={'add_member_load_more'}>
          <Button variant="outlined" color="secondary" onClick={this.loadEvenMore}>
            Load More...
          </Button>
        </li>
      </ul>
    );
  }

  getSelectedUsers() {
    const list = this.state.selectedUsers.map((u: IUser) => (
      <li key={u._id} onClick={this.removeThisMember.bind(this, u)}>
        <UserAvatar user={u} borderRadius="16px" size={24} avatar={true} />
        <UserAvatar user={u} name={true} size={22} className="uname" />
      </li>
    ));
    return <ul className="selecteds">{list}</ul>;
  }

  handleCancel = () => {
    this.props.onClose && this.props.onClose();
  };

  addMembers = () => {
    this.props.addMembers(
      _.merge(_.clone(this.state.selectedUsers), {
        admin: false,
      })
    );
    this.props.onClose && this.props.onClose();
    this.setState({
      selectedUsers: [],
      query: '',
    });
    this.searchAccounts('');
  };

  render() {
    const { classes } = this.props;
    return (
      <Dialog open={this.state.visible} onClose={this.handleCancel} fullWidth={true} maxWidth="xs">
        <DialogTitle>
          <Grid className={classes.header} container={true}>
            <div className={classes.close} onClick={this.handleCancel}>
              <IcoN size={24} name={'xcross24'} />
            </div>
            <Typography className={classes.head} variant="h6" component="h4">
              Add Member
            </Typography>
          </Grid>
        </DialogTitle>
        <DialogContent>
          {this.getSelectedUsers()}
          <TextField
            id="name"
            autoComplete="off"
            fullWidth={true}
            label="Name or Username"
            value={this.state.query}
            onChange={this.updateSearchQuery}
          />
          {this.getSuggests()}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" fullWidth={true} onClick={this.addMembers}>
            add {this.state.selectedUsers.length} Members
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles((theme: Theme) =>
  createStyles({
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
  })
)(AddMemberModal);
