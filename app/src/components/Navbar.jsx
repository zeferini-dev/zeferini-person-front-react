import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Link,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const menuItems = [
    { label: 'Listar Pessoas', path: '/persons', icon: <PersonIcon /> },
    { label: 'Nova Pessoa', path: '/persons/new', icon: <PersonAddIcon /> },
  ];

  return (
    <>
      <AppBar position="sticky" className="navbar" sx={{ backgroundColor: '#3f51b5' }}>
        <Toolbar sx={{ paddingInline: '8px' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ marginRight: '8px' }}
          >
            <MenuIcon />
          </IconButton>

          <span className="navbar__brand">TesteFull</span>
          <span className="navbar__divider"></span>

          <span className="navbar__spacer"></span>

          <span className="navbar__framework">React</span>

          <span className="navbar__spacer"></span>

          <Link
            href="http://localhost:3000/api"
            target="_blank"
            rel="noreferrer"
            sx={{ color: 'inherit', display: 'flex', alignItems: 'center' }}
          >
            <IconButton color="inherit" size="large">
              <DescriptionIcon />
            </IconButton>
          </Link>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        className="navbar__drawer"
      >
        <Box
          sx={{
            width: 280,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
          role="presentation"
        >
          <Box
            sx={{
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#3f51b5',
              color: 'white',
            }}
          >
            <span className="navbar__brand" style={{ margin: 0 }}>
              Menu
            </span>
            <IconButton
              onClick={toggleDrawer(false)}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <List sx={{ flex: 1 }}>
            {menuItems.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    padding: '12px 16px',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  <Box sx={{ marginRight: '12px', display: 'flex', alignItems: 'center' }}>
                    {item.icon}
                  </Box>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider />

          <Box sx={{ padding: '16px' }}>
            <Link
              href="http://localhost:3000/api"
              target="_blank"
              rel="noreferrer"
              sx={{
                color: '#3f51b5',
                textDecoration: 'none',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <DescriptionIcon fontSize="small" />
              API Docs
            </Link>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
