import * as React from 'react';
import _ from 'lodash';
import {Icon, Table, Dropdown, Card, TableColumnConfig} from 'antd';
import PlaceApi from '../../../api/place/index';
import IPlace from '../../../api/place/interfaces/IPlace';
import {columnsList, IPlaceListColumn} from './columsList';

interface IListProps {

}
interface IListState {
    places: Array<IPlace>;
}

export default class PlaceList extends React.Component<IListProps, IListState> {

    constructor(props: any) {
        super(props);
        this.state = {
            places: [],
        };
    }

    componentDidMount() {

        let placeApi = new PlaceApi();
        placeApi.placeList()
            .then((places: Array<IPlace>) => {
                this.setState({
                    places: places
                });
            });
    }

    renderPlaceCell(text: string, record: IPlace, index: any) {
        console.log(text, record, index);
        return text;
    }

    renderUsersCell(text: string, record: IPlace, index: any) {
        console.log(text, record, index);
        return text;
    }

    renderCounterCell(text: string, record: IPlace, index: any) {
        console.log(text, record, index);
        return text;
    }

    renderPlaceTypeCell(text: string, record: IPlace, index: any) {
        console.log(text, record, index);
        return text;
    }

    getColumns() {
        let columns: Array <TableColumnConfig> = [];
        columnsList.forEach((column: IPlaceListColumn) => {

            let renderer: (text: string, record: IPlace, index: any) => {};

            switch (column.renderer) {
                case 'place' :
                    renderer = this.renderPlaceCell;
                    break;
                case 'users' :
                    renderer = this.renderUsersCell;
                    break;
                case 'counter' :
                    renderer = this.renderCounterCell;
                    break;
                case 'placeType' :
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
        console.log(columns);
        return columns;
    }

    render() {
        let column = this.getColumns();
        return (
            <Card>
                <Table
                    rowKey='_id'
                    columns={column}
                    dataSource={this.state.places}
                    size='middle'
                    scroll={{x: 960}}
                />
            </Card>
        );
    }

}
