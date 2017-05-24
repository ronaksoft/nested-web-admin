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
                        <h1>403</h1>
                        <p >Sorry, You are not authorized!</p>
                        <Link to='/signin'><b>Sign-in</b></Link>
                    </p>
                </Col>
            </Row>
        );
    }
}
export default NotFound;
