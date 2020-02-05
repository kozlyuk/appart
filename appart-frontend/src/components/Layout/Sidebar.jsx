import logo200Image from 'assets/img/logo/logo_200.png';
import sidebarBgImage from 'assets/img/sidebar/sidebar-4.jpg';
import SourceLink from 'components/SourceLink';
import React from 'react';
import { FaGithub } from 'react-icons/fa';
import {
  MdAccountCircle,
  MdArrowDropDownCircle,
  MdBorderAll,
  MdBrush,
  MdChromeReaderMode,
  MdDashboard,
  MdExtension,
  MdGroupWork,
  MdInsertChart,
  MdKeyboardArrowDown,
  MdNotificationsActive,
  MdPages,
  MdRadioButtonChecked,
  MdSend,
  MdStar,
  MdTextFields,
  MdViewCarousel,
  MdViewDay,
  MdViewList,
  MdWeb,
  MdWidgets,
} from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import {
  // UncontrolledTooltip,
  Collapse,
  Nav,
  Navbar,
  NavItem,
  NavLink as BSNavLink,
} from 'reactstrap';
import bn from 'utils/bemnames';
import { Text } from 'react-easy-i18n';

const sidebarBackground = {
  backgroundImage: `url("${sidebarBgImage}")`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
};

const condominiumComponents = [
  { to: '/house', name: <Text text="sidebar.house"/>, exact: false, Icon: MdWidgets },
  { to: '/apartment', name: <Text text="sidebar.apartment"/>, exact: false, Icon: MdWidgets },
];

const navContents = [
  { to: '/typography', name: 'typography', exact: false, Icon: MdTextFields },
  { to: '/tables', name: 'tables', exact: false, Icon: MdBorderAll },
];

const pageContents = [
  { to: '/login', name: 'login / signup', exact: false, Icon: MdAccountCircle },
  {
    to: '/login-modal',
    name: 'login modal',
    exact: false,
    Icon: MdViewCarousel,
  },
];

const navItems = [
  { to: '/', name: <Text text="sidebar.home"/>, exact: true, Icon: MdDashboard },
  { to: '/user', name: <Text text="sidebar.user"/>, exact: false, Icon: MdWeb },
  { to: '/company', name: <Text text="sidebar.company"/>, exact: false, Icon: MdInsertChart },
  // { to: '/condominium', name: <Text text="sidebar.condominium"/>, exact: false, Icon: MdWidgets },
  // { to: '/notice', name: <Text text="sidebar.notice"/>, exact: false, Icon: MdWidgets },
  // { to: '/payment', name: <Text text="sidebar.payment"/>, exact: false, Icon: MdWidgets },
  // { to: '/profile', name: <Text text="sidebar.profile"/>, exact: false, Icon: MdWidgets },
];

const bem = bn.create('sidebar');

class Sidebar extends React.Component {
  state = {
    isOpenComponents: false,
    isOpenContents: true,
    isOpenPages: true,
  };

  handleClick = name => () => {
    this.setState(prevState => {
      const isOpen = prevState[`isOpen${name}`];

      return {
        [`isOpen${name}`]: !isOpen,
      };
    });
  };

