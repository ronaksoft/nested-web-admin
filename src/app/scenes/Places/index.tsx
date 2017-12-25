import {IDispatch} from '~react-redux~redux';
import * as React from 'react';
import {connect} from 'react-redux';
import {IcoN} from '../../components/icon/index';

import Filter from './../../components/Filter/index';
import BarMenu from './../../components/Filter/BarMenu';
import {Row, Col, Icon, Input, Tabs, Button, message, Modal} from 'antd';
import PlaceList from './List/index';
import SystemApi from '../../api/system/index';
import PlaceApi from '../../api/place/index';
import IGetSystemCountersResponse from '../../api/system/interfaces/IGetSystemCountersResponse';
import CPlaceFilterTypes from '../../api/consts/CPlaceFilterTypes';
import CreatePlaceModal from '../../components/CreatePlaceModal/index';
import _ from 'lodash';
import AddMemberModal from '../../components/AddMember/index';
import IUser from '../../api/account/interfaces/IUser';
import SendMessageModal from '../../components/SendMessageModal/index';

// import './places.less';
const TabPane = Tabs.TabPane;

export interface IAccountsProps {
}

export interface IAccountsState {
    counters: IGetSystemCountersResponse;
    notifyChildrenUnselect: boolean;
    loadCounters: boolean;
    sendMessageVisible: boolean;
    sendManyMessage: boolean;
    visibleAddMemberModal: boolean;
    visibleCreatePlaceModal: boolean;
    createGrandPlace: boolean;
    visibleDeletePlace: boolean;
    selectedFilter: string;
    searchKeyword: string;
    selectedTab: string;
    selectedItems: any[];
    updates: number;
    focusPlace: string;
}

class Accounts extends React.Component<IAccountsProps, IAccountsState> {
    updateData = _.debounce(this.updateDataMain, 512);
    placeApi: any;
    constructor(props: IAccountsProps) {
        super(props);
        this.state = {
            selectedFilter: CPlaceFilterTypes.ALL,
            searchKeyword: '',
            focusPlace: '',
            counters: {},
            updates: 0,
            selectedItems: [],
            sendMessageVisible: false,
            sendManyMessage: false,
            notifyChildrenUnselect: false,
            loadCounters: false,
            visibleAddMemberModal: false,
            visibleCreatePlaceModal: false,
            createGrandPlace: true,
            visibleDeletePlace: false,
            selectedTab: CPlaceFilterTypes.TAB_SHARED,
        };
        this.sendMessageToggle = this.sendMessageToggle.bind(this);
    }

