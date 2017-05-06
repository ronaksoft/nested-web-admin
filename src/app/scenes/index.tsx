import * as React from 'react';
import {IDispatch} from '~react-redux~redux';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';


import HeaderComponent from '../components/Header/index';
import SidebarComponent from '../components/Sidebar/index';

import AAA from './../services/classes/aaa';

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
        console.log(aaa.hasUser());
        if (!aaa.hasUser()) {
            browserHistory.push('/403');
        }
    }

    render() {


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
