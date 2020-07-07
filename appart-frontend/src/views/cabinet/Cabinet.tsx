/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, { useState } from 'react';
import Auth from '../../auth/auth';
import '../../components/Layout/cabinet.css';
import Sidebar from './layout/CabinetSidebar';
import Navbar from './layout/Navbar';

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
const Cabinet = (props: any) => {

  const [activeTab, setActiveTab] = useState('1');
  const [navbarIsOpen, setNavbarIsOpen] = useState(false);
  const [userCardIsOpen, setUSerCardIsOpen] = useState(false);

  /**
   * Toggle collapse block
   *
   * @param tab
   */
  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const navbarToggle = () => setNavbarIsOpen(!navbarIsOpen);

  const userCardToggle = () => setUSerCardIsOpen(!userCardIsOpen);

  let userEmail;
  if (props.user) {
    userEmail = props.user.email;
  }
  return (
    <div className="container-fluid p-0">
      <div className="d-flex flex-row ">
        <Sidebar isOpen={navbarIsOpen}/>
        <div className="container-fluid bg-light">
          <div className="tab-pane content">
            <div className="row">
              <div className="col-12 ">
                <Navbar toggle={navbarToggle}
                        toggleUserCard={userCardToggle}
                        isCardToggled={userCardIsOpen}
                        user={props.user}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cabinet;
