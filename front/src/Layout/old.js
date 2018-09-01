import React from 'react';
import styled from 'styled-components';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import { mailFolderListItems, otherMailFolderListItems } from './tileData';

const MENU_BUTTON_STYLE = {
  marginLeft: -12,
  marginRight: 20,
};

const DRAWER_WIDTH = 260;

const drawerClasses = {
  paper: 'layout-styled-drawer__paper',
};

const StyledDrawer = styled(Drawer)`
  .${drawerClasses.paper} {
    width: ${DRAWER_WIDTH};
    @media(min-width: ${p => p.theme.breakpoints[0]})
      position: 'relative',
    },
  }
`;

const ResponsiveAppBar = styled(AppBar)`
  position: 'absolute',
  marginLeft: ${DRAWER_WIDTH},
  @media(min-width: ${p => p.theme.breakpoints[0]}) {
    width: calc(100% - ${DRAWER_WIDTH}px),
  }
`;

const styles = theme => ({
  toolbar: theme.mixins.toolbar,
});

class Layout extends React.Component {
  state = {
    auth: true,
    menuAnchorElement: null,
  };

  handleMenu = event => {
    this.setState({ menuAnchorElement: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ menuAnchorElement: null });
  };

  render() {
    const {children, theme, classes} = this.props;
    console.log(theme.mixins.toolbar);
    const { menuAnchorElement } = this.state;
    const open = Boolean(menuAnchorElement);

    const drawer = (
      <div>
        <div className={classes.toolbar} />
        <Divider />
        <List>{mailFolderListItems}</List>
        <Divider />
        <List>{otherMailFolderListItems}</List>
      </div>
    );

    return (
      <div>
        <ResponsiveAppBar position="static">
          <Toolbar>
            <IconButton color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" style={{flexGrow: 1}}>
              Photos
            </Typography>
            <div>
              <IconButton
                aria-owns={open ? 'menu-appbar' : null}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={menuAnchorElement}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={this.handleClose}>
                <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                <MenuItem onClick={this.handleClose}>My account</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </ResponsiveAppBar>

        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            classes={drawerClasses}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}>
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={drawerClasses}
          >
            {drawer}
          </Drawer>
        </Hidden>

        <main>
          {children}
        </main>
      </div>
    );
  }
}


export default withStyles(styles, { withTheme: true })(Layout);





// import React from 'react';
// import PropTypes from 'prop-types';

// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
// import IconButton from '@material-ui/core/IconButton';


// import MenuIcon from '@material-ui/icons/Menu';
// import { mailFolderListItems, otherMailFolderListItems } from './tileData';

// const drawerWidth = 240;

// const styles = theme => ({
//   root: {
//     flexGrow: 1,
//     height: 430,
//     zIndex: 1,
//     overflow: 'hidden',
//     position: 'relative',
//     display: 'flex',
//     width: '100%',
//   },
//   appBar: {
//     position: 'absolute',
//     marginLeft: drawerWidth,
//     [theme.breakpoints.up('md')]: {
//       width: `calc(100% - ${drawerWidth}px)`,
//     },
//   },
//   navIconHide: {
//     [theme.breakpoints.up('md')]: {
//       display: 'none',
//     },
//   },
//   toolbar: theme.mixins.toolbar,
//   drawerPaper: {
//     width: drawerWidth,
//     [theme.breakpoints.up('md')]: {
//       position: 'relative',
//     },
//   },
//   content: {
//     flexGrow: 1,
//     backgroundColor: theme.palette.background.default,
//     padding: theme.spacing.unit * 3,
//   },
// });

// class ResponsiveDrawer extends React.Component {
//   state = {
//     mobileOpen: false,
//   };

//   handleDrawerToggle = () => {
//     this.setState(state => ({ mobileOpen: !state.mobileOpen }));
//   };

//   render() {
//     const { classes, theme } = this.props;


//     return (
//       <div className={classes.root}>
//         <AppBar className={classes.appBar}>
//           <Toolbar>
//             <IconButton
//               color="inherit"
//               aria-label="Open drawer"
//               onClick={this.handleDrawerToggle}
//               className={classes.navIconHide}
//             >
//               <MenuIcon />
//             </IconButton>
//             <Typography variant="title" color="inherit" noWrap>
//               Responsive drawer
//             </Typography>
//           </Toolbar>
//         </AppBar>
//         <Hidden mdUp>
//           <Drawer
//             variant="temporary"
//             anchor={theme.direction === 'rtl' ? 'right' : 'left'}
//             open={this.state.mobileOpen}
//             onClose={this.handleDrawerToggle}
//             classes={{
//               paper: classes.drawerPaper,
//             }}
//             ModalProps={{
//               keepMounted: true, // Better open performance on mobile.
//             }}
//           >
//             {drawer}
//           </Drawer>
//         </Hidden>
//         <Hidden smDown implementation="css">
//           <Drawer
//             variant="permanent"
//             open
//             classes={{
//               paper: classes.drawerPaper,
//             }}
//           >
//             {drawer}
//           </Drawer>
//         </Hidden>
//         <main className={classes.content}>
//           <div className={classes.toolbar} />
//           <Typography noWrap>{'You think water moves fast? You should see ice.'}</Typography>
//         </main>
//       </div>
//     );
//   }
// }

// ResponsiveDrawer.propTypes = {
//   classes: PropTypes.object.isRequired,
//   theme: PropTypes.object.isRequired,
// };

// export default withStyles(styles, { withTheme: true })(ResponsiveDrawer);
