import {IDispatch} from '~react-redux~redux';
import * as React from 'react';
import {connect} from 'react-redux';
import {IcoN} from '../../components/icon/index';

import Filter from './../../components/Filter/index';
import BarMenu from './../../components/Filter/BarMenu';
import {Row, Col, Icon, Input, Tabs, Button, message} from 'antd';
import PlaceList from './List/index';
import SystemApi from '../../api/system/index';
import PlaceApi from '../../api/place/index';
import IGetSystemCountersResponse from '../../api/system/interfaces/IGetSystemCountersResponse';
import CPlaceFilterTypes from '../../api/consts/CPlaceFilterTypes';
import CreatePlaceModal from '../../components/CreatePlaceModal/index';
import _ from 'lodash';

// import './places.less';
const TabPane = Tabs.TabPane;

export interface IAccountsProps {
}

export interface IAccountsState {
    counters: IGetSystemCountersResponse;
    notifyChildrenUnselect: boolean;
    loadCounters: boolean;
    visibleCreatePlaceModal: boolean;
    selectedFilter: string;
    searchKeyword: string;
    selectedTab: string;
    selectedItems: any[];
    updates: number;
}

class Accounts extends React.Component<IAccountsProps, IAccountsState> {
    updateData = _.debounce(this.updateDataMain, 512);
    constructor(props: IAccountsProps) {
        super(props);
        this.state = {
            selectedFilter: CPlaceFilterTypes.ALL,
            searchKeyword: '',
            counters: {},
            updates: 0,
            selectedItems: [],
            notifyChildrenUnselect: false,
            loadCounters: false,
            visibleCreatePlaceModal: false,
            selectedTab: CPlaceFilterTypes.TAB_SHARED,
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

    updateDataMain() {
        this.setState({
            updates: this.state.updates + 1,
        });
    }

    changeFilter(key: string) {
        this.setState({
            selectedFilter: key,
        });
    }

    deletePlaces = () => {
        let placeApi = new PlaceApi();
        this.state.selectedItems.forEach( place => {
            const action = placeApi.placeDelete({
                place_id: place._id
            }).then( date => {
                message.success(`"${place._id}" is deleted`);
                this.updateData();
            });
        });
        this.unselectAll();
    }

    showCreatePlaceModal() {
        this.setState({
            visibleCreatePlaceModal: true,
        });
    }

    closeCreatePlaceModal() {
        this.setState({
            visibleCreatePlaceModal: false,
        });
    }

    tabChangeHandler(data: any) {
        this.setState({
            selectedTab: data[0],
        });
    }

    searchKeyDown(e: any) {
        this.setState({
            searchKeyword: e.target.value || '',
        });
    }

    toggleSelect (place: any) {
        var ind = this.state.selectedItems.indexOf(place);
        if (ind > -1) {
            var filteredArray = this.state.selectedItems.slice(0);
            filteredArray.splice(ind, 1);
            this.setState({
                selectedItems: filteredArray
            });
        } else {
            this.setState({
                selectedItems: [...this.state.selectedItems, place]
            });
        }
    }

    unselectAll () {
        this.setState({
            selectedItems: [],
            notifyChildrenUnselect: !this.state.notifyChildrenUnselect
        });
    }

    clearQuery () {
        this.setState({
            searchKeyword: '',
        });
    }

    render() {
        const isSelected = this.state.selectedItems.length;
        const total = this.state.counters.grand_places + this.state.counters.locked_places + this.state.counters.unlocked_places + this.state.counters.personal_places;
        const filterItems = [
            {
                key: CPlaceFilterTypes.ALL,
                name: 'Relation View',
                icon: 'placesRelation16',
                count: this.state.counters.grand_places,
                disableChart: true,
            },
            {
                key: CPlaceFilterTypes.ABSOLUTE_VIEW,
                name: 'Absolute View',
                icon: 'listView16',
                count: total,
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
            // {
            //     key: CPlaceFilterTypes.UNLOCKED_PLACES,
            //     name: 'Recieving Emails',
            //     icon: 'atsign16',
            //     count: this.state.counters.unlocked_places,
            //     disableChart: true,
            // },
            // {
            //     key: CPlaceFilterTypes.WITHOUT_MANAGER,
            //     name: 'without Managers',
            //     icon: 'manager16',
            //     disableChart: true,
            // },
            // {
            //     key: CPlaceFilterTypes.WITHOUT_MEMBERS,
            //     name: 'without Members',
            //     icon: 'member16',
            //     disableChart: true,
            // },
            // {
            //     key: CPlaceFilterTypes.SEARCHABLE,
            //     name: 'Searchable',
            //     icon: 'search16',
            //     disableChart: true,
            // },
            // {
            //     key: CPlaceFilterTypes.NON_SEARCHABLE,
            //     name: 'Non-Searchable',
            //     icon: 'nonsearch16',
            //     disableChart: true,
            // }
        ];
        return (
            <div className='places'>
                {this.state.visibleCreatePlaceModal &&
                    <CreatePlaceModal visible={this.state.visibleCreatePlaceModal}
                        onClose={this.closeCreatePlaceModal.bind(this)}/>
                }
                <Row className='places-tab' type='flex'>
                    <Tabs defaultActiveKey={this.state.selectedTab} onChange={this.tabChangeHandler.bind(this)}>
                        <TabPane tab={<span><IcoN size={24} name={'dudesWire24'}/>Shared Places</span>} key={CPlaceFilterTypes.TAB_SHARED}/>
                        <TabPane tab={<span><IcoN size={24} name={'dudeWire24'}/>Individual Places</span>} key={CPlaceFilterTypes.TAB_INDIVIDUAL}/>
                    </Tabs>
                    <Button type=' butn butn-green secondary' onClick={this.showCreatePlaceModal.bind(this)}>Create Grand Place</Button>
                </Row>
                <div className='white-block-container'>
                    <Row className={[
                            'toolbar',
                            isSelected ? 'selcted-mode' : '',
                            this.state.selectedFilter !== filterItems[0].key ? 'filter-mode' : ''
                        ].join(' ')} type='flex'>
                        {!isSelected && (<div className='filter-search'>
                            <Input className='filter-search' value={this.state.searchKeyword} placeholder='type to search...'
                                   onChange={this.searchKeyDown.bind(this, event)}/>
                            { this.state.searchKeyword.length === 0 && <IcoN size={16} name={'search16'}/>}
                            { this.state.searchKeyword.length > 0 &&
                                <div className='_cp' onClick={this.clearQuery.bind(this)}><IcoN size={16} name={'xcross16'}/></div>
                            }
                        </div>)}
                        {isSelected && (
                            <div className='default-mode-butn _cp' onClick={this.unselectAll.bind(this)}>
                                <IcoN size={16} name={'xcross16'}/>
                            </div>
                        )}
                        {isSelected && (
                            <span className='bar-item'><b> {isSelected} Places Selected</b></span>
                        )}
                        <div className='filler'></div>
                        {isSelected && (
                            <BarMenu menus={[{
                                key: 'delete',
                                name: 'Delete',
                                icon: 'bin16'}]} onChange={this.deletePlaces}/>
                        )}
                        {/* {isSelected && (
                            <BarMenu menus={[{
                                key: 'addMember',
                                name: 'Add Member',
                                icon: 'member16'}]} onChange={this.addMember}/>
                        )} */}
                        {!isSelected &&
                        <Filter totalCount={filterItems[0].count} menus={filterItems}
                                onChange={this.changeFilter.bind(this)}/>
                        }
                    </Row>
                    <Row>
                        <Col span={24}>
                            {this.state.loadCounters &&
                            <PlaceList counters={this.state.counters} selectedFilter={this.state.selectedFilter} selectedTab={this.state.selectedTab}
                                notifyChildrenUnselect={this.state.notifyChildrenUnselect} toggleSelected={this.toggleSelect.bind(this)}
                                updatedPlaces={this.state.updates} query={this.state.searchKeyword}/>
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