    componentDidMount() {
        this.placeApi = new PlaceApi();
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
            notifyChildrenUnselect: !this.state.notifyChildrenUnselect
        });
    }

    sendMessageToggle(many?: boolean) {
        this.setState({
            sendManyMessage: (many === true),
            sendMessageVisible: !this.state.sendMessageVisible,
        });
    }

    changeFilter(key: string) {
        this.setState({
            selectedFilter: key,
        });
    }

    deletePlaces = () => {
        let placeApi = new PlaceApi();
        // todo delete single place
        if (this.state.focusPlace.length > 0 ) {
            const action = placeApi.placeDelete({
                place_id: this.state.focusPlace
            }).then( data => {
                message.success(`"${this.state.focusPlace}" is deleted`);
                this.updateData();
            }).catch((data) => {
                if (data.err_code === 1) {
                    if (data.items.indexOf('remove_children_first') > -1) {
                        message.warning(`Remove children first`);
                    }
                }
            });
        } else {
            this.state.selectedItems.forEach( place => {
                const action = placeApi.placeDelete({
                    place_id: place._id
                }).then( data => {
                    message.success(`"${place._id}" is deleted`);
                }).catch((data) => {
                    if (data.err_code === 1) {
                        if (data.items.indexOf('remove_children_first') > -1) {
                            message.warning(`Remove children first`);
                        }
                    }
                }).finally( () => {
                    this.updateData();
                });
            });
            this.unselectAll();
        }
        this.toggleDeletePlaceModal();
    }

    toggleCreatePlaceModal(grandPlace: boolean) {
        this.setState({
            focusPlace: this.state.visibleCreatePlaceModal ? '' : this.state.focusPlace,
            visibleCreatePlaceModal: !this.state.visibleCreatePlaceModal,
            createGrandPlace: grandPlace,
        });
    }

    tabChangeHandler(data: any) {
        this.setState({
            selectedTab: data[0],
        });
    }

    searchKeyDown(event: any) {
        this.setState({
            searchKeyword: event.currentTarget.value || '',
        });
    }

    resetSelect() {
        this.setState({
            selectedItems: []
        });
    }

    toggleSelect (place: any) {
        const index = this.state.selectedItems.indexOf(place);
        if (index > -1) {
            const filteredArray = this.state.selectedItems.slice(0);
            filteredArray.splice(index, 1);
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

    toggleAddMemberModal () {
        this.setState({
            focusPlace: this.state.visibleAddMemberModal ? '' : this.state.focusPlace,
            visibleAddMemberModal: !this.state.visibleAddMemberModal
        });
    }

    toggleDeletePlaceModal () {
        this.setState({
            focusPlace: this.state.visibleDeletePlace ? '' : this.state.focusPlace,
            visibleDeletePlace: !this.state.visibleDeletePlace
        });
    }

    sendManyMessage() {
        this.sendMessageToggle(true);
    }

    addMembers (members: IUser[]) {
        if (members.length === 0) {
            return;
        }
        const membersId = _.map(members, (user) => {
            return user._id;
        }).join(',');
        this.placeApi.placeAddMember({
            place_id: this.state.focusPlace,
            account_id: membersId
        }).then(() => {
            message.success(`${members.length} member(s) added to "${this.state.focusPlace}"`);
        });
    }

    actionOnPlace (placeId: string, action: string) {
        if (action === 'addMember') {
            this.setState({
                focusPlace: placeId
            }, () => {
                this.toggleAddMemberModal();
            });
        }
        if (action === 'create') {
            this.setState({
                focusPlace: placeId
            }, () => {
                this.toggleCreatePlaceModal(false);
            });
        }
        if (action === 'message') {
            this.setState({
                focusPlace: placeId
            }, () => {
                this.sendMessageToggle();
            });
        }
        if (action === 'delete') {
            this.setState({
                focusPlace: placeId
            }, () => {
                this.toggleDeletePlaceModal();
            });
        }
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

        let messageTarget;
        if (this.state.sendManyMessage) {
            messageTarget = _.unionBy(this.state.selectedItems, '_id');
            messageTarget = _.map(messageTarget, (item) => {
                return item._id;
            }).join(',');
        } else {
            messageTarget = this.state.focusPlace;
        }

        return (
            <div className='places'>
                {this.state.visibleCreatePlaceModal &&
                    <CreatePlaceModal visible={this.state.visibleCreatePlaceModal}
                        onClose={this.toggleCreatePlaceModal.bind(this, true)}
                                      grandPlaceId={!this.state.createGrandPlace ? this.state.focusPlace : ''}/>
                }
                <AddMemberModal
                    addMembers={this.addMembers.bind(this)}
                    onClose={this.toggleAddMemberModal.bind(this)}
                    visible={this.state.visibleAddMemberModal}/>
                <SendMessageModal
                    onClose={this.sendMessageToggle}
                    visible={this.state.sendMessageVisible}
                    target={messageTarget}/>
                <Modal
                    key={this.state.focusPlace}
                    content='Some descriptions'
                    title='Delete Place'
                    width={360}
                    visible={this.state.visibleDeletePlace}
                    onCancel={this.toggleDeletePlaceModal.bind(this)}
                    footer={[
                        <Button key='cancel' type=' butn butn secondary' size='large'
                                onClick={this.toggleDeletePlaceModal.bind(this)}>Cancel</Button>,
                        <Button key='submit' type=' butn butn-red' size='large'
                                onClick={this.deletePlaces}>Delete</Button>,
                    ]}
                >
                    By deleting this Place all data will erase and have no irreverse action.
                </Modal>
                <Row className='places-tab' type='flex'>
                    <Tabs defaultActiveKey={this.state.selectedTab} onChange={this.tabChangeHandler.bind(this)}>
                        <TabPane tab={<span><IcoN size={24} name={'dudesWire24'}/>Shared Places</span>} key={CPlaceFilterTypes.TAB_SHARED}/>
                        <TabPane tab={<span><IcoN size={24} name={'dudeWire24'}/>Individual Places</span>} key={CPlaceFilterTypes.TAB_INDIVIDUAL}/>
                    </Tabs>
                    <Button type=' butn butn-green secondary' onClick={this.toggleCreatePlaceModal.bind(this, true)}>Create Grand Place</Button>
                </Row>
                <div className='white-block-container'>
                    <Row className={[
                            'toolbar',
                            isSelected ? 'selcted-mode' : '',
                            this.state.selectedFilter !== filterItems[0].key ? 'filter-mode' : ''
                        ].join(' ')} type='flex'>
                        {!isSelected && (<div className='filter-search'>
                            <Input className='filter-search' value={this.state.searchKeyword} placeholder='type to search...'
                                   onChange={this.searchKeyDown.bind(this)}/>
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
                                key: 'post-message',
                                name: 'Post Message',
                                icon: 'message16'}]} onChange={this.sendManyMessage.bind(this)}/>
                        )}
                        {isSelected && (
                            <BarMenu menus={[{
                                key: 'delete',
                                name: 'Delete',
                                icon: 'bin16'}]} onChange={this.toggleDeletePlaceModal.bind(this)}/>
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
                                notifyChildrenUnselect={this.state.notifyChildrenUnselect} toggleSelected={this.toggleSelect.bind(this)} resetSelected={this.resetSelect.bind(this)}
                                updatedPlaces={this.state.updates} query={this.state.searchKeyword} actionOnPlace={this.actionOnPlace.bind(this)}/>
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
