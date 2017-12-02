import * as React from 'react';
import {connect} from 'react-redux';
import Filter from '../../components/Filter/index';
import Options from './components/Options/index';
import List from './components/List/index';
import {Row, Col, notification, Input} from 'antd';
import {IcoN} from '../../components/icon/index';
import AccountApi from '../../api/account/account';
import FilterGroup from './FilterGroup';
import IUser from '../../api/account/interfaces/IUser';
import IPerson from '../../api/account/interfaces/IPerson';

export interface IAccountsProps {
}

export interface IAccountsState {
    count: Number;
    filterGroup: FilterGroup;
    Items: IUser[];
    selectedItems: Array< IPerson >;
    counters: any;
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
            notifyChildrenUnselect: false
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

    setGroup = (group: FilterGroup) => this.setState({filterGroup: group});

    toggleSelect (user: IPerson) {
        var ind = this.state.selectedItems.indexOf(user);
        if (ind > -1) {
            var filteredArray = this.state.selectedItems.slice(0);
            filteredArray.splice(ind, 1);
            this.setState({selectedItems: filteredArray});
        } else {
            this.setState({
                selectedItems: [...this.state.selectedItems, user]
            });
        }
    }

    unselectAll () {
        this.setState({
            selectedItems: [],
            notifyChildrenUnselect: !this.state.notifyChildrenUnselect
        });
    }

    render() {
        const isSelected = this.state.selectedItems.length > 0;
        const total = (this.state.counters.enabled_accounts || 0) + (this.state.counters.disabled_accounts || 0);
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
        return (
            <div className='accounts'>
                <Row type='flex' align='middle' className='scene-head'>
                    <h2>Accounts</h2>
                    <Options/>
                </Row>
                <div className='white-block-container'>
                    <Row className={['toolbar', isSelected ? 'selcted-mode' : ''].join(' ')} type='flex'>
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
                            <span className='bar-item'><b>Accounts Selected</b></span>
                        )}
                        <div className='filler'></div>
                        {isSelected && (
                            <span className='bar-item'>
                                Active/ Deactive
                                <div className='bar-icon'>
                                    <IcoN size={16} name={'arrow16'}/>
                                </div>
                            </span>
                        )}
                        {isSelected && (
                            <span className='bar-item'>
                                Add to Place
                                <div className='bar-icon'>
                                    <IcoN size={16} name={'enter16'}/>
                                </div>
                            </span>
                        )}
                        {isSelected && (
                            <span className='bar-item'>
                                Reset Password
                                <div className='bar-icon'>
                                    <IcoN size={16} name={'lock16'}/>
                                </div>
                            </span>
                        )}
                        {isSelected && (
                            <span className='bar-item'>
                                Searchable Off
                                <div className='bar-icon'>
                                    <IcoN size={16} name={'arrow16'}/>
                                </div>
                            </span>
                        )}
                        {isSelected && (
                            <span className='bar-item'>
                                Label Manager
                                <div className='bar-icon'>
                                    <IcoN size={16} name={'tag16'}/>
                                </div>
                            </span>
                        )}
                        {(this.state.countersLoaded && !isSelected) &&
                        <Filter totalCount={total} menus={filterItems}
                                onChange={this.setGroup} counters={this.state.counters}/>
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
