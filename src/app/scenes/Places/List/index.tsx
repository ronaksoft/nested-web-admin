import * as React from 'react';
import _ from 'lodash';
import {Table, Row, Col, Card, Icon, TableColumnConfig, Checkbox, Dropdown, Menu} from 'antd';
import PlaceApi from '../../../api/place/index';
import IPlace from '../../../api/place/interfaces/IPlace';
import IUser from '../../../api/account/interfaces/IUser';
import AccountApi from '../../../api/account/account';
import UserAvatar from '../../../components/avatar/index';
import PlaceView from '../../../components/placeview/index';
import PlaceModal from '../../../components/PlaceModal/index';
import IGetSystemCountersResponse from '../../../api/system/interfaces/IGetSystemCountersResponse';
import CPlaceFilterTypes from '../../../api/consts/CPlaceFilterTypes';
import C_PLACE_TYPE from '../../../api/consts/CPlaceType';
import {IcoN} from '../../../components/icon/index';
import Arrow from '../../../components/Arrow/index';
import PlacePolicy from '../../../components/PlacePolicy/index';
import MoreOption from '../../../components/Filter/MoreOption';
import FilterGroup from '../../Accounts/FilterGroup';
import $ from 'jquery';

let cachedTrees = [];

export interface IPlaceListColumn {
    key: string;
    title: string;
    renderer: string;
    index: number;
    icon ?: string;
    width?: number;
    sorter?: () => {};
    sortOrder?: any;
}

export interface ISort {
    name: boolean;
    key_holders: boolean;
    creators: boolean;
    children: boolean;
    place_type: boolean;
}


export interface IPlaceOptionsItem {
    key: string;
    name: string;
    icon: string;
    style ?: string;
    class ?: string;
}

interface IListProps {
    counters: IGetSystemCountersResponse;
    selectedFilter: string;
    selectedTab: string;
    query: string;
    updatedPlaces: number;
    notifyChildrenUnselect: boolean;
    toggleSelected: (user: IPlace) => {};
    resetSelected: () => {};
    actionOnPlace: (placeId: string, action: string) => {};
    grandPlaceId?: string;
}

interface IListState {
    places: Array<IPlace>;
    visibleAddMemberModal: boolean;
    loading: boolean;
    pagination: {};
    selectedFilter: string;
    visibelPlaceModal?: boolean;
    selectedPlace?: IPlace;
    selectedTab: string;
    viewMode: string;
    query: string;
    sortedInfo: ISort;
    sortKey: any;
}

export default class PlaceList extends React.Component<IListProps, IListState> {
    users = {};
    pageLimit: number = 10;
    selectedPlace: IPlace | null = null;
    updateQueryDeb = _.debounce(this.updateQuery, 512);
    listRefresh: any;
    constructor(props: any) {
        super(props);
        const counter = props.counters;
        this.state = {
            places: [],
            visibleAddMemberModal: false,
            loading: false,
            selectedFilter: CPlaceFilterTypes.ALL,
            counters: props.counters,
            query: '',
            pagination: {},
            viewMode: 'relation',
            sortedInfo: {
                name: false,
                key_holders: false,
                creators: false,
                children: false,
                place_type: false,
            },
            sortKey: null,
        };

        this.listRefresh = this.fetchPlaces.bind(this);
    }

    componentDidMount() {
        this.fetchPlaces();
        const counter = this.props.counters;
        let totalCounter: number = counter.grand_places + counter.locked_places + counter.unlocked_places;
        if (this.props.selectedFilter === CPlaceFilterTypes.RELATION_VIEW ||
            this.props.selectedFilter === CPlaceFilterTypes.ALL) {
            totalCounter = counter.grand_places;
        }
        window.addEventListener('place_updated', this.listRefresh, false);
        this.setState({
            selectedFilter: CPlaceFilterTypes.ALL,
            pagination: {
                pageSize: this.pageLimit,
                current: 1,
                total: totalCounter,
            }
        });
    }

