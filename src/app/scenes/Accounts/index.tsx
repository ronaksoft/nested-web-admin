import * as React from 'react';
import {connect} from 'react-redux';
import Filter from '../../components/Filter/index';
import BarMenu from '../../components/Filter/BarMenu';
import Options from './components/Options/index';
import List from './components/List/index';
import {Row, Col, notification, Input} from 'antd';
import {IcoN} from '../../components/icon/index';
import AccountApi from '../../api/account/account';
import FilterGroup from './FilterGroup';
import IUser from '../../api/account/interfaces/IUser';
import IPerson from './interfaces/IPerson';

export interface ICounters {
    enabled_accounts: number;
    disabled_accounts: number;
    searchable_accounts: number;
    nonsearchable_accounts: number;
}

export interface IAccountsProps {
}

export interface IAccountsState {
    count: Number;
    filterGroup: FilterGroup;
    Items: IUser[];
    selectedItems: Array< IPerson >;
    counters: any;
    selectedCounters: ICounters;
    countersLoaded: boolean;
    loading: boolean;
    notifyChildrenUnselect: boolean;
    searchKeyword: string;
}

class Accounts extends React.Component<IAccountsProps, IAccountsState> {
    accountApi;

    constructor(props: IAccountsProps) {

        super(props);

        this.state = {
            Items: [],
            selectedItems: [],
            count: 0,
            searchKeyword: '',
            filterGroup: FilterGroup.Total,
            counters: {},
            countersLoaded: false,
            loading: false,
            notifyChildrenUnselect: false,
            selectedCounters: {
                enabled_accounts: 0,
                disabled_accounts: 0,
                searchable_accounts: 0,
                nonsearchable_accounts: 0
            }
        };
    }

    load() {
        this.accountApi.getCounters().then((counters) => {
            this.setState({
                counters: counters,
                loading: false,
                countersLoaded: true
            });
        }).catch((error) => {
            this.setState({
                loading: false,
                countersLoaded: true
            });
            notification.error({message: 'Error', description: 'An error has occured while trying to get data!'});
        });
    }

    componentDidMount() {
        this.accountApi = new AccountApi();
        this.load();
    }

    searchKeyDown(e: any) {
        this.setState({
            searchKeyword: e.target.value || '',
        });
    }

    onChange() {
        this.load();
    }

    setFilterGroup = (group: FilterGroup) => this.setState({filterGroup: group});

    setActiveDeactive = (data) => {
        console.log(data);
    }

    setSearchable = (data) => {
        console.log(data);
    }

    addToPlace = (data) => {
        console.log(data);
    }

    resetPassword = (data) => {
        console.log(data);
    }

    setLabelManager = (data) => {
        console.log(data);
    }

    toggleSelect (user: IPerson) {
        var ind = this.state.selectedItems.indexOf(user);
        if (ind > -1) {
            var filteredArray = this.state.selectedItems.slice(0);
            filteredArray.splice(ind, 1);
            this.setState({
                selectedItems: filteredArray,
                selectedCounters: {
                    enabled_accounts: user.disabled ? this.state.selectedCounters.enabled_accounts : --this.state.selectedCounters.enabled_accounts,
                    disabled_accounts: user.disabled ? --this.state.selectedCounters.disabled_accounts : this.state.selectedCounters.disabled_accounts,
                    searchable_accounts: user.searchable ? --this.state.selectedCounters.searchable_accounts : this.state.selectedCounters.searchable_accounts,
                    nonsearchable_accounts: user.searchable ? this.state.selectedCounters.nonsearchable_accounts : --this.state.selectedCounters.nonsearchable_accounts
                }
            });
        } else {
            this.setState({
                selectedItems: [...this.state.selectedItems, user],
                selectedCounters: {
                    enabled_accounts: user.disabled ? this.state.selectedCounters.enabled_accounts : ++this.state.selectedCounters.enabled_accounts,
                    disabled_accounts: user.disabled ? ++this.state.selectedCounters.disabled_accounts : this.state.selectedCounters.disabled_accounts,
                    searchable_accounts: user.searchable ? ++this.state.selectedCounters.searchable_accounts : this.state.selectedCounters.searchable_accounts,
                    nonsearchable_accounts: user.searchable ? this.state.selectedCounters.nonsearchable_accounts : ++this.state.selectedCounters.nonsearchable_accounts
                }
            });
        }
    }

    unselectAll () {
        this.setState({
            selectedItems: [],
            selectedCounters: {
                enabled_accounts: 0,
                disabled_accounts: 0,
                searchable_accounts: 0,
                nonsearchable_accounts: 0
            },
            notifyChildrenUnselect: !this.state.notifyChildrenUnselect
        });
    }

