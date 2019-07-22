import * as React from 'react';
import AppApi from '../../api/app/index';
import Create from './addApplications/index';
import { IcoN } from '../../components/icon/index';
import { Typography } from '@material-ui/core';
import appLoader from '../../components/Loading/app-loading';
import Loading from '../../components/Loading';
import MaterialTable from 'material-table';
import tableIcons from '../../components/table-icons/index';

export interface IApp {
  isChecked: boolean;
  _id: string;
  name: string;
  developer: string;
  icon_small_url: string;
  icon_large_url: string;
}

export interface IAppsProps {}

export interface IAppsState {
  loading: boolean;
  createAppVisible: boolean;
}

class Apps extends React.Component<IAppsProps, IAppsState> {
  private AppApi: AppApi = new AppApi();
  private tableRef = React.createRef();

  private PAGE_SIZE = 10;
  private query: string = '';

  constructor(props: IAppsProps) {
    super(props);
    this.state = {
      loading: false,
      createAppVisible: false,
    };
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
    const data = await this.AppApi.search({
      limit: this.PAGE_SIZE,
      skip: page * this.PAGE_SIZE,
      keyword: this.query,
    });
    return data.apps;
  };

  toggleCreateApp = () => {
    this.setState({
      createAppVisible: !this.state.createAppVisible,
    });
  };

  componentDidMount() {
    this.AppApi = new AppApi();
    appLoader.hide();
  }

  removeApp = (app_id: string) => {
    this.AppApi.remove({ app_id }).then(this.reload);
  };

  logoRenderer = (app: IApp, type) => (
    <img width="32" height="32" alt={app.name} src={app.icon_small_url} />
  );

  render() {
    var columns = [
      {
        field: '_id',
        index: 0,
        title: 'App ID',
      },
      {
        field: 'name',
        index: 1,
        title: 'App Name',
      },
      {
        field: 'developer',
        index: 2,
        title: 'Developer',
      },
      {
        field: 'homepage',
        index: 3,
        title: 'Homepage',
      },
      {
        field: 'logo',
        index: 3,
        render: this.logoRenderer,
        title: 'Logo',
      },
    ];
    return (
      <div className="charts-scene">
        <div className="scene-head">
          <Typography className="page-head" variant="h5" component="h2">
            Accounts
          </Typography>
        </div>
        <div className="white-block-container">
          <MaterialTable
            icons={tableIcons}
            title="apps"
            tableRef={this.tableRef}
            columns={columns}
            components={{
              OverlayLoading: (props: any, context?: any) => (
                <Loading active={true} position="absolute" />
              ),
            }}
            options={{
              selection: true,
              columnsButton: true,
              exportButton: true,
              pageSize: 10,
              sorting: false,
              debounceInterval: 512,
              emptyRowsWhenPaging: false,
              showTitle: false,
            }}
            actions={[
              {
                icon: () => <IcoN size={24} name={'cross24'} />,
                tooltip: 'Add Application',
                isFreeAction: true,
                onClick: event => this.toggleCreateApp(),
              },
              {
                icon: () => (
                  <a href="https://store.nested.me/" target="_blank" rel="noopener noreferrer">
                    <IcoN size={24} name={'store24'} />
                  </a>
                ),
                tooltip: 'Add Application from Store',
                isFreeAction: true,
                onClick: event => {},
              },
            ]}
            data={async ({ page, pageSize, search }) => {
              this.PAGE_SIZE = pageSize;
              this.query = search;
              const data = await this.GetData(page);
              return {
                data,
                page,
                totalCount: data.length,
              };
            }}
            editable={{
              onRowDelete: (oldData: IApp) =>
                new Promise(resolve => {
                  setTimeout(() => {
                    resolve();
                    this.removeApp(oldData._id);
                  }, 600);
                }),
            }}
          />
        </div>
        <Create
          visible={this.state.createAppVisible}
          handleClose={this.toggleCreateApp}
          handleCreate={this.create}
        />
      </div>
    );
  }

  private create = (data: any) => {
    this.AppApi.register({
      app_id: data.id,
      app_name: data.name,
      developer: data.developer,
      homepage: data.homepage,
      icon_large_url: data.logoUrl,
      icon_small_url: data.thumbnailUrl,
    }).then(this.reload);
    this.toggleCreateApp();
  };
}

export default Apps;
