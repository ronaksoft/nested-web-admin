import * as React from 'react';
import _ from 'lodash';
import {Table, Row, Col, Card, Icon, TableColumnConfig} from 'antd';
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


interface IListProps {
    counters: IGetSystemCountersResponse;
    selectedFilter: CPlaceFilterTypes;
}

interface IListState {
    places: Array<IPlace>;
    loading: boolean;
    pagination: {};
    selectedFilter: CPlaceFilterTypes;
    visibelPlaceModal?: boolean;
    selectedPlace?: IPlace;
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
            pagination: {}
        };
    }

    componentDidMount() {
        this.fetchPlaces();
    }

    componentWillReceiveProps(props: IListProps) {
        const counter = props.counters;
        if (props.selectedFilter !== this.state.selectedFilter) {

            let totalCounter: number = 0;
            if (props.selectedFilter === CPlaceFilterTypes.ALL) {
                totalCounter = counter.grand_places + counter.locked_places + counter.unlocked_places;

            } else {
                totalCounter = counter[props.selectedFilter];
            }


            this.state = {
                selectedFilter: props.selectedFilter,
                counters: props.counters,
                pagination: {
                    pageSize: this.pageLimit,
                    current: 1,
                    total: totalCounter,
                }
            };
            setTimeout(() => {
                this.fetchPlaces();
            }, 100);
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

        let placeApi = new PlaceApi();
        placeApi.placeList({
            filter: this.state.selectedFilter === CPlaceFilterTypes.ALL ? CPlaceFilterTypes.ALL : this.state.selectedFilter,
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

    renderPlaceCell(text: string, record: IPlace, index: any) {
        return <PlaceView borderRadius={4} place={record} size={32} avatar name id></PlaceView>;
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
                    users.push(<UserAvatar avatar key={userId} user={user} size={20}/>);
                }
            });
        }
        return (
            <Row type='flex' gutter={4} justify='start'>
                {users}
                {moreUserCounter > 0 &&
                <span>+{moreUserCounter}</span>
                }
            </Row>
        );
    }

    renderMemberCounterCell(text: string, record: IPlace, index: any) {
        const count = record.counters.creators + record.counters.key_holders;
        return (<div><Icon type='user' title={'Members'}/>{count}</div>);
    }

    renderSubPlaceCounterCell(text: string, record: IPlace, index: any) {
        const count = record.counters.childs;
        return (<div>{count}</div>);
    }

    renderPlaceTypeCell(text: string, record: IPlace, index: any) {
        return text;
    }

    getColumns() {
        let columns: Array<TableColumnConfig> = [];
        columnsList.forEach((column: IPlaceListColumn) => {

            let renderer: (text: string, record: IPlace, index: any) => {};

            switch (column.renderer) {
                case 'place':
                    renderer = this.renderPlaceCell;
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
            }

            columns.push(
                {
                    title: column.title,
                    dataIndex: column.key,
                    key: column.key,
                    render: renderer
                }
            );
        });
        return columns;
    }

    render() {
        let column = this.getColumns();
        return (
            <Card>
                {this.state.visibelPlaceModal &&
                <PlaceModal visible={this.state.visibelPlaceModal} place={this.selectedPlace}
                            onClose={this.closePlaceModal.bind(this)}/>
                }
                <Table
                    pagination={this.state.pagination}
                    onChange={this.handleTableChange.bind(this) }
                    rowKey='_id'
                    onRowClick={this.showPlaceModal.bind(this) }
                    columns={column}
                    loading={this.state.loading}
                    dataSource={this.state.places}
                    size='middle'
                    scroll={{x: 960}}
                />
            </Card>
        );
    }

}
