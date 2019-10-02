import * as React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography } from '@material-ui/core';
import appLoader from '../../../../components/Loading/app-loading';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';

export default withStyles((theme: Theme) =>
  createStyles({
    page: {
      color: theme.palette.error.dark,
      padding: theme.spacing(8, 0),
      '& > *': {
        margin: theme.spacing(1, 0),
      },
    },
  })
)((props: any) => {
  appLoader.hide();
  return (
    <Container component="main" maxWidth="md" className={props.classes.page}>
      <Typography variant="h1" align="center">
        403
      </Typography>
      <Typography variant="h5" component="h2" align="center">
        Sorry, You are not authorized!
      </Typography>
      <Typography variant="h5" component="h2" align="center">
        <Link to="/signin">
          <b>Sign-in</b>
        </Link>
      </Typography>
    </Container>
  );
});
