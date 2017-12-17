interface IGetOnlineUsers {
    online_users: IOnlineUser[];
}
interface IOnlineUser {
    online_users: IBundle[];
}
interface IBundle {
    accounts: string[];
    bundle_id: string;
}

export default IGetOnlineUsers;
