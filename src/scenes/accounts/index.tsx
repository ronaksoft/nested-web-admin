import _ from 'lodash';
import * as React from 'react';
import moment from 'moment';
import IUser from '../../interfaces/IUser';
import IPerson from '../../interfaces/IPerson';
import appLoader from '../../components/Loading/app-loading';
import AccountApi from '../../api/account';
import Loading from '../../components/Loading/index';
import UserAvatar from '../../components/avatar/index';
import tableIcons from '../../components/table-icons/index';
import AccountListSort from '../../consts/AccountListSort';
import FilterGroup from '../../consts/FilterGroup';
import View from './components/View/index';
import { IcoN } from '../../components/icon';
import { Typography } from '@material-ui/core';
import MaterialTable, { Column } from 'material-table';
import Create from './components/Create/index';

import SystemApi from '../../api/system/index';
import { withSnackbar } from 'notistack';
import Lock from '@material-ui/icons/Lock';
import VerifiedUser from '@material-ui/icons/VerifiedUser';
import Block from '@material-ui/icons/Block';

export interface ICounters {
  enabled_accounts: number;
  disabled_accounts: number;
  searchable_accounts: number;
  nonsearchable_accounts: number;
}
export interface ISort {
  joined_on: boolean;
  birthday: boolean;
  user_id: boolean;
  email: boolean;
}
export interface ISortedInfo {
  order: string;
  columnKey: string;
}

interface IListProps {
  enqueueSnackbar: (
    message: React.ReactNode | string,
    options?: any
  ) => string | number | null | undefined;
  closeSnackbar: () => void;
}

interface IListState {
  users: IPerson[];
  accounts: IPerson[];
  loading: boolean;
  viewAccount: boolean;
  showCreate: boolean;
  chosen?: IPerson;
  selectedRowKeys: any[];
  sortedInfo: ISortedInfo;
  licenseMaxUsers: number;
  sortKey: any;
  counters: any;
}

class Accounts extends React.Component<IListProps, IListState> {
  private accountApi: AccountApi = new AccountApi();
  private SystemApi: SystemApi = new SystemApi();
  private defaultFilter: any = ['true', 'false'];
  private filter: FilterGroup = FilterGroup.Total;
  private tableRef = React.createRef();
  private totalCount: number = 0;

  private genders = {
    o: 'Other',
    f: 'Female',
    m: 'Male',
  };

  private PAGE_SIZE = 10;
  private currentPage: number = 1;
  private query: string = '';

  constructor(props: IListProps) {
    super(props);

    this.state = {
      accounts: [],
      licenseMaxUsers: 0,
      users: [],
      selectedRowKeys: [],
      loading: false,
      showCreate: false,
      counters: {
        enabled_accounts: 0,
        disabled_accounts: 0,
      },
      sortedInfo: {
        order: 'ascend',
        columnKey: '_id',
      },
      viewAccount: false,
      sortKey: null,
    };
  }

  public componentDidMount() {
    this.SystemApi.getLicense()
      .then((result: any) => {
        this.setState({
          licenseMaxUsers: result.license.max_active_users,
        });
      })
      .catch((error: any) => {
        console.log('error', error);
      });

    this.accountApi
      .getCounters()
      .then(counters => {
        this.setState({
          counters,
          loading: false,
        });
      })
      .catch((error: any) => {
        this.setState({
          loading: false,
        });
        this.props.enqueueSnackbar(`An error has occured while trying to get data!`, {
          variant: 'error',
        });
      });
    window.addEventListener(
      'account_updated',
      () => this.reload,
      // () => this.load(this.currentPage, this.PAGE_SIZE, FilterGroup.Total),
      false
    );
    appLoader.hide();
  }

  reload = () => {
    if (
      this.tableRef &&
      this.tableRef.current &&
      typeof (this.tableRef.current as any).onQueryChange === 'function'
    ) {
      (this.tableRef.current as any).onQueryChange();
    }
  };

  componentWillUnmount() {
    window.removeEventListener('account_updated', () => this.reload);
  }

  // columns Render Handlers
  nameRender = (user: IPerson, type) => {
    return (
      <div>
        <UserAvatar avatar={true} name={true} size="24" user={user as IUser} />
      </div>
    );
  };

