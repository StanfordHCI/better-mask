import React from 'react';
import {getFacebookShareLink, getMessengerShareLink, getTwitterShareLink, getRedditShareLink, getEmailShareLink} from '../utils';
import {Flex, Box} from 'grid-styled';
import styled from 'styled-components';
import {Icon} from '@material-ui/core';

import Stats from './Stats';
import InvitedUsersList from './InvitedUsersList';

import {colors} from 'theme';

const referralLink = 'https://yolo.ok/qsdf/jklm';



const ReferralsAccounting = styled.div`
  background-color: white;
  margin-bottom: 16px;
  color: rgb(37, 37, 37);
  height: 100%;
  box-sizing: border-box;
  box-shadow: darkgray 0px 5px 10px;
  border: 1px solid lightgray;
  border-radius: 4px;
  padding: 24px 16px 16px;
  transition: transform 200ms ease 0s, box-shadow 300ms ease 0s;
`;



const ICON_STYLE = {
  width: 64,
  height: 64,
  fontSize: 64,
  textAlign: 'center',
};

const SocialIconBox = styled.div`
  height: 128px;
  width: 128px;
  border-radius: 8px;
  background: ${p => p.background || 'white'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
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

const TextCenter = styled.div`
  text-align: center;
`;

const loadingStats = false;
const stats = {"referrals":[{"id":1,"created_at":"2018-08-09T21:40:44.000Z","updated_at":"2018-08-09T21:40:44.000Z","referring_user_id":1,"app_id":1,"http_referrer":"","ip_address":"127.0.0.1","referral_token_id":1,"converted":true,"referred_user":{"id":2,"name":"Helen Albggahjacjhg Wisemanwitz","created_at":"2018-08-09T21:41:16.000Z","updated_at":"2018-08-09T21:41:16.000Z","referral_code":"helenalbggahjacjhgwisemanwitz","admin":false}}],"invited_users":[{"user_id":2,"name":"Helen Albggahjacjhg Wisemanwitz","profile_picture":"qsdfqsdf"}],"pending_referrals_count":1,"all_referrals_count":2}

export default class PromotionDetails extends React.Component {
  reflinkInput = null;
  _mounted = false;

  state = {
    copied: false,
  }

  componentWillMount() {
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  onClickRefLink = () => {
    if (!this.reflinkInput) return;

    this.reflinkInput.select();
    document.execCommand('copy');

    this.setState({copied: true});

    setTimeout(() => {
      this._mounted && this.setState({copied: false});
    }, 1000);
  }

  render() {
    return (
      <div style={{width: '100%'}}>
        <div style={{display: 'flex', flexDirection: 'row', borderBottom: '1px solid gray', padding: 24}}>
          <div style={{flexGrow: 1}}>
            <h3>Tori.Land promotion</h3>
            <p style={{marginBottom: 0}}>
              Earn 1 π for each friend who joins Tori.Land! They also get a free Tori.
            </p>
          </div>
          <div onClick={this.props.onClose} style={{fontSize: '2em', lineHeight: '16px', cursor: 'pointer'}}>&times;</div>
        </div>
        <div style={{padding: 24}}>

          <div style={{textAlign: 'center'}}>
            <p>
              Thanks to this offer, you earned <br/>
              <span style={{fontSize: '4em'}}>46 π</span>
            </p>
          </div>

          <ReferralsAccounting>

            <h3>Share</h3>

            <Flex style={{margin: '0 -8px 16px -8px'}} flexWrap="wrap" justifyContent="space-between">
              <Box width={[1 / 2, 1 / 3, 1 / 3, 1 / 6]} px={2} style={{paddingBottom: 16}}>
                <SocialIcon background="#3b5998" targetBlank href={getFacebookShareLink(referralLink)} icon="fab fa-facebook-f" />
              </Box>
              <Box width={[1 / 2, 1 / 3, 1 / 3, 1 / 6]} px={2} style={{paddingBottom: 16}}>
                <SocialIcon background="#448AFF" targetBlank href={getMessengerShareLink(referralLink)} icon="fa fa-comment" />
              </Box>
              <Box width={[1 / 2, 1 / 3, 1 / 3, 1 / 6]} px={2} style={{paddingBottom: 16}}>
                <SocialIcon background="#55acee" targetBlank href={getTwitterShareLink(referralLink)} icon="fab fa-twitter" />
              </Box>
              <Box width={[1 / 2, 1 / 3, 1 / 3, 1 / 6]} px={2} style={{paddingBottom: 16}}>
                <SocialIcon background="#ff4006" targetBlank href={getRedditShareLink(referralLink)} icon="fab fa-reddit-alien" />
              </Box>
              <Box width={[1 / 2, 1 / 3, 1 / 3, 1 / 6]} px={2} style={{paddingBottom: 16}}>
                <SocialIcon background="#7d7d7d" href={getEmailShareLink(referralLink)} icon="fa fa-envelope" />
              </Box>
              <Box width={[1 / 2, 1 / 3, 1 / 3, 1 / 6]} px={2} style={{paddingBottom: 16}}>
                <SocialIcon background={colors.secondary} href={"#"} icon="fa fa-share-alt" />
              </Box>
            </Flex>

            <TextCenter>Or share your referral link:</TextCenter>

            <input
              style={{border: '1px solid gray', padding: 4, textAlign: 'center', fontSize: '1.3em', width: '100%'}}
              readOnly
              ref={el => this.reflinkInput = el}
              onClick={this.onClickRefLink}
              value={referralLink || ''} />

            {
              this.state.copied ?
                <TextCenter>Copied to clipboard!</TextCenter>
                :
                <TextCenter onClick={this.onClickRefLink}>Click to copy to clipboard!</TextCenter>
            }
          </ReferralsAccounting>


          <Flex style={{margin: '32px -16px 0'}} flexWrap="wrap">
            <Box width={[1, 1, 1/2]} px={3} py={3}>
              <ReferralsAccounting>
                <h3>Stats</h3>
                {
                  loadingStats || stats == null ?
                    <p>loading...</p>
                    :
                    <Stats stats={stats} />
                }
              </ReferralsAccounting>
            </Box>
            <Box width={[1, 1, 1/2]} px={3} py={3}>
              <ReferralsAccounting>
                <h3>They joined thanks to you</h3>
                {
                  loadingStats || stats == null ?
                    <p>loading...</p>
                    :
                    <InvitedUsersList invitedUsers={stats.invited_users} />
                }
              </ReferralsAccounting>
            </Box>
          </Flex>

        </div>
      </div>
    )
  }
}