    componentWillUnmount() {
        window.removeEventListener('place_updated', this.listRefresh, false);
    }

    updateQuery(q: string) {
        this.setState({
            query: q
        },  () => {
            this.fetchPlaces();
        });
    }
    componentWillReceiveProps(props: IListProps) {
        const counter = props.counters;
        if (props.selectedFilter !== this.state.selectedFilter || props.selectedTab !== this.state.selectedTab) {
            let totalCounter: number = 0;
            if (props.selectedFilter === CPlaceFilterTypes.ABSOLUTE_VIEW) {
                totalCounter = counter.grand_places + counter.locked_places + counter.unlocked_places + counter.personal_places;
            } else if (props.selectedFilter === CPlaceFilterTypes.RELATION_VIEW ||
                props.selectedFilter === CPlaceFilterTypes.ALL) {
                totalCounter = counter.grand_places;
            } else {
                totalCounter = counter[props.selectedFilter];
            }

            this.setState({
                selectedFilter: props.selectedFilter,
                selectedTab: props.selectedTab,
                counters: props.counters,
                pagination: {
                    pageSize: this.pageLimit,
                    current: 1,
                    total: totalCounter,
                }
            }, () => {
                this.fetchPlaces();
            });
        } else if (props.updatedPlaces !== this.props.updatedPlaces) {
            this.fetchPlaces();
        } else if (props.query !== this.state.query) {
            this.updateQueryDeb(props.query);
        }
        if (props.notifyChildrenUnselect !== this.props.notifyChildrenUnselect) {
            let PlacesClone: IPlace[] = _.clone(this.state.places);
            PlacesClone.forEach((user: IPlace) => {
                user.isChecked = false;
            });
            this.setState({
                places: PlacesClone
            });
        }
    }

    handleTableChange(pagination: any, filters: any, sorter: any) {
        // console.log(arguments);
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        setTimeout(() => {
            this.fetchPlaces();
        }, 100);
    }

    showPlaceModal(record: IPlace, index: number) {
        this.selectedPlace = record;
        this.setState({
            selectedPlace: record,
            visibelPlaceModal: true,
        });
    }

    closePlaceModal() {
        this.setState({
            visibelPlaceModal: false,
        });
    }

    fetchPlaces() {
        this.props.resetSelected();

        this.setState({
            loading: true
        });

        let filter = 'grand_places';

        if (this.state.selectedTab === CPlaceFilterTypes.TAB_SHARED) {
            filter = 'grand_places';
        } else if (this.state.selectedTab === CPlaceFilterTypes.TAB_INDIVIDUAL) {
            filter = 'personal_places';
        }

        if (this.state.selectedFilter !== CPlaceFilterTypes.ALL) {
            filter = this.state.selectedFilter;
            this.setState({
                viewMode: 'absolute',
            });
        } else {
            this.setState({
                viewMode: 'relation',
            });
        }

        let placeApi = new PlaceApi();
        // placeApi.placeList({
        //     filter: this.state.selectedFilter === CPlaceFilterTypes.ALL ? CPlaceFilterTypes.ALL : this.state.selectedFilter,
        //     limit: this.pageLimit,
        //     skip: (this.state.pagination.current - 1) * this.pageLimit,
        // }).then(this.setPlaces.bind(this));
        placeApi.placeList({
            filter: filter,
            limit: this.pageLimit,
            skip: (this.state.pagination.current - 1) * this.pageLimit,
            keyword: this.state.query,
            sort: (this.state.sortedInfo[this.state.sortKey] ? '-' : '') + this.state.sortKey,
        }).then(this.setPlaces.bind(this));

    }

    setPlaces(places: Array<IPlace>) {
        this.setState({
            places: places,
            loading: false,
        });
        if (this.props.query.length > 0) {
            this.setState({
                pagination: {
                    pageSize: this.pageLimit,
                    current: 1,
                    total: places.length,
                }
            });
        }

        let creators = [];
        places.forEach((place: IPlace) => {
            creators = _.union(creators, place.creators);
        });

        let accountApi = new AccountApi();
        creators.forEach((userId: string) => {
            accountApi.accountGet({
                account_id: userId
            }).then((user: IUser) => {
                this.users[userId] = user;
                this.forceUpdate();
            });
        });
    }

