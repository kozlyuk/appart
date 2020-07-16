import sidebarBgImage from 'assets/img/sidebar/sidebar-4.jpg';
import logo200Image from 'assets/img/logo/logo_small_white.png';
import React from 'react';
import {
  MdAttachMoney,
  MdBuild,
  MdDashboard,
  MdEqualizer,
  MdEvent,
  MdExtension,
  MdKeyboardArrowDown,
  MdMonetizationOn,
  MdPayment,
  MdSupervisorAccount,
  MdWidgets,
  MdWork
} from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import { Collapse, Nav, Navbar, NavItem, NavLink as BSNavLink } from 'reactstrap';
import bn from 'utils/bemnames';
import { Text } from 'react-easy-i18n';
import { PermissionContext } from '../../globalContext/PermissionContext';
import PermissionSidebarComponent from '../../acl/PermissionSidebarComponent';
import MultiplePermissionComponent from '../../acl/MultiplePermissionComponent';

/**
 * @type {{backgroundImage: string, backgroundSize: string, backgroundRepeat: string}}
 */
const sidebarBackground = {
  backgroundImage: `url("${sidebarBgImage}")`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat'
};

/**
 * @type {sidebar}
 */
const bem = bn.create('sidebar');

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenGlobalMenu: true,
      isOpenComponentCondominium: false,
      isOpenComponentNotice: false,
      isOpenComponentService: false,
      isOpenComponentAccounting: false,
      isOpenContents: true,
      isOpenPages: true
    };
  }

  static contextType = PermissionContext;

  /**
   * @type {({modelName: string, name: *, exact: boolean, to: string, Icon: , permissionName: string}|{modelName: string, name: *, exact: boolean, to: string, Icon: , permissionName: string})[]}
   */
  condominiumComponents = [
    {
      to: '/dashboard/house',
      name: <Text text="sidebar.house"/>,
      exact: false,
      Icon: MdWidgets,
      modelName: 'house',
      permissionName: 'view'
    },
    {
      to: '/dashboard/apartment',
      name: <Text text="sidebar.apartment"/>,
      exact: false,
      Icon: MdWidgets,
      modelName: 'apartment',
      permissionName: 'view'
    }
  ];

  accountingComponents = [
    {
      to: '/dashboard/bill',
      name: <Text text="sidebar.bills"/>,
      exact: true,
      Icon: MdAttachMoney,
      modelName: 'bill',
      permissionName: 'view'
    },
    {
      to: '/dashboard/payment',
      name: <Text text="sidebar.payment"/>,
      exact: true,
      Icon: MdPayment,
      modelName: 'payment',
      permissionName: 'view'
    },
    {
      to: '/dashboard/service',
      name: <Text text="sidebar.services"/>,
      exact: true,
      Icon: MdExtension,
      modelName: 'service',
      permissionName: 'view'
    },
    {
      to: '/dashboard/rate',
      name: <Text text="sidebar.rate"/>,
      exact: true,
      Icon: MdEqualizer,
      modelName: 'rate',
      permissionName: 'view'
    }
  ];

  /**
   * @type {({modelName: string, name: *, exact: boolean, to: string, Icon: , permissionName: string}|{modelName: string, name: *, exact: boolean, to: string, Icon: , permissionName: string}|{modelName: string, name: *, exact: boolean, to: string, Icon: , permissionName: string}|{modelName: string, name: *, exact: boolean, to: string, Icon: , permissionName: string})[]}
   */
  navItems = [
    {
      to: '/dashboard/',
      name: <Text text="sidebar.home"/>,
      exact: true,
      Icon: MdDashboard,
      modelName: '',
      permissionName: ''
    },
    {
      to: '/dashboard/user',
      name: <Text text="sidebar.user"/>,
      exact: false,
      Icon: MdSupervisorAccount,
      modelName: 'user',
      permissionName: 'view'
    }
  ];

  /**
   * @type {({modelName: string, name: *, exact: boolean, to: string, Icon: , permissionName: string}|{modelName: string, name: *, exact: boolean, to: string, Icon: , permissionName: string})[]}
   */
  serviceComponents = [
    {
      to: '/dashboard/order',
      name: <Text text="sidebar.order"/>,
      exact: false,
      Icon: MdEvent,
      modelName: 'order',
      permissionName: 'view'
    },
    {
      to: '/dashboard/work',
      name: <Text text="sidebar.work"/>,
      exact: false,
      Icon: MdWork,
      modelName: 'work',
      permissionName: 'view'
    }
  ];

  /**
   * @param name
   * @return {function(...[*]=)}
   */
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
            {this.navItems.map(({ to, name, exact, Icon, modelName, permissionName }, index) => (
              <PermissionSidebarComponent key={index} aclList={this.context} modelName={modelName}
                                          permissionName={permissionName}>
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
              </PermissionSidebarComponent>
            ))}

            <MultiplePermissionComponent
              aclList={this.context} modelName={['house', 'apartment']}
              permissionName={['view', 'view']}
            >
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
            </MultiplePermissionComponent>
            <Collapse isOpen={this.state.isOpenComponentCondominium}>
              {this.condominiumComponents.map(({ to, name, exact, Icon, modelName, permissionName }, index) => (
                <PermissionSidebarComponent
                  key={index}
                  aclList={this.context} modelName={modelName}
                  permissionName={permissionName}
                >
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
                </PermissionSidebarComponent>
              ))}
            </Collapse>
            <MultiplePermissionComponent
              aclList={this.context} modelName={['bill', 'payment', 'service', 'rate']}
              permissionName={['view', 'view', 'view', 'view']}
            >
              <NavItem
                className={bem.e('nav-item')}
                onClick={this.handleClick('ComponentAccounting')}
              >
                <BSNavLink className={bem.e('nav-item-collapse')}>
                  <div className="d-flex">
                    <MdMonetizationOn className={bem.e('nav-item-icon')}/>
                    <span className="align-self-start text-uppercase"><Text text="sidebar.accounting"/></span>
                  </div>
                  <MdKeyboardArrowDown
                    className={bem.e('nav-item-icon')}
                    style={{
                      padding: 0,
                      transform: this.state.isOpenComponentAccounting
                        ? 'rotate(0deg)'
                        : 'rotate(-90deg)',
                      transitionDuration: '0.3s',
                      transitionProperty: 'transform'
                    }}
                  />
                </BSNavLink>
              </NavItem>
            </MultiplePermissionComponent>
            <Collapse isOpen={this.state.isOpenComponentAccounting}>
              {this.accountingComponents.map(({ to, name, exact, Icon, modelName, permissionName }, index) => (
                <PermissionSidebarComponent
                  key={index}
                  aclList={this.context} modelName={modelName}
                  permissionName={permissionName}
                >
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
                </PermissionSidebarComponent>
              ))}
            </Collapse>
            <MultiplePermissionComponent
              aclList={this.context} modelName={['order', 'work']}
              permissionName={['view', 'view']}
            >
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
                      transform: this.state.isOpenComponentService
                        ? 'rotate(0deg)'
                        : 'rotate(-90deg)',
                      transitionDuration: '0.3s',
                      transitionProperty: 'transform'
                    }}
                  />
                </BSNavLink>
              </NavItem>
            </MultiplePermissionComponent>
            <Collapse isOpen={this.state.isOpenComponentService}>
              {this.serviceComponents.map(({ to, name, exact, Icon, modelName, permissionName }, index) => (
                <PermissionSidebarComponent
                  key={index}
                  aclList={this.context} modelName={modelName}
                  permissionName={permissionName}
                >
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
                </PermissionSidebarComponent>
              ))}
            </Collapse>
          </Nav>
        </div>
      </aside>
    );
  }
}

export default Sidebar;