import sidebarBgImage from 'assets/img/sidebar/sidebar-4.jpg';
import logo200Image from 'assets/img/logo/logo_small_white.png';
import React from 'react';
import {
  MdAttachMoney,
  MdBuild,
  MdDashboard,
  MdEvent,
  MdExtension,
  MdKeyboardArrowDown,
  MdPayment,
  MdWeb,
  MdWidgets,
  MdWork
} from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import { Collapse, Nav, Navbar, NavItem, NavLink as BSNavLink } from 'reactstrap';
import bn from 'utils/bemnames';
import { Text } from 'react-easy-i18n';

const sidebarBackground = {
  backgroundImage: `url("${sidebarBgImage}")`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat'
};

const condominiumComponents = [
  { to: '/house', name: <Text text="sidebar.house"/>, exact: false, Icon: MdWidgets },
  { to: '/apartment', name: <Text text="sidebar.apartment"/>, exact: false, Icon: MdWidgets }
];

const navItems = [
  { to: '/', name: <Text text="sidebar.home"/>, exact: true, Icon: MdDashboard },
  { to: '/user', name: <Text text="sidebar.user"/>, exact: false, Icon: MdWeb },
  { to: '/bill', name: <Text text="sidebar.bills"/>, exact: true, Icon: MdAttachMoney },
  { to: '/payment', name: <Text text="sidebar.payment"/>, exact: true, Icon: MdPayment }
];

const serviceComponents = [
  { to: '/order', name: <Text text="sidebar.order"/>, exact: false, Icon: MdEvent },
  { to: '/work', name: <Text text="sidebar.work"/>, exact: false, Icon: MdWork }
];

const bem = bn.create('sidebar');

class Sidebar extends React.Component {
  state = {
    isOpenGlobalMenu: true,
    isOpenComponentCondominium: false,
    isOpenComponentNotice: false,
    isOpenComponentService: false,
    isOpenContents: true,
    isOpenPages: true
  };

  handleClick = name => () => {
    this.setState(prevState => {
      const isOpen = prevState[`isOpen${name}`];

      return {
        [`isOpen${name}`]: !isOpen
      };
    });
  };

  render() {
    return (
      <aside className={bem.b()} data-image={sidebarBgImage}>
        <div className={bem.e('background')} style={sidebarBackground}/>
        <div className={bem.e('content')}>
          <Navbar>
            <img
              src={logo200Image}
              width="auto"
              height="70"
              className="ml-auto mr-auto"
              alt=""
            />
          </Navbar>
          <Nav vertical>
            {navItems.map(({ to, name, exact, Icon }, index) => (
              <NavItem key={index} className={bem.e('nav-item')}>
                <BSNavLink
                  id={`navItem-${name}-${index}`}
                  className="text-uppercase"
                  tag={NavLink}
                  to={to}
                  activeClassName="active"
                  exact={exact}
                >
                  <Icon className={bem.e('nav-item-icon')}/>
                  <span className="">{name}</span>
                </BSNavLink>
              </NavItem>
            ))}

            <NavItem
              className={bem.e('nav-item')}
              onClick={this.handleClick('ComponentCondominium')}
            >
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <MdExtension className={bem.e('nav-item-icon')}/>
                  <span className="align-self-start text-uppercase"><Text text="sidebar.condominium"/></span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.isOpenComponentCondominium
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform'
                  }}
                />
              </BSNavLink>
            </NavItem>
            <Collapse isOpen={this.state.isOpenComponentCondominium}>
              {condominiumComponents.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                  >
                    <Icon className={bem.e('nav-item-icon')}/>
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse>
            <NavItem
              className={bem.e('nav-item')}
              onClick={this.handleClick('ComponentService')}
            >
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <MdBuild className={bem.e('nav-item-icon')}/>
                  <span className="align-self-start text-uppercase"><Text text="sidebar.service"/></span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.isOpenComponentCondominium
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform'
                  }}
                />
              </BSNavLink>
            </NavItem>
            <Collapse isOpen={this.state.isOpenComponentService}>
              {serviceComponents.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                  >
                    <Icon className={bem.e('nav-item-icon')}/>
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse>
          </Nav>
        </div>
      </aside>
    );
  }
}

export default Sidebar;