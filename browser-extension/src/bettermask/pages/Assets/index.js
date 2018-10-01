import React from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';
import FlexCenter from 'components/FlexCenter';

import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import TradeIcon from '@material-ui/icons/CompareArrows';

import FlatLink from 'components/FlatLink';
import {REFERRALS_ROUTE} from 'routes';
import {fetchProfile} from 'data/user';
import {CircularProgress} from '@material-ui/core';

const Wrapper = styled.div`
  padding: 24px;

  @media screen and (max-width: ${p => p.theme.breakpoints[0]}) {
    padding: 16px;
  }
`;

const AssetRow = styled.div`
  // height: 72px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 32px;

  @media screen and (max-width: ${p => p.theme.breakpoints[0]}) {
    font-size: 12px;
    padding-bottom: 16px;
    margin-bottom: 16px;
  }
`;

const AssetCol = styled.div`
  margin-right: 32px;

  @media screen and (max-width: ${p => p.theme.breakpoints[0]}) {
    margin-right: 8px;
  }
`;

const AssetBalance = styled(AssetCol)`
  font-size: 2em;
  flex-grow: 1;
  margin-bottom: 8px;

  @media screen and (max-width: ${p => p.theme.breakpoints[0]}) {
    font-size: 1.5em;
    width: calc(100% - 68px);
  }
`;

const LogoWrapper = styled(FlexCenter)`
  height: 72px;
  width: 72px;
  border-radius: 36px;
  background: white;
  border: 1px solid darkgray;
  box-sizing: border-box;

  @media screen and (max-width: ${p => p.theme.breakpoints[0]}) {
    margin-bottom: 8px;
    height: 52px;
    width: 52px;
    border-radius: 50%;
  }

  img {
    height: ${p => p.noSpace ? '100%' : '80%'};
    border-radius: 50%;
  }
`;

class Assets extends React.Component {
  componentDidMount() {
    if (this.props.balances || this.props.fetchingProfile) return;
    this.props.fetchProfile();
  }

  render() {
    const loading = this.props.fetchingProfile || !this.props.balances;
    const bctBalance = loading ? 0 : this.props.balances.bct;

    return (
      <div>
        <Wrapper>
          <AssetRow style={{marginBottom: 0}}>
            <AssetCol>
              <LogoWrapper>
                <span style={{fontSize: '1.5em', fontWeight: 'bold'}}>BCT</span>
              </LogoWrapper>
            </AssetCol>

            <AssetBalance>
              {
                loading ?
                  <CircularProgress />
                  :
                  bctBalance + " BCT"
              }
            </AssetBalance>

            <AssetCol style={{marginRight: 0}}>
              <FlatLink to={REFERRALS_ROUTE}>
                <Button variant="contained" color="primary" size="large">
                  <Icon className="fa fa-users" style={{width: '1.8em'}} />
                  Refer friends
                </Button>
              </FlatLink>
            </AssetCol>
          </AssetRow>
          <AssetRow style={{justifyContent: 'flex-end'}}>
            <p style={{marginTop: 0, fontSize: '1.1em', textAlign: 'right'}}>
              Earn 1 BCT Coin for each friend who joins the BCT network.
              They also get a free BCT Coin.
            </p>
          </AssetRow>
        </Wrapper>
      </div>
    )
  }
}

export default connect((state) => ({
  fetchingProfile: state.user.fetchingProfile,
  balances: state.user.balances,
}), (dispatch) => ({
  fetchProfile: () => dispatch(fetchProfile())
}))(Assets);
