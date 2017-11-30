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

export interface IAccountsProps {
}

export interface IAccountsState {
    count: Number;
    filterGroup: FilterGroup;
    Items: IUser[];
    counters: any;
    countersLoaded: boolean;
    loading: boolean;
    searchKeywork: string;
}

class Accounts extends React.Component<IAccountsProps, IAccountsState> {
    accountApi;

    constructor(props: IAccountsProps) {

        super(props);

        this.state = {
            Items: [],
            count: 0,
            searchKeywork: '',
            filterGroup: FilterGroup.Total,
            counters: {},
            countersLoaded: false,
            loading: false
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
            searchKeywork: e.target.value || '',
        });
    }

    onChange() {
        this.load();
    }

    setGroup = (group: FilterGroup) => this.setState({filterGroup: group});

    render() {

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
                    <Row className='toolbar' type='flex'>
                        <div className='filter-search'>
                            <Input className='filter-search' value={this.state.searchKeywork} placeholder='type to search...' onChange={this.searchKeyDown.bind(this, event)}/>
                            { this.state.searchKeywork.length === 0 && <IcoN size={16} name={'search16'}/>}
                            { this.state.searchKeywork.length > 0 && <IcoN size={16} name={'xcross16'}/>}
                        </div>
                        <div className='filler'></div>
                        {this.state.countersLoaded &&
                        <Filter totalCount={total} menus={filterItems}
                                onChange={this.setGroup} counters={this.state.counters}/>
                        }
                    </Row>
                    <Row>
                        <Col span={24}>
                            {
                                this.state.countersLoaded &&
                                <List counters={this.state.counters} filter={this.state.filterGroup}
                                    onChange={this.onChange.bind(this)}/>
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