  placesRender = (user: IPerson, type) => {
    return (
      <div className="user-member-place">
        {user.access_place_ids !== undefined && user.access_place_ids.length > 0 ? (
          <IcoN size={16} name={'placesRelation16'} />
        ) : null}
        {user.access_place_ids !== undefined && user.access_place_ids.length > 0
          ? user.access_place_ids.length
          : ''}
        {user.access_place_ids === undefined &&
          user.bookmarked_places &&
          user.bookmarked_places.length > 0 && <IcoN size={16} name={'placesRelation16'} />}
        {user.access_place_ids === undefined &&
        user.bookmarked_places &&
        user.bookmarked_places.length > 0
          ? user.bookmarked_places.length
          : ''}
        {(user.access_place_ids === undefined ||
          (user.access_place_ids && user.access_place_ids.length === 0)) &&
          (user.bookmarked_places === undefined ||
            (user.bookmarked_places && user.bookmarked_places.length === 0)) &&
          '-'}
      </div>
    );
  };

  joinedRender = (user: IPerson, type) => {
    const value = moment(user.joined_on);
    let date = '-';
    let time = '-';
    if (value.isValid()) {
      date = value.format('YYYY[/]MM[/]DD');
      time = value.format('HH:mm A');
    }
    return (
      <div className="date">
        {date} <span>{time}</span>
      </div>
    );
  };
  phoneRender = (user: IPerson, type) => (user.phone ? '+' + user.phone : '');
  genderRender = (user: IPerson, type) => (user.gender && this.genders[user.gender]) || '-';
  disabledRender = (user: IPerson, type) => {
    if (user.disabled) {
      return (
        <div className="deactive-user">
          <IcoN size={16} name={'circle16'} />
          Deactive
        </div>
      );
    } else {
      return (
        <div className="active-user">
          <IcoN size={16} name={'circle16'} />
          Active
        </div>
      );
    }
  };
  dobRender = (user: IPerson, type) => {
    const value = moment(user.joined_on);
    if (value.isValid()) {
      return value.format('YYYY[/]MM[/]DD');
    } else {
      return '-';
    }
  };
  searchableRender = (user: IPerson, type) => {
    if (user && _.has(user, 'searchable')) {
      return user.searchable ? (
        <div className="search-cell">
          <IcoN size={16} name={'search16'} />
        </div>
      ) : (
        <div className="search-cell">
          <IcoN size={16} name={'nonsearch16'} />
        </div>
      );
    }

    return '-';
  };

  onSelectChange = (selectedRowKeys: any[]) => {
    this.setState({ selectedRowKeys });
  };

  onItemClick = (event, account: IPerson) => {
    this.setState({ chosen: account, viewAccount: true });
  };

  onCloseView = () => {
    this.setState({ chosen: undefined, viewAccount: false });
  };

  resetPassword = (account_id: string) => {
    const action = this.accountApi.edit({
      account_id,
      force_password: true,
    });

    action.then(
      (result: any) => {
        this.props.enqueueSnackbar(`"${account_id}" is forced to change his/her password.`, {
          variant: 'success',
        });
        this.reload();
      },
      (error: any) => {
        this.props.enqueueSnackbar(
          `We were not able to force "${account_id}" to change password!`,
          {
            variant: 'error',
          }
        );
      }
    );
  };

  setLabelManager = (account_id: string) => {
    const action = this.accountApi.edit({
      account_id,
      'authority.label_editor': true,
    });

    action.then(
      (result: any) => {
        this.props.enqueueSnackbar(`"${account_id}" is label manager now.`, {
          variant: 'success',
        });
        this.reload();
      },
      (error: any) => {
        this.props.enqueueSnackbar(`We were not able to set "${account_id}" as label manager!`, {
          variant: 'error',
        });
      }
    );
  };

  setActiveDeactive = (account_id: string, checked: boolean) => {
    const action = checked
      ? this.accountApi.enable({ account_id })
      : this.accountApi.disable({ account_id });

    action.then(
      (result: any) => {
        if (checked) {
          this.props.enqueueSnackbar(`"${account_id}" is active now.`, {
            variant: 'success',
          });
        } else {
          this.props.enqueueSnackbar(`"${account_id}" is not active now.`, {
            variant: 'warning',
          });
        }
        this.reload();
      },
      (error: any) => {
        this.props.enqueueSnackbar(`We were not able to active/deactive "${account_id}"!`, {
          variant: 'error',
        });
      }
    );
  };

  setSearchable = (account_id: string, checked: boolean) => {
    const action = this.accountApi.edit({
      account_id,
      searchable: checked,
    });

    action.then(
      (result: any) => {
        if (checked) {
          this.props.enqueueSnackbar(`"${account_id}" is searchable now.`, {
            variant: 'success',
          });
        } else {
          this.props.enqueueSnackbar(`"${account_id}" is not searchable now.`, {
            variant: 'warning',
          });
        }
        this.reload();
      },
      (error: any) => {
        this.props.enqueueSnackbar(
          `We were not able to searchable/non-searchable "${account_id}"!`,
          {
            variant: 'error',
          }
        );
      }
    );
  };

