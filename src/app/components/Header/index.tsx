import * as React from 'react';
import { Input, Row, Col, Button } from 'antd';
import UserAvatar from './../avatar/index';
import AAA from './../../services/classes/aaa/index';

const Search = Input.Search;


interface IHeaderProps { };

interface IHeaderState { };

class Header extends React.Component<IHeaderProps, IHeaderState> {

    constructor(props: any) {
        super(props);
    }

    render() {
        let loggedUser = AAA.getInstance().getUser();
        return (
            <header className='header'>
                <Row>
                    <Col span={10}>
                        <Search
                            placeholder = 'Basic usage'
                            size = 'large'/>
                    </Col>
                    <Col span={14}>
                        <Row type='flex' justify='end'>
                            <Col>
                                <Button type='toolkit' shape='circle' icon='notification'></Button>
                                <Button type='toolkit' shape='circle' icon='setting'></Button>
                                <Button type='toolkit' shape='circle' icon='lock'></Button>
                                <Button type='toolkit' shape='circle' icon='member'></Button>
                                <Button type='toolkit' shape='circle'>
                                    <UserAvatar size={24} user={loggedUser} avatar/>
                                </Button>
                                <Button type='toolkit' shape='circle'></Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </header>
        );
    }
}

export default Header;
