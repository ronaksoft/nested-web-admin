import * as React from 'react';
import { Input, Row, Col, Button } from 'antd';
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
                            <Col span={4}>
                                <Button type='primary' shape='circle'  icon='search'></Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </header>
        );
    }
}

export default Header;
