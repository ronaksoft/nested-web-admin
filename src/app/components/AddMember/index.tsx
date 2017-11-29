import * as React from 'react';
import {Modal, Row, Col, Icon, Button, message, Form, Input, Select, notification, Upload} from 'antd';

import _ from 'lodash';
import {IcoN} from '../icon/index';

interface IProps {
    visible: boolean;
    members?: Array<any>;
    onClose?: () => {};
    addMembers: (members: Array<any>) => {};
}

interface IStates {
    visible: boolean;
    members: Array<any>;
    suggests: Array<any>;
    query: string;
}


export default class AddMemberModal extends React.Component<IProps, IStates> {

    constructor(props: any) {
        super(props);
        this.state = {
            visible: false,
            members: [],
            suggests: [],
            query: '',
        };
    }

    updateSearchQuery(event: any) {
        this.setState({
            query: event.currentTarget.value,
        });
    }

    componentWillReceiveProps(props: any) {
        this.setState({
            visible: props.visible,
        });
    }

    getSuggests() {
        var list = this.state.suggests.map((u) => {
            return <li>u.name</li>;
        });
        return (
            <ul>
                {list}
            </ul>
        );
    }

    handleCancel() {
        console.log(arguments);
    }

    addMembers() {
        console.log(arguments);
        this.props.addMembers(this.state.members);
    }

    render() {

        const modalFooter = (
            <div className='modal-foot'>
                <Button type=' butn butn-green full-width'
                    onClick={this.addMembers.bind(this)}>add {this.state.members.length} Members</Button>
            </div>
        );
        return (
            <Modal className='add-member-modal'
                   maskClosable={true}
                   width={480}
                   closable={true}
                   onCancel={this.handleCancel.bind(this)}
                   visible={this.state.visible}
                   footer={modalFooter}
                   title='Add Member'>
                <Row>
                    <Input id='name' size='large' className='nst-input' value={this.state.query}
                        onChange={this.updateSearchQuery.bind(this)} placeholder='Name or Username'/>
                </Row>
                <Row>
                    {this.getSuggests()}
                </Row>
            </Modal>
        );
    }

}
