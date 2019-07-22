import _ from 'lodash';
import * as React from 'react';
import MaterialTable from 'material-table';
import PlaceApi from '../../api/place/index';
import IPlace from '../../interfaces/IPlace';
import IUser from '../../interfaces/IUser';
import SystemApi from '../../api/system/index';
import tableIcons from '../../components/table-icons/index';
import UserAvatar from '../../components/avatar/index';
import SendMessageModal from '../../components/SendMessageModal/index';
import PlaceView from '../../components/placeview/index';
import PlaceModal from '../../components/PlaceModal/index';
import IGetSystemCountersResponse from '../../interfaces/IGetSystemCountersResponse';
import CPlaceFilterTypes from '../../consts/CPlaceFilterTypes';
import PlaceListSort from '../../consts/PlaceListSort';
import { IcoN } from '../../components/icon/index';
import Loading from '../../components/Loading/index';
import PlacePolicy from '../../components/PlacePolicy/index';
import CreatePlaceModal from '../../components/CreatePlaceModal/index';
import appLoader from '../../components/Loading/app-loading';
import AddMemberModal from '../../components/AddMember/index';
import { Button, Tabs, Tab } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { withSnackbar } from 'notistack';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';

export interface IPlaceListColumn {
  key: string;
  title: string;
  renderer: string;
  index: number;
  icon?: string;
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
  style?: string;
  class?: string;
}

interface IListProps {
  classes: any;
  enqueueSnackbar: (
    message: React.ReactNode | string,
    options?: any
  ) => string | number | null | undefined;
  closeSnackbar: () => void;
}

interface IListState {
  places: IPlace[];
  counters: IGetSystemCountersResponse;
  visibleAddMemberModal: boolean;
  visibleCreatePlaceModal: boolean;
  sendMessageVisible: boolean;
  visibleDeletePlace: boolean;
  loading: boolean;
  pagination: any;
  selectedFilter: CPlaceFilterTypes;
  visibelPlaceModal?: boolean;
  selectedPlace?: IPlace;
  isAbsoluteView: boolean;
  query: string;
  focusPlace: string;
  selectedTab: number;
}

class Places extends React.Component<IListProps, IListState> {
  private selectedPlace: IPlace | null = null;
  private placeApi: PlaceApi = new PlaceApi();
  private systemApi: SystemApi = new SystemApi();
  private tableRef = React.createRef();
  private PAGE_SIZE = 10;
  private currentPage: number = 1;
  private totalCount: number = 0;
  private query: string = '';
  private defaultFilter: any = [CPlaceFilterTypes.GRAND_PLACES, CPlaceFilterTypes.LOCKED_PLACES];
  private filter: CPlaceFilterTypes = CPlaceFilterTypes.ALL;

  constructor(props: any) {
    super(props);
    this.state = {
      places: [],
      visibleAddMemberModal: false,
      visibleCreatePlaceModal: false,
      sendMessageVisible: false,
      visibleDeletePlace: false,
      loading: false,
      selectedFilter: CPlaceFilterTypes.ALL,
      counters: {} as IGetSystemCountersResponse,
      selectedTab: 0,
      query: '',
      focusPlace: '',
      pagination: {},
      isAbsoluteView: true,
    };
  }

  componentDidMount() {
    this.systemApi.getSystemCounters().then((data: IGetSystemCountersResponse) => {
      this.setState({
        counters: data,
      });
    });
    appLoader.hide();
  }

  componentWillUnmount() {
    // window.removeEventListener('place_updated', this.reload, false);
  }

  reload = () => {
    if (
      this.tableRef &&
      this.tableRef.current &&
      typeof (this.tableRef.current as any).onQueryChange === 'function'
    ) {
      (this.tableRef.current as any).onQueryChange();
    }
  };

  showPlaceModal = (record: IPlace) => {
    this.selectedPlace = record;
    this.setState({
      selectedPlace: record,
      visibelPlaceModal: true,
    });
  };

