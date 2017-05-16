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
                                <Button type='toolkit nst-ico ic_open_message_solid_24' shape='circle' icon='notification'></Button>
                                <Button type='toolkit nst-ico ic_bell_solid_24' shape='circle' icon='notification'></Button>
                                <Button type='toolkit nst-ico ic_gear_solid_-1' shape='circle' icon='logout'></Button>
                                <Button type='toolkit nst-ico ic_lock_solid_24' shape='circle' icon='setting'></Button>
                                <Button type='toolkit nst-ico ic_logout_solid_24' shape='circle' icon='lock'></Button>
                                <Button type='toolkit-user' shape='circle' className='oddcondi'>
                                    <UserAvatar size={24} user={loggedUser} avatar/>
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </header>
        );
    }
}

export default Header;
