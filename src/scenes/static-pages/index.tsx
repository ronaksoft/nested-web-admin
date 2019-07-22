import * as React from 'react';

interface IAppProps {}

interface IAppState {}

class StaticePages extends React.Component<IAppProps, IAppState> {
  static propTypes = {};

  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    // $('#loading').hide(); FIX
  }

  render() {
    const { children } = this.props;
    return <div>{children}</div>;
  }
}
export default StaticePages;