  onItemClick = (event, record: IPlace) => {
    this.showPlaceModal(record);
  };

  closePlaceModal = () => {
    this.setState({
      visibelPlaceModal: false,
    });
  };

  tabChangeHandler = (e: React.ChangeEvent<{}>, selectedTab: any) => {
    this.setState(
      {
        selectedTab: parseInt(selectedTab),
      },
      this.reload
    );
  };

  nameRender = (record: IPlace, type) => (
    <PlaceView
      borderRadius="4px"
      place={record}
      size={32}
      avatar={true}
      name={true}
      id={true}
      onClick={this.showPlaceModal}
    />
  );

  renderUsersCell = (record: IPlace, type) => {
    let users: JSX.Element[] = [];
    let moreUserCounter = 0;
    const limit = 3;

    if (record.creators && record.creators.length > 0) {
      record.creators.forEach((userId: string) => {
        if (users.length >= limit) {
          moreUserCounter++;
          return;
        }
        users.push(<UserAvatar avatar={true} key={userId} user={userId} size={16} />);
      });
    }
    return (
      <div className={this.props.classes.managers}>
        {users}
        {moreUserCounter > 0 && <span>+{moreUserCounter}</span>}
      </div>
    );
  };

  renderMemberCounterCell = (record: IPlace, type) => {
    const count = record.counters.creators + record.counters.key_holders;
    return (
      <div className={this.props.classes.membersCounter}>
        <IcoN size={16} name={'dudesWire16'} />
        {count}
      </div>
    );
  };

  renderPoliciesCell = (record: IPlace, type) => {
    return (
      <div className={this.props.classes.policies}>
        <PlacePolicy place={record} text={false} search={true} receptive={true} />
      </div>
    );
  };

  renderSubPlaceCounterCell = (record: IPlace, type) => {
    const count = record.counters.childs;
    return <div>{count}</div>;
  };

  renderPlaceTypeCell = (record: IPlace, type) => {
    return (
      <div className={this.props.classes.membersCounter}>
        <PlacePolicy place={record} text={true} type={true} />
      </div>
    );
  };

