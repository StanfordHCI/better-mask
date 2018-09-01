import React from 'react';
import {connect} from 'react-redux';
import {createPendingReferral} from 'data/referrals';
import { ACCESS_TOKEN_LOCALSTORAGE_KEY } from 'data/auth';

class ReferralLanding extends React.Component {
  componentDidMount() {
    if (this.props.match.params && this.props.match.params.referralCode) {
      const {referralCode, appSlug} = this.props.match.params;
      const refcode = referralCode;
      const applicationSlug = appSlug || '';
      const referrer = document.referrer;

      this.props.createPendingReferral(refcode, applicationSlug, referrer);
    }
  }

  render() {
    const {creatingPendingReferral, latestPendingReferral, applications} = this.props;

    if (creatingPendingReferral || !latestPendingReferral) {
      return <div>Loading...</div>;
    }

    const application = applications[latestPendingReferral.app_id];

    const token = localStorage.getItem(ACCESS_TOKEN_LOCALSTORAGE_KEY);
    const link = `${application.url}/referral-callback#access_token=${token}`;

    return (
      <div>
        <h1>{latestPendingReferral.referring_user_name} has invited you to join {application.name}!</h1>
        <h2><a href={process.env.REACT_APP_BROWSER_EXTENSION_MARKETPLACE_LINK}>Install browser extension</a></h2>

        { token &&
          <p>
            {/* TODO Visible only if auth'd: */}
            <a href={link}>Start playing</a>
          </p>
        }
      </div>
    )
  }
}

export default connect((state) => ({
  creatingPendingReferral: state.referrals.creatingPendingReferral,
  latestPendingReferral: state.referrals.pendingReferrals[state.referrals.pendingReferrals.length - 1],
  applications: state.applications.applications,
}), (dispatch) => ({
  createPendingReferral: (refcode, appSlug, referrer) => dispatch(createPendingReferral(refcode, appSlug, referrer)),
}))(ReferralLanding)
