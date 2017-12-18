import * as React from 'react';
import {Card, Icon, Tooltip} from 'antd';
import _ from 'lodash';
import SystemApi from '../../api/system/index';

interface IOnlineUsersProps {
}

interface IOnlineUsersState {
    onlineUsers: any[];
    loading: boolean;
}

class OnlineUsers extends React.Component<IOnlineUsersProps, IOnlineUsersState> {
    constructor(props: IOnlineUsersProps) {
        super(props);

        this.state = {
            loading: true,
            onlineUsers: [],
        };

        this.reload = this.reload.bind(this);
    }

    componentDidMount() {
        this.SystemApi = new SystemApi();
        this.GetOnlines();
    }

    reload() {
        this.setState({
            loading: true
        });
        this.GetOnlines();
    }

    // componentWillReceiveProps(newProps: IOnlineUsersProps) {
    // }

    GetOnlines() {

        this.SystemApi.getOnlineUsers().then((result) => {
            this.setState({
                onlineUsers: result,
                loading: false
            });
        }).catch((error) => {
            console.log('error', error);
        });
    }

    render() {
        const {onlineUsers} = this.state;
        const onlineUsersDom = onlineUsers.map( (bundle, ind) => {
            const accountsDom = bundle.accounts.map(account => {
                return <li key={account}>{account}</li>;
            });
            return <ul key={ind}><li key={0}>{bundle.bundle_id} :</li>{accountsDom}</ul>;
        });
        return (
            <Card title='Online Users' loading={this.state.loading} extra={
                <div>
                    <Tooltip placement='top' title='reload'>
                        <a rel='noopener noreferrer' onClick={this.reload}><Icon type='reload'/></a>
                    </Tooltip>
                </div>
            } className='chart-card online-users-card' style={{height: '418px'}}>
            {onlineUsers.length > 0 && onlineUsersDom}
            </Card>
        );
    }
}

export default OnlineUsers;
