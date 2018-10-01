import React from 'react';
import styled from 'styled-components';
import FlexCenter from 'components/FlexCenter';

import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import TradeIcon from '@material-ui/icons/CompareArrows';

import tori from './img/tori.png';
import FlatLink from 'components/FlatLink';
import {REFERRALS_ROUTE} from 'routes';
import NewsCarousel from './components/NewsCarousel';

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
    border-bottom: 1px solid ${p => p.theme.colors.divider};
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

export default class Assets extends React.Component {
  render() {
    return (
      <div>
        <NewsCarousel />

        <Wrapper>
          <AssetRow>
            <AssetCol>
              <LogoWrapper>
                <img src="https://cdn-images-1.medium.com/max/800/1*L8ODr3uJlh44i1SgjlMv7w.png" alt="Ether" />
              </LogoWrapper>
            </AssetCol>

            <AssetBalance>
              1.8457 ETH
            </AssetBalance>

            <AssetCol>
              <Button variant="contained" color="primary" size="large">
                <TradeIcon style={{marginRight: 16}} />
                Trade
              </Button>
            </AssetCol>
          </AssetRow>

          <AssetRow>
            <AssetCol>
              <LogoWrapper>
                <img src="https://xxx/yyy.jpg" alt="BECoin" />
              </LogoWrapper>
            </AssetCol>

            <AssetBalance>
              12 XBE
            </AssetBalance>

            <AssetCol>
              <Button variant="contained" color="primary" size="large" style={{marginRight: 16}}>
                <TradeIcon style={{marginRight: 16}} />
                Trade
              </Button>

              <FlatLink to={REFERRALS_ROUTE}>
                <Button variant="contained" color="primary" size="large">
                  <Icon className="fa fa-coins" style={{marginRight: 16}} />
                  Earn
                </Button>
              </FlatLink>
            </AssetCol>
          </AssetRow>

          <AssetRow>
            <AssetCol>
              <LogoWrapper>
                <span style={{fontSize: '1.5em', fontWeight: 'bold'}} >DTI</span>
              </LogoWrapper>
            </AssetCol>

            <AssetBalance>
              4 DTI
            </AssetBalance>

            <AssetCol>
              <Button variant="contained" color="primary" size="large">
                <Icon className="fa fa-coins" style={{marginRight: 16}} />
                Earn
              </Button>
            </AssetCol>
          </AssetRow>

          <AssetRow>
            <AssetCol>
              <LogoWrapper>
                <img src={tori} alt="Ether" />
              </LogoWrapper>
            </AssetCol>

            <AssetBalance>
              2 Toris
            </AssetBalance>

            <AssetCol>
              <Button variant="contained" color="primary" size="large" style={{marginRight: 16}}>
                <TradeIcon style={{marginRight: 16}} />
                Trade
              </Button>

              <a href="https://tori.land" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
                <Button variant="contained" color="primary" size="large">
                  <Icon className="fa fa-gamepad" style={{width: '1.3em', marginRight: 16}} />
                  Play
                </Button>
              </a>
            </AssetCol>
          </AssetRow>

          <AssetRow>
            <AssetCol>
              <LogoWrapper noSpace>
                <img src="https://www.cryptokitties.co/icons/logo.svg" alt="Ether" />
              </LogoWrapper>
            </AssetCol>

            <AssetBalance>
              3 CryptoKitties
            </AssetBalance>

            <AssetCol>
              <Button variant="contained" color="primary" size="large" style={{marginRight: 16}}>
                <TradeIcon style={{marginRight: 16}} />
                Trade
              </Button>

              <Button variant="contained" color="primary" size="large">
                <Icon className="fa fa-gamepad" style={{width: '1.3em', marginRight: 16}} />
                Play
              </Button>
            </AssetCol>
          </AssetRow>
        </Wrapper>
      </div>
    )
  }
}
