import { Divider } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Switch, Route, useHistory, Link } from "react-router-dom";
import Navbar from './Navbar';
import { GridMenuIcon } from "@material-ui/data-grid";
import Employee_Master from './NavItems/Employee_Master';
import Location_Master from './NavItems/Location_Master';
import Customer_Master from './NavItems/Customer_Master';
import Media_Type_Master from './NavItems/Media_Type_Master';
import Size_Master from './NavItems/Size_Master';
import Industry_Master from './NavItems/Industry_Master';
import GST_Type_Master from './NavItems/GST_Type_Master';
import Labour_Master from './NavItems/Labour_Master';
import Dashboard from './NavItems/Dashboard';
import Inventory_Master from "./NavItems/Inventory_Master";
import Labor_Category_Master from "./NavItems/Labor_Category_Master";
import Payment_Type from "./NavItems/Payment_Type";
import Availability from "./NavItems/Availability";
import Inquiry_Master from "./NavItems/Inquiry_Master";
import Booking from "./NavItems/Booking";
import Landloard_Management from "./NavItems/Landlord_Management";
import Quick_Media_Proposal from "./NavItems/Quick_Media_Proposal";
import Purchase_Order_Management from "./NavItems/Purchase_Order_Management";
import Flex_and_Vinyl_Management from "./NavItems/Flex_and_Vnyl_Management";
import MonitoringImages from "./NavItems/MonitoringImages";
import Login from "./Login";
import { ProtectedRoute } from '../protected.route';
import auth from '../auth';
import Availability_Master from "./NavItems/Availability_Master";
import Hoarding_Insurance1 from "./NavItems/Hoarding_Insurance1";
import Hoarding_Erection from "./NavItems/Hoarding_Erection";
import HoardingErrection from "./NavItems/HoardingErrection";
import Quick_Media from "./NavItems/Quick_Media";

// import { MenuOpen } from "@material-ui/icons";

const Body = () => {
  const [date, setDate] = useState(new Date());

  function refreshClock() {
    setDate(new Date());
  }
  useEffect(() => {
    const timerId = setInterval(refreshClock, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);
  const history = useHistory();
  const homeRedirect = () => {
    history.push('/')
  }

  const [menu, setMenu] = useState(false);
  const menu_toggle = () => {
    let a = document.getElementById('sidebar');
    let b = document.getElementById('main');
    if (menu) {
      a.style.display = 'none';
      b.className = 'col-md-12 main';
      setMenu(false);
    } else {
      a.style.display = 'block';
      b.className = 'col-md-10 main';
      setMenu(true);
    }

  }

  return (
    <div>
      <div>
        <header className="header" id="header" >
          <GridMenuIcon onClick={menu_toggle} id='menu-btn' style={{ margin: '32px', color: 'black' }} />
          <div className='adu'>
            <h4 style={{ cursor: 'pointer', marginLeft: '10px', color: 'black' }} onClick={homeRedirect}>
              BHARTI EXPO-ADS
            </h4>
          </div>
          <div style={{ display: 'flex', width: '100%', flex: '1' }}>
            <div className="text-black">
              <br />
              <h4 style={{ textAlign: 'center' }}>
                {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </h4>
            </div>

            <nav className="navbar navbar-dark navbar-expand-sm" >


              <div className="collapse navbar-collapse" id="navbar-list-4">
                <ul className="navbar-nav">
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#"
                      id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true"
                      aria-expanded="false">
                      <img src="https://www.w3schools.com/howto/img_avatar.png" width="20" height="20"
                        className="rounded-circle" />
                    </a>
                    <div style={{ marginLeft: '260px' }} class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                      <a class="dropdown-item" href="#">Dashboard</a>
                      <a class="dropdown-item" href="#">Edit Profile</a>
                      <li className="nav-item" onClick={() => {
                        auth.logout(() => {
                          history.push("/Login");
                        })
                        console.log(localStorage.getItem("authenticated"))
                      }}>
                        <Link className="dropdown-item">
                          Logout
                        </Link>
                      </li>
                    </div>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </header>
      </div>
      <div className='body1'>

        <div className="sidenav" id='sidebar'>
          <Navbar menu_function={menu_toggle}/>
        </div>
        <div className=" main" id='main'>
          <Switch>

            <ProtectedRoute exact path='/hoarding-final/' component={Dashboard} />
            <ProtectedRoute exact path='/hoarding-final/Employee_Master' component={Employee_Master} />
            <ProtectedRoute exact path='/hoarding-final/Labour_Master' component={Labour_Master} />
            <ProtectedRoute exact path='/hoarding-final/Location_Master' component={Location_Master} />
            <ProtectedRoute exact path='/hoarding-final/Customer_Master' component={Customer_Master} />
            <ProtectedRoute exact path='/hoarding-final/Media_Type_Master' component={Media_Type_Master} />
            <ProtectedRoute exact path='/hoarding-final/Size_Master' component={Size_Master} />
            <ProtectedRoute exact path='/hoarding-final/Inventory_Master' component={Inventory_Master} />
            <ProtectedRoute exact path='/hoarding-final/Industry_Master' component={Industry_Master} />
            <ProtectedRoute exact path='/hoarding-final/GST_Type_Master' component={GST_Type_Master} />
            <ProtectedRoute exact path='/hoarding-final/Labor_Category_Master' component={Labor_Category_Master} />
            <ProtectedRoute exact path='/hoarding-final/Payment_Type' component={Payment_Type} />
            <ProtectedRoute exact path="/hoarding-final/Availability" component={Availability} />
            <ProtectedRoute exact path="/hoarding-final/Inquiry_Master" component={Inquiry_Master} />
            <ProtectedRoute exact path="/hoarding-final/Booking" component={Booking} />
            <ProtectedRoute exact path="/hoarding-final/Landlord_Management" component={Landloard_Management} />
            <ProtectedRoute exact path="/hoarding-final/Quick_Media_Proposal" component={Quick_Media_Proposal} />
            <ProtectedRoute exact path="/hoarding-final/Purchase_Order_Management" component={Purchase_Order_Management} />
            <ProtectedRoute exact path="/hoarding-final/Flex_and_Vinyl_Management" component={Flex_and_Vinyl_Management} />
            <ProtectedRoute exact path="/hoarding-final/MonitoringImages" component={MonitoringImages} />
            <ProtectedRoute exact path="/hoarding-final/Availability_Master" component={Availability_Master} />
            <ProtectedRoute exact path="/hoarding-final/Hoarding_Insurance" component={Hoarding_Insurance1} />
            <ProtectedRoute exact path="/hoarding-final/Hoarding_Erection" component={Hoarding_Erection} />
            <ProtectedRoute exact path="/hoarding-final/Quick_Media" component={Quick_Media} />
            <ProtectedRoute exact path="/hoarding-final/HoardingErrection" component={HoardingErrection} />
          </Switch>
        </div>
      </div>

    </div>
  );
}

export default Body;
