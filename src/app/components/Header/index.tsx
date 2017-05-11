import * as React from 'react';
import { Input, Row, Col, Button } from 'antd';
import UserAvatar from './../avatar/index';

const Search = Input.Search;


interface IHeaderProps { };

interface IHeaderState { };

class Header extends React.Component<IHeaderProps, IHeaderState> {
    static propTypes = {
    };
    constructor(props: any) {
        super(props);
    }

    render() {
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
                                <Button type='toolkit' shape='circle' icon='logout'></Button>
                                <UserAvatar size='24' user='' />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </header>
        );
    }
}

export default Header;
