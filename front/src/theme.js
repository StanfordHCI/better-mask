// @flow

import { createMuiTheme } from '@material-ui/core/styles';

const breakpoints = [600, 960, 1280];

export const colors = {
  primary: "#8363d4",
  secondary: "#ffaf4c",
  primary_darker: "#6d0b18",
  lightgray: "#e5e5ea",
  divider: "#e5e5ea",
  gray: '#b0b0bf',
  darkgray: '#47474c',
};

export const styledComponentsTheme = {
  breakpoints: breakpoints.map(b => `${b}px`),
  colors,
};

console.log(createMuiTheme({
  palette: {
    primary: {main: colors.primary},
    divider: colors.divider,
  },
  breakpoints: {
    keys: [
      "xs",
      "sm",
      "md",
      "lg",
    ],
    values: {
      xs: 0,
      sm: breakpoints[0],
      md: breakpoints[1],
      lg: breakpoints[2],
    }
  }
}));

export const muiTheme = createMuiTheme({
  palette: {
    primary: {main: colors.primary},
    divider: colors.divider,
  },
  breakpoints: {
    keys: [
      "xs",
      "sm",
      "md",
      "lg",
    ],
    values: {
      xs: 0,
      sm: breakpoints[0],
      md: breakpoints[1],
      lg: breakpoints[2],
    }
  }
});
