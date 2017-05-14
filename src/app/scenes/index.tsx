import * as React from 'react';
import {IDispatch} from '~react-redux~redux';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';


import HeaderComponent from '../components/Header/index';
import SidebarComponent from '../components/Sidebar/index';

import AAA from '../services/classes/aaa/index';

import {Layout} from 'antd';
import AccountApi from '../api/account/account';
import IUser from '../api/account/interfaces/IUser';

const {Header, Footer, Sider, Content} = Layout;

interface IAppProps {
}

interface IAppState {
}

class App extends React.Component<IAppProps, IAppState> {
    state = {
        isReady : false,
    };

    constructor(props: any) {
        super(props);
    }

    componentDidMount() {
        let accountApi = new AccountApi();
        let aaa = AAA.getInstance();
        const credential = aaa.getCredentials();
        console.log('start');
        accountApi.sessionRecall({
            _ss : credential.ss,
            _sk : credential.sk,
        }).then((user: IUser) => {
          console.log('then');
            console.log(user);
            aaa.setUser(user);
            this.setState({
              isReady : true,
            });
        }).catch((err) => {
          console.log('catch');
            console.log(err);
            aaa.setIsUnAthenticated();
            browserHistory.push('/403');
        });

    }

    render() {
      const children = this.props.children;

        return (
          <div>
            {this.state.isReady &&
                <Layout>
                  <Sider width='226'>
                    <SidebarComponent/>
                  </Sider>
                  <Layout className='container'>
                    <Header>
                      <HeaderComponent/>
                    </Header>
                    <Content>{children}</Content>
                    {/*<Footer>Footer</Footer>*/}
                  </Layout>
                </Layout>
              }
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
