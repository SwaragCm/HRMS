import { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { fetchEmployees } from '../../store/employeesList';
import { useDispatch } from 'react-redux';

const PrimaryNavbar = styled(AppBar)(() => ({
  zIndex: 1000,
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const StyledLinkWrapper = styled(Grid)({
  marginLeft: 'auto',
});

const DrawerContainer = styled('div')(() => ({
  width: 250,
  background: 'linear-gradient(to right bottom, rgba(253, 216, 29, 0.7), rgba(255, 153, 13, 0.7), rgba(27, 5, 124, 0.7))',
  height: '100%',
}));

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState(() => localStorage.getItem('username'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setUsername(localStorage.getItem('username'));
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername(null);
    navigate('/login');
  };

  const renderDrawerLinks = () => {
    if (location.pathname === '/employee/list') {
      return (
        <>
          <ListItem button component={Link} to="/employee/add" onClick={toggleDrawer}>
            <ListItemText primary="Add Employee" />
          </ListItem>
          <ListItem button component={Link} to="/list/role" onClick={toggleDrawer}>
            <ListItemText primary="Designations List" />
          </ListItem>
          <ListItem button component={Link} to="/" onClick={toggleDrawer}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={handleLogout} style={{ color: 'inherit' }}>
            <ListItemText primary="Logout" />
          </ListItem>
        </>
      );
    } else if (location.pathname === '/list/role') {
      return (
        <>
          <ListItem button component={Link} to="/add/designation" onClick={toggleDrawer}>
            <ListItemText primary="Add Designation" />
          </ListItem>
          <ListItem button component={Link} to="/employee/list" onClick={() => { toggleDrawer(); dispatch(fetchEmployees()); }}>
          <ListItemText primary="Employees List" /></ListItem>
          <ListItem button component={Link} to="/" onClick={toggleDrawer}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={handleLogout} style={{ color: 'inherit' }}>
            <ListItemText primary="Logout" />
          </ListItem>
        </>
      );
    }
  };

  const renderRightSideLink = () => {
    if (location.pathname === '/') {
      return (
        <>
          <Typography variant="h6" style={{ display: 'inline-block', marginRight: '1rem' }}>
            <Link to="/employee/list" style={{ color: 'inherit' }}>Employees List</Link>
          </Typography>
          <Typography variant="h6" style={{ display: 'inline-block', marginRight: '1rem' }}>
            <Link to="/list/role" style={{ color: 'inherit' }}>Designations List</Link>
          </Typography>
          <Typography variant="h6" style={{ display: 'inline-block' }}>
            <Link to="/login" style={{ color: 'inherit' }}>Login</Link>
          </Typography>
        </>
      );
    } else if (location.pathname === '/login') {
      return (
        <Typography variant="h6">
          <Link to="/" style={{ color: 'inherit' }}>Home</Link>
        </Typography>
      );
    } else if (location.pathname === '/employee/add') {
      return (
        <Typography variant="h6">
          <Link to="/employee/list" style={{ color: 'inherit' }}>Employees List</Link>
        </Typography>
      );
    } else if (location.pathname === '/add/designation') {
      return (
        <Typography variant="h6">
          <Link to="/list/role" style={{ color: 'inherit' }}>Designations List</Link>
        </Typography>
      );
    }
    return null;
  };

  const showDrawer = location.pathname !== '/' && location.pathname !== '/login';

  return (
    <div>
      <PrimaryNavbar>
        <Toolbar style={{ background: 'linear-gradient(to right bottom, rgba(253, 216, 29, 0.7), rgba(255, 153, 13, 0.7), rgba(27, 5, 124, 0.7))' }}>
          <StyledTypography variant="h6">
            Human Resource Management System
          </StyledTypography>
          <StyledLinkWrapper>
            {renderRightSideLink()}
            {username && (
              <Typography variant="h6" style={{ marginLeft: '1rem', color: 'inherit' }}>
                Welcome {username}
              </Typography>
            )}
            {showDrawer && (
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer}
                sx={{ ml: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </StyledLinkWrapper>
        </Toolbar>
      </PrimaryNavbar>
      {showDrawer && (
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer}
        >
          <DrawerContainer>
            <List>
              {renderDrawerLinks()}
            </List>
          </DrawerContainer>
        </Drawer>
      )}
    </div>
  );
};

export default Navbar;








