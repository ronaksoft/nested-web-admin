import * as React from 'react';
import { IcoN } from '../../../components/icon/index';
import PlaceApi from '../../../api/place/index';
import PlaceModal from '../../../components/PlaceModal/index';
import Loading from '../../../components/Loading/index';
import tableIcons from '../../../components/table-icons/index';
import IPlace from '../../../interfaces/IPlace';
import PlacePolicy from '../../../components/PlacePolicy/index';
import UserAvatar from '../../../components/avatar/index';
import PlaceView from '../../../components/placeview/index';
import AddPlaceModal from '../../../components/AddPlace/index';
import appLoader from '../../../components/Loading/app-loading';
import { Typography } from '@material-ui/core';
import MaterialTable from 'material-table';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';

export interface IProps {
  classes: any;
  enqueueSnackbar: (
    message: React.ReactNode | string,
    options?: any
  ) => string | number | null | undefined;
  closeSnackbar: () => void;
}

export interface IState {
  visiblePlaceModal?: boolean;
  loading: boolean;
  selectedPlace?: IPlace;
  visibleAddDefaultPlaceModal: boolean;
  visibleRemoveDefaultPlaceModal: boolean;
}

class DefaultPlaces extends React.Component<IProps, IState> {
  private placeApi: PlaceApi = new PlaceApi();
  private tableRef = React.createRef();

  private PAGE_SIZE = 10;
  private currentPage: number = 1;
  private query: string = '';

  constructor(props: IProps) {
    super(props);
    this.state = {
      visiblePlaceModal: false,
      loading: false,
      visibleAddDefaultPlaceModal: false,
      visibleRemoveDefaultPlaceModal: false,
    };
  }
  componentDidMount() {
    appLoader.hide();
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

  GetData = async (page: number = 0) => {
    return await this.placeApi.getDefaultPlace({
      limit: this.PAGE_SIZE,
      skip: page * this.PAGE_SIZE,
      keyword: this.query,
    });
  };

  showPlaceModal = (event, record: IPlace) => {
    this.setState({
      selectedPlace: record,
      visiblePlaceModal: true,
    });
  };

  closePlaceModal = () => {
    this.setState({
      visiblePlaceModal: false,
    });
  };

  renderPlaceCell(record: IPlace, type) {
    return (
      <PlaceView
        borderRadius="4px"
        place={record}
        size={32}
        avatar={true}
        name={true}
        id={true}
        className="indent-left"
      />
    );
  }

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
    let count = 0;
    if (record.counters) {
      count = record.counters.creators || 0 + record.counters.key_holders || 0;
    }
    return (
      <div className={this.props.classes.membersCounter}>
        <IcoN size={16} name={'dudesWire16'} />
        {count}
      </div>
    );
  };

  renderPlaceTypeCell = (record: IPlace, type) => {
    if (record.policy && record.privacy) {
      return (
        <div className={this.props.classes.membersCounter}>
          <PlacePolicy place={record} text={true} type={true} />
        </div>
      );
    }
    return '';
  };

  renderPoliciesCell = (record: IPlace, type) => {
    if (record.policy && record.privacy) {
      return (
        <div className={this.props.classes.policies}>
          <PlacePolicy place={record} text={false} search={true} receptive={true} />
        </div>
      );
    }
    return '';
  };

  toggleAddDefaultPlaceModal = () => {
    this.setState({
      visibleAddDefaultPlaceModal: !this.state.visibleAddDefaultPlaceModal,
    });
  };

  addPlaces = (places: IPlace[]) => {
    const ids = places
      .map((place: IPlace) => {
        return place._id;
      })
      .join(',');
    this.placeApi
      .addDefaultPlace({
        place_ids: ids,
      })
      .then(() => {
        this.reload();
      })
      .catch(() => {
        this.props.enqueueSnackbar(`Can't add default place!`, {
          variant: 'error',
        });
        this.setState({
          visibleAddDefaultPlaceModal: false,
        });
      });
  };

  removePlace = (place_ids: string) => {
    this.placeApi
      .removeDefaultPlace({
        place_ids,
      })
      .then(() => {
        this.reload();
      })
      .catch(() => {
        this.props.enqueueSnackbar(`Can't remove default place!`, {
          variant: 'error',
        });
        this.setState({
          visibleRemoveDefaultPlaceModal: false,
        });
      });
  };

  render() {
    const columns = [
      {
        title: 'Place Name',
        field: 'name',
        index: 0,
        render: this.renderPlaceCell,
      },
      {
        render: this.renderUsersCell,
        field: 'Creators',
        title: 'Managers',
        cellStyle: { minWidth: '150px', width: '150px', maxWidth: '150px' },
        headerStyle: { minWidth: '150px', width: '150px', maxWidth: '150px' },
      },
      {
        title: 'Members',
        field: 'key_holders',
        render: this.renderMemberCounterCell,
        cellStyle: { minWidth: '100px', width: '100px', maxWidth: '100px' },
        headerStyle: { minWidth: '100px', width: '100px', maxWidth: '100px' },
      },
      {
        title: 'Type',
        field: 'type',
        render: this.renderPlaceTypeCell,
        cellStyle: { minWidth: '200px', width: '200px', maxWidth: '200px' },
        headerStyle: { minWidth: '200px', width: '200px', maxWidth: '200px' },
      },
      {
        title: 'Policies',
        field: 'policies',
        render: this.renderPoliciesCell,
        cellStyle: { minWidth: '100px', width: '100px', maxWidth: '100px' },
        headerStyle: { minWidth: '100px', width: '100px', maxWidth: '100px' },
      },
    ];

    return (
      <div className="places">
        <AddPlaceModal
          addPlaces={this.addPlaces}
          onClose={this.toggleAddDefaultPlaceModal}
          visible={this.state.visibleAddDefaultPlaceModal}
        />
        <div className="scene-head">
          <Typography className="page-head" variant="h5" component="h2">
            Default places
          </Typography>
        </div>
        <div className="white-block-container">
          <div className="places-list">
            {this.state.visiblePlaceModal && this.state.selectedPlace !== undefined && (
              <PlaceModal
                visible={this.state.visiblePlaceModal}
                place={this.state.selectedPlace}
                onClose={this.closePlaceModal}
              />
            )}
            <MaterialTable
              icons={tableIcons}
              tableRef={this.tableRef}
              columns={columns}
              onRowClick={this.showPlaceModal}
              components={{
                OverlayLoading: (props: any, context?: any) => (
                  <Loading active={true} position="absolute" />
                ),
              }}
              options={{
                selection: true,
                columnsButton: true,
                sorting: false,
                exportButton: true,
                pageSize: 10,
                debounceInterval: 512,
                emptyRowsWhenPaging: false,
                showTitle: false,
              }}
              actions={[
                {
                  icon: () => <IcoN size={24} name={'cross24'} />,
                  tooltip: 'Add Place',
                  isFreeAction: true,
                  onClick: event => this.toggleAddDefaultPlaceModal(),
                },
              ]}
              data={async ({ page, pageSize, search }) => {
                this.currentPage = page;
                this.PAGE_SIZE = pageSize;
                this.query = search;
                const data = await this.GetData(page);
                return {
                  data: data.places,
                  page,
                  totalCount: data.total,
                };
              }}
              editable={{
                onRowDelete: (oldData: IPlace) =>
                  new Promise(resolve => {
                    setTimeout(() => {
                      resolve();
                      this.removePlace(oldData._id);
                    }, 600);
                  }),
              }}
            />
          </div>
        </div>
      </div>
    );
  }
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
)(withSnackbar(DefaultPlaces));
