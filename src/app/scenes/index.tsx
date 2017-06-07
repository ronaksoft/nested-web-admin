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
        isReady: false,
    };

    constructor(props: any) {
        super(props);
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
            accountApi.sessionRecall({
                _ss: credential.ss,
                _sk: credential.sk,
            }).then((user: IUser) => {
                if (!user.admin) {
                    aaa.setIsUnAthenticated();
                    browserHistory.push('/403');
                    return;
                }
                aaa.setUser(user);
                this.setState({
                    isReady: true,
                });
            }).catch((err) => {
                aaa.setIsUnAthenticated();
                browserHistory.push('/signin');
            });
        } else {
            this.setState({
                isReady: true,
            });
        }

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