    getUser(userId: string): IUser | null {
        if (this.users[userId]) {
            return this.users[userId];
        } else {
            return null;
        }
    }

    handleGroupChange(menu: any) {

        if (typeof menu.onClick === 'function') {
            menu.onClick();
        }
    }

    isChild(parentId: string, place: IPlace) {
        return place && place._id && place._id.indexOf(parentId + '.') === 0;
    }

    getChildren(place: IPlace, places: IPlace[], depth: number) {
        return _.chain(places).sortBy(['id']).reduce((stack, item) => {
            if (!this.isChild(place._id, item)) {
                return stack;
            }

            let previous = _.last(stack);

            if (previous && this.isChild(previous._id, item)) {
                return stack;
            }

            let children = this.getChildren(item, places, depth + 1);
            if (children.length > 0) {
                stack.push(_.merge(item, {
                    children: children,
                    child: true,
                }));
            } else {
                stack.push(_.merge(item, {
                    child: true,
                }));
            }

            return stack;
        }, []).value();
    }

    createTree(places: IPlace[]) {
        return _.chain(places).filter((place) => {
            return place._id && place._id.indexOf('.') === -1;
        }).map((place) => {
            return _.merge(place, {
                children: this.getChildren(place, places, 1),
                child: false,
            });
        }).value();
    }

    renderPlaceCell(text: string, record: IPlace, index: any) {
        const loadChildren = (expand: any) => {
            const index = _.findIndex(this.state.places, {
                _id: record._id
            });
            let places = this.state.places;
            if (!cachedTrees.hasOwnProperty(record._id)) {
                this.setState({
                    loading: true
                });
                const placeApi = new PlaceApi();
                placeApi.placeList({
                    grand_parent_id: record._id
                }).then((data) => {
                    let tempTree = this.createTree(data);
                    places[index] = _.merge(tempTree[0], {
                        expanded: true,
                    });
                    places[index].expanded = true;
                    places[index].children = tempTree[0].children;
                    cachedTrees[record._id] = tempTree[0].children;
                    this.setState({
                        places: places,
                        loading: false,
                    });
                });
            } else {
                if (!places[index].children) {
                    places[index].children = cachedTrees[record._id];
                } else {
                    try {
                        delete places[index].children;
                    } catch (e) {
                        console.log('can\'t delete property');
                    }
                }
                this.setState({
                    places: places,
                });
            }
        };

        const getId = (obj) => {
            return obj.find('.PlaveView-detail span').eq(1).text().replace(/\s+/g, '');
        };

        const toggleExpand = (expand: any, event: any) => {
            const obj = $(event).parents('.ant-table-row');
            const classList = obj.attr('class').split(/\s+/);
            let currentLevel = '';
            classList.forEach((item) => {
                if (item.indexOf('ant-table-row-level-') > -1) {
                    currentLevel = parseInt(item.replace('ant-table-row-level-', ''));
                    return;
                }
            });
            const id = getId(obj);
            let queryArr = [];
            for (let i = 1 + currentLevel; i <= 5; i++) {
                queryArr.push('.ant-table-row-level-' + i + ' ');
                if (expand) {
                    break;
                }
            }
            const targetObj = obj.parent().find(queryArr.join(', '));
            for (let i = 0; i < targetObj.length; i++) {
                const rowObj = targetObj.eq(i);
                if (getId(rowObj).indexOf(id) > -1) {
                    if (expand) {
                        rowObj.attr('style', 'display: table-row !important');
                    } else {
                        rowObj.attr('style', 'display: none !important');
                    }
                }
            }
        };

        return (
            <Row type='flex' align='middle'>
                <Row type='flex' align='middle' onClick={this.preventer.bind(this)}>
                    <Checkbox onChange={(event) => this.onCheckboxChange(event, record)}
                              checked={record.isChecked}/>
                    {record.child === true && <div className={['place-indent', record.level].join('-')}></div>}
                    <div className='arrow-holder'>
                        {(record.counters.childs > 0 && this.state.viewMode === 'relation' && record.grand_parent_id === record._id ) &&
                            <Arrow rotate={record.children === undefined ? '0' : '180'} child={record.child}
                                onClick={loadChildren.bind(this)}/>}
                        {(record.counters.childs > 0 && this.state.viewMode === 'relation' && record.grand_parent_id !== record._id ) &&
                            <Arrow rotate={'0'} child={record.child}
                                onClick={(expand, elem) => {toggleExpand(!expand, elem);}}/>}
                    </div>
                </Row>
                <PlaceView borderRadius={4} place={record} size={32} avatar name id></PlaceView>
            </Row>
        );
    }

