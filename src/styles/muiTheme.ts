import { createMuiTheme }    from '@material-ui/core/styles';
import { PaletteOptions }    from '@material-ui/core/styles/createPalette';
import { TypographyOptions } from '@material-ui/core/styles/createTypography';
import { Overrides }         from '@material-ui/core/styles/overrides';
import { theme }             from './theme';

const typography: TypographyOptions = {
  htmlFontSize: 18,
  fontFamily  : 'Lato'
};

const palette: PaletteOptions = {
  primary    : {
    main        : theme.colors.primary,
    light       : `${ theme.colors.primary }35`,
    contrastText: theme.colors.white,
  },
  secondary  : {
    main        : theme.colors.secondary,
    light       : `${ theme.colors.secondary }35`,
    contrastText: theme.colors.white,
  },
  error      : {
    main: theme.colors.error,
  },
  warning    : {
    main: theme.colors.warning,
  },
  info       : {
    main: theme.colors.info,
  },
  success    : {
    main: theme.colors.success,
  },
  common     : {
    black: theme.colors.black,
    white: theme.colors.white,
  },
  text       : {
    primary  : theme.colors.black,
    disabled : theme.colors.disabled,
    secondary: theme.colors.darkGrey,
    hint     : theme.colors.darkGrey,
  },
  background : {
    default: theme.colors.grey,
    paper  : theme.colors.white,
  },
  tonalOffset: 0.2,
};

const overrides: Overrides = {
  MuiTypography             : {
    body2: {
      fontFamily: 'Lato'
    }
  },
  MuiSelect                 : {
    root: {
      padding      : '7px 12px',
      textTransform: 'none',
      boxSizing    : 'border-box',
      display      : 'flex',
      alignItems   : 'center',
      minHeight    : '40px !important'
    }
  },
  MuiBadge                  : {
    colorPrimary  : {
      backgroundColor: theme.colors.primary
    },
    colorSecondary: {
      backgroundColor: theme.colors.warning
    }
  },
  MuiInputLabel             : {
    outlined: {
      transform: 'translate(14px, 14px) scale(1)'
    }
  },
  MuiOutlinedInput          : {
    root          : {
      background     : theme.colors.white,
      boxShadow      : '0 0 8px 0 rgb(0 0 0 / 12%)',
      borderRadius   : 9,
      backgroundColor: '#fafafa'
    },
    notchedOutline: {
      visibility: 'hidden'
    }
  },
  MuiToolbar                : {
    root: {
      height         : 72,
      justifyContent : 'space-between',
      color          : theme.colors.white,
      backgroundColor: theme.colors.primary,
    }
  },
  MuiListItemIcon           : {
    root: {
      maxWidth: 40
    }
  },
  MuiIconButton             : {
    label: {
      maxHeight: '100%'
    }
  },
  MuiTab                    : {
    root   : {
      minWidth  : '0 !important',
      fontFamily: 'Jost'
    },
    wrapper: {
      fontWeight: 600,
      fontSize  : 16,
      lineHeight: '22px',
      color     : theme.colors.info
    }
  },
  MuiTabs                   : {
    scrollButtons: {
      '&.Mui-disabled': {
        display: 'none'
      }
    }
  },
  MuiListItem               : {
    dense    : {
      paddingTop   : 14,
      paddingBottom: 14,

      '& .MuiTypography-root': {
        fontSize: 18,
        color   : theme.colors.black
      }
    },
    container: {
      borderBottom  : '1px solid #e9e9e9',
      '&:last-child': {
        borderBottom: 'none'
      }
    },
    gutters  : {
      paddingLeft: 8
    }
  },
  MuiListItemSecondaryAction: {
    root: {
      fontWeight: 700,
      fontFamily: 'Lato'
    }
  }
};

export const muiTheme = createMuiTheme({
  typography,
  overrides,
  palette,
});
