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
              Дім онлайн
            </NavLink>
          </div>
          <nav className="nav-tabs nav_menu" style={{ cursor: 'pointer' }}>
            <ul className="nav flex-column">
              <li className="nav-item">
                <NavLink exact activeClassName='active' style={linkStyle} to="/cabinet"
                         className="nav-link"><MdAssignment/>&nbsp;Сповіщення
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink exact activeClassName='active'
                         style={linkStyle}
                         to="/cabinet/bills"
                         className="nav-link"><MdAttachMoney/>&nbsp;Рахунки
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink exact activeClassName='active'
                         style={linkStyle}
                         to="/cabinet/payments"
                         className="nav-link"><MdPayment/>&nbsp;Оплати
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink exact activeClassName='active'
                         style={linkStyle}
                         to="/cabinet/service"
                         className="nav-link"><MdBuild/>&nbsp;Сервісна служба
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