    render() {
        const isSelected = this.state.selectedItems.length;
        const total = (this.state.counters.enabled_accounts || 0) + (this.state.counters.disabled_accounts || 0);
        const activeItems = [];
        const searchItems = [];
        const filterItems = [
            {
                key: FilterGroup.Total,
                name: 'Total',
                icon: 'team16',
                disableChart: true,
            },
            {
                key: FilterGroup.Active,
                name: 'Active',
                icon: 'circle16',
            },
            {
                key: FilterGroup.Deactive,
                name: 'Inactive',
                icon: 'circleWire16',
            },
            {
                key: FilterGroup.Searchable,
                name: 'Searchable',
                icon: 'search16',
            },
            {
                key: FilterGroup.NonSearchable,
                name: 'Non-Searchable',
                icon: 'nonsearch16',
            },
            {
                key: FilterGroup.NotVerifiedPhone,
                name: 'Not Verified Phones',
                icon: 'devicePhone16',
            }
        ];
        if(this.state.selectedCounters.disabled_accounts) {
            activeItems.push({
                key: 'active',
                name: 'Active',
                icon: 'circle16',
                count: this.state.selectedCounters.disabled_accounts
            });
        }
        if(this.state.selectedCounters.enabled_accounts) {
            activeItems.push({
                key: 'deactive',
                name: 'Dective',
                icon: 'circleWire16',
                count: this.state.selectedCounters.enabled_accounts
            });
        }

        if(this.state.selectedCounters.nonsearchable_accounts) {
            searchItems.push({
                key: 'searchable',
                name: 'Searchable',
                icon: 'search16',
                count: this.state.selectedCounters.nonsearchable_accounts
            });
        }
        if(this.state.selectedCounters.searchable_accounts) {
            searchItems.push({
                key: 'nonsearchable',
                name: 'Non-Searchable',
                icon: 'nonsearch16',
                count: this.state.selectedCounters.searchable_accounts
            });
        }

        return (
            <div className='accounts'>
                <Row type='flex' align='middle' className='scene-head'>
                    <h2>Accounts</h2>
                    <Options/>
                </Row>
                <div className='white-block-container'>
                    <Row className={[
                                    'toolbar',
                                    isSelected ? 'selcted-mode' : '',
                                    this.state.filterGroup !== filterItems[0].key ? 'filter-mode' : ''
                        ].join(' ')} type='flex'>
                        {!isSelected && (<div className='filter-search'>
                            <Input className='filter-search' value={this.state.searchKeyword} placeholder='type to search...' onChange={this.searchKeyDown.bind(this, event)}/>
                            { this.state.searchKeyword.length === 0 && <IcoN size={16} name={'search16'}/>}
                            { this.state.searchKeyword.length > 0 && <IcoN size={16} name={'xcross16'}/>}
                        </div>)}
                        {isSelected && (
                            <div className='default-mode-butn _cp' onClick={this.unselectAll.bind(this)}>
                                <IcoN size={16} name={'xcross16'}/>
                            </div>
                        )}
                        {isSelected && (
                            <span className='bar-item'><b>{isSelected} Accounts Selected</b></span>
                        )}
                        <div className='filler'></div>
                        {/* <span className='bar-item'>
                            Active/ Deactive
                            <div className='bar-icon'>
                                <IcoN size={16} name={'arrow16'}/>
                            </div>
                        </span> */}
                        {isSelected && (
                            <BarMenu menus={activeItems} onChange={this.setActiveDeactive}/>
                        )}
                        {isSelected && (
                            <BarMenu menus={[{
                                key: 'addToPlace',
                                name: 'Add to Place',
                                icon: 'enter16'}]} onChange={this.addToPlace}/>
                        )}
                        {isSelected && (
                            <BarMenu menus={[{
                                key: 'resetPassword',
                                name: 'Reset Password',
                                icon: 'lock16'}]} onChange={this.resetPassword}/>
                        )}
                        {isSelected && (
                            <BarMenu menus={searchItems} onChange={this.setSearchable}/>
                        )}
                        {isSelected && (
                            <BarMenu menus={[{
                                key: 'labelManager',
                                name: 'Label Manager',
                                icon: 'tag16'}]} onChange={this.setLabelManager}/>
                        )}
                        {(this.state.countersLoaded && !isSelected) &&
                        <Filter totalCount={total} menus={filterItems}
                                onChange={this.setFilterGroup}/>
                        }
                    </Row>
                    <Row>
                        <Col span={24}>
                            {
                                this.state.countersLoaded &&
                                <List counters={this.state.counters} filter={this.state.filterGroup}
                                      notifyChildrenUnselect={this.state.notifyChildrenUnselect}
                                      onChange={this.onChange.bind(this)} toggleSelected={this.toggleSelect.bind(this)}/>
                            }
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: any) {
    return {};
}

function mapDispatchToProps() {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Accounts);
