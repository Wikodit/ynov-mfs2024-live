import {
  type ThemeOptions,
  createTheme,
  responsiveFontSizes,
} from '@mui/material';

let theme = createTheme({
  palette: {
    mode: 'dark',
    // primary: {
    //   light: '#F9FBFF',
    //   main: '#4178F7',
    //   dark: '#002884',
    //   contrastText: '#FFFFFF',
    // },
    // secondary: {
    //   light: '#FF7961',
    //   main: '#F44336',
    //   dark: '#BA000D',
    //   contrastText: '#000000',
    // },
    // error: {
    //   light: '#FADFE2',
    //   main: '#F44336',
    // },
    // warning: {
    //   light: '#FFF5CC',
    //   main: '#F7B32B',
    // },
    // info: {
    //   main: '#4178F7',
    //   dark: '#1E3C64',
    // },
    // success: {
    //   main: '#009900',
    // },
  },
});

theme = createTheme(theme, {
  typography: {
    fontFamily: ['Roboto', 'Arial', 'sans-serif'].join(','),
  },
  components: {},
} as ThemeOptions);

theme = responsiveFontSizes(theme, {
  breakpoints: ['xs', 'sm', 'md', 'lg'],
  factor: 2,
});

export default theme;
