import {IDispatch} from '~react-redux~redux';
import * as React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Table, notification, Card, Button, Input, Checkbox} from 'antd';
import AppApi from '../../api/app/index';
import Create from './addApplications/index';
import {IcoN} from '../../components/icon/index';
import BarMenu from './../../components/Filter/BarMenu';
import {findIndex} from 'lodash';


export interface IApp {
    isChecked: boolean;
    _id: string;
    name: string;
    developer: string;
    icon_small_url: string;
    icon_large_url: string;
}

export interface IAppsProps {
}

export interface IAppsState {
    apps: any[];
    pagination: any;
    selectedItems: any[];
    searchKeyword: string;
    sendManyMessage: boolean;
    createAppVisible: boolean;
    notifyChildrenUnselect: boolean;
}

class Apps extends React.Component <IAppsProps, IAppsState> {
    AppApi: any;
    pageLimit: number = 10;

    constructor(props: IAppsProps) {
        super(props);
        this.state = {
            apps: [],
            pagination: {},
            selectedItems: [],
            searchKeyword: '',
            sendManyMessage: false,
            createAppVisible: false,
            notifyChildrenUnselect: false,
        };
    }

    searchKeyDown(event: any) {
        this.setState({
            searchKeyword: event.currentTarget.value || '',
        }, this.fetchApps);
    }

    clearQuery() {
        this.setState({
            searchKeyword: '',
        });
    }

    handleTableChange = (pagination: any, filters: any, sorter: any) => {
        // console.log(arguments);
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        setTimeout(() => {
            this.fetchApps();
        }, 100);
    }

    fetchApps = () => {
        this.AppApi.search({
            limit: this.pageLimit,
            skip: (this.state.pagination.current - 1) * this.pageLimit,
            keyword: this.state.searchKeyword,
        }).then(this.setApps.bind(this));
    }

    setApps(data: any) {
        const {apps} = data;
        this.setState({
            apps: apps,
        });
        if (this.state.searchKeyword.length > 0) {
            this.setState({
                pagination: {
                    pageSize: this.pageLimit,
                    current: 1,
                    total: apps.length,
                }
            });
        } else {
            this.setState({
                pagination: {
                    pageSize: this.pageLimit,
                    current: this.state.pagination.current,
                    total: apps.length,
                }
            });
        }
    }

    toggleCreateApp = () => {
        this.setState({
            createAppVisible: !this.state.createAppVisible,
        });
    }

    unselectAll() {
        this.setState({
            selectedItems: []
        });
    }

    componentDidMount() {
        this.AppApi = new AppApi();
        this.fetchApps();
    }

    removeApp = (app_id?: string) => {
        if (!app_id && app_id !== '') {
            this.state.selectedItems.forEach((app: IApp) => {
                this.removeApp(app._id);
            });
        } else {
            this.AppApi.remove({app_id})
                .then(this.fetchApps);
        }
        this.unselectAll();
    }

    onCheckboxChange = (event, app: IApp) => {
        event.stopPropagation();
        app.isChecked = !app.isChecked;
        let selectedItems = [...this.state.selectedItems];
        if (app.isChecked) {
            selectedItems.push(app);
        } else {
            selectedItems.splice(findIndex(selectedItems, {id: app._id}), 1);
        }
        this.setState({
            selectedItems
        });
    }

    private create = (data) => {
        this.AppApi.register({
            app_id: data.id,
            app_name: data.name,
            homepage: data.homepage,
            developer: data.developer,
            icon_large_url: data.logoUrl,
            icon_small_url: data.thumbnailUrl,
        }).then(this.fetchApps);
        this.toggleCreateApp();
    }