  openCreate() {
    this.setState({ showCreate: true });
  }

  closeCreate = () => {
    this.setState({ showCreate: false });
  };

  handleChange = (account: IPerson) => {
    const accounts = _.clone(this.state.accounts);
    const index = _.findIndex(accounts, { _id: account._id });
    if (index === -1) {
      return;
    }
    this.reload();
  };

  render() {
    const cellStyle = {
      autoLayout: 'fixed',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    };
    const canCreate =
      this.state.counters.enabled_accounts < this.state.licenseMaxUsers ||
      this.state.licenseMaxUsers === 0;
    const columns: Column[] = [
      {
        title: 'Name',
        filtering: false,
        render: this.nameRender,
        sorting: false,
      },
      {
        title: 'User ID',
        field: '_id',
        filtering: false,
        cellStyle: { ...cellStyle, minWidth: '250px', width: '250px', maxWidth: '250px' },
        headerStyle: { ...cellStyle, minWidth: '250px', width: '250px', maxWidth: '250px' },
      },
      {
        title: 'Member in',
        field: 'access_places',
        filtering: false,
        render: this.placesRender,
        sorting: false,
        cellStyle: { ...cellStyle, minWidth: '120px', width: '120px', maxWidth: '120px' },
        headerStyle: { ...cellStyle, minWidth: '120px', width: '120px', maxWidth: '120px' },
      },
      {
        title: 'Joined Date',
        field: 'joined_on',
        filtering: false,
        render: this.joinedRender,
        cellStyle: { ...cellStyle, minWidth: '200px', width: '200px', maxWidth: '200px' },
        headerStyle: { ...cellStyle, minWidth: '200px', width: '200px', maxWidth: '200px' },
      },
      {
        title: 'Phone',
        filtering: false,
        sorting: false,
        render: this.phoneRender,
        cellStyle: { ...cellStyle, minWidth: '200px', width: '200px', maxWidth: '200px' },
        headerStyle: { ...cellStyle, minWidth: '200px', width: '200px', maxWidth: '200px' },
      },
      {
        title: 'Gender',
        filtering: false,
        field: 'gender',
        sorting: false,
        cellStyle: { ...cellStyle, minWidth: '120px', width: '120px', maxWidth: '120px' },
        headerStyle: { ...cellStyle, minWidth: '120px', width: '120px', maxWidth: '120px' },
        lookup: {
          x: 'Other',
          f: 'Female',
          m: 'Male',
        },
      },
      {
        field: 'dob',
        title: 'Date of Birth',
        filtering: false,
        render: this.dobRender,
        cellStyle: { ...cellStyle, minWidth: '160px', width: '160px', maxWidth: '160px' },
        headerStyle: { ...cellStyle, minWidth: '160px', width: '160px', maxWidth: '160px' },
      },
      {
        field: 'searchable',
        title: 'Searchable',
        type: 'boolean',
        filtering: false,
        sorting: false,
        render: this.searchableRender,
        cellStyle: { ...cellStyle, minWidth: '100px', width: '100px', maxWidth: '100px' },
        headerStyle: { ...cellStyle, minWidth: '100px', width: '100px', maxWidth: '100px' },
      },
      {
        field: 'disabled',
        title: 'Status',
        type: 'boolean',
        sorting: false,
        defaultFilter: this.defaultFilter,
        render: this.disabledRender,
        lookup: {
          true: 'Active Users',
          false: 'Deactive Users',
        },
        cellStyle: { ...cellStyle, minWidth: '200px', width: '200px', maxWidth: '200px' },
        headerStyle: { ...cellStyle, minWidth: '200px', width: '200px', maxWidth: '200px' },
        filterCellStyle: { ...cellStyle, minWidth: '200px', width: '200px', maxWidth: '200px' },
      },
    ];

    switch (this.filter) {
      case FilterGroup.Active:
        this.totalCount = this.state.counters.enabled_accounts || 0;
        break;
      case FilterGroup.Deactive:
        this.totalCount = this.state.counters.disabled_accounts || 0;
        break;
      default:
        this.totalCount =
          (this.state.counters.enabled_accounts || 0) +
          (this.state.counters.disabled_accounts || 0);
        break;
    }

    if (this.totalCount < this.PAGE_SIZE) {
      this.totalCount = this.PAGE_SIZE;
    }
    return (
      <div>
        <div className="scene-head">
          <Typography className="page-head" variant="h5" component="h2">
            Accounts
          </Typography>
        </div>
        <MaterialTable
          icons={tableIcons}
          onRowClick={this.onItemClick}
          tableRef={this.tableRef}
          columns={columns}
          isLoading={this.state.loading}
          components={{
            OverlayLoading: (props: any, context?: any) => (
              <Loading active={true} position="absolute" />
            ),
          }}
          actions={[
            {
              icon: () => <IcoN size={24} name={'cross24'} />,
              tooltip: canCreate
                ? 'Add User'
                : 'You have reached the active members of nested service limit!',
              isFreeAction: true,
              disabled: !canCreate,
              onClick: event => this.openCreate(),
            },
            {
              icon: () => <IcoN size={24} name={'tag24'} />,
              tooltip: 'Label Manager',
              onClick: (event, rowData: IPerson[]) =>
                rowData.forEach(u => this.setLabelManager(u._id)),
            },
            {
              icon: () => <Lock />,
              tooltip: 'Reset Password',
              onClick: (event, rowData: IPerson[]) =>
                rowData.forEach(u => this.resetPassword(u._id)),
            },
            {
              icon: () => <IcoN size={24} name={'search24'} />,
              tooltip: 'Active Searchable',
              onClick: (event, rowData: IPerson[]) =>
                rowData.forEach(u => this.setSearchable(u._id, true)),
            },
            {
              icon: () => <VerifiedUser />,
              tooltip: 'Active Users',
              onClick: (event, rowData: IPerson[]) =>
                rowData.forEach(u => this.setActiveDeactive(u._id, true)),
            },
            {
              icon: () => <Block />,
              tooltip: 'Deactive Users',
              onClick: (event, rowData: IPerson[]) =>
                rowData.forEach(u => this.setActiveDeactive(u._id, false)),
            },
          ]}
          options={{
            selection: true,
            columnsButton: true,
            exportButton: true,
            filtering: true,
            pageSize: 10,
            debounceInterval: 512,
            pageSizeOptions: [10, 50, 100],
            emptyRowsWhenPaging: false,
            showTitle: false,
          }}
          data={async ({ filters, page, pageSize, search, orderBy, orderDirection }) => {
            this.currentPage = page;
            this.PAGE_SIZE = pageSize;
            this.query = search;
            this.filter = FilterGroup.Total;
            if (filters.length > 0) {
              this.defaultFilter =
                filters[0].value.length > 0 ? filters[0].value : this.defaultFilter;
              if (this.defaultFilter.length === 1) {
                if (this.defaultFilter[0] === 'true') {
                  this.filter = FilterGroup.Active;
                } else if (this.defaultFilter[0] === 'false') {
                  this.filter = FilterGroup.Deactive;
                }
              }
            }
            let sort = AccountListSort.uid;
            if (orderBy) {
              switch (orderBy.field) {
                case 'dob':
                  sort =
                    orderDirection === 'desc'
                      ? AccountListSort.birthdayDesc
                      : AccountListSort.birthday;
                  break;
                case 'joined_on':
                  sort =
                    orderDirection === 'desc'
                      ? AccountListSort.joinedOnDesc
                      : AccountListSort.joinedOn;
                  break;
                default:
                  sort = orderDirection === 'desc' ? AccountListSort.uidDesc : AccountListSort.uid;
                  break;
              }
            }
            const data = await this.getData(page, pageSize, this.filter, sort);
            return {
              data,
              page,
              totalCount: this.query ? data.length : this.totalCount,
            };
          }}
        />
        {this.state.viewAccount && this.state.chosen && (
          <View
            account={this.state.chosen}
            visible={this.state.viewAccount}
            onChange={this.handleChange}
            onClose={this.onCloseView}
          />
        )}
        <Create visible={this.state.showCreate} handleClose={this.closeCreate} />
      </div>
    );
  }

  private async getData(
    page?: number,
    size?: number,
    filter?: FilterGroup,
    sort?: AccountListSort
  ) {
    this.setState({ loading: true });
    page = page || this.currentPage;
    size = size || this.PAGE_SIZE;
    const skip = page * size;
    let filterValue: FilterGroup = FilterGroup.Total;
    switch (filter) {
      case FilterGroup.Active:
        filterValue = FilterGroup.Active;
        break;
      case FilterGroup.Deactive:
        filterValue = FilterGroup.Deactive;
        break;
    }

    const result = await this.accountApi.getAll({
      filter: filterValue,
      keyword: this.query || '',
      limit: size,
      skip,
      sort: sort || AccountListSort.uid,
    });
    this.setState({ loading: false });
    return result.accounts;
  }
}

export default withSnackbar(Accounts);
