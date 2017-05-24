import * as React from 'react';
import {Row, Col, Layout, Content, Header, Footer} from 'antd';
import {Link} from 'react-router';

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
            <Row align='middle'>
                <Col span={8} offset={8}>
                    <p className='text-center' style={{marginTop: 96}}>
                        <h1>404</h1>
                        <p>We did not find what you look for!</p>
                        <Link to='/dashboard'><b>Go to Dashboard</b></Link>
                    </p>
                </Col>
            </Row>
        );
    }
}
export default NotFound;