  render() {
    console.log(this.filter);
    switch (this.filter) {
      case CPlaceFilterTypes.SHARED_PLACES:
        this.totalCount =
          this.state.counters.locked_places +
          this.state.counters.unlocked_places +
          this.state.counters.grand_places;
        break;
      case CPlaceFilterTypes.LOCKED_PLACES:
        this.totalCount = this.state.counters.locked_places || 0;
        break;
      case CPlaceFilterTypes.UNLOCKED_PLACES:
        this.totalCount = this.state.counters.unlocked_places || 0;
        break;
      case CPlaceFilterTypes.PERSONAL_PLACES:
        this.totalCount = this.state.counters.personal_places || 0;
        break;
      default:
        this.totalCount =
          this.state.counters.grand_places +
          this.state.counters.locked_places +
          this.state.counters.unlocked_places +
          this.state.counters.personal_places;
        break;
    }

    if (this.totalCount < this.PAGE_SIZE) {
      this.totalCount = this.PAGE_SIZE;
    }

    const cellStyle = {
      autoLayout: 'fixed',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    };

    const columns = [
      {
        field: 'name',
        title: 'Place Name',
        filtering: false,
        sorting: false,
        render: this.nameRender,
      },
      {
        field: 'creators',
        title: 'Managers',
        filtering: false,
        render: this.renderUsersCell,
        cellStyle: { ...cellStyle, minWidth: '200px', width: '200px', maxWidth: '200px' },
        headerStyle: { ...cellStyle, minWidth: '200px', width: '200px', maxWidth: '200px' },
      },
      {
        field: 'key_holders',
        title: 'Members',
        filtering: false,
        render: this.renderMemberCounterCell,
        cellStyle: { ...cellStyle, minWidth: '150px', width: '150px', maxWidth: '150px' },
        headerStyle: { ...cellStyle, minWidth: '150px', width: '150px', maxWidth: '150px' },
      },
      {
        field: 'place_type',
        title: 'Place Type',
        render: this.renderPlaceTypeCell,
        cellStyle: { ...cellStyle, minWidth: '200px', width: '200px', maxWidth: '200px' },
        headerStyle: { ...cellStyle, minWidth: '200px', width: '200px', maxWidth: '200px' },
        lookup: {
          shared: CPlaceFilterTypes.SHARED_PLACES,
          personal: CPlaceFilterTypes.PERSONAL_PLACES,
        },
      },
      {
        field: 'children',
        title: 'Sub-places',
        filtering: false,
        render: this.renderSubPlaceCounterCell,
        cellStyle: { ...cellStyle, minWidth: '150px', width: '150px', maxWidth: '150px' },
        headerStyle: { ...cellStyle, minWidth: '150px', width: '150px', maxWidth: '150px' },
      },
      {
        field: 'policies',
        title: 'Policies',
        filtering: false,
        sorting: false,
        render: this.renderPoliciesCell,
        cellStyle: { ...cellStyle, minWidth: '100px', width: '100px', maxWidth: '100px' },
        headerStyle: { ...cellStyle, minWidth: '100px', width: '100px', maxWidth: '100px' },
      },
    ];

    return (
      <div className="places">
        <div className="scene-head">
          <Tabs
            value={this.state.selectedTab}
            indicatorColor="primary"
            textColor="primary"
            onChange={this.tabChangeHandler}
          >
            <Tab label="Shared Places" icon={<IcoN size={24} name={'dudesWire24'} />} />
            <Tab label="Individual Places" icon={<IcoN size={24} name={'dudeWire24'} />} />
          </Tabs>
        </div>
        <div className="places-list">
          {this.state.visibelPlaceModal && this.selectedPlace && (
            <PlaceModal
              visible={this.state.visibelPlaceModal}
              place={this.selectedPlace}
              onClose={this.closePlaceModal}
            />
          )}
          <CreatePlaceModal
            visible={this.state.visibleCreatePlaceModal}
            onClose={() => this.toggleCreatePlaceModal()}
            grandPlaceId={this.state.focusPlace}
          />
          <AddMemberModal
            addMembers={this.addMembers.bind(this)}
            onClose={this.toggleAddMemberModal.bind(this)}
            visible={this.state.visibleAddMemberModal}
          />
          <SendMessageModal
            onClose={this.sendMessageToggle}
            visible={this.state.sendMessageVisible}
            target={this.state.focusPlace}
          />
          <Dialog
            open={this.state.visibleDeletePlace}
            onClose={() => this.toggleDeletePlaceModal()}
            fullWidth={true}
            maxWidth="sm"
          >
            <DialogTitle>Delete Place</DialogTitle>
            <DialogContent>
              <DialogContentText>
                By deleting this Place all data will erase and have no irreverse action.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => this.toggleDeletePlaceModal()}
              >
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={this.deletePlaces}>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          <MaterialTable
            icons={tableIcons}
            tableRef={this.tableRef}
            parentChildData={(row: IPlace, rows: IPlace[]) =>
              !this.state.isAbsoluteView &&
              this.filter !== CPlaceFilterTypes.ALL &&
              rows.find(a => a._id === row.grand_parent_id && a._id !== row._id)
            }
            onRowClick={this.onItemClick}
            title="Places"
            isLoading={this.state.loading}
            components={{
              OverlayLoading: (props: any, context?: any) => (
                <Loading active={true} position="absolute" />
              ),
            }}
            columns={columns}
            actions={[
              {
                icon: () => <IcoN size={24} name={'cross24'} />,
                tooltip: 'Create Grand place',
                isFreeAction: true,
                onClick: event => this.toggleCreatePlaceModal(),
              },
              {
                icon: () => <IcoN size={16} name={'brickWall16'} />,
                tooltip: 'Create a Private Place',
                onClick: (event, rowData: IPlace[]) =>
                  rowData.forEach(record => this.toggleCreatePlaceModal(record._id)),
              },
              {
                icon: () => <IcoN size={16} name={'message16'} />,
                tooltip: 'Post a Message',
                onClick: (event, rowData: IPlace[]) =>
                  this.sendMessageToggle(rowData.map(record => record._id).join(',')),
              },
              {
                icon: () => <IcoN size={16} name={'person16'} />,
                tooltip: 'Add Member',
                // disabled: record.type !== C_PLACE_TYPE['0'],
                onClick: (event, rowData: IPlace[]) =>
                  rowData.forEach(record => this.toggleAddMemberModal(record._id)),
              },
              {
                icon: () => <IcoN size={16} name={'bin16'} />,
                tooltip: 'Delete',
                // disabled: record.grand_parent_id !== record._id || record.type !== C_PLACE_TYPE['0']
                onClick: (event, rowData: IPlace[]) =>
                  rowData.forEach(record => this.toggleDeletePlaceModal(record._id)),
              },
              {
                icon: () =>
                  !this.state.isAbsoluteView ? (
                    <IcoN size={16} name={'placesRelation16'} />
                  ) : (
                    <IcoN size={16} name={'listView16'} />
                  ),
                tooltip: !this.state.isAbsoluteView ? 'Relation view' : 'Absolute view',
                isFreeAction: true,
                onClick: (event, rowData: IPlace[]) => {},
                // this.setState({ isAbsoluteView: !this.state.isAbsoluteView }),
              },
            ]}
            options={{
              selection: true,
              columnsButton: true,
              exportButton: true,
              filtering: false,
              pageSize: 10,
              debounceInterval: 512,
              pageSizeOptions: [10, 50, 100],
              emptyRowsWhenPaging: false,
              showTitle: false,
            }}
            data={async ({ filters, page, pageSize, search, orderBy, orderDirection }) => {
              this.currentPage = page;
              this.PAGE_SIZE = pageSize;
              this.query = search;
              if (this.state.selectedTab === 0) {
                this.filter = CPlaceFilterTypes.SHARED_PLACES;
                if (!this.state.isAbsoluteView) {
                  this.filter = CPlaceFilterTypes.GRAND_PLACES;
                }
              } else {
                this.filter = CPlaceFilterTypes.PERSONAL_PLACES;
              }

              // if (this.state.selectedFilter !== CPlaceFilterTypes.ALL) {
              //   filter = this.state.selectedFilter;
              //   this.setState({
              //     isAbsoluteView: 'absolute',
              //   });
              // } else {
              //   this.setState({
              //     isAbsoluteView: 'relation',
              //   });
              // }
              // if (filters.length > 0) {
              //   this.defaultFilter =
              //     filters[0].value.length > 0 ? filters[0].value : this.defaultFilter;
              //   if (this.defaultFilter.length === 1) {
              //     if (this.defaultFilter[0] === 'true') {
              //       this.filter = CPlaceFilterTypes.Active;
              //     } else if (this.defaultFilter[0] === 'false') {
              //       this.filter = CPlaceFilterTypes.Deactive;
              //     }
              //   }
              // }
              let sort = PlaceListSort.none;
              if (orderBy) {
                console.log(orderBy.field);
                switch (orderBy.field) {
                  case 'key_holders':
                    sort =
                      orderDirection === 'desc' ? PlaceListSort.MEMBERDesc : PlaceListSort.MEMBER;
                    break;
                  case 'creators':
                    sort =
                      orderDirection === 'desc' ? PlaceListSort.CREATORDesc : PlaceListSort.CREATOR;
                    break;
                  case 'children':
                    sort =
                      orderDirection === 'desc'
                        ? PlaceListSort.CHILDRENDesc
                        : PlaceListSort.CHILDREN;
                    break;
                  case 'place_type':
                    sort = orderDirection === 'desc' ? PlaceListSort.TYPEDesc : PlaceListSort.TYPE;
                    break;
                }
              }
              const grand = await this.getData(page, pageSize, this.filter, sort);
              // const child = await Promise.all(
              //   grand.filter(p => p.counters.childs > 0).map(p => this.getChild(p._id))
              // );
              return {
                // data: [...grand, ..._.flatMap(child)],
                data: grand,
                page,
                totalCount: this.query ? grand.length : this.totalCount,
              };
            }}
          />
        </div>
      </div>
    );
  }

  private async getData(
    page?: number,
    size?: number,
    filter?: CPlaceFilterTypes,
    sort?: PlaceListSort
  ) {
    this.setState({ loading: true });
    page = page || this.currentPage;
    size = size || this.PAGE_SIZE;
    const skip = page * size;

    const result = await this.placeApi.placeList({
      filter,
      keyword: this.query || '',
      limit: size,
      skip,
      sort: sort || PlaceListSort.none,
    });
    this.setState({ loading: false });
    return result;
  }

  private getChild = async (grand_parent_id: string) =>
    await this.placeApi.placeList({
      limit: 100,
      skip: 0,
      grand_parent_id,
    });

  private toggleCreatePlaceModal = (focusPlace: string = '') => {
    this.setState({
      focusPlace,
      visibleCreatePlaceModal: !this.state.visibleCreatePlaceModal,
    });
  };

  private toggleAddMemberModal(focusPlace: string = '') {
    this.setState({
      focusPlace: this.state.visibleAddMemberModal ? '' : this.state.focusPlace,
      visibleAddMemberModal: !this.state.visibleAddMemberModal,
    });
  }

  private toggleDeletePlaceModal = (focusPlace: string = '') => {
    this.setState({
      focusPlace: this.state.visibleDeletePlace ? '' : focusPlace,
      visibleDeletePlace: !this.state.visibleDeletePlace,
    });
  };

  private sendMessageToggle(focusPlace: string) {
    this.setState({
      focusPlace: this.state.sendMessageVisible ? '' : focusPlace,
      sendMessageVisible: !this.state.sendMessageVisible,
    });
  }

  private addMembers(members: IUser[]) {
    if (members.length === 0) {
      return;
    }
    const membersId = _.map(members, user => {
      return user._id;
    }).join(',');
    this.placeApi
      .placeAddMember({
        place_id: this.state.focusPlace,
        account_id: membersId,
      })
      .then(() => {
        this.props.enqueueSnackbar(
          `${members.length} member(s) added to "${this.state.focusPlace}"`,
          {
            variant: 'success',
          }
        );
      });
  }

  private deletePlaces = () => {
    this.placeApi
      .placeDelete({
        place_id: this.state.focusPlace,
      })
      .then(data => {
        this.props.enqueueSnackbar(`"${this.state.focusPlace}" is deleted`, {
          variant: 'success',
        });
        this.reload();
      })
      .catch(data => {
        if (data.err_code === 1) {
          if (data.items.indexOf('remove_children_first') > -1) {
            this.props.enqueueSnackbar(`Remove children first`, {
              variant: 'warning',
            });
          }
        }
      });
    this.toggleDeletePlaceModal();
  };
}

export default withStyles((theme: Theme) =>
  createStyles({
    managers: {
      display: 'flex',
      '& > *': {
        margin: '0 2px',
      },
    },
    membersCounter: {
      opacity: 0.62,
      color: theme.palette.text.primary,
      fontSize: '13px',
      '& i': {
        transform: 'translateY(-3px)',
        margin: '0 4px',
      },
    },
    policies: {
      opacity: 0.4,
    },
  })
)(withSnackbar(Places));
