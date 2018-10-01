import React from 'react';
import {connect} from 'react-redux';
import { ACCESS_TOKEN_LOCALSTORAGE_KEY } from 'data/auth';
import { claimReferralToken } from 'data/referrals';

class AuthCallback extends React.Component {
  state = {
    error: false,
    loggingIn: true,
  }

  async componentDidMount() {
    const params = {};
    // substring to get rid of #
    const queryString = this.props.location.hash.substring(1);
    const regex = /([^&=]+)=([^&]*)/g;
    let m = regex.exec(queryString);

    while (m) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
      m = regex.exec(queryString);
    }

    this.props.history.replace('/#_=_');

    if (!params.access_token) {
      return this.setState({ error: true, loggingIn: false });
    }

    const accessToken = params.access_token;

    var data = { type: "bettermask__access-token-received", access_token: accessToken };
    window.postMessage(data, "*");

    localStorage.setItem(ACCESS_TOKEN_LOCALSTORAGE_KEY, accessToken);

    this.props.claimReferralToken();

    this.props.history.replace('/');
  }

  render() {
    const {loggingIn, error} = this.state;
    if (error) return (<div>Error!</div>)
    if (loggingIn) return (<div>Loading... Hang tight!</div>);

    // Should not be visible to the user: this means we are now authenticated, so
    // componentWillReceiveProps should have kicked in and redirected the user
    return null;
  }
}

export default connect((state) => ({
  hasPendingReferral: state.referrals.pendingReferrals.length > 0,
}), (dispatch) => ({
  claimReferralToken: () => dispatch(claimReferralToken())
}))(AuthCallback)
