/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, {useState} from 'react';
// import "./style.css"
// import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  UncontrolledDropdown
} from 'reactstrap';
import News from './News';
import BillsList from './BillsList';
import Auth from '../../auth/auth';
import {Link} from 'react-router-dom';
import PaymentList from './PaymentList';
import ServiceList from "./ServiceList";

/**
 * User object
 *
 * @type {Auth}
 */
const user = new Auth();

/**
 * Cabinet view
 *
 * @param props
 * @returns {*}
 * @constructor
 */
const Cabinet = (props) => {

  const [activeTab, setActiveTab] = useState('2');
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Toggle collapse block
   *
   * @param tab
   */
  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const navbarToggle = () => setIsOpen(!isOpen);

  let userEmail;
  if (props.user) {
    userEmail = props.user.email;
  }
  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">Дім онлайн</NavbarBrand>
        <NavbarToggler onClick={navbarToggle}/>
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/">House</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/">Company</NavLink>
            </NavItem>
            <NavItem>
              <NavLink active href="/">Personal cabinet</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/registration">Registration</NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                {userEmail}
              </DropdownToggle>
              <DropdownMenu right>
                <Link to="/">
                  <DropdownItem>
                    Адміністрування
                  </DropdownItem>
                </Link>
                <DropdownItem>
                  Мій профіль
                </DropdownItem>
                <DropdownItem divider/>
                <DropdownItem onClick={() => {
                  user.logout();
                }}>
                  Вийти
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
      <div
        style={{background: 'transparent'}}
        className="hero-area-bg particles_js"
      >
        <div className="overlay"/>
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="container-flex">
                <div className="row">
                  <div className="col-3">
                    <Nav vertical pills tag={'nav'} style={{cursor: 'pointer'}}>
                      <NavItem>
                        <NavLink
                          className={({active: activeTab === '1'})}
                          onClick={() => {
                            toggle('1');
                          }}
                        >
                          Новини і оголошення
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={({active: activeTab === '2'})}
                          onClick={() => {
                            toggle('2');
                          }}
                        >
                          Рахунки
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={({active: activeTab === '3'})}
                          onClick={() => {
                            toggle('3');
                          }}
                        >
                          Оплати
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={({active: activeTab === '4'})}
                          onClick={() => {
                            toggle('4');
                          }}
                        >
                          Сервісна служба
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                  <div className="col-9">
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId="1">
                        <News/>
                      </TabPane>
                      <TabPane tabId="2">
                        <BillsList user={props.user}/>
                      </TabPane>
                      <TabPane tabId="3">
                        <PaymentList user={props.user}/>
                      </TabPane>
                      <TabPane tabId="4">
                        <ServiceList user={props.user}/>
                      </TabPane>
                    </TabContent>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cabinet;
