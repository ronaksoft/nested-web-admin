import * as React from 'react';
import {IDispatch} from '~react-redux~redux';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';


import HeaderComponent from '../components/Header/index';
import SidebarComponent from '../components/Sidebar/index';

import AAA from '../services/classes/aaa/index';

import {Layout} from 'antd';
const {Header, Footer, Sider, Content} = Layout;

interface IAppProps {
}

interface IAppState {
}

class App extends React.Component<IAppProps, IAppState> {
    static propTypes = {};

    constructor(props: any) {
        super(props);
    }

    componentDidMount() {
        let aaa = new AAA();

        aaa.getUser().then((has: boolean) => {
            console.log(has);
            if (!has) {
                // browserHistory.push('/403');
            }
        });

    }

    render() {
      const children = this.props.children;

        return (
            <Layout>
                <Sider>
                    <SidebarComponent/>
                </Sider>
                <Layout>
                    <Header>
                        <HeaderComponent/>
                    </Header>
                    <Content>{children}</Content>
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
