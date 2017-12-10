import * as React from 'react';
import {
    Icon,
    Row,
    Table,
    Dropdown,
    Card,
    Menu,
    Checkbox,
    Popover,
    Button,
    notification,
    Pagination,
    Modal,
    Badge
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
import {IcoN} from '../../../../components/icon/index';
import IUser from '../../../../api/account/interfaces/IUser';
import Arrow from '../../../../components/Arrow/index';

export interface ISort {
    joined_on: boolean;
    birthday: boolean;
    user_id: boolean;
    email: boolean;
}

interface IListProps {
    counters: any;
    notifyChildrenUnselect: boolean;
    filter: FilterGroup;
    onChange: any;
    query: string;
    updatedAccounts: number;
    toggleSelected: (user:IPerson) => {};
}

interface IListState {
    users: IPerson[];
    accounts: IPerson[];
    viewAccount: boolean;
    chosen: IAccount;
    query: string;
    dataColumns: Array< any >;
    columns: Array< any >;
    sortedInfo: ISort;
    sortKey: any;
}

class List extends React.Component <IListProps,
    IListState> {
    updateQueryDeb = _.debounce(this.updateQuery, 512);
    dataColumns = {
        'name': 'Name',
        '_id': 'User ID',
        'access_places': 'Member in',
        'joined_on': 'Joined Date',
        'phone': 'Phone',
        'gender': 'Gender',
        'dob': 'Date of Birth',
        'searchable': 'Searchable',
        'disabled': 'Status'
    };

    genders = {
        'o': 'Other',
        'f': 'Female',
        'm': 'Male'
    };

    COLUMNS_STORAGE_KEY = 'ronak.nested.admin.accounts.columns';
    PAGE_SIZE = 10;

    checkboxClick  = (event) => {
        event.preventDefault();
        event.stopPropagation();
    }

    onCheckboxChange  = (user: IPerson) => {
        user.isChecked = !user.isChecked;
        this.props.toggleSelected(user);
    }

    // columns Render Handlers
    nameRender = (text, user: IPerson, index) => {
        return (
            <Row type='flex' align='middle' onClick={this.checkboxClick.bind(this)}>
                <Checkbox onChange={() => this.onCheckboxChange(user)}
                    checked={user.isChecked}/>
                    <UserAvatar avatar name size='24' user={user}/>
            </Row>
        );
    }
    idRender = (text, user, index) => text;

    placesRender = (text, user, index) => {
        return (
            <div className='user-member-place'>
                {user.bookmarked_places.length > 0 && <IcoN size={16} name={'placesRelation16'}/>}
                {user.bookmarked_places.length  > 0
                ? user.bookmarked_places.length
                : '-'}
            </div>
        );
    }

    joinedRender = (text, user, index) => {
        const value = moment(user.joined_on);
        let date = '-';
        let time = '-';
        if (value.isValid()) {
            date = value.format('YYYY[/]MM[/]DD');
            time = value.format('HH:mm A');
        }
        return (<div className='date'>{date} <span>{time}</span></div>);
    }
    phoneRender = (text, user: IPerson, index) => text ? '+' + text : '';
    genderRender = (text, user: IPerson, index) => {
        return this.genders[user.gender] || '-';
    }
    disabledRender = (text, user: IPerson, index) => {
        if (user.disabled) {
            return (<div className='deactive'>
                <IcoN size={16} name={'circle16'}/>Deactive
            </div>);
        } else {
            return (<div className='active'>
                <IcoN size={16} name={'circle16'}/>Active
            </div>);
        }
    }
    dobRender = (text, user: IPerson, index) => {
        const value = moment(user.joined_on);
        if (value.isValid()) {
            return value.format('YYYY[/]MM[/]DD');
        } else {
            return '-';
        }
    }
    searchableRender = (text, user: IPerson, index) => {
        if (user && _.has(user, 'searchable')) {
            return user.searchable
                ? <div className='search-cell'><IcoN size={16} name={'search16'}/></div>
                : <div className='search-cell'><IcoN size={16} name={'nonsearch6'}/></div>;
        }

        return '-';
    }
    enable = (user: IPerson) => {
        this.accountApi.enable({account_id: user._id}).then((result) => {
            this.props.onChange();
            user.disabled = false;
            this.handleChange(user);
            notification.success({message: 'Activated', description: `"${user._id}" is enabled now.`});
        });
    }
    disable = (user: IPerson) => {
        this.accountApi.disable({account_id: user._id}).then((result) => {
            this.props.onChange();
            user.disabled = true;
            this.handleChange(user);
            notification.warning({message: 'Deactivated', description: `"${user._id}" is disabled now.`});
        });
    }
    // optionsRender = (text, user, index) => {
    //     const optionsMenu = (
    //         <Menu>
    //             {user.disabled && <Menu.Item key='0'>
    //                 <Icon type='check'/>
    //                 <a href='#' onClick={() => this.enable(user)}>Activate</a>
    //             </Menu.Item>
    //             }
    //             {!user.disabled && <Menu.Item key='1'>
    //                 <Icon type='close'/>
    //                 <a href='#' onClick={() => this.disable(user)}>Deactivate</a>
    //             </Menu.Item>
    //             }
    //             <Menu.Item key='2'>
    //                 <Icon type='eye-o'/>
    //                 <a href='#' onClick={() => this.onItemClick(user)}>View</a>
    //             </Menu.Item>
    //         </Menu>
    //     );
    //
    //     return (
    //         <Dropdown overlay={optionsMenu} trigger={['click']}>
    //             <a className='ant-dropdown-link' href='#'>
    //                 <Icon type='ellipsis'/>
    //             </a>
    //         </Dropdown>
    //     );
    // }

    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }

    onItemClick = (account) => {
        this.setState({chosen: account, viewAccount: true});
    }

    onCloseView = () => {
        this.setState({chosen: null, viewAccount: false});
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

    constructor(props: IListProps) {
        super(props);

        this.state = {
            users: [],
            columns: [],
            dataColumns: [],
            selectedRowKeys: [],
            currentPage: 1,
            loading: false,
            filter: props.filter,
            counters: {
                enabled_accounts: 0,
                disabled_accounts: 0
            },
            sortedInfo: {
                order: 'ascend',
                columnKey: '_id',
            },
            viewAccount: false,
            chosen: {},
            sortKey: null,
        };


        this.onPageChange = this.onPageChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.accountApi = new AccountApi();
        this.load(1, this.PAGE_SIZE, FilterGroup.Total);
    }

    updateQuery(q: string) {
        this.setState({
            query: q
        },  () => {
            this.load(1, this.PAGE_SIZE, this.props.filter);
        });
    }

    componentWillReceiveProps(nextProps: IListProps) {
        if (_.has(nextProps, 'filter') && nextProps.filter !== this.props.filter) {
            this.load(1, this.PAGE_SIZE, nextProps.filter);
        }
        if (nextProps.updatedAccounts !== this.props.updatedAccounts) {
            this.load(1, this.PAGE_SIZE, nextProps.filter);
        } else if (nextProps.query !== this.props.query) {
            this.updateQueryDeb(nextProps.query);
        }
        if(nextProps.notifyChildrenUnselect !== this.props.notifyChildrenUnselect) {
            var accountsClone: IPerson[] = _.clone(this.state.accounts);
            accountsClone.forEach((user: IPerson) => {
               user.isChecked = false;
            });
            this.setState({
                accounts: accountsClone
            });
        }
    }

    onPageChange(value: Number) {
        this.load(value, this.PAGE_SIZE, this.props.filter);
    }

    handleSortChange(pagination: any, filters: any, sorter: any) {
        if(sorter.columnKey) {
            this.setState({
                sortedInfo: {
                    order: sorter.order,
                    columnKey: sorter.columnKey,
                }
            });
        }
    }

    handleChange(account: IPerson) {
        this.props.onChange();
        const accounts = _.clone(this.state.accounts);
        const index = _.findIndex(accounts, {_id: account._id});
        if (index === -1) {
            return;
        }

        accounts.splice(index, 1, account);
        this.setState({
            accounts: accounts
        });
    }

    onSortChanged(key: string) {
        let sort = this.state.sortedInfo;
        sort[key] = !sort[key];
        this.setState({
            sortedInfo: sort,
            sortKey: key,
        }, () => {
            this.load();
        });
    }

    render() {
        let sortedInfo = this.state.sortedInfo;
        const allColumns = [
            {
                title: this.dataColumns.name,
                dataIndex: 'name',
                key: 'name',
                render: this.nameRender,
                index: 0,
            }, {
                title: (
                    <span>{this.dataColumns._id}
                        <Arrow rotate={sortedInfo.user_id === false ? '0' : '180'}
                               onClick={this.onSortChanged.bind(this, 'user_id')}/>
                    </span>),
                dataIndex: '_id',
                key: '_id',
                render: this.idRender,
                index: 1,
                width: 152,
            }, {
                title: this.dataColumns.access_places,
                dataIndex: 'access_places',
                key: 'access_places',
                render: this.placesRender,
                index: 2,
                width: 102
            }, {
                title: this.dataColumns.searchable,
                dataIndex: 'searchable',
                key: 'searchable',
                render: this.searchableRender,
                index: 3,
                width: 128,
            }, {
                title: this.dataColumns.phone,
                dataIndex: 'phone',
                key: 'phone',
                render: this.phoneRender,
                index: 4,
                width: 136,
            }, {
                title: (
                    <span>{this.dataColumns.joined_on}
                        <Arrow rotate={sortedInfo.joined_on === false ? '0' : '180'}
                               onClick={this.onSortChanged.bind(this, 'joined_on')}/>
                    </span>),
                dataIndex: 'joined_on',
                key: 'joined_on',
                render: this.joinedRender,
                index: 5,
                width: 152,
            }, {
                title: this.dataColumns.disabled,
                dataIndex: 'disabled',
                key: 'disabled',
                render: this.disabledRender,
                index: 6,
                width: 116,
            }
        ];

        // {
        //     title: this.dataColumns.gender,
        //     dataIndex: 'gender',
        //     key: 'gender',
        //     render: this.genderRender,
        //     index: 7
        // }, {
        //     title: this.dataColumns.dob,
        //     dataIndex: 'dob',
        //     key: 'dob',
        //     render: this.dobRender,
        //     index: 8
        // }

        const storedColumns = window.localStorage.getItem(this.COLUMNS_STORAGE_KEY);
        const storedColumnsList = storedColumns
            ? _.split(storedColumns, ',')
            : [];
        const tableColumns = storedColumnsList.length > 0
            ? storedColumnsList
            : _(allColumns).take(7).map('key').value();

        const dataColumns = _.map(this.dataColumns, (value, key) => {
            return {
                key: key,
                title: value,
                checked: _.includes(tableColumns, key)
            };
        });
        window.localStorage.setItem(this.COLUMNS_STORAGE_KEY, _.join(tableColumns, ','));
        const columns = _(allColumns).filter((column) => _.includes(tableColumns, column.key)).orderBy(['index']).value();

        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onSelectChange
        };

        let total = 10;
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

        if (total < this.PAGE_SIZE) {
            total = this.PAGE_SIZE;
        }
        console.log(total);
        return (
            <div>
                <Table
                    onRowClick={(user) => {
                        this.onItemClick(user);
                    }}
                    pagination={{
                        total: total,
                        current: this.state.currentPage,
                        onChange: this.onPageChange
                    }}
                    rowKey='_id'
                    columns={columns}
                    dataSource={this.state.accounts}
                    onChange={this.handleSortChange.bind(this)}
                    size='middle nst-table' scroll={{
                    x: 960
                }} loading={this.state.loading}/>
                {
                    this.state.viewAccount &&
                    <View account={this.state.chosen} visible={this.state.viewAccount} onChange={this.handleChange}
                          onClose={this.onCloseView}/>
                }
            </div>
        );
    }

    private load(page?: Number, size?: Number, filter?: FilterGroup) {
        this.setState({loading: true});
        page = page || this.state.currentPage;
        size = size || this.size;
        const skip = (page - 1) * size;
        let filterValue = null;
        switch (filter) {
            case FilterGroup.Active:
                filterValue = 'users_enabled';
                break;
            case FilterGroup.Deactive:
                filterValue = 'users_disabled';
                break;
            case FilterGroup.Searchable:
            case FilterGroup.NonSearchable:
            case FilterGroup.NotVerifiedPhone:
            default:
                filterValue = 'users';
                break;

        }

        return this.accountApi.getAll({
            skip: skip,
            limit: size,
            filter: filterValue,
            keyword: this.state.query || '',
            sort: (this.state.sortedInfo[this.state.sortKey] ? '-' : '') + this.state.sortKey,
        }).then((result) => {
            this.setState({accounts: result.accounts, loading: false, currentPage: page});
        }).catch((error) => {
            this.setState({loading: false, page: page});
            notification.error('Accounts', 'An error has occured while trying to get ');
        });
    }
}

export default List;
