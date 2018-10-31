import {IDispatch} from '~react-redux~redux';
import * as React from 'react';
import {IcoN} from '../../../components/icon/index';
import _ from 'lodash';
import {Row, Col, Table, Tabs, Button, Modal, message} from 'antd';
import PlaceApi from '../../../api/place/index';
import IUser from '../../../api/account/interfaces/IUser';
import PlaceModal from '../../../components/PlaceModal/index';
import Loading from '../../../components/Loading/index';
import IPlace from '../../../api/place/interfaces/IPlace';
import PlacePolicy from '../../../components/PlacePolicy/index';
import UserAvatar from '../../../components/avatar/index';
import PlaceView from '../../../components/placeview/index';
import AccountApi from '../../../api/account/account';
import AddPlaceModal from '../../../components/AddPlace/index';


export interface IProps {
    location?: any;
}

export interface IState {
    places: IPlace[];
    visiblePlaceModal?: boolean;
    selectedPlace?: string | null;
    pagination: any;
    loading: boolean;
    visibleAddDefaultPlaceModal: boolean;
    visibleRemoveDefaultPlaceModal: boolean;
}

class DefaultPlaces extends React.Component<IProps, IState> {
    users = {};
    placeApi: any;
    selectedPlace: IPlace | null = null;
    pageLimit: number = 10;

    constructor(props: IProps) {
        super(props);
        this.state = {
            places: [],
            pagination: {
                pageSize: this.pageLimit,
                current: 1,
                total: 10,
            },
            visiblePlaceModal: false,
            loading: false,
            visibleAddDefaultPlaceModal: false,
            visibleRemoveDefaultPlaceModal: false,
            selectedPlace: null,
        };
    }

    componentDidMount() {
        this.placeApi = new PlaceApi();
        this.fetchPlaces();
    }

    fetchPlaces() {
        this.placeApi.getDefaultPlace({
            limit: this.pageLimit,
            skip: (this.state.pagination.current - 1) * this.pageLimit,
        }).then((res) => {
            this.setState({
                places: res.places,
                pagination: {
                    pageSize: this.pageLimit,
                    current: this.state.pagination.current,
                    total: (this.state.pagination.current - 1) * this.pageLimit + res.places.length,
                },
            });
            let accountApi = new AccountApi();
            let creators = [];
            res.places.forEach((place: IPlace) => {
                if (place.creators) {
                    creators = _.union(creators, place.creators);
                }
            });
            creators.forEach((userId: string) => {
                accountApi.accountGet({
                    account_id: userId
                }).then((user: IUser) => {
                    this.users[userId] = user;
                    this.forceUpdate();
                });
            });
        });
    }

    showPlaceModal = (record: IPlace, index: number) => {
        this.selectedPlace = record;
        this.setState({
            selectedPlace: record,
            visiblePlaceModal: true,
        });
    }

    closePlaceModal = () => {
        this.setState({
            visiblePlaceModal: false,
        });
    }