    render() {
        const isSelected = this.state.selectedItems.length;
        var columns = [
            {
                key: '_id',
                index: 0,
                title: (<span>App ID</span>),
                renderer: 'id',
                width: 140,
            },
            {
                key: 'name',
                index: 1,
                title: (<span>App Name</span>),
                renderer: 'name',
            },
            {
                key: 'developer',
                index: 2,
                title: (<span>Developer</span>),
                renderer: 'developer',
                width: 140,
            },
            {
                key: 'homepage',
                index: 3,
                title: (<span>Homepage</span>),
                renderer: 'homepage',
                width: 320,
            },
            {
                key: 'logo',
                index: 3,
                title: (<span>Logo</span>),
                renderer: 'logo',
                width: 32,
            },
        ].map((column) => {
            let renderer: (text: string, record: IApp, index: any) => {};
            switch (column.renderer) {
                case 'id':
                    renderer = (text: string, record: IApp, index: any) => {
                        // console.log(text, record);
                        return <Row type='flex' align='middle'>
                            <Row type='flex' align='middle'>
                                <Checkbox onChange={(event) => this.onCheckboxChange(event, record)}
                                          checked={record.isChecked}/>
                                <span>{text}</span>
                            </Row>
                        </Row>;
                    };
                    break;
                case 'logo':
                    renderer = (text: string, record: IApp, index: any) => {
                        return (<Row type='flex' align='middle'>
                            <img width='32' height='32' alt={text} src={record.icon_small_url}/>
                        </Row>);
                    };
                    break;
                case 'name':
                case 'developer':
                case 'homepage':
                    renderer = (text: string, record: IApp, index: any) => <span>{text}</span>;
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
            <div className='charts-scene'>
                <Row type='flex' align='middle' className='scene-head'>
                    <h2>Apps</h2>
                    <a href='https://store.nested.me/' target='_blank'><Button type='butn butn-green secondary'>Add
                        Application</Button></a>
                </Row>
                <div className='white-block-container'>
                    <Row className={[
                        'toolbar',
                        isSelected ? 'selcted-mode' : '',
                    ].join(' ')} type='flex'>
                        {!isSelected && (<div className='filter-search'>
                            <Input className='filter-search' value={this.state.searchKeyword}
                                   placeholder='type to search...'
                                   onChange={this.searchKeyDown.bind(this)}/>
                            {this.state.searchKeyword.length === 0 && <IcoN size={16} name={'search16'}/>}
                            {this.state.searchKeyword.length > 0 &&
                            <div className='_cp' onClick={this.clearQuery.bind(this)}><IcoN size={16}
                                                                                            name={'xcross16'}/></div>
                            }
                        </div>)}
                        {isSelected && (
                            <div className='default-mode-butn _cp' onClick={this.unselectAll.bind(this)}>
                                <IcoN size={16} name={'xcross16'}/>
                            </div>
                        )}
                        {isSelected && (
                            <span className='bar-item'><b> {isSelected} Application Selected</b></span>
                        )}
                        <div className='filler'></div>
                        {isSelected && (
                            <BarMenu menus={[{
                                key: 'remove',
                                name: 'Delete',
                                icon: 'bin16'
                            }]} onChange={() => {
                                this.removeApp();
                            }}/>
                        )}
                        {/* {isSelected && (
                            <BarMenu menus={[{
                                key: 'addMember',
                                name: 'Add Member',
                                icon: 'member16'}]} onChange={this.addMember}/>
                        )} */}
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Table
                                pagination={this.state.pagination}
                                onChange={this.handleTableChange}
                                rowKey='_id'
                                columns={columns}
                                dataSource={this.state.apps}
                                size='middle nst-table'
                                className='nst-table'
                                scroll={{x: 960}}
                            />
                        </Col>
                    </Row>
                </div>
                {/* <Row>
                    <Card loading={false}>
                        <ul>
                            {this.state.apps.map( app => (
                                <li>
                                    <img src={app.icon_large_url} alt='' />
                                    <span>{app.name}</span>
                                    <button onClick={() => this.removeApp(app._id)}>Remove</button>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </Row> */}
                <Create visible={this.state.createAppVisible} handleClose={this.toggleCreateApp}
                        handleCreate={this.create}/>
                <Button type=' butn butn-white secondary margin-top-10' onClick={this.toggleCreateApp}>Add Custom
                    Application</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Apps);
