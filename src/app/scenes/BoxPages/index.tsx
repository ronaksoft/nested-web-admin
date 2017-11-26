import * as React from 'react';

import {Layout} from 'antd';
import './boxPages.less';
const {Header, Footer, Sider, Content} = Layout;

interface IAppProps {
    type: string;
}

interface IAppState {
}

class BoxPages extends React.Component<IAppProps, IAppState> {
    static propTypes = {};

    constructor(props: any) {
        super(props);
    }

    componentDidMount() {
        $('#loading').hide();
    }

    render() {

        const {children} = this.props;
        return (
            <Layout className='info-page'>
                <div className='logo'/>
                <Content>
                    {children}
                </Content>
            </Layout>
        );
    }
}
export default BoxPages;
