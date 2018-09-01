import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Route, Redirect} from 'react-router-dom';

import {INITIALIZE_ROUTE} from '../../routes';

const InitializedRoute = props => {
  return props.isInitialized
    ? <Route {...props} />
    : <Redirect to={{pathname: INITIALIZE_ROUTE}} />
}

InitializedRoute.propTypes = {
  isInitialized: PropTypes.bool,
}

const mapStateToProps = state => {
  const {metamask: {isInitialized}} = state
  return {
    isInitialized,
  }
}

export default connect(mapStateToProps)(InitializedRoute);
