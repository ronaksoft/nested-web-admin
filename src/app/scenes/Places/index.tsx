import {IDispatch} from '~react-redux~redux';
import * as React from 'react';
import {connect} from 'react-redux';
import {IcoN} from '../../components/icon/index';

import Filter from './../../components/Filter/index';
import {Row, Col, Icon, Input, Tabs, Button} from 'antd';
import PlaceList from './List/index';
import SystemApi from '../../api/system/index';
import IGetSystemCountersResponse from '../../api/system/interfaces/IGetSystemCountersResponse';
import CPlaceFilterTypes from '../../api/consts/CPlaceFilterTypes';
import CreatePlaceModal from '../../components/CreatePlaceModal/index';

// import './places.less';
const TabPane = Tabs.TabPane;

export interface IAccountsProps {
}

export interface IAccountsState {
    counters: IGetSystemCountersResponse;
    loadCounters: boolean;
    visibelCreatePlaceModal: boolean;
    selectedFilter: string;
    searchKeywork: string;
}

class Accounts extends React.Component<IAccountsProps, IAccountsState> {
    constructor(props: IAccountsProps) {
        super(props);
        this.state = {
            selectedFilter: CPlaceFilterTypes.GRAND_PLACES,
            searchKeywork: '',
            counters: {},
            loadCounters: false,
            visibelCreatePlaceModal: false,
        };
    }

    componentDidMount() {
        let systemApi = new SystemApi();
        systemApi.getSystemCounters()
            .then((data: IGetSystemCountersResponse) => {
                this.setState({
                    counters: data,
                    loadCounters: true
                });
            });
    }

    changeFilter(key: string) {
        this.setState({
            selectedFilter: key,
        });
    }

    showCreatePlaceModal() {
        this.setState({
            visibelCreatePlaceModal: true,
        });
    }

    closeCreatePlaceModal() {
        this.setState({
            visibelCreatePlaceModal: false,
        });
    }

    tabChangeHandler() {
        console.log(arguments);
    }

    searchKeyDown(e: any) {
        this.setState({
            searchKeywork: e.target.value || '',
        });
    }

    render() {

        const filterItems = [
            {
                key: CPlaceFilterTypes.ALL,
                name: 'Relation View',
                icon: 'placesRelation16',
                count: this.state.counters.grand_places + this.state.counters.locked_places + this.state.counters.unlocked_places + this.state.counters.personal_places,
                disableChart: true,
            },
            {
                key: CPlaceFilterTypes.GRAND_PLACES,
                name: 'Absolute View',
                icon: 'listView16',
                count: this.state.counters.grand_places,
                disableChart: true,
            },
            {
                key: CPlaceFilterTypes.GRAND_PLACES,
                name: 'Grand Places',
                icon: 'places16',
                count: this.state.counters.grand_places,
                disableChart: true,
            },
            {
                key: CPlaceFilterTypes.LOCKED_PLACES,
                name: 'Private Places',
                icon: 'brickWall16',
                count: this.state.counters.locked_places,
                disableChart: true,
            },
            {
                key: CPlaceFilterTypes.UNLOCKED_PLACES,
                name: 'Recieving Emails',
                icon: 'atsign16',
                count: this.state.counters.unlocked_places,
                disableChart: true,
            },
            {
                key: CPlaceFilterTypes.PERSONAL_PLACES,
                name: 'without Managers',
                icon: 'manager16',
                count: this.state.counters.personal_places,
                disableChart: true,
            },
            {
                key: CPlaceFilterTypes.PERSONAL_PLACES,
                name: 'without Members',
                icon: 'member16',
                count: this.state.counters.personal_places,
                disableChart: true,
            },
            {
                key: CPlaceFilterTypes.PERSONAL_PLACES,
                name: 'Searchable',
                icon: 'search16',
                count: this.state.counters.personal_places,
                disableChart: true,
            },
            {
                key: CPlaceFilterTypes.PERSONAL_PLACES,
                name: 'Non-Searchable',
                icon: 'nonsearch6',
                count: this.state.counters.personal_places,
                disableChart: true,
            }
        ];

        return (
            <div className='places'>
                {this.state.visibelCreatePlaceModal &&
                    <CreatePlaceModal visible={this.state.visibelCreatePlaceModal}
                        onClose={this.closeCreatePlaceModal.bind(this)}/>
                }
                <Row className='places-tab' type='flex'>
                    <Tabs defaultActiveKey='0' onChange={this.tabChangeHandler.bind(this)}>
                        <TabPane tab={<span><IcoN size={24} name={'dudesWire24'}/>Shared Places</span>} key='0'/>
                        <TabPane tab={<span><IcoN size={24} name={'dudeWire24'}/>Individual Places</span>} key='1'/>
                    </Tabs>
                    <Button type=' butn butn-green secondary' onClick={this.showCreatePlaceModal.bind(this)}>Create Grand Place</Button>
                </Row>
                <div className='white-block-container'>
                    <Row className='toolbar' type='flex'>
                        <div className='filter-search'>
                            <Input className='filter-search' value={this.state.searchKeywork} placeholder='type to search...' onChange={this.searchKeyDown.bind(this, event)}/>
                            { this.state.searchKeywork.length === 0 && <IcoN size={16} name={'search16'}/>}
                            { this.state.searchKeywork.length > 0 && <IcoN size={16} name={'xcross16'}/>}
                            {/* <IcoN size={24} name={'dashbooard24'}/> */}
                            {/* <svg class="_16svg" ng-click="ctlFiles.searchFunc()" ng-show="ctlFiles.keyword.length === 0">
                            <use xlink:href="/assets/icons/nst-icn16.svg#search"></use>
                            </svg>
                            <svg class="_16svg" ng-click="ctlFiles.keyword = ''" ng-show="ctlFiles.keyword.length > 0">
                            <use xlink:href="/assets/icons/nst-icn16.svg#xcross"></use>
                            </svg> */}
                        </div>
                        <div className='filler'></div>
                        {this.state.loadCounters &&
                        <Filter totalCount={filterItems[0].count} menus={filterItems}
                                onChange={this.changeFilter.bind(this)}/>
                        }
                    </Row>
                    <Row>
                        <Col span={24}>
                            {this.state.loadCounters &&
                            <PlaceList counters={this.state.counters} selectedFilter={this.state.selectedFilter}/>
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

function mapDispatchToProps(dispatch: IDispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Accounts);
