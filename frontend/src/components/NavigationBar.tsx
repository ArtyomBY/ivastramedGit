import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NavigationBar: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationsEl, setNotificationsEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setNotificationsEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  const handleSettings = () => {
    navigate('/settings');
    handleClose();
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#1976d2', boxShadow: 'none', width: '100%', borderRadius: 0 }}>
      <Toolbar sx={{ justifyContent: 'space-between', padding: '0 16px' }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Ивастрамед
        </Typography>
        <IconButton color="inherit" onClick={handleNotificationsMenu}>
          <Badge badgeContent={4} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Menu
          anchorEl={notificationsEl}
          keepMounted
          open={Boolean(notificationsEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Уведомление 1</MenuItem>
          <MenuItem onClick={handleClose}>Уведомление 2</MenuItem>
          <MenuItem onClick={handleClose}>Уведомление 3</MenuItem>
          <MenuItem onClick={handleClose}>Уведомление 4</MenuItem>
        </Menu>
        <IconButton
          edge="end"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleProfile}>Профиль</MenuItem>
          <MenuItem onClick={handleSettings}>Настройки</MenuItem>
          <MenuItem onClick={handleLogout}>Выйти</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
