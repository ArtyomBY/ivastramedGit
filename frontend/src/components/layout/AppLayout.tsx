import React from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { Navigation } from '../navigation/Navigation';
import { useAuth } from '../../contexts/AuthContext';
import NotificationsMenu from '../notifications/NotificationsMenu';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 280,
  }),
}));

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = React.useState(true);
  const { user } = useAuth();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: open ? 'calc(100% - 280px)' : '100%',
          ml: open ? '280px' : 0,
          transition: (theme) =>
            theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            IvastraMed
          </Typography>
          <NotificationsMenu />
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Avatar>{user?.firstName?.[0]}</Avatar>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: open ? 280 : 0 },
          flexShrink: { sm: 0 },
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Navigation />
      </Box>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
};
