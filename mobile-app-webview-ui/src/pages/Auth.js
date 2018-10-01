import React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {receiveAccessToken, fetchCurrentUser} from '../data/auth';
import CircularProgress from '@material-ui/core/CircularProgress';
import {ASSETS_ROUTE} from '../routes';

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
`;


class Auth extends React.Component {
  async componentDidMount() {
    console.log(this.props);
    
    const hash = this.props.location.hash;
    if (!hash) return;

    const hashParams = hash.substring(1);

    const params = {};
    const regex = /([^&=]+)=([^&]*)/g
    let m;
    while (m = regex.exec(hashParams)) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    console.log(params);

    if (params.access_token) {
      const {access_token} = params;
      this.setState({accessToken: access_token})
      this.props.receiveAccessToken(access_token);

      await this.props.fetchCurrentUser();

      this.props.history.push(ASSETS_ROUTE);
    }
  }

  render() {
    return (
      <Wrapper>
        <CircularProgress />
      </Wrapper>
    );
  }
}

export default connect((state) => ({
}), (dispatch) => ({
  receiveAccessToken: (token) => dispatch(receiveAccessToken(token)),
  fetchCurrentUser: () => dispatch(fetchCurrentUser()),
}))(Auth);