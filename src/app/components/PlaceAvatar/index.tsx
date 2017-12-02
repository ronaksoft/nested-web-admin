import * as React from 'react';
import _ from 'lodash';
import CONFIG from '/src/app/config';
import AAA from './../../services/classes/aaa/index';

export interface IAvatarProps {
    avatar: any;
}

export interface IAvatarStates {
    src: string;
}

class PlaceAvatar extends React.Component<IAvatarProps, IAvatarStates> {
    constructor(props: any) {
        super(props);
        this.state = {
            src: this.getImage(this.props.avatar),
        };
    }

    getImage(avatar: any) {
        if (avatar) {
            if (_.isString(avatar)) {
                return 'data:image/svg+xml;base64,' + avatar;
            } else if (avatar.x64) {
                return `${CONFIG().STORE.URL}/view/${AAA.getInstance().getCredentials().sk}/${avatar.x64}`;
            }
        } else {
            return `/style/images/ph_place.png`;
        }
    }

    componentWillReceiveProps(newProps: any) {
        this.setState({
            src: this.getImage(newProps.avatar),
        });
    }

    render() {
        return (
            <img src={this.state.src}/>
        );
    }
}

export default PlaceAvatar;
