/**
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import Navbar from '../../views/cabinet/layout/Navbar';
import { UserConsumer } from '../../globalContext/userContext';
import Sidebar from '../../views/cabinet/layout/CabinetSidebar';
import './cabinet.css';
import { Alert } from 'reactstrap';

class CabinetLayout extends React.Component {

  /**
   * Cabinet layout constructor.
   *
   * @param props
   * @param user
   */
  constructor(props, user) {
    super(props);
    this.user = user;
    this.state = {
      navbarIsOpen: true,
      userCardIsOpen: false
    };
  }

  static contextType = UserConsumer;

  /**
   * Navbar toggler.
   */
  navbarToggle = () => {
    const { navbarIsOpen } = this.state;
    this.setState({
      navbarIsOpen: !navbarIsOpen
    });
  };

  /**
   * User card toggler.
   */
  userCardToggle = () => {
    const { userCardIsOpen } = this.state;
    this.setState({
      userCardIsOpen: !userCardIsOpen
    });
  };

  render() {
    const { children } = this.props;
    return (
      <div className="container-fluid p-0 main-container">
        <div className="d-flex flex-row ">
          <Sidebar isOpen={this.state.navbarIsOpen}/>
          <div className="container-fluid bg-light">
            <div className="tab-pane content">
              <div className="row">
                <div className="col-12 ">
                  <UserConsumer>
                    {({ pk, email, first_name, last_name, apartment }) => (
                      <Navbar
                        toggle={this.navbarToggle}
                        toggleUserCard={this.userCardToggle}
                        isCardToggled={this.state.userCardIsOpen}
                        userFirstName={first_name}
                        userLastName={last_name}
                        userPk={pk}
                        userEmail={email}
                      />
                    )}
                  </UserConsumer>
                  {this.context.apartment[0] ? children : <UserWithoutApartment/>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CabinetLayout;

function UserWithoutApartment() {
  return (
    <Alert color="danger" className="text-center mt-4">
      У Вас не має жодних апартаментів. Для уточнення інформації зв'яжіться з менеджером!
    </Alert>
  );
}
