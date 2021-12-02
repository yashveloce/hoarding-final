import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
// import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
// import InboxIcon from '@material-ui/icons/MoveToInbox';
// import DraftsIcon from '@material-ui/icons/Drafts';
// import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
// import StarBorder from '@material-ui/icons/StarBorder';
import DashboardIcon from '@material-ui/icons/Dashboard';
// import GroupIcon from '@material-ui/icons/Group';
import StarBorder from '@material-ui/icons/StarBorder';
import PinDropIcon from '@material-ui/icons/PinDrop';
import FlagIcon from '@material-ui/icons/Flag';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import BuildIcon from '@mui/icons-material/Build';
import InventoryIcon from '@mui/icons-material/Inventory';
import PersonIcon from '@mui/icons-material/Person';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
// import PinDropIcon from '@material-ui/icons/PinDrop';
import { Link } from 'react-router-dom';
import SettingsIcon from '@material-ui/icons/Settings';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import PaymentsIcon from '@mui/icons-material/Payments';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import BookIcon from '@mui/icons-material/Book';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MonitorIcon from '@mui/icons-material/Monitor';
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    color: 'black',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function Navbar(props) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    if(window.matchMedia("(max-width:426px)").matches)
    {
      props.menu_function();
    }
  };

  const classes = useStyles();
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [open4, setOpen4] = React.useState(false);
  const [open5, setOpen5] = React.useState(false);
  const [open6, setOpen6] = React.useState(false);

  const handleClick1 = () => {
    setOpen1(!open1);
  };
  const handleClick2 = () => {
    setOpen2(!open2);
  };
  const handleClick3 = () => {
    setOpen3(!open3);
  };
  const handleClick4 = () => {
    setOpen4(!open4);
  };
  const handleClick5 = () => {
    setOpen5(!open5);
  };
  const handleClick6 = () => {
    setOpen6(!open6);
  };
  const role = localStorage.getItem("userrole");
  if (role === "admin") {
    return (
      <>
        <h6 style={{ textAlign: 'center', marginTop: '15px', color: 'Black' }} className="admin-nav" >ADMIN</h6>
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          className={classes.root}
        >
          {/* Dashboard */}
          <Link to='/'>
            <ListItem
              selected={selectedIndex === 0}
              onClick={(event) => handleListItemClick(event, 0)}
              style={{ color: 'White' }}
              button>
              <DashboardIcon />
              <ListItemIcon style={{ color: 'white' }}>
              </ListItemIcon>
              <ListItemText primary="Dashboard" className='menu-item-color' style={{ fontStyle: 'bold' }} />

            </ListItem>
          </Link>

          {/* Master Creation */}

          <ListItem button onClick={handleClick1} style={{ paddingLeft: '30px', backgroundColor: 'rgb(161 154 154)' }}>
            <ListItemIcon style={{ color: 'white' }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Master Creation" className='menu-item-color' />
            {open1 ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open1} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {/* Employee Master */}
              <Link to='/Employee_Master' >
                <ListItem
                  selected={selectedIndex === 1}
                  onClick={(event) => handleListItemClick(event, 1)}
                  button className={classes.nested}>
                  <ListItemIcon>
                    <FlagIcon style={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText primary="Employee Master" className='menu-item-color' />
                </ListItem>
              </Link>
              {/* Labour Master */}
              <Link to='/Labour_Master' >
                <ListItem
                  selected={selectedIndex === 2}
                  onClick={(event) => handleListItemClick(event, 2)}
                  button
                  className={classes.nested}>
                  <ListItemIcon>
                    <BuildIcon style={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText primary="Labour Master" className='menu-item-color' />
                </ListItem>
              </Link>
              {/* Location Master */}
              {/* <Link to='/Location_Master' >
  
                <ListItem
                  selected={selectedIndex === 3}
                  onClick={(event) => handleListItemClick(event, 3)}
                  button
                  className={classes.nested}>
                  <ListItemIcon>
                    <PinDropIcon style={{color:'white'}} />
                  </ListItemIcon>
                  <ListItemText primary="Location Master" className='menu-item-color' />
                </ListItem>
              </Link> */}
              {/* Customer Master */}
              <Link to='/Customer_Master' >

                <ListItem
                  selected={selectedIndex === 4}
                  onClick={(event) => handleListItemClick(event, 4)}
                  button
                  className={classes.nested}>
                  <ListItemIcon>
                    < PersonIcon style={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText primary="Customer Master" className='menu-item-color' />
                </ListItem>
              </Link>
              {/* Media Type Master */}
              <Link to='/Media_Type_Master' >

                <ListItem
                  selected={selectedIndex === 5}
                  onClick={(event) => handleListItemClick(event, 5)}
                  button
                  className={classes.nested}>
                  <ListItemIcon>
                    <StarBorder style={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText primary="Media Type Master" className='menu-item-color' />
                </ListItem>
              </Link>
              {/* Size Master */}
              {/* <Link to='/Size_Master' >
  
                <ListItem
                  selected={selectedIndex === 6}
                  onClick={(event) => handleListItemClick(event, 6)}
                  button
                  className={classes.nested}>
                  <ListItemIcon>
                    <AspectRatioIcon style={{color:'white'}}/>
                  </ListItemIcon>
                  <ListItemText primary="Size Master" className='menu-item-color' />
                </ListItem>
              </Link> */}
              {/* Hoarding Insurance */}
              <Link to='/Hoarding_Insurance' >
                <ListItem
                  selected={selectedIndex === 6}
                  onClick={(event) => handleListItemClick(event, 6)}
                  button
                  className={classes.nested}>
                  <ListItemIcon>
                    <MonitorIcon style={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText primary="Hoarding Insurance" className='menu-item-color' />
                </ListItem>
              </Link>
              {/* Hoarding Erection */}
              <Link to='/HoardingErrection' >
                <ListItem
                  selected={selectedIndex === 7}
                  onClick={(event) => handleListItemClick(event, 7)}
                  button
                  className={classes.nested}>
                  <ListItemIcon>
                    <MonitorIcon style={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText primary="Hoarding Erection" className='menu-item-color' />
                </ListItem>
              </Link>

              {/* GST Type Master */}
              <Link to='/Inventory_Master' >


                <ListItem
                  selected={selectedIndex === 9}
                  onClick={(event) => handleListItemClick(event, 9)}
                  button
                  className={classes.nested}>
                  <ListItemIcon>
                    <InventoryIcon style={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText primary="Inventory Master" className='menu-item-color' />
                </ListItem>
              </Link>
              {/* Industry Master */}
              <Link to='/Industry_Master' >

                <ListItem
                  selected={selectedIndex === 8}
                  onClick={(event) => handleListItemClick(event, 8)}
                  button
                  className={classes.nested}>
                  <ListItemIcon>
                    <LocationCityIcon style={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText primary="Industry Master" className='menu-item-color' />
                </ListItem>
              </Link>
              {/* GST Type Master */}
              <Link to='/GST_Type_Master' >


                <ListItem
                  selected={selectedIndex === 10}
                  onClick={(event) => handleListItemClick(event, 10)}
                  button
                  className={classes.nested}>
                  <ListItemIcon>
                    <AccountBalanceIcon style={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText primary="GST Type Master" className='menu-item-color' />
                </ListItem>
              </Link>
              {/* Labor Category Type Master */}
              <Link to='/Labor_Category_Master' >


                <ListItem
                  selected={selectedIndex === 11}
                  onClick={(event) => handleListItemClick(event, 11)}
                  button
                  className={classes.nested}>
                  <ListItemIcon>
                    <AcUnitIcon style={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText primary="Labor Category Master" className='menu-item-color' />
                </ListItem>
              </Link>
              {/* Labor Category Type Master */}
              <Link to='/Payment_Type' >
                <ListItem
                  selected={selectedIndex === 12}
                  onClick={(event) => handleListItemClick(event, 12)}
                  button
                  className={classes.nested}>
                  <ListItemIcon>
                    <PaymentsIcon style={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText primary="Payment Type Master" className='menu-item-color' />
                </ListItem>
              </Link>
              {/* Availability Master */}
              {/* <Link to='/Availability_Master' >
                <ListItem
                  selected={selectedIndex === 7}
                  onClick={(event) => handleListItemClick(event, 7)}
                  button
                  className={classes.nested}>
                  <ListItemIcon>
                    <AccessibilityIcon style={{color:'white'}}/>
                  </ListItemIcon>
                  <ListItemText primary="Availability Master" className='menu-item-color' />
                </ListItem>
              </Link> */}
              {/* Availability Master */}
              {/* <Link to='/Availability' >
                <ListItem
                  selected={selectedIndex === 12}
                  onClick={(event) => handleListItemClick(event, 13)}
                  button
                  className={classes.nested}>
                  <ListItemIcon>
                    <AccessibilityIcon style={{color:'white'}}/>
                  </ListItemIcon>
                  <ListItemText primary="Availability Master" className='menu-item-color' />
                </ListItem>
              </Link> */}

            </List>
          </Collapse>
          {/* Landlord Management */}

          <ListItem button onClick={handleClick2} style={{ paddingLeft: '30px', backgroundColor: 'rgb(161 154 154)' }}>
            <ListItemIcon>
              <SettingsIcon style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Landlord Management" className='menu-item-color' />
            {open2 ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open2} timeout="auto" unmountOnExit>
            {/* Landlord Management */}
            <Link to='/Landlord_Management' >
              <ListItem
                selected={selectedIndex === 1}
                onClick={(event) => handleListItemClick(event, 1)}
                button
                className={classes.nested}>
                <ListItemIcon>
                  <AccessibilityIcon style={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Landlord Management" className='menu-item-color' />
              </ListItem>
            </Link>
          </Collapse>

          {/* Planning */}
          <ListItem button onClick={handleClick3} style={{ paddingLeft: '30px', backgroundColor: 'rgb(161 154 154)' }}>
            <ListItemIcon>
              <SettingsIcon style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Planning" className='menu-item-color' />
            {open2 ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open3} timeout="auto" unmountOnExit>
            {/* Inquiry Master */}
            <Link to='/Inquiry_Master' >
              <ListItem
                selected={selectedIndex === 1}
                onClick={(event) => handleListItemClick(event, 1)}
                button
                className={classes.nested}>
                <ListItemIcon>
                  <AddIcCallIcon style={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Inquiry" className='menu-item-color' />
              </ListItem>
            </Link>
            {/* Quick Media Proposal */}
            {/* <Link to='/Quick_Media_Proposal' >
                <ListItem
                  selected={selectedIndex === 2}
                  onClick={(event) => handleListItemClick(event, 2)}
                  button
                  className={classes.nested}>
                  <ListItemIcon>
                    <AssessmentIcon style={{color:'white'}}/>
                  </ListItemIcon>
                  <ListItemText primary="Quick Media Proposal" className='menu-item-color' />
                </ListItem>
              </Link> */}
            {/* Quick Proposal */}
            <Link to='/Quick_Media' >
              <ListItem
                selected={selectedIndex === 2}
                onClick={(event) => handleListItemClick(event, 2)}
                button
                className={classes.nested}>
                <ListItemIcon>
                  <AssessmentIcon style={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Quick Media" className='menu-item-color' />
              </ListItem>
            </Link>
            {/* Booking */}
            <Link to='/Booking' >
              <ListItem
                selected={selectedIndex === 3}
                onClick={(event) => handleListItemClick(event, 3)}
                button
                className={classes.nested}>
                <ListItemIcon>
                  <BookIcon style={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Booking" className='menu-item-color' />
              </ListItem>
            </Link>
          </Collapse>
          {/* Purchase Order Management */}

          <ListItem button onClick={handleClick4} style={{ paddingLeft: '30px', backgroundColor: 'rgb(161 154 154)' }}>
            <ListItemIcon>
              <SettingsIcon style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Purchase Order Management" className='menu-item-color' />
            {open2 ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open4} timeout="auto" unmountOnExit>
            {/* Purchase Order Management */}
            <Link to='/Purchase_Order_Management' >
              <ListItem
                selected={selectedIndex === 1}
                onClick={(event) => handleListItemClick(event, 1)}
                button
                className={classes.nested}>
                <ListItemIcon>
                  <ApartmentIcon style={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Purchase Order Management" className='menu-item-color' />
              </ListItem>
            </Link>
          </Collapse>

          {/* Flex And Vnyl Management */}

          <ListItem button onClick={handleClick5} style={{ paddingLeft: '30px', backgroundColor: 'rgb(161 154 154)' }}>
            <ListItemIcon>
              <SettingsIcon style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Flex And Vinyl Management" className='menu-item-color' />
            {open2 ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open5} timeout="auto" unmountOnExit>
            {/* Flex And Vnyl Management */}
            <Link to='/Flex_and_Vinyl_Management' >
              <ListItem
                selected={selectedIndex === 1}
                onClick={(event) => handleListItemClick(event, 1)}
                button
                className={classes.nested}>
                <ListItemIcon>
                  <AddBoxIcon style={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Flex And Vinyl Management" className='menu-item-color' />
              </ListItem>
            </Link>
          </Collapse>

          {/* Flex And Vnyl Management */}

          <ListItem button onClick={handleClick6} style={{ paddingLeft: '30px', backgroundColor: 'rgb(161 154 154)' }}>
            <ListItemIcon>
              <SettingsIcon style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Monitoring Images" className='menu-item-color' />
            {open2 ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open6} timeout="auto" unmountOnExit>
            {/* Monitoring Images */}
            <Link to='/MonitoringImages' >
              <ListItem
                selected={selectedIndex === 1}
                onClick={(event) => handleListItemClick(event, 1)}
                button
                className={classes.nested}>
                <ListItemIcon>
                  <MonitorIcon style={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Monitoring Images" className='menu-item-color' />
              </ListItem>
            </Link>
          </Collapse>




        </List>
      </>
    );
  }
  else {
    return (
      <>
        <h6 style={{ textAlign: 'center', marginTop: '15px', color: 'Black' }} className="admin-nav" >SUPER ADMIN</h6>
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          className={classes.root}
        >
          {/* Dashboard */}
          <Link to='/'>
            <ListItem
              selected={selectedIndex === 0}
              onClick={(event) => handleListItemClick(event, 0)}
              style={{ color: 'White' }}
              button>
              <DashboardIcon />
              <ListItemIcon style={{ color: 'white' }}>
              </ListItemIcon>
              <ListItemText primary="Dashboard" className='menu-item-color' style={{ fontStyle: 'bold' }} />

            </ListItem>
          </Link>
        </List>
      </>
    )
  }
}