    renderUsersCell(text: string, record: IPlace, index: any) {
        let users = [];
        let moreUserCounter = 0;
        const limit = 3;

        if (record.creators && record.creators.length > 0) {
            record.creators.forEach((userId: string) => {
                if (users.length >= limit) {
                    moreUserCounter++;
                    return;
                }
                if (this.getUser(userId)) {
                    const user = this.getUser(userId);
                    users.push(<UserAvatar avatar key={userId} user={user} size={16}/>);
                }
            });
        }
        return (
            <Row className='managers' type='flex' gutter={4} justify='start'>
                {users}
                {moreUserCounter > 0 &&
                <span>+{moreUserCounter}</span>
                }
            </Row>
        );
    }

    renderMemberCounterCell(text: string, record: IPlace, index: any) {
        const count = record.counters.creators + record.counters.key_holders;
        return (<div className='membersCounter'><IcoN size={16} name={'dudesWire16'}/>{count}</div>);
    }

    renderPoliciesCell(text: string, record: IPlace, index: any) {
        return <div className='placePolicies'><PlacePolicy place={record} text={false} search={true} receptive={true}/>
        </div>;
    }

    renderOptionsCell(text: string, record: IPlace, index: any) {
        let visibleAddMemberModal = true;
        const items = [
            {
                key: 'message',
                name: 'Post a Message',
                icon: 'message16',
                action: () => {
                    this.props.actionOnPlace(record._id, 'message');
                },
            },
            {
                key: 'create',
                name: 'Create a Private Subplace',
                icon: 'brickWall16',
                action: () => {
                    this.props.actionOnPlace(record._id, 'create');
                },
            }
        ];
        const deviders = [0];
        if (record.type !== C_PLACE_TYPE['0']) {
            items.push({
                key: 'person16',
                name: 'Add Member',
                icon: 'person16',
                action: () => {
                    this.props.actionOnPlace(record._id, 'addMember');
                },
            });
        }
        if (record.grand_parent_id !== record._id || record.type !== C_PLACE_TYPE['0']) {
            items.push(
                {
                    key: 'delete',
                    name: 'Delete',
                    icon: 'bin16',
                    action: () => {
                        this.props.actionOnPlace(record._id, 'delete');
                    },
                    class: 'nst-red'
                }
            );
            deviders.push(items.length - 2);
        }
        return (
            <Row className='moreOptions' type='flex' justify='end' onClick={this.preventer.bind(this)}>
                <MoreOption menus={items} deviders={deviders}/>
            </Row>
        );
    }

    renderSubPlaceCounterCell(text: string, record: IPlace, index: any) {
        const count = record.counters.childs;
        return (<Row type='flex' justify='center'>{count}</Row>);
    }

    renderPlaceTypeCell(text: string, record: IPlace, index: any) {
        return <Row className='placeType' type='flex' align='middle'><PlacePolicy place={record} text={true}
                                                                                  type={true}/></Row>;
    }

    preventer = (event) => {
        event.preventDefault();
        event.stopPropagation();
    }

    onCheckboxChange = (event, place: IPlace) => {
        event.stopPropagation();
        place.isChecked = !place.isChecked;
        this.props.toggleSelected(place);
    }

