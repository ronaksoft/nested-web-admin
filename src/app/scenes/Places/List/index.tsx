import * as React from 'react';
import _ from 'lodash';
import {Table, Row, Col, Card, Icon, TableColumnConfig, Checkbox, Dropdown, Menu} from 'antd';
import PlaceApi from '../../../api/place/index';
import IPlace from '../../../api/place/interfaces/IPlace';
import {columnsList, IPlaceListColumn} from './columsList';
import IUser from '../../../api/account/interfaces/IUser';
import AccountApi from '../../../api/account/account';
import UserAvatar from '../../../components/avatar/index';
import PlaceView from '../../../components/placeview/index';
import PlaceModal from '../../../components/PlaceModal/index';
import IGetSystemCountersResponse from '../../../api/system/interfaces/IGetSystemCountersResponse';
import CPlaceFilterTypes from '../../../api/consts/CPlaceFilterTypes';
import {IcoN} from '../../../components/icon/index';
import Arrow from '../../../components/Arrow/index';
import PlacePolicy from '../../../components/PlacePolicy/index';

let cachedTrees = [];

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
    notifyChildrenUnselect: boolean;
    toggleSelected: (user: IPlace) => {};
}

interface IListState {
    places: Array<IPlace>;
    loading: boolean;
    pagination: {};
    selectedFilter: string;
    visibelPlaceModal?: boolean;
    selectedPlace?: IPlace;
    selectedTab: string;
    viewMode: string;
}

export default class PlaceList extends React.Component<IListProps, IListState> {
    users = {};
    pageLimit: number = 10;
    selectedPlace: IPlace | null = null;

    constructor(props: any) {
        super(props);
        const counter = props.counters;

        this.state = {
            places: [],
            loading: false,
            selectedFilter: CPlaceFilterTypes.ALL,
            counters: props.counters,
            pagination: {},
            viewMode: 'relation',
        };
    }

    componentDidMount() {
        this.fetchPlaces();

        const counter = this.props.counters;
        let totalCounter: number = counter.grand_places + counter.locked_places + counter.unlocked_places;

        this.setState({
            selectedFilter: CPlaceFilterTypes.ALL,
            pagination: {
                pageSize: this.pageLimit,
                current: 1,
                total: totalCounter,
            }
        });
    }

    componentWillReceiveProps(props: IListProps) {
        const counter = props.counters;
        if (props.selectedFilter !== this.state.selectedFilter || props.selectedTab !== this.state.selectedTab) {

            let totalCounter: number = 0;
            if (props.selectedFilter === CPlaceFilterTypes.ALL) {
                totalCounter = counter.grand_places + counter.locked_places + counter.unlocked_places + counter.personal_places;

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
            },  () => {
                this.fetchPlaces();
            });
        }
        if(props.notifyChildrenUnselect !== this.props.notifyChildrenUnselect) {
            var PlacesClone: IPlace[] = _.clone(this.state.places);
            PlacesClone.forEach((user: IPlace) => {
               user.isChecked = false;
            });
            this.setState({
                places: PlacesClone
            });
        }
    }

    handleTableChange(pagination: any) {
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
        }).then(this.setPlaces.bind(this));
    }

    setPlaces(places: Array<IPlace>) {
        this.setState({
            places: places,
            loading: false
        });

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
                if (expand) {
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
                }
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
        return (
            <Row type='flex' align='middle'>
                <Row type='flex' align='middle' onClick={this.preventer.bind(this)}>
                    <Checkbox onChange={() => this.onCheckboxChange(record)}
                            checked={record.isChecked}/>
                    {record.child === true && <div className={['place-indent', record.level].join('-')}></div>}
                    <div className='arrow-holder'>{(record.child !== true && this.state.viewMode === 'relation') &&
                    <Arrow rotate={record.children === undefined ? '0' : '180'} child={record.child}
                        onClick={loadChildren.bind(this)}/>}</div>
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
        var items = [
            {
                key: CPlaceFilterTypes.ALL,
                name: 'Relation View',
                icon: 'placesRelation16',
                onClick: () => {
                    console.log('onclick item');
                },
            }
        ];
        items.map((menu: IPlaceOptionsItem, index: number) => {

            return (<div>
                <Menu.Item key={index}>
                    <div>
                        <IcoN size={16} name={menu.icon}/>
                        <p>{menu.name}</p>
                    </div>
                </Menu.Item>
                <Menu.Divider/>
            </div>);
        });
        return (
            <Row className='moreOptions' type='flex' justify='end'>
                <Dropdown overlay={<Menu>
                    {items}
                </Menu>} trigger={['click']}>
                    <IcoN size={24} name={'more24'}/>
                </Dropdown>
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

    getColumns() {
        let columns: Array<TableColumnConfig> = [];
        columnsList.forEach((column: IPlaceListColumn) => {
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
                    renderer = this.renderOptionsCell;
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
            columns.push(col);
        });
        return columns;
    }

    preventer = (event) => {
        event.preventDefault();
        event.stopPropagation();
    }

    onCheckboxChange  = (place: IPlace) => {
        place.isChecked = !place.isChecked;
        this.props.toggleSelected(place);
    }

    render() {
        let column = this.getColumns();
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
                    columns={column}
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
