// import React from 'react';

// export default function Layout(props) {
//   return (
//     <div>
//       {props.children}
//     </div>
//   );
// }

import React from 'react';
import PropTypes from 'prop-types';

import {withRouter} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBack from '@material-ui/icons/ArrowBack';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';

import {PROFILE_ROUTE, ASSETS_ROUTE, REFERRALS_ROUTE} from 'routes';

import {lockAccount} from 'data/auth';

import FlatLink from 'components-library/layout/FlatLink';

const DEFAULT_ROUTE = "/TAGADATSOINTSOIN"

const MenuItemLink = ({ to, children, ...rest }) => {
  return (
    <FlatLink to={to} {...(rest || {})}>
      <MenuItem>
        {children}
      </MenuItem>
    </FlatLink>
  )
};

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    position: 'relative',
    display: 'flex',
    width: '100%',
    minHeight: '100vh',
  },
  appBar: {
    position: 'absolute',
    marginLeft: drawerWidth,
    width: '100vw',
  },
  flexGrow: {
    flexGrow: 1,
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.up('md')]: {
      width: `100vw`,
    },
    // padding: theme.spacing.unit * 3,
  },
});

class Layout extends React.Component {
  state = {
    mobileOpen: false,
    accountMenuAnchor: null,
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  openAccountMenu = event => {
    this.setState({ accountMenuAnchor: event.currentTarget });
  };

  closeAccountMenu = () => {
    this.setState({ accountMenuAnchor: null });
  };
  
  lockAccount = () => {
    this.props.lockAccount();
    this.props.history.push(DEFAULT_ROUTE);
  }

  goBack = () => {
    this.props.history.push(ASSETS_ROUTE);
  }

  render() {
    const { classes, theme, children, authenticated, location } = this.props;
    const { accountMenuAnchor } = this.state;
    const accountMenuOpen = Boolean(accountMenuAnchor);

    const hideBackButton = location.pathname === DEFAULT_ROUTE || location.pathname === ASSETS_ROUTE;

    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            { !hideBackButton &&
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.goBack}>
                <ArrowBack />
              </IconButton>
            }
            <Typography variant="title" color="inherit" noWrap className={classes.flexGrow} >
              Bettermask
            </Typography>

            {
              authenticated && (
                <div>
                  {/* <IconButton
                    aria-owns={accountMenuOpen ? 'menu-appbar' : null}
                    aria-haspopup="true"
                    onClick={this.openAccountMenu}
                    color="inherit">
                    <AccountCircle />
                  </IconButton> */}
                  <Menu
                    id="menu-appbar"
                    anchorEl={accountMenuAnchor}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={accountMenuOpen}
                    onClose={this.closeAccountMenu}>
                    <MenuItemLink to={PROFILE_ROUTE}>
                      <ListItemIcon>
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText inset primary="Profile" />
                    </MenuItemLink>

                    <MenuItem onClick={this.lockAccount}>
                      <ListItemIcon>
                        <LockIcon />
                      </ListItemIcon>
                      <ListItemText inset primary="Lock Bettermask" />
                    </MenuItem>
                  </Menu>
                </div>
              )
            }
          </Toolbar>
        </AppBar>
      
        <main className={classes.content}>
          <div className={classes.toolbar} />
          
          {
            children
          }
        </main>
      </div>
    );
  }
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

const hoc = compose(
  withRouter, // Needed to make the component navigation-aware
  withStyles(styles, { withTheme: true }),
  connect((state) => ({
    authenticated: true,
    lockingAccount: false,
  }), (dispatch) => ({
    lockAccount: () => dispatch(lockAccount()),
  }))
);

export default hoc(Layout);
