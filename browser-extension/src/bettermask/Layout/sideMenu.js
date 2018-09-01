// This file is shared across the demos.

import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import WalletIcon from '@material-ui/icons/AccountBalanceWallet';
import PersonIcon from '@material-ui/icons/Person';
import PeopleIcon from '@material-ui/icons/People';
import AppsIcon from '@material-ui/icons/Apps';
import RssFeedIcon from '@material-ui/icons/RssFeed';
import GameIcon from '@material-ui/icons/VideogameAsset';

import {REFERRALS_ROUTE, ASSETS_ROUTE} from 'routes';

import FlatLink from 'components/FlatLink';

const ListItemLink = ({ to, children, ...rest }) => {
  return (
    <FlatLink to={to} {...(rest || {})}>
      <ListItem button>
        {children}
      </ListItem>
    </FlatLink>
  )
};

export const mainMenu = (
  <div>
    <ListItemLink to={ASSETS_ROUTE}>
      <ListItemIcon>
        <WalletIcon />
      </ListItemIcon>
      <ListItemText primary="Assets" />
    </ListItemLink>
    <ListItemLink to={REFERRALS_ROUTE}>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Referrals" />
    </ListItemLink>
    <ListItemLink to="/#">
      <ListItemIcon>
        <RssFeedIcon />
      </ListItemIcon>
      <ListItemText primary="News Feed" />
    </ListItemLink>
    <ListItemLink to="/#">
      <ListItemIcon>
        <AppsIcon />
      </ListItemIcon>
      <ListItemText primary="App Store" />
    </ListItemLink>
    <ListItemLink to="/#">
      <ListItemIcon>
        <PersonIcon />
      </ListItemIcon>
      <ListItemText primary="Profile" />
    </ListItemLink>
  </div>
);

export const recentApps = (
  <div>
    <ListItem>
      <h3>Recent apps</h3>
    </ListItem>

    <ListItem button>
      <ListItemIcon>
        <GameIcon />
      </ListItemIcon>
      <ListItemText primary="Tori.Land" />
    </ListItem>

    <ListItem button>
      <ListItemIcon>
        <GameIcon />
      </ListItemIcon>
      <ListItemText primary="CryptoKitties" />
    </ListItem>
  </div>
);
