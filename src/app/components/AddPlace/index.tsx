import * as React from 'react';
import {
    Modal,
    Row,
    Button,
    Input,
} from 'antd';

import _ from 'lodash';
import IPlace from '../../api/place/interfaces/IPlace';
import PlaceApi from '../../api/place/index';
import PlaceView from '../placeview/index';
import C_PLACE_TYPE from '../../api/consts/CPlaceType';

interface IProps {
    visible: boolean;
    onClose?: () => {};
    addPlaces: (places: IPlace[]) => {};
    places?: IPlace[];
}

interface IStates {
    visible: boolean;
    places: IPlace[];
    suggests: IPlace[];
    selectedPlaces: IPlace[];
    query: string;
    hasMore: boolean;
}

export default class AddPlaceModal extends React.Component <IProps, IStates> {
    placeApi: any;
    searchIt: any;
    searchSetting: any;

    constructor(props: any) {
        super(props);
        this.searchIt = _.debounce(this.searchPlaces, 512);
        this.state = {
            visible: false,
            places: this.props.places || [],
            suggests: [],
            selectedPlaces: [],
            query: '',
            hasMore: false,
        };
        this.searchSetting = {
            skip: 0,
            limit: 10,
            keyword: '',
        };

        this.placeApi = new PlaceApi();
    }

    componentDidMount() {
        this.searchPlaces('');
    }

    updateSuggestions(places?: IPlace[], callback?: any) {
        if (places === undefined) {
            places = this.state.suggests;
        }
        let list = _.differenceBy(places, this.state.selectedPlaces, '_id');
        list = _.differenceBy(list, this.state.places, '_id');
        list = _.uniqBy(list, '_id');
        if (_.isFunction(callback)) {
            callback(list);
        }
        this.setState({
            suggests: list,
        });
    }

    fullFillList(places: any[], list: any[]) {
        if (places.length >= this.searchSetting.limit) {
            this.setState({
                hasMore: true,
            });
            if (list.length === 0) {
                this.loadEvenMore();
            }
        } else {
            this.setState({
                hasMore: false,
            });
        }
    }

    loadEvenMore() {
        this.searchSetting.skip += this.searchSetting.limit;
        const filter = 'shared_places';
        this.placeApi.placeList({
            filter,
            keyword: this.searchSetting.keyword,
            limit: this.searchSetting.limit,
            skip: this.searchSetting.skip,
        }).then((places) => {
            this.updateSuggestions(this.state.suggests.concat(places), (list: any) => {
                this.fullFillList(places, list);
            });
        });
    }

    searchPlaces(keyword: string) {
        this.searchSetting.skip = 0;
        const filter = 'shared_places';
        this.placeApi.placeList({
            filter,
            keyword: this.searchSetting.keyword,
            limit: this.searchSetting.limit,
            skip: this.searchSetting.skip,
        }).then((places) => {
            this.searchSetting.keyword = keyword;
            this.updateSuggestions(places, (list: any) => {
                this.fullFillList(places, list);
            });
        });
    }

    updateSearchQuery(event: any) {
        const keyword = event.currentTarget.value;
        this.setState({
            query: keyword,
        }, () => {
            this.searchIt(keyword);
        });
    }

    componentWillReceiveProps(props: any) {
        this.setState({
            visible: props.visible,
            places: props.places,
        });
    }

    addThisPlace(place: IPlace) {
        const selectedPlaces = this.state.selectedPlaces;
        const index = _.findIndex(selectedPlaces, {
            _id: place._id,
        });
        if (index === -1) {
            selectedPlaces.push(place);
            this.setState({
                selectedPlaces: selectedPlaces,
            }, () => {
                this.updateSuggestions(this.state.suggests);
            });
        }
    }

    removeThisPlace(place: any) {
        if (_.isObject(place)) {
            place = place._id;
        }
        const places = this.state.selectedPlaces;
        const index = _.findIndex(places, {
            _id: place,
        });
        if (index > -1) {
            places.splice(index, 1);
            this.setState({
                selectedPlaces: places,
            }, () => {
                this.searchPlaces(this.state.query);
            });
        }
    }

    getSuggests() {
        const list = this
            .state
            .suggests
            .map((p: IPlace) => {
                return (
                    <li key={p._id + 'ss'}>
                        <Row type='flex' align='middle'>
                            <PlaceView borderRadius='4' place={p} size={32} avatar={true} name={true} id={true}/>
                            <div className='user-detail'/>
                            {Boolean(p.type !== 'personal') &&
                            <div className='add-button _cp' onClick={this.addThisPlace.bind(this, p)}>Add</div>}
                        </Row>
                    </li>
                );
            });
        return (
            <ul className='suggests'>
                {list}
                <li key={'add_member_load_more'}>
                    <Button className='butn butn-white full-width' onClick={this.loadEvenMore.bind(this)}>
                        Load More...
                    </Button>
                </li>
            </ul>
        );
    }

    getSelectedPlaces() {
        const list = this
            .state
            .selectedPlaces
            .map((p: IPlace) => {
                return (
                    <li key={p._id} onClick={this.removeThisPlace.bind(this, p)}>
                        <Row type='flex' align='middle'>
                            <PlaceView borderRadius='4' place={p} size={32} avatar={true} id={true}/>
                        </Row>
                    </li>
                );
            });
        return (
            <ul className='selecteds'>
                {list}
            </ul>
        );
    }

    handleCancel() {
        this.props.onClose();
    }

    addPlaces() {
        if (this.props.addPlaces) {
            this.props.addPlaces(_.merge(_.clone(this.state.selectedPlaces), {
                admin: false,
            }));
        }
        this.props.onClose();
        this.setState({
            selectedPlaces: [],
            query: '',
        });
        this.searchPlaces('');
    }

    render() {

        const modalFooter = (
            <div className='modal-foot'>
                <Button
                    type=' butn butn-green full-width'
                    onClick={this.addPlaces.bind(this)}>add {this.state.selectedPlaces.length} Places</Button>
            </div>
        );
        return (
            <Modal
                className='add-member-modal'
                maskClosable={true}
                width={480}
                onCancel={this.handleCancel.bind(this)}
                visible={this.state.visible}
                footer={modalFooter}
                title='Add Place'>
                <Row className='input-area' type='flex'>
                    {this.getSelectedPlaces()}
                    <Input
                        id='name'
                        size='large'
                        autoComplete={'off'}
                        className='nst-input no-style'
                        value={this.state.query}
                        onChange={this.updateSearchQuery.bind(this)}
                        placeholder='Name or id'/>
                </Row>
                <Row>
                    {this.getSuggests()}
                </Row>
            </Modal>
        );
    }

}