  render() {
    return (
      <aside className={bem.b()} data-image={sidebarBgImage}>
        <div className={bem.e('background')} style={sidebarBackground} />
        <div className={bem.e('content')}>
          <Navbar>
            <SourceLink className="navbar-brand d-flex">
              <img
                src={logo200Image}
                width="40"
                height="30"
                className="pr-2"
                alt=""
              />
              <span className="text-white">
                Reduction <FaGithub />
              </span>
            </SourceLink>
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
                  <Icon className={bem.e('nav-item-icon')} />
                  <span className="">{name}</span>
                </BSNavLink>
              </NavItem>
            ))}

            <NavItem
              className={bem.e('nav-item')}
              onClick={this.handleClick('Components')}
            >
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <MdExtension className={bem.e('nav-item-icon')} />
                  <span className="align-self-start text-uppercase"><Text text="sidebar.condominium"/></span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.isOpenComponents
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem>
            <Collapse isOpen={this.state.isOpenComponents}>
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
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse>

            {/*<NavItem*/}
            {/*  className={bem.e('nav-item')}*/}
            {/*  onClick={this.handleClick('Contents')}*/}
            {/*>*/}
            {/*  <BSNavLink className={bem.e('nav-item-collapse')}>*/}
            {/*    <div className="d-flex">*/}
            {/*      <MdSend className={bem.e('nav-item-icon')} />*/}
            {/*      <span className="">Contents</span>*/}
            {/*    </div>*/}
            {/*    <MdKeyboardArrowDown*/}
            {/*      className={bem.e('nav-item-icon')}*/}
            {/*      style={{*/}
            {/*        padding: 0,*/}
            {/*        transform: this.state.isOpenContents*/}
            {/*          ? 'rotate(0deg)'*/}
            {/*          : 'rotate(-90deg)',*/}
            {/*        transitionDuration: '0.3s',*/}
            {/*        transitionProperty: 'transform',*/}
            {/*      }}*/}
            {/*    />*/}
            {/*  </BSNavLink>*/}
            {/*</NavItem>*/}
            {/*<Collapse isOpen={this.state.isOpenContents}>*/}
            {/*  {navContents.map(({ to, name, exact, Icon }, index) => (*/}
            {/*    <NavItem key={index} className={bem.e('nav-item')}>*/}
            {/*      <BSNavLink*/}
            {/*        id={`navItem-${name}-${index}`}*/}
            {/*        className="text-uppercase"*/}
            {/*        tag={NavLink}*/}
            {/*        to={to}*/}
            {/*        activeClassName="active"*/}
            {/*        exact={exact}*/}
            {/*      >*/}
            {/*        <Icon className={bem.e('nav-item-icon')} />*/}
            {/*        <span className="">{name}</span>*/}
            {/*      </BSNavLink>*/}
            {/*    </NavItem>*/}
            {/*  ))}*/}
            {/*</Collapse>*/}

            {/*<NavItem*/}
            {/*  className={bem.e('nav-item')}*/}
            {/*  onClick={this.handleClick('Pages')}*/}
            {/*>*/}
            {/*  <BSNavLink className={bem.e('nav-item-collapse')}>*/}
            {/*    <div className="d-flex">*/}
            {/*      <MdPages className={bem.e('nav-item-icon')} />*/}
            {/*      <span className="">Pages</span>*/}
            {/*    </div>*/}
            {/*    <MdKeyboardArrowDown*/}
            {/*      className={bem.e('nav-item-icon')}*/}
            {/*      style={{*/}
            {/*        padding: 0,*/}
            {/*        transform: this.state.isOpenPages*/}
            {/*          ? 'rotate(0deg)'*/}
            {/*          : 'rotate(-90deg)',*/}
            {/*        transitionDuration: '0.3s',*/}
            {/*        transitionProperty: 'transform',*/}
            {/*      }}*/}
            {/*    />*/}
            {/*  </BSNavLink>*/}
            {/*</NavItem>*/}
            {/*<Collapse isOpen={this.state.isOpenPages}>*/}
            {/*  {pageContents.map(({ to, name, exact, Icon }, index) => (*/}
            {/*    <NavItem key={index} className={bem.e('nav-item')}>*/}
            {/*      <BSNavLink*/}
            {/*        id={`navItem-${name}-${index}`}*/}
            {/*        className="text-uppercase"*/}
            {/*        tag={NavLink}*/}
            {/*        to={to}*/}
            {/*        activeClassName="active"*/}
            {/*        exact={exact}*/}
            {/*      >*/}
            {/*        <Icon className={bem.e('nav-item-icon')} />*/}
            {/*        <span className="">{name}</span>*/}
            {/*      </BSNavLink>*/}
            {/*    </NavItem>*/}
            {/*  ))}*/}
            {/*</Collapse>*/}
          </Nav>
        </div>
      </aside>
    );
  }
}

export default Sidebar;