    handleTableChange = (pagination: any, filters: any, sorter: any) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        setTimeout(() => {
            this.fetchPlaces();
        }, 100);
    }

    getUser(userId: string): IUser | null {
        if (this.users[userId]) {
            return this.users[userId];
        } else {
            return null;
        }
    }

    renderPlaceCell(text: string, record: IPlace) {
        return (
            <Row type='flex' align='middle'>
                <PlaceView borderRadius='4' place={record} size={32} avatar={true} name={true} id={true}
                           className='indent-left' onClick={this.showPlaceModal}/>
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
        let count = 0;
        if (record.counters) {
            count = record.counters.creators || 0 + record.counters.key_holders || 0;
        }
        return (<div className='membersCounter'><IcoN size={16} name={'dudesWire16'}/>{count}</div>);
    }

    renderPlaceTypeCell(text: string, record: IPlace, index: any) {
        if (record.policy && record.privacy) {
            return <Row className='placeType' type='flex' align='middle'><PlacePolicy place={record} text={true}
                                                                                      type={true}/></Row>;
        }
        return '';
    }

    renderPoliciesCell(text: string, record: IPlace, index: any) {
        if (record.policy && record.privacy) {
            return <div className='placePolicies'><PlacePolicy place={record} text={false} search={true}
                                                               receptive={true}/>
            </div>;
        }
        return '';
    }

    renderRemoveCell(text: string, record: IPlace, index: any) {
        return (<div className='placeRemove' onClick={this.toggleRemoveDefaultPlaceModal.bind(this, record._id)}>
            <IcoN size={16} name={'bin16'}/></div>);
    }

    toggleAddDefaultPlaceModal = () => {
        this.setState({
            visibleAddDefaultPlaceModal: !this.state.visibleAddDefaultPlaceModal,
        });
    }

    toggleRemoveDefaultPlaceModal = (place?: string) => {
        this.setState({
            visibleRemoveDefaultPlaceModal: !this.state.visibleRemoveDefaultPlaceModal,
            selectedPlace: place || null,
        });
    }

    addPlaces = (places: IPlace[]) => {
        const ids = places.map((place: IPlace) => {
            return place._id;
        }).join(',');
        this.placeApi.addDefaultPlace({
            place_ids: ids,
        }).then(() => {
            this.setState({
                places: [...this.state.places, ...places],
                visibleAddDefaultPlaceModal: false,
            });
        }).catch(() => {
            message.error(`Can't add default place!`, 3000);
            this.setState({
                visibleAddDefaultPlaceModal: false,
            });
        });
    }

    removePlace = () => {
        this.placeApi.removeDefaultPlace({
            place_ids: this.state.selectedPlace,
        }).then(() => {
            const {places} = this.state;
            const index = _.findIndex(places, {_id: this.state.selectedPlace});
            if (index > -1) {
                places.splice(index, 1);
                this.setState({
                    places,
                    visibleRemoveDefaultPlaceModal: false,
                });
            }
        }).catch(() => {
            message.error(`Can't remove default place!`, 3000);
            this.setState({
                visibleRemoveDefaultPlaceModal: false,
            });
        });
    }

    render() {
        const columns = [
            {
                key: 'name',
                index: 0,
                title: 'Place Name',
                renderer: 'place',
            },
            {
                key: 'creators',
                index: 2,
                title: 'Managers',
                renderer: 'users',
                width: 140,
            },
            {
                key: 'counters.counters',
                index: 3,
                title: 'Members',
                renderer: 'memberCounter',
                icon: 'member',
                width: 96,
            },
            {
                key: 'type',
                index: 4,
                renderer: 'placeType',
                width: 128,
                title: 'Place Type'
            },
            {
                key: 'policies',
                index: 5,
                title: 'Policies',
                renderer: 'placePolicy',
                width: 80
            },
            {
                key: 'remove',
                index: 6,
                title: '',
                renderer: 'remove',
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
                case 'placeType':
                    renderer = this.renderPlaceTypeCell;
                    break;
                case 'placePolicy':
                    renderer = this.renderPoliciesCell;
                    break;
                case 'remove':
                    renderer = this.renderRemoveCell.bind(this);
                    break;
            }
            const col = {
                title: column.title,
                dataIndex: column.key,
                key: column.key,
                render: renderer,
                width: null,
            };
            if (column.width) {
                col.width = column.width;
            }
            return col;
        });

        return (
            <div className='places'>
                <AddPlaceModal
                    addPlaces={this.addPlaces}
                    onClose={this.toggleAddDefaultPlaceModal}
                    visible={this.state.visibleAddDefaultPlaceModal}/>
                {this.state.visibleRemoveDefaultPlaceModal && <Modal
                    content=''
                    title='Remove Place'
                    width={360}
                    visible={this.state.visibleRemoveDefaultPlaceModal}
                    onCancel={this.toggleRemoveDefaultPlaceModal}
                    footer={[
                        <Button key='cancel' type=' butn butn secondary' size='large'
                                onClick={this.toggleRemoveDefaultPlaceModal}>Cancel</Button>,
                        <Button key='submit' type=' butn butn-red' size='large'
                                onClick={this.removePlace}>Remove</Button>,
                    ]}
                >
                    Remove <b>"{this.state.selectedPlace}"</b> from default places,<br/>
                    Are you sure?
                </Modal>}
                <Row type='flex' align='middle' className='scene-head'>
                    <h2>Default places</h2>
                    <Button type=' butn butn-green secondary' onClick={this.toggleAddDefaultPlaceModal}>Add Default
                        Place</Button>
                </Row>
                <div className='white-block-container'>
                    <Row>
                        <Col span={24}>
                            <div className='places-list'>
                                {this.state.visiblePlaceModal &&
                                <PlaceModal visible={this.state.visiblePlaceModal} place={this.selectedPlace}
                                            onClose={this.closePlaceModal}/>
                                }
                                <Table
                                    pagination={this.state.pagination}
                                    onChange={this.handleTableChange}
                                    rowKey='_id'
                                    columns={columns}
                                    dataSource={this.state.places}
                                    size='middle nst-table'
                                    className='nst-table'
                                    scroll={{x: 960}}
                                />
                                <Loading active={this.state.loading} position='absolute'/>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default DefaultPlaces;
