import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../contexts/AuthContext';
import UserMenu from './UserMenu';
import NotificationsMenu from '../notifications/NotificationsMenu';

interface HeaderProps {
  onDrawerToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onDrawerToggle }) => {
  const theme = useTheme();
  const { user } = useAuth();

  return (
    <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Ivastramed
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {user && <NotificationsMenu />}
          <UserMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
