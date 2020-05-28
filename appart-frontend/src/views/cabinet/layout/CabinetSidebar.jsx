/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdAssignment, MdAttachMoney, MdBuild, MdPayment } from 'react-icons/md';
import { Slide } from 'react-reveal';
import logo200Image from '../../../assets/img/logo/logo_main.png';
import { Text } from 'react-easy-i18n';

export default class CabinetSidebar extends React.Component {

  render() {
    const toggle = this.props.isOpen ? 'col-3 center-block menu show collapse' : 'col-3 center-block menu collapse';
    return (
      <Slide duration={300} left collapse when={this.props.isOpen}>
        <div className={toggle} id="collapseMenu">
          <div className=" row justify-content-center">
            <NavLink exact activeClassName='active'
                     to="/cabinet"
                     className="navbar-brand">
              <img
                src={logo200Image}
                width="auto"
                height="60"
                className="ml-auto mr-auto"
                alt=""
              />
            </NavLink>
          </div>
          <nav className="nav-tabs nav_menu" style={{ cursor: 'pointer' }}>
            <ul className="nav flex-column">
              <li className="nav-item">
                <NavLink exact activeClassName='active' style={linkStyle} to="/cabinet"
                         className="nav-link"><MdAssignment/>&nbsp;<Text text="cabinet.sidebar.notifications"/>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink exact activeClassName='active'
                         style={linkStyle}
                         to="/cabinet/bills"
                         className="nav-link"><MdAttachMoney/>&nbsp;<Text text="cabinet.sidebar.bills"/>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink exact activeClassName='active'
                         style={linkStyle}
                         to="/cabinet/payments"
                         className="nav-link"><MdPayment/>&nbsp;<Text text="cabinet.sidebar.payments"/>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink exact activeClassName='active'
                         style={linkStyle}
                         to="/cabinet/service"
                         className="nav-link"><MdBuild/>&nbsp;<Text text="cabinet.sidebar.services"/>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </Slide>
    );
  }
}

const linkStyle = {
  color: '#495057'
};