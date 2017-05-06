import * as React from 'react';
import {IDispatch} from '~react-redux~redux';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import HeaderComponent from '../components/Header/index';
import SidebarComponent from '../components/Sidebar/index';

import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

interface IAppProps { }

interface IAppState { }

class App extends React.Component<IAppProps, IAppState> {
  static propTypes = {};

  render() {

    const {children} = this.props;

    return (
      <Layout>
        <Sider>
          <SidebarComponent/>
        </Sider>
        <Layout>
          <Header>
            <HeaderComponent/>
          </Header>
          <Content>Content</Content>
          <Footer>Footer</Footer>
        </Layout>
      </Layout>
    );
  }
}

function mapStateToProps(state: any) {
  return {};
}

function mapDispatchToProps(dispatch: IDispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
