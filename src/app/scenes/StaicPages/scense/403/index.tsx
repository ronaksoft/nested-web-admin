import * as React from 'react';
import {Layout} from 'antd';

interface IAppProps {
}

interface IAppState {
}

class NotFound extends React.Component<IAppProps, IAppState> {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <h1>403</h1>
        );
    }
}
export default NotFound;
