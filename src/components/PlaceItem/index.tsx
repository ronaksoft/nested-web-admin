import * as React from 'react';
import PlaceView from '../placeview/index';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';

function PlaceItem(props: any) {
  const iconStyle = {
    height: '16px',
    width: '16px',
    verticalAlign: 'middle',
    marginRight: '4px',
  };
  const { classes } = props;
  return (
    <div
      className={classes.placeRow}
      onClick={() => {
        if (props.onClick) {
          props.onClick(props.place);
        }
      }}
    >
      <PlaceView borderRadius="4px" place={props.place} size={32} avatar={true} id={false} />
      <div className={classes.placeNameId}>
        <p>
          {props.place.privacy.locked && (
            <span className="nst-ico ic_brick_wall_solid_16" style={iconStyle} />
          )}
          {!props.place.privacy.locked && (
            <span className="nst-ico ic_window_solid_16" style={iconStyle} />
          )}
          {props.place.name}
        </p>
        <span>{props.place._id}</span>
      </div>
      {/* <aside>{props.place.counters.creators + props.place.counters.key_holders} Members</aside> */}
    </div>
  );
}
export default withStyles((theme: Theme) =>
  createStyles({
    placeRow: {
      alignItems: 'center',
      display: 'flex',
      height: '64px',
      '& p': {
        display: 'flex',
        width: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        margin: '6px 0 0',
        fontSize: '14px',
      },
    },
    placeNameId: {
      flexDirection: 'column',
      padding: '0 4px',
      maxWidth: 'calc(100% - 40px)',
    },
  })
)(PlaceItem);
