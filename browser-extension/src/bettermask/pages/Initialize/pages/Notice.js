import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Markdown from 'react-markdown'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import debounce from 'lodash.debounce'

import { INITIALIZE_SOCIAL_LOGIN_ROUTE } from '../routes';
import LoadingScreen from '../components/FullScreenSpinner';
import {skipAllNotices} from 'data/initialization';

// import { markNoticeRead } from '../../../../actions';

class Notice extends Component {
  static propTypes = {
    nextUnreadNotice: PropTypes.shape({
      title: PropTypes.string,
      date: PropTypes.string,
      body: PropTypes.string,
    }),
    location: PropTypes.shape({
      state: PropTypes.shape({
        next: PropTypes.func.isRequired,
      }),
    }),
    markNoticeRead: PropTypes.func,
    history: PropTypes.object,
    isLoading: PropTypes.bool,
    noActiveNotices: PropTypes.bool,
  };

  static defaultProps = {
    nextUnreadNotice: {},
  };

  state = {
    atBottom: false,
  }

  async componentDidMount () {
    const { skipAllNotices } = this.props
    
    if (this.props.noActiveNotices) {
      return this.props.history.push(INITIALIZE_SOCIAL_LOGIN_ROUTE)
    }
    
    try {
      await skipAllNotices();
      return this.props.history.push(INITIALIZE_SOCIAL_LOGIN_ROUTE);
    } catch (er) {
      // wat do ?
      console.error(er);
    }

    this.onScroll()
  }

  acceptTerms = () => {
    const { markNoticeRead, nextUnreadNotice, history } = this.props
    markNoticeRead(nextUnreadNotice)
      .then(hasActiveNotices => {
        if (!hasActiveNotices) {
          history.push(INITIALIZE_SOCIAL_LOGIN_ROUTE)
        } else {
          this.setState({ atBottom: false })
          this.onScroll()
        }
      })
  }

  onScroll = debounce(() => {
    if (this.state.atBottom) return

    const target = document.querySelector('.tou__body')
    const {scrollTop, offsetHeight, scrollHeight} = target
    const atBottom = scrollTop + offsetHeight >= scrollHeight

    this.setState({atBottom: atBottom})
  }, 25)

  render () {
    return null;
  
    const {
      nextUnreadNotice: { title, body },
      isLoading,
    } = this.props
    const { atBottom } = this.state

    return (
      isLoading
        ? <LoadingScreen />
        : (
          <div className="first-time-flow">
            <div className="first-view-main-wrapper">
              <div className="first-view-main">
                <div
                  className="tou"
                  onScroll={this.onScroll}>
                  <div className="tou__title">{title}</div>
                  <Markdown
                    className="tou__body markdown"
                    source={body}
                    skipHtml />
                  <button
                    className="first-time-flow__button"
                    onClick={atBottom ? this.acceptTerms : undefined}
                    disabled={!atBottom}>
                    Accept
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
    )
  }
}

const mapStateToProps = ({ metamask, appState }) => {
  const { nextUnreadNotice, noActiveNotices } = metamask
  // const { isLoading } = appState

  return {
    nextUnreadNotice,
    noActiveNotices,
    // isLoading,
  }
}

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    dispatch => ({
      markNoticeRead: () => {
        throw new Error('This function should never have been called anyway!');
      },
      skipAllNotices: () => dispatch(skipAllNotices()),
    })
  )
)(Notice)
