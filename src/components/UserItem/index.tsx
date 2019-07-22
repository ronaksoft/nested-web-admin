import * as React from 'react';
import UserAvatar from '../avatar/index';
import Grid from '@material-ui/core/Grid';

function UserItem(props: any) {
  return (
    <Grid
      container={true}
      spacing={2}
      className="user-row remove-margin"
      onClick={() => {
        if (typeof props.onClick === 'function') {
          props.onClick();
        }
      }}
    >
      <Grid item={true} xs={2}>
        <UserAvatar user={props.user} borderRadius="16px" size={32} avatar={true} />
      </Grid>
      <Grid item={true} className="user-row-inner" xs={10}>
        <Grid container={true}>
          <Grid item={true} xs={8}>
            <p>{props.user.name}</p>
            <span>{props.user._id}</span>
          </Grid>
          <Grid item={true} xs={4}>
            {props.manager && (
              <aside>
                Manager
                <div className="nst-ico ic_crown_shine_24" />
              </aside>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default UserItem;
