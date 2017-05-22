import * as React from 'react';
import {
    Icon,
    Table,
    Dropdown,
    Card,
    Menu,
    Checkbox,
    Popover,
    Button,
    notification,
    Pagination
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import Account from '../../Account';
import {IAccount} from '../../interfaces/IAccount';
import IUnique from '../../interfaces/IUnique';
import IPerson from '../../interfaces/IPerson';
import AccountApi from '../../../../api/account/account';
import UserAvatar from '../../../../components/avatar/index';
import IEnableRequest from '../../../../api/account/interfaces/IEnableRequest';
import IDisableRequest from '../../../../api/account/interfaces/IDisableRequest';
import IPromoteRequest from '../../../../api/account/interfaces/IPromoteRequest';
import IDemoteRequest from '../../../../api/account/interfaces/IDemoteRequest';
import FilterGroup from '../../FilterGroup';
import View from '../View/index';

interface IListProps {
    counters : any;
    filter : FilterGroup;
}

interface IListState {
    users : IPerson[];
    viewAccount : boolean;
    chosen : IAccount;
}

class List extends React.Component < IListProps,
IListState > {

    const dataColumns = {
        'name': 'Name',
        '_id': 'User ID',
        'access_places': 'Member in Place',
        'joined_on': 'Joined Date',
        'phone': 'Phone',
        'gender': 'Gender',
        'dob': 'Date of Birth',
        'searchable': 'Searchable',
        'disabled': 'Status'
    };

    const genders = {
        'o': 'Other',
        'f': 'Female',
        'm': 'Male'
    };

    COLUMNS_STORAGE_KEY = 'ronak.nested.admin.accounts.columns';
    PAGE_SIZE = 10;

    // columns Render Handlers

    nameRender = (text, user, index) => <UserAvatar avatar name size='32' user={user}/>;
    idRender = (text, user, index) => <a onClick={() => this.onItemClick(user)}>{text}</a>;

    placesRender = (text, user, index) => user.access_places
        ? user.access_places.length
        : '-';
    joinedRender = (text, user, index) => {
        const value = moment(user.joined_on, 'YYYY-MM-DD');
        if (value.isValid()) {
            return value.format('YYYY[/]MM[/]DD HH:mm A');
        } else {
            return '-';
        }
    }
    phoneRender = (text, user, index) => text;
    genderRender = (text, user, index) => {
        return this.genders[user.gender] || '-';
    }
    disabledRender = (text, user, index) => user.disabled
        ? 'Disabled'
        : 'Enabled';
    dobRender = (text, user, index) => {
        const value = moment(user.joined_on, 'YYYY-MM-DD');
        if (value.isValid()) {
            return value.format('YYYY[/]MM[/]DD');
        } else {
            return '-';
        }
    }
    searchableRender = (text, user, index) => {
        if (user.privacy && _.has(user.privacy, 'searchable')) {
            return user.privacy.searchable
                ? 'Yes'
                : 'No';
        }

        return '-';
    }
    enable = (user) => {
        this.accountApi.enable({account_id: user._id}).then((result) => {
            user.disabled = false;
            notification.success({message: 'Enabled', description: `"${user._id}" is enabled now.`});
            this.setState({
                users: _.clone(this.state.accounts)
            });
        });
    }
    disable = (user) => {
        this.accountApi.disable({account_id: user._id}).then((result) => {
            user.disabled = true;
            notification.warning({message: 'Disabled', description: `"${user._id}" is disabled now.`});
            this.setState({
                users: _.clone(this.state.accounts)
            });
        });
    }
    promote = (user) => {
        this.accountApi.promote({account_id: user._id}).then((result) => {
            user.admin = true;
            notification.success({message: 'Promoted', description: `"${user._id}" can access Nested Administrator.`});
            this.setState({
                users: _.clone(this.state.accounts)
            });
        });
    }
    demote = (user) => {
        this.accountApi.demote({account_id: user._id}).then((result) => {
            user.admin = false;
            notification.warning({message: 'Demoted', description: `"${user._id}" is no longer able to access Nested Administrator.`});
            this.setState({
                users: _.clone(this.state.accounts)
            });
        });
    }
    optionsRender = (text, user, index) => {
        const optionsMenu = (
            <Menu>
                {user.disabled && <Menu.Item key='0'>
                    <Icon type='check'/>
                    <a href='#' onClick={() => this.enable(user)}>Enable</a>
                </Menu.Item>
}
                {!user.disabled && <Menu.Item key='1'>
                    <Icon type='close'/>
                    <a href='#' onClick={() => this.disable(user)}>Disable</a>
                </Menu.Item>
}
                {!user.admin && <Menu.Item key='2'>
                    <Icon type='arrow-up'/>
                    <a href='#' onClick={() => this.promote(user)}>Promote</a>
                </Menu.Item>
}
                {user.admin && <Menu.Item key='3'>
                    <Icon type='arrow-down'/>
                    <a href='#' onClick={() => this.demote(user)}>Demote</a>
                </Menu.Item>
}
                <Menu.Item key='4'>
                    <Icon type='lock'/>Set Password
                </Menu.Item>
            </Menu>
        );

        return (
            <Dropdown overlay={optionsMenu} trigger={['click']}>
                <a className='ant-dropdown-link' href='#'>
                    <Icon type='ellipsis'/>
                </a>
            </Dropdown>
        );
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }

    onItemClick = (account) => {
        this.setState({chosen: account, viewAccount: true});
    }

    onCloseView = () => {
        this.setState({viewAccount: false});
    }

    onColumnCheckChange = (item) => {
        item.checked = !item.checked;
        const dataColumns = _.clone(this.state.dataColumns);
        this.setState({dataColumns});
        if (item.checked) {
            this.insertColumn(item.key);
        } else {
            this.removeColumn(item.key);
        }
    }

    insertColumn = (key) => {
        if (_.some(this.allColumns, {key: key})) {
            this.setState({
                columns: [
                    ...this.state.columns,
                    key
                ]
            });
        }
    }

    removeColumn = (key) => {
        this.setState({
            columns: _.without(this.state.columns, key)
        });
    }

    constructor(props : IListProps) {

        this.allColumns = [
            {
                title: this.dataColumns.name,
                dataIndex: 'name',
                key: 'name',
                render: this.nameRender,
                index: 0
            }, {
                title: this.dataColumns._id,
                dataIndex: '_id',
                key: '_id',
                render: this.idRender,
                index: 1
            }, {
                title: this.dataColumns.access_places,
                dataIndex: 'access_places',
                key: 'access_places',
                render: this.placesRender,
                index: 2
            }, {
                title: this.dataColumns.joined_on,
                dataIndex: 'joined_on',
                key: 'joined_on',
                render: this.joinedRender,
                index: 3
            }, {
                title: this.dataColumns.phone,
                dataIndex: 'phone',
                key: 'phone',
                render: this.phoneRender,
                index: 4
            }, {
                title: this.dataColumns.gender,
                dataIndex: 'gender',
                key: 'gender',
                render: this.genderRender,
                index: 5
            }, {
                title: this.dataColumns.dob,
                dataIndex: 'dob',
                key: 'dob',
                render: this.dobRender,
                index: 6
            }, {
                title: this.dataColumns.disabled,
                dataIndex: 'disabled',
                key: 'disabled',
                render: this.disabledRender,
                index: 7
            }, {
                title: this.dataColumns.searchable,
                dataIndex: 'searchable',
                key: 'searchable',
                render: this.searchableRender,
                index: 7
            }
        ];

        const storedColumns = window.localStorage.getItem(this.COLUMNS_STORAGE_KEY);
        const storedColumnsList = storedColumns
            ? _.split(storedColumns, ',')
            : [];
        const tableColumns = storedColumnsList.length > 0
            ? storedColumnsList
            : _(this.allColumns).take(5).map('key').value();

        this.state = {
            users: [],
            columns: tableColumns,
            dataColumns: [],
            selectedRowKeys: [],
            currentPage: 1,
            loading: false,
            filter: props.filter,
            counters: {
                enabled_accounts: 0,
                disabled_accounts: 0
            },
            viewAccount: false,
            chosen: {}
        };

        this.state.dataColumns = _.map(this.dataColumns, (value, key) => {
            return {
                key: key,
                title: value,
                checked: _.includes(this.state.columns, key)
            };
        });
        this.onPageChange = this.onPageChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.accountApi = new AccountApi();
        this.load(1, this.PAGE_SIZE, FilterGroup.Total);
    }

    componentWillReceiveProps(nextProps : IListProps) {
      if (_.has(nextProps, 'filter')) {
        this.load(1, this.PAGE_SIZE, nextProps.filter);
      }
    }

    onPageChange(value : Number) {
        this.load(value, this.PAGE_SIZE, this.props.filter);
    }

    handleChange(account : IPerson) {
      const accounts = _.clone(this.state.accounts);
      const index = _.findIndex(accounts, { _id: account._id });
      if (index === -1) {
          return;
      }

      accounts.splice(index, 1, account);
      this.setState({
          accounts: accounts
      });
    }

    render() {
        window.localStorage.setItem(this.COLUMNS_STORAGE_KEY, _.join(this.state.columns, ','));
        const optionsPopover = (
            <ul>
                {_(this.state.dataColumns).orderBy(['index']).map((item) => <li key={item.key}>
                    <Checkbox onChange={() => this.onColumnCheckChange(item)} checked={item.checked}>{item.title}</Checkbox>
                </li>).value()
}
            </ul>
        );

        const optionsTitle = (
            <Popover content={optionsPopover} placement='bottom'>
                <Icon type='setting'/>
            </Popover>
        );

        const columns = _(this.allColumns).filter((column) => _.includes(this.state.columns, column.key)).orderBy(['index']).concat([
            {
                title: optionsTitle,
                dataIndex: 'options',
                key: 'options',
                render: this.optionsRender
            }
        ]).value();

        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onSelectChange
        };

        let total = 0;
        switch (this.props.filter) {
          case FilterGroup.Active:
            total = this.props.counters.enabled_accounts || 0;
            break;
          case FilterGroup.Deactive:
            total = this.props.counters.disabled_accounts || 0;
            break;
          default:
            total = (this.props.counters.enabled_accounts || 0) + (this.props.counters.disabled_accounts || 0);
            break;
        }
        return (
            <Card>
                <Table pagination={{
                    total: total,
                    current: this.state.currentPage,
                    onChange: this.onPageChange
                }} rowKey='_id' rowSelection={rowSelection} columns={columns} dataSource={this.state.accounts} size='middle' className='nst-table' scroll={{
                    x: 960
                }} loading={this.state.loading}/>
                {
                  this.state.chosen && this.state.chosen._id &&
                  <View account={this.state.chosen} visible={this.state.viewAccount} onChange={this.handleChange} onClose={this.onCloseView}/>
                }
            </Card>
        );
    }

    private load(page: Number, size: Number, filter: FilterGroup) {
        this.setState({loading: true});
        page = page || this.state.currentPage;
        const skip = (page - 1) * size;
        let filterValue = null;
        switch (filter) {
            case FilterGroup.Active:
                filterValue = 'users_enabled';
                break;
            case FilterGroup.Deactive:
                filterValue = 'users_disabled';
                break;
            default:
                filterValue = 'users';
                break;

        }

        return this.accountApi.getAll({skip: skip, limit: size, filter: filterValue}).then((result) => {
            this.setState({accounts: result.accounts, loading: false, currentPage: page});
        }).catch((error) => {
            this.setState({loading: false, page: page});
            notification.error('Accounts', 'An error has occured while trying to get ');
        });
    }
}

export default List;
