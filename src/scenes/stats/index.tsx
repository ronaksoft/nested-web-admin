import * as React from 'react';
import SystemApi from '../../api/system/index';
import JSONTree from 'react-json-tree';
import appLoader from '../../components/Loading/app-loading';
import './stats.less';

export interface IConfigProps {}

export interface IConfigState {
  data: any;
  theme: any;
}

class Stats extends React.Component<IConfigProps, IConfigState> {
  private SystemApi: SystemApi = new SystemApi();
  constructor(props: IConfigProps) {
    super(props);
    this.state = {
      data: {},
      theme: {
        author: '',
        base00: '#000000',
        base01: '#383830',
        base02: '#49483e',
        base03: '#75715e',
        base04: '#a59f85',
        base05: '#f8f8f2',
        base06: '#f5f4f1',
        base07: '#f9f8f5',
        base08: '#f92672',
        base09: '#fd971f',
        base0A: '#f4bf75',
        base0B: '#a6e22e',
        base0C: '#a1efe4',
        base0D: '#66d9ef',
        base0E: '#ae81ff',
        base0F: '#cc6633',
        scheme: 'monokai',
      },
    };
  }

  componentDidMount() {
    this.GetData();
    appLoader.hide();
  }

  GetData() {
    this.SystemApi.getStats()
      .then((result: any) => {
        // console.log(result);
        this.setState({
          data: result,
        });
      })
      .catch((error: any) => {
        console.log('error', error);
      });
  }

  render() {
    return (
      <div className="stats-container">
        <div className="scene-head">
          <h2>Stats</h2>
        </div>
        <JSONTree data={this.state.data} theme={this.state.theme} />
      </div>
    );
  }
}

export default Stats;
