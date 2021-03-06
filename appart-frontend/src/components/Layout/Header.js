import Avatar from 'components/Avatar';
import { UserCard } from 'components/Card';
import Notifications from 'components/Notifications';
import { notificationsData } from 'demos/header';
import withBadge from 'hocs/withBadge';
import Auth from '../../auth/auth';
import Breadcrumbs from '../../breadcrumbs/Breadcrumbs';
import {
  Badge,
  Button,
  ListGroup,
  ListGroupItem,
  Nav,
  Navbar,
  NavItem,
  NavLink,
  Popover,
  PopoverBody
} from 'reactstrap';
import React from 'react';
import {
  MdClearAll,
  MdExitToApp,
  MdInsertChart,
  MdNotificationsActive,
  MdNotificationsNone,
  MdPersonPin,
  MdSettingsApplications
} from 'react-icons/md';
import bn from 'utils/bemnames';
import { UserConsumer } from '../../globalContext/userContext';
import { LangContext } from '../../globalContext/langContext';

/**
 * @type {header}
 */
const bem = bn.create('header');

/**
 * @type {function(...[*]=)}
 */
const MdNotificationsActiveWithBadge = withBadge({
  size: 'md',
  color: 'primary',
  style: {
    top: -10,
    right: -10,
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  children: <small>5</small>
})(MdNotificationsActive);

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenNotificationPopover: false,
      isNotificationConfirmed: false,
      isOpenUserCardPopover: false
    };
    this.user = new Auth();
  }

  toggleNotificationPopover = () => {
    this.setState({
      isOpenNotificationPopover: !this.state.isOpenNotificationPopover
    });

    if (!this.state.isNotificationConfirmed) {
      this.setState({ isNotificationConfirmed: true });
    }
  };

  toggleUserCardPopover = () => {
    this.setState({
      isOpenUserCardPopover: !this.state.isOpenUserCardPopover
    });
  };

  static contextType = LangContext;

  handleSidebarControlButton = event => {
    event.preventDefault();
    event.stopPropagation();

    document.querySelector('.cr-sidebar').classList.toggle('cr-sidebar--open');
  };

  render() {
    const { isNotificationConfirmed } = this.state;

    return (
      <Navbar light expand className={bem.b('bg-white')}>
        <Nav navbar className="mr-2">
          <Button outline onClick={this.handleSidebarControlButton}>
            <MdClearAll size={25}/>
          </Button>
        </Nav>
        <Nav navbar>
          <Breadcrumbs/>
        </Nav>

        <Nav navbar className={bem.e('nav-right')}>
          <NavItem className="d-inline-flex">
            <NavLink id="Popover1" className="position-relative">
              {isNotificationConfirmed ? (
                <MdNotificationsNone
                  size={25}
                  className="text-secondary can-click"
                  onClick={this.toggleNotificationPopover}
                />
              ) : (
                <MdNotificationsActiveWithBadge
                  size={25}
                  className="text-secondary can-click animated swing infinite"
                  onClick={this.toggleNotificationPopover}
                />
              )}
            </NavLink>
            <Popover
              placement="bottom"
              isOpen={this.state.isOpenNotificationPopover}
              toggle={this.toggleNotificationPopover}
              target="Popover1"
            >
              <PopoverBody>
                <Notifications notificationsData={notificationsData}/>
              </PopoverBody>
            </Popover>
          </NavItem>
          <UserConsumer>
            {({ email, is_superuser, avatar, first_name, last_name }) => (
              <NavItem>
                <NavLink id="Popover2">
                  {is_superuser &&
                  <Badge pill className="mr-2"
                         color="success">Superuser</Badge>
                  }
                  <Avatar
                    src={avatar}
                    onClick={this.toggleUserCardPopover}
                    className="can-click"
                  />
                </NavLink>
                <Popover
                  placement="bottom-end"
                  isOpen={this.state.isOpenUserCardPopover}
                  toggle={this.toggleUserCardPopover}
                  target="Popover2"
                  className="p-0 border-0"
                  style={{ minWidth: 250 }}
                >
                  <PopoverBody className="p-0 border-light">
                    <UserCard
                      avatar={avatar}
                      title={`${first_name} ${last_name}`}
                      subtitle={email}
                      className="border-light"
                    >
                      <ListGroup flush>
                        <ListGroupItem tag="button" action className="border-light">
                          <MdPersonPin/> Profile
                        </ListGroupItem>
                        <ListGroupItem tag="button" action className="border-light">
                          <MdInsertChart/> Stats
                        </ListGroupItem>
                        <ListGroupItem tag="button" action className="border-light">
                          <MdSettingsApplications/> Settings
                        </ListGroupItem>
                        <ListGroupItem tag="button" action className="border-light" onClick={() => this.context('en')}>
                          <MdSettingsApplications/> English version
                        </ListGroupItem>
                        <ListGroupItem tag="button" action className="border-light" onClick={() => this.context('uk')}>
                          <MdSettingsApplications/> Українська версія
                        </ListGroupItem>
                        <ListGroupItem tag="button" action className="border-light" onClick={() => {
                          this.user.logout();
                        }}>
                          <MdExitToApp/> Sign out
                        </ListGroupItem>
                      </ListGroup>
                    </UserCard>
                  </PopoverBody>

                </Popover>
              </NavItem>
            )}
          </UserConsumer>
        </Nav>
      </Navbar>
    );
  }
}

export default Header;
