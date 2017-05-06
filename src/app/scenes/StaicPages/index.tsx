import * as React from 'react';

import {Layout} from 'antd';
const {Header, Footer, Sider, Content} = Layout;

interface IAppProps {
    type: string;
}

interface IAppState {
}

class StaticePages extends React.Component<IAppProps, IAppState> {
    static propTypes = {};

    constructor(props: any) {
        super(props);
    }

    render() {

        const {children} = this.props;
        return (
            <Layout>
                <Content>
                    {children}
                </Content>
            </Layout>
        );
    }
}
export default StaticePages;
