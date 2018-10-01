import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import UnlockPage from './unlock-page.component'

const mapStateToProps = state => {
  const { metamask: { isUnlocked, isPopup } } = state
  return {
    loading: state.auth.loadingAuthStatus,
    isAuthenticated: state.auth.authenticated,
    isUnlocked,
    isPopup,
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(UnlockPage);
