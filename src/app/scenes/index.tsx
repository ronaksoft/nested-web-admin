import * as React from 'react';
import {IDispatch} from '~react-redux~redux';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import log from 'loglevel';

import HeaderComponent from '../components/Header/index';
import SidebarComponent from '../components/Sidebar/index';

import AAA from '../services/classes/aaa/index';

import {Layout} from 'antd';
import AccountApi from '../api/account/account';
import IUser from '../api/account/interfaces/IUser';

import Server from '../services/classes/server/index';
import {message} from 'antd';
import SocketState from '../services/classes/socket/states';
import Client from '../services/classes/client/index';

const {Header, Footer, Sider, Content} = Layout;

interface IAppProps {
}

interface IAppState {
}

class App extends React.Component<IAppProps, IAppState> {
    state = {
        isReady: false
    };

    constructor(props: any) {
        super(props);
        this.hideDisconnected = null;
    }

    componentDidMount() {
        $('#loading').fadeOut('slow');
        let accountApi = new AccountApi();
        let aaa = AAA.getInstance();
        const credential = aaa.getCredentials();
        const user = aaa.getUser();

        if (!credential.sk || !credential.ss) {
            aaa.setIsUnAthenticated();
            browserHistory.push('/signin');
            return;
        }

        if (!user) {
            const did = Client.getDid();
            const dt = Client.getDt();
            accountApi.sessionRecall({
                _ss: credential.ss,
                _sk: credential.sk,
                _did: did,
                _do: 'android',
                _dt: dt,
            }).then((user: IUser) => {
                if (user && user.admin) {
                    aaa.setUser(user);
                    this.setState({
                        isReady: true,
                    });
                    Client.setDid(did);
                    Client.setDt(dt);
                } else {
                    aaa.setIsUnAthenticated();
                    browserHistory.push('/403');
                }
            }).catch((err) => {
                aaa.setIsUnAthenticated();
                browserHistory.push('/signin');
            });
        } else {
            this.setState({
                isReady: true,
            });
        }

        Server.getInstance().onConnectionStateChange((state: SocketState) => {
            if (state === SocketState.OPEN) {
                if (this.hideDisconnected) {
                    this.hideDisconnected();
                }
            }

            if (state === SocketState.CLOSED) {
                this.hideDisconnected = message.loading('Reconnecting...', 0);
            }
        });
        log.setLevel(0);
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
