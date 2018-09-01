import React from 'react';
import styled from 'styled-components';
import {Flex, Box} from 'grid-styled';
import Button from '@material-ui/core/Button';
import {Icon, Hidden} from '@material-ui/core';

import {getFacebookShareLink, getMessengerShareLink, getTwitterShareLink, getRedditShareLink, getEmailShareLink} from '../utils';

import FlexCenter from 'components/FlexCenter';

const ICON_STYLE = {
  width: 18,
  height: 18,
  fontSize: 18,
  textAlign: 'center',
};

const SocialIconBox = styled.div`
  height: 36px;
  width: 36px;
  border-radius: 18px;
  background: ${p => p.background || 'white'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
`;

const SocialIcon = (props) => {
  const {href, background, icon, targetBlank} = props;
  return (
    <a href={href} target={targetBlank && "_blank"} rel="noopener noreferrer" style={{textDecoration: 'none'}}>
      <SocialIconBox background={background}>
        <Icon className={icon} style={ICON_STYLE} />
      </SocialIconBox>
    </a>
  )
};

const LogoWrapper = styled(FlexCenter)`
  height: ${p => p.size}px;
  width: ${p => p.size}px;
  border-radius: 50%;
  background: white;
  border: 1px solid darkgray;
  box-sizing: border-box;
  margin-right: ${p => p.size / 4}px;
`;

const DetailsLink = styled.span`
  cursor: pointer;
  color: ${p => p.theme.colors.primary};

  &:hover {
    text-decoration: underline;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid ${p => p.theme.colors.divider};
  background: white;

  padding: 24px;

  @media screen and (max-width: ${p => p.theme.breakpoints[0]}) {
    padding: 16px;
  }
`;

const ReferralLink = styled.span`
  height: 48px;
  border: 1px solid lightgray;
  padding: 4px;
  text-align: center;
  font-size: 1.3em;
  border-radius: 4px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;

  @media screen and (max-width: ${p => p.theme.breakpoints[0]}) {
    flex-grow: 1;
    height: 36px;
    font-size: 1em;
  }
`;


export default class Offer extends React.Component {
  render() {
    const {offer} = this.props;
    const {name, description, appSlug, stats, imgSrc} = offer;
    const referralLink = `https://chv.lt/username/${appSlug}`;

    return (
      <Wrapper>
        <Hidden smDown>
          <LogoWrapper size={140}>
            <img src={imgSrc} alt={`${appSlug} logo`} style={{height: '100%', borderRadius: '50%', margin: 'auto'}} />
          </LogoWrapper>
        </Hidden>

        <div style={{flex: 1 }}>
          <Flex>
            <Hidden mdUp>
              <Box>
                <LogoWrapper size={64}>
                  <img src={imgSrc} alt={`${appSlug} logo`} style={{height: '100%', borderRadius: '50%', margin: 'auto'}} />
                </LogoWrapper>
              </Box>
            </Hidden>
            <Box flex="1">
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <h3 style={{flex: 1}}>{name}</h3>
              </div>
              <p>
                {description}
              </p>
            </Box>
          </Flex>

          <Flex flexWrap="wrap" alignItems="flex-start" justifyContent="center" style={{fontSize: '1.1em', margin: '0 -16px'}} >
            <Box width={[1, 1/2]} flex="1" px={3} py={1}>
              <Box style={{paddingRight: 16}}>
                Your referral link
              </Box>
              <Box>
                <Flex>
                  <ReferralLink
                    ref={el => this.reflinkInput = el}
                    readOnly
                    onClick={this.onClickRefLink}>
                    {referralLink || ''}
                  </ReferralLink>
                  <Button variant="contained" color="primary" style={{marginLeft: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}>
                    Copy
                  </Button>
                </Flex>
              </Box>
              <Box>
                <div style={{marginTop: 0}}>
                  <DetailsLink>
                    {stats.clicks} clicks | {stats.success} people joined | <strong>{stats.earnings}&nbsp;{stats.currency} earned</strong>
                  </DetailsLink>
                </div>
              </Box>
            </Box>

            <Box width={[1, 1/2]} px={3} py={1}>
              <Box style={{paddingRight: 16}}>
                Share
                      </Box>
              <Box style={{paddingRight: 16}}>
                <Flex>
                  <SocialIcon background="#3b5998" targetBlank href={getFacebookShareLink(referralLink)} icon="fab fa-facebook-f" />
                  <SocialIcon background="#448AFF" targetBlank href={getMessengerShareLink(referralLink)} icon="fab fa-facebook-messenger" />
                  <SocialIcon background="#55acee" targetBlank href={getTwitterShareLink(referralLink)} icon="fab fa-twitter" />
                  <SocialIcon background="#ff4006" targetBlank href={getRedditShareLink(referralLink)} icon="fab fa-reddit-alien" />
                  <SocialIcon background="#7d7d7d" href={getEmailShareLink(referralLink)} icon="fa fa-envelope" />
                  <SocialIcon background="lightgray" href={"#"} icon="fa fa-ellipsis-h" />
                </Flex>
              </Box>
            </Box>
          </Flex>

        </div>
      </Wrapper>
    );
  }
}
