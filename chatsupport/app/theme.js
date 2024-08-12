import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5C6BC0', // Blue
    },
    secondary: {
      main: '#9575CD', // Purple
    },
    background: {
      default: '#F3F4F6', // Light gray
    },
  },
  typography: {
    h1: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
    },
  },
});

export default theme;