    onSortChanged(key: string) {
        let sort = this.state.sortedInfo;
        sort[key] = !sort[key];
        this.setState({
            sortedInfo: sort,
            sortKey: key,
        }, () => {
            this.fetchPlaces();
        });
    }

    render() {
        let {sortedInfo, sortKey} = this.state;
        var columns = [
            {
                key: 'name',
                index: 0,
                title: (<span>Place Name</span>),
                renderer: 'place',
            },
            {
                key: 'creators',
                index: 2,
                title: (
                    <span className={[sortKey === 'creators'? 'active' : ''].join(' ')}>Managers
                        <Arrow rotate={sortedInfo.creators === false ? '0' : '180'}
                               onClick={this.onSortChanged.bind(this, 'creators')}/>
                    </span>),
                renderer: 'users',
                width: 140,
            },
            {
                key: 'counters.counters',
                index: 3,
                title: (
                    <span className={[sortKey === 'key_holders' ? 'active' : ''].join(' ')}>Members
                        <Arrow rotate={sortedInfo.key_holders === false ? '0' : '180'}
                               onClick={this.onSortChanged.bind(this, 'key_holders')}/>
                    </span>),
                renderer: 'memberCounter',
                icon: 'member',
                width: 96,
            },
            {
                key: 'type',
                index: 4,
                renderer: 'placeType',
                width: 128,
                title: (
                    <span className={[sortKey === 'place_type' ? 'active' : ''].join(' ')}>Place Type
                        <Arrow rotate={sortedInfo.place_type === false ? '0' : '180'}
                               onClick={this.onSortChanged.bind(this, 'place_type')}/>
                    </span>)
            },
            {
                key: 'sub-places',
                index: 4,
                title: (
                    <span className={[sortKey === 'children' ? 'active' : ''].join(' ')}>Sub-places
                        <Arrow rotate={sortedInfo.children === false ? '0' : '180'}
                               onClick={this.onSortChanged.bind(this, 'children')}/>
                    </span>),
                renderer: 'subPlaceCounter',
                width: 104,
            },
            {
                key: 'policies',
                index: 5,
                title: (
                    <span>Policies</span>),
                renderer: 'placePolicy',
                width: 80
            },
            {
                key: 'options',
                index: 6,
                title: '',
                renderer: 'options',
                width: 80
            }
        ].map((column) => {
            let renderer: (text: string, record: IPlace, index: any) => {};

            switch (column.renderer) {
                case 'place':
                    renderer = this.renderPlaceCell.bind(this);
                    break;
                case 'users':
                    renderer = this.renderUsersCell.bind(this);
                    break;
                case 'memberCounter':
                    renderer = this.renderMemberCounterCell;
                    break;
                case 'subPlaceCounter':
                    renderer = this.renderSubPlaceCounterCell;
                    break;
                case 'placeType':
                    renderer = this.renderPlaceTypeCell;
                    break;
                case 'placePolicy':
                    renderer = this.renderPoliciesCell;
                    break;
                case 'options':
                    renderer = this.renderOptionsCell.bind(this);
                    break;
            }
            var col = {
                title: column.title,
                dataIndex: column.key,
                key: column.key,
                render: renderer
            };
            if (column.width) {
                col.width = column.width;
            }
            return col;
        });

        return (
            <div className='places-list'>
                {this.state.visibelPlaceModal &&
                <PlaceModal visible={this.state.visibelPlaceModal} place={this.selectedPlace}
                            onClose={this.closePlaceModal.bind(this)}/>
                }
                <Table
                    pagination={this.state.pagination}
                    onChange={this.handleTableChange.bind(this)}
                    rowKey='_id'
                    onRowClick={this.showPlaceModal.bind(this)}
                    columns={columns}
                    loading={this.state.loading}
                    dataSource={this.state.places}
                    size='middle nst-table'
                    className='nst-table'
                    scroll={{x: 960}}
                />
            </div>
        );
    }

}